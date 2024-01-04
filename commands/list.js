const aws = require('aws-sdk');
const ssm = new aws.SSM({ apiVersion: '2014-11-06' });
const errResp = require('../utils/errors').errorResp;

let getParamList = [];

exports.command = 'list';
exports.aliases = ['ls', 'get'];
exports.describe = 'list parameters at path';
exports.builder = (yargs) => {
  yargs
    .example('$0 -p my-service')
    .example('$0 -p my-service -r json')
    .options({
      path: {
        alias: 'p',
        describe: 'The SSM path to list from.'
      },
      result: {
        alias: 'r',
        default: 'table',
        describe: 'Result format. Defaults to formatted table. Accepts `json, table`.',
      }
    })
    .demandOption(['path'], 'You must define the path to list.')
};
exports.handler = function (argv) {
  return getParams(argv);
};

const getParams = async (yargs) => {
  let awsParams = {};
  awsParams['Path'] = yargs.p.startsWith('/') ? yargs.p : `/${yargs.p}`;
  awsParams['Recursive'] = true;
  awsParams['WithDecryption'] = true;
  const getAWSParams = (token) => {
    if (token) awsParams['NextToken'] = token;
    ssm.getParametersByPath(awsParams, (err, data) => {
      if (err) {
        errResp(err.code, awsParams);
        throw new Error(err);
      } else {
        for (let i = 0; i < data.Parameters.length; i++) {
          if (data.Parameters[i].Name.includes('_CERT') && yargs.r === 'table') {
            // redact certificate values for consistent formatting when listing to table
            data.Parameters[i].Value = 'CERT REDACTED';
          }
          getParamList.push({
            key: data.Parameters[i].Name.replace(`/${yargs.p}/`, ''),
            value: data.Parameters[i].Value,
            type: data.Parameters[i].Type,
          });
        }
        if (data.NextToken) {
          getAWSParams(data.NextToken);
        } else {
          if (yargs.r === 'json') {
            console.info(require('util').format('%j', getParamList))
            process.exit(0)
          } else {
            console.table(getParamList);
            process.exit(0)
          }
        }
      }
    });
    return;
  };

  try {
    getAWSParams();
  } catch (e) {
    console.error(e);
  }
};
