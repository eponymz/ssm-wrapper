#!/usr/bin/env node
require('yargs/yargs')(process.argv.slice(2))
      .usage('Usage: $0 <command> [options]')
      .commandDir('commands')
      .demandCommand()
      .help('h')
      .alias('h', 'help')
      .parse();
