const aws = require('aws-sdk');
const ssm = new aws.SSM({ apiVersion: '2014-11-06' })
const rl = require('../utils/prompt').rl

module.exports.deleteParams = async () => {
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
