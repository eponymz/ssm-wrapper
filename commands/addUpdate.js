const fs = require('fs');
const sleep = require('../utils/sleep').sleep

module.exports.addUpdateParams = async () => {
  if (args.file) {
    const params = JSON.parse(fs.readFileSync(args.file));
    let awsParams = {}
    for (let i = 0; i < params.length; i++) {
      try {
        awsParams['Name'] = params[i].key,
        awsParams['Value'] = params[i].value,
        awsParams['Type'] = args.type || 'SecureString'
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
