const fs = require('fs');
const sleep = require('../utils/sleep').sleep;
const errResp = require('../utils/errors').errorResp

exports.command = 'add -f <file> [options]';
exports.aliases = ['update'];
exports.describe = 'add or update parameters';
exports.builder = (yargs) =>
  yargs
    .example('$0 -f /path/to/parameters.json')
    .example('$0 -f /path/to/parameters.json -k alias/ops-service-ssm-key')
    .example('$0 -f /path/to/parameters.json -o true -k alias/ops-service-ssm-key')
    .alias('f', 'file')
    .nargs('f', 1)
    .describe('f', 'JSON file with params to add.')
    .alias('k', 'key')
    .nargs('k', 1)
    .describe('k', 'The KMS key to encrypt the param with.')
    .alias('o', 'overwrite')
    .nargs('o', 1)
    .describe('o', 'Whether or not to overwrite. (defaults to false)')
    .alias('t', 'type')
    .nargs('t', 1)
    .describe('t', 'The parameter type. Defaults to SecureString.')
    .demandOption(['f'])
exports.handler = function (argv) {return addUpdateParams()}

const addUpdateParams = async () => {
  if (args.file) {
    const params = JSON.parse(fs.readFileSync(args.file));
    let awsParams = {}
    for (let i = 0; i < params.length; i++) {
      try {
        awsParams['Name'] = params[i].key,
        awsParams['Value'] = params[i].value,
        awsParams['Type'] = args.type || 'SecureString'
        if (args.k) awsParams['KeyId'] = args.k
        if (args.o) awsParams['Overwrite'] = true

        ssm.putParameter(awsParams, (err, data) => {
          if (err) {
            errResp(err.code)
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
    return
  }
}
