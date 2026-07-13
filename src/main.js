#!/usr/bin/env node
import * as fs from 'node:fs/promises'
import {tokenize} from './tokenizer.js'
import {compile} from './compiler.js'
import {run} from './vm.js'

/**
 * On an interactive TTY, append a newline when the program's output did not end
 * with one, so a wrapping launcher's progress teardown (npx/npm) does not erase
 * the last line. Piped/redirected output is left byte-exact.
 *
 * @param {import('./vm.js').RunResult} result
 */
function fixupTtyNewline(result) {
  if (process.stdout.isTTY && result.wroteOutput && !result.endsWithNewline) {
    process.stdout.write('\n')
  }
}

async function program() {
  const path = process.argv[2]
  if (!path) {
    console.error('실행할 파일을 지정해 주세요. 예: npx iguklang example/print-hello.iguk')
    process.exitCode = 1
    return
  }

  const code = await fs.readFile(path, 'utf8')
  fixupTtyNewline(run(compile(tokenize(code))))
}

await program()
