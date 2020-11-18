#!/usr/bin/env node
const fs = require('fs');
const aws = require('aws-sdk');
const readline = require('readline')
const ssm = new aws.SSM({ apiVersion: '2014-11-06' })
const args = require('yargs/yargs')(process.argv.slice(2))
      .usage('Usage: $0 [options]')
      .example('$0 -f /Users/isabey/Downloads/prod_secrets.json')
      .example('$0 -f /Users/isabey/Downloads/prod_secrets.json -k alias/ops-service-ssm-key')
      .example('$0 -f /Users/isabey/Downloads/prod_secrets.json -o true -k alias/ops-service-ssm-key')
      .alias('a', 'action')
      .nargs('a', 1)
      .describe('a', 'Action to take. One of list|add|update|delete.')
      .alias('f', 'file')
      .nargs('f', 1)
      .describe('f', 'JSON file with params to add.')
      .alias('k', 'key')
      .nargs('k', 1)
      .describe('k', 'The KMS key to encrypt the param with.')
      .alias('o', 'overwrite')
      .nargs('o', 1)
      .describe('o', 'Whether or not to overwrite. (defaults to false)')
      .demandOption(['a'])
      .help('h')
      .alias('h', 'help')
      .argv;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})

let getParamList = []

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const deletePrep = async () => {
  let awsParams = {}
  rl.question('What is the path of the parameter?\n', path => {
    rl.question('What is the parameter name? (not case sensitive)\n', name => {
      rl.question(`Confirm deletion of /${path}/${name}?\n`, confirmed => {
        rl.close()
        if (confirmed != 'yes') {
          console.error('Only an answer of \'yes\' will be accepted! Exiting..')
          return
        } else {
          try {
            awsParams['Name'] = `/${path}/${name}`
            ssm.deleteParameter(awsParams, (err, data) => {
              if (err) {
                switch (err.code) {
                  case 'ExpiredTokenException':
                    console.info(`Expired creds. Run 'getCreds' and retry.`)
                    process.exit(1)
                  case 'ParameterAlreadyExists':
                    console.info(`Parameter ${awsParams.Name} already exists and overwrite is set to false. Skipping.`)
                    break
                  case 'ValidationException':
                    console.error(`Valdiation error occurred on ${awsParams.Name}. See below for info.\n${err.stack}`)
                    break
                  case 'InvalidParameterType':
                    console.error(`Invalid parameter type. See below for info.\n${err.stack}`)
                    break
                  case 'ThrottlingException':
                    console.error(`Rate limit exceeded when calling AWS API.`)
                    break
                  default:
                    console.error(`Non mapped error occurred on ${awsParams.Name}. See below.\n${err.stack}`)
                    break
                }
              } else {
                console.info(`Deleted: ${awsParams.Name}`)
              }
            })
          } catch (e) {
            console.error(e)
          }
        }
        return
      })
    })
  })
}

async function getParams () {
  rl.question('What path to list?\n', path => {
    rl.close()
    let awsParams = {}
    awsParams['Path'] = `/${path}`,
    awsParams['Recursive'] = true,
    awsParams['WithDecryption'] = true
    const getAWSParams = token => {
      if (token) awsParams['NextToken'] = token
      ssm.getParametersByPath(awsParams, (err, data) => {
        if (err) {
          switch (err.code) {
            case 'ExpiredTokenException':
              console.info(`Expired creds. Run 'getCreds' and retry.`)
              process.exit(1)
            default:
              console.error(`Non mapped error occurred on ${awsParams.Name}. See below.\n${err.stack}`)
              break
          }
        } else {
          for (let i = 0; i < data.Parameters.length; i++) {
            if (data.Parameters[i].Name.includes('CERT')) {
              data.Parameters[i].Value = 'CERT REDACTED'
            }
            getParamList.push({
              key: data.Parameters[i].Name.replace(`/${path}/`, ''),
              value: data.Parameters[i].Value
            })
          }
          if (data.NextToken) {
            getAWSParams(data.NextToken)
          } else {
            console.table(getParamList)
          }
        }
      })
    }

    try {
      getAWSParams()
    } catch (e) {
      console.error(e)
    }
  })
}

const addUpdateParams = async () => {
  if (args.file) {
    const params = JSON.parse(fs.readFileSync(args.file));
    let awsParams = {}
    for (let i = 0; i < params.length; i++) {
      try {
        awsParams['Name'] = params[i].key,
        awsParams['Value'] = params[i].value,
        awsParams['Type'] = 'SecureString'
        if (args.k){awsParams['KeyId'] = args.k}
        if (args.o){awsParams['Overwrite'] = true}
    
        ssm.putParameter(awsParams, (err, data) => {
          if (err) {
            switch (err.code) {
              case 'ExpiredTokenException':
                console.info(`Expired creds. Run 'getCreds' and retry.`)
                process.exit(1)
              case 'ParameterAlreadyExists':
                console.info(`Parameter ${awsParams.Name} already exists and overwrite is set to false. Skipping.`)
                break
              case 'ValidationException':
                console.error(`Valdiation error occurred on ${awsParams.Name}. See below for info.\n${err.stack}`)
                break
              case 'InvalidParameterType':
                console.error(`Invalid parameter type. See below for info.\n${err.stack}`)
                break
              case 'ThrottlingException':
                console.error(`Rate limit exceeded when calling AWS API.`)
                break
              default:
                console.error(`Non mapped error occurred on ${awsParams.Name}. See below.\n${err.stack}`)
                break
            }
          } else {
            console.info(`Added: ${awsParams.Name}`)
          }
        })
      } catch (e) {
        console.error(e)
      }
      await sleep(1000)
    }
  } else {
    console.warn('No file path provided!!')
    return;
  }
}

switch (args.action) {
  case 'list':
    getParams();
    break
  case 'add':
  case 'update':
    addUpdateParams();
    break;
  case 'delete':
    deletePrep();
    break;
}
