const aws = require('aws-sdk');
const ssm = new aws.SSM({ apiVersion: '2014-11-06' })
const rl = require('../utils/prompt').rl
const errResp = require('../utils/errors').errorResp

exports.command = 'delete';
exports.aliases = ['del', 'rm'];
exports.describe = 'delete parameter';
exports.builder = (yargs) => {
  yargs
    .example('$0 -p lending-service -n LENDING_ENABLED')
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
  let paramName = yargs.n.toUpperCase()
  rl.question(`Confirm deletion of /${yargs.p}/${paramName}?\n`, confirmed => {
    rl.close()
    if (confirmed != 'yes') {
      console.error('Only an answer of \'yes\' will be accepted! Exiting..')
      return
    } else {
      try {
        awsParams['Name'] = `/${yargs.p}/${paramName}`
        ssm.deleteParameter(awsParams, (err, data) => {
          if (err) {
            errResp(err.code, err.stack, awsParams)
          } else {
            console.info(`Deleted: ${awsParams.Name}`)
            process.exit(0)
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  })
}
