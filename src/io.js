import readline from 'node:readline/promises'

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
