#!/usr/bin/env node
import * as fs from 'node:fs/promises'
import {tokenize} from './tokenizer.js'
import {compile} from './compiler.js'
import {run} from './vm.js'

async function program() {
  const path = process.argv[2]
  if (!path) {
    console.error('실행할 파일을 지정해 주세요. 예: iguk example/print-hello.iguk')
    process.exitCode = 1
    return
  }

  const code = await fs.readFile(path, 'utf8')
  run(compile(tokenize(code)))
}

await program()
