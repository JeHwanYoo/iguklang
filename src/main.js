import {rl} from './io.js'
import {tokenize, Token} from './token.js'
import {execute} from './service.js'
import * as fs from 'node:fs/promises'
import {memory} from './mem.js'

async function program() {
  const code = await fs.readFile(process.argv[2])

  memory.commands = tokenize(code.toString())

  for (memory.offset = 0; memory.offset < memory.commands.length; memory.offset++) {
    execute()
  }

  rl.close()
}

await program()
