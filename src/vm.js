import * as fs from 'node:fs'
import {Opcode} from './op.js'
import {inputValue} from './io.js'
import {memory} from './mem.js'

/**
 * Result of {@link run}, reporting facts about what was written so the driver
 * can apply presentation policy (e.g. a trailing newline on a TTY).
 *
 * @typedef {Object} RunResult
 * @property {boolean} wroteOutput - Whether the program produced any output.
 * @property {boolean} endsWithNewline - Whether the last output byte was a newline.
 */

/**
 * Executes a compiled program against the shared {@link memory}, writing the
 * program's output bytes verbatim. Output is buffered and flushed on input or
 * completion so tight output loops do not pay a syscall per character.
 *
 * @param {import('./compiler.js').Program} program
 * @returns {RunResult}
 */
export function run(program) {
  const {ops, args, length} = program
  const array = memory.array
  let pointer = memory.pointer
  let out = ''
  let wroteOutput = false
  let endsWithNewline = false

  const flush = () => {
    if (!out) return
    fs.writeSync(1, out)
    wroteOutput = true
    endsWithNewline = out.endsWith('\n')
    out = ''
  }

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
        flush()
        array[pointer] = inputValue()
        break
    }
  }

  flush()
  memory.pointer = pointer
  return {wroteOutput, endsWithNewline}
}
