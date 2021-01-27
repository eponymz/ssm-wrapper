const aws = require('aws-sdk');
const ssm = new aws.SSM({ apiVersion: '2014-11-06' })
const rl = require('../utils/prompt').rl
const errResp = require('../utils/errors').errorResp

exports.command = 'delete';
exports.aliases = ['del', 'rm'];
exports.describe = 'delete parameter';
exports.builder = (yargs) => {
  yargs
    .example('$0 -p my-service -n MY_PARAMETER')
    .options({
      path: {
        alias: 'p',
        describe: 'The SSM path to remove parameters from.'
      },
      name: {
        alias: 'n',
        describe: 'The parameter to remove.'
      }
    })
    .demandOption(['path', 'name'], 'You must define the path and parameter name to remove.')
};
exports.handler = function (argv) {return deleteParams(argv)}

const deleteParams = async (yargs) => {
  let awsParams = {}
    try {
      awsParams['Name'] = `/${yargs.p}/${yargs.n}`
      ssm.deleteParameter(awsParams, (err, data) => {
        if (err) {
          errResp(err.code, err.stack, awsParams)
        } else {
          console.info(`Deleted: ${awsParams.Name}`)
          process.exit(0)
        }
      })
    } 
    catch (e) {
      console.error(e)
    }
}
