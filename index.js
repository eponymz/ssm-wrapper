#!/usr/bin/env node
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
      .alias('t', 'type')
      .nargs('t', 1)
      .describe('t', 'The parameter type. Defaults to SecureString.')
      .demandOption(['a'])
      .help('h')
      .alias('h', 'help')
      .argv;

const addUpdateParams = require('./commands/addUpdate').addUpdateParams
const getParams = require('./commands/list').getParams
const deleteParams = require('./commands/delete').deleteParams

switch (args.action) {
  case 'list':
    getParams();
    break
  case 'add':
  case 'update':
    addUpdateParams();
    break;
  case 'delete':
    deleteParams();
    break;
}
