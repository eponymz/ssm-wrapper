const aws = require('aws-sdk');
const ssm = new aws.SSM({ apiVersion: '2014-11-06' })
const rl = require('../utils/prompt').rl

exports.command = 'delete';
exports.aliases = ['del', 'rm'];
exports.describe = 'delete parameter';
exports.builder = {}
exports.handler = function (argv) {return deleteParams()}

const deleteParams = async () => {
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
                errResp(err.code)
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
