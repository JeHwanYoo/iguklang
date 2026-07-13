import * as fs from 'node:fs'
import {Opcode} from './op.js'
import {inputValue} from './io.js'
import {memory} from './mem.js'

/**
 * Executes a compiled program against the shared {@link memory}.
 *
 * Output is buffered and flushed on input or completion so tight output loops
 * do not pay a syscall per character. On a TTY a trailing newline is appended so
 * a wrapping launcher's progress teardown (npm/npx) does not erase the last line;
 * piped/redirected output stays byte-exact.
 *
 * @param {import('./compiler.js').Program} program
 * @returns {void}
 */
export function run(program) {
  const {ops, args, length} = program
  const array = memory.array
  let pointer = memory.pointer
  let out = ''

  for (let pc = 0; pc < length; pc++) {
    switch (ops[pc]) {
      case Opcode.ADD:
        array[pointer] += args[pc]
        break
      case Opcode.MOVE:
        pointer += args[pc]
        break
      case Opcode.LOOP_START:
        if (array[pointer] === 0) pc = args[pc]
        break
      case Opcode.LOOP_END:
        if (array[pointer] !== 0) pc = args[pc]
        break
      case Opcode.OUTPUT:
        out += String.fromCharCode(array[pointer])
        break
      case Opcode.INPUT:
        if (out) {
          fs.writeSync(1, out)
          out = ''
        }
        array[pointer] = inputValue()
        break
    }
  }

  if (out) {
    if (process.stdout.isTTY && !out.endsWith('\n')) out += '\n'
    fs.writeSync(1, out)
  }
  memory.pointer = pointer
}
