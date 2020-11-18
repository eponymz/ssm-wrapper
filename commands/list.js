const aws = require('aws-sdk');
const ssm = new aws.SSM({ apiVersion: '2014-11-06' })
const rl = require('../utils/prompt').rl

let getParamList = []

module.exports.getParams = async () => {
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
