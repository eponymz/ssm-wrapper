const readline = require('readline')

module.exports.rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})
