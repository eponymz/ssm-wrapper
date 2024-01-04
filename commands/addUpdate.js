const fs = require('fs');
const aws = require('aws-sdk');
const ssm = new aws.SSM({ apiVersion: '2014-11-06' });
const sleep = require('../utils/sleep').sleep;
const errResp = require('../utils/errors').errorResp;

exports.command = 'add';
exports.aliases = ['update'];
exports.describe = 'add or update parameters';
exports.builder = (yargs) => {
  yargs
    .example('$0 -f /path/to/parameters.json -p my-service -k alias/alias/kms-key-alias')
    .example('$0 -f /path/to/parameters.json -p my-service -k alias/alias/kms-key-alias -o true')
    .options({
      file: {
        alias: 'f',
        describe: 'JSON file with params to add.',
      },
      path: {
        alias: 'p',
        describe: 'The SSM path to add the parameters to.',
      },
      key: {
        alias: 'k',
        describe: 'The KMS key to encrypt the param with.',
      },
      overwrite: {
        alias: 'o',
        default: false,
        describe: 'Whether or not to overwrite the parameter.',
      },
    })
    .demandOption(['file', 'path'], 'You must define: file and path.');
};
exports.handler = async (argv) => {
  await addUpdateParams(argv);
};

const addUpdateParams = async (yargs) => {
  const params = JSON.parse(fs.readFileSync(yargs.file));
  let awsParams = {};
  for (let i = 0; i < params.length; i++) {
    awsParams['Name'] = `/${yargs.path}/${params[i].key}`;
    awsParams['Value'] = params[i].value;
    awsParams['Type'] = params[i].type;
    awsParams['Overwrite'] = yargs.o;
    if (params[i].type === 'SecureString') {
      awsParams['KeyId'] = yargs.k;
    } else {
      delete awsParams['KeyId'];
    }
    ssm.putParameter(awsParams, (err, data) => {
      if (err) {
        errResp(err.code, err.stack, awsParams)
      } else {
        console.info(`Added: ${awsParams.Name}`)
      }
    })
    await sleep(1000)
  }
  process.exit(0)
};
