import {Token} from './token.js'
import {
  decreasePointer,
  decrementValue,
  forward,
  increasePointer,
  incrementValue,
  inputValue,
  isZeroByte,
  outputValue,
  rewind
} from './command.js'
import {memory} from './mem.js'
import {rl} from './io.js'

/**
 * Command Table
 * containing command functions for iGuk language.
 *
 * @property {Function} '욱' - Function that adds an increment value to the memory array at the current pointer location.
 * @property {Function} '국' - Function that subtracts a decrement value from the memory array at the current pointer location.
 * @property {Function} '고수?' - Function that increases the memory pointer by one.
 * @property {Function} '하-' - Function that decreases the memory pointer by one.
 * @property {Function} '신' - Function that checks if the byte at the current memory pointer is zero. If true, moves the command offset forward.
 * @property {Function} '킹갓 충무공 제너럴' - Function that checks if the byte at the current memory pointer is not zero. If true, moves the command offset backward.
 * @property {Function} '이국 왤캐 고수임?' - Async function that waits for user input and assigns the input value to the memory array at the current pointer location.
 * @property {Function} '이국이 처럼 살고싶다.' - Function that writes the output value of the memory array at the current pointer location to stdout.
 */
const commandTable = {
  '욱': () => {
    memory.array[memory.pointer] += incrementValue(memory.commands[memory.offset])
  },
  '국': () => {
    memory.array[memory.pointer] += decrementValue(memory.commands[memory.offset])
  },
  '고수?': () => {
    memory.pointer = increasePointer(memory.pointer)
  },
  '하-': () => {
    memory.pointer = decreasePointer(memory.pointer)
  },
  '신': () => {
    if (isZeroByte(memory.array, memory.pointer)) {
      memory.offset = forward(memory.commands, memory.offset)
    }
  },
  '킹갓 충무공 제너럴': (_, __, commands) => {
    if (!isZeroByte(memory.array, memory.pointer)) {
      memory.offset = rewind(memory.commands, memory.offset)
    }
  },
  '이국 왤캐 고수임?': async () => {
    memory.array[memory.pointer] = await inputValue(rl)
  },
  '이국이 처럼 살고싶다.': () => {
    process.stdout.write(outputValue(memory.array, memory.pointer))
  },
}

/**
 * Executes a command.
 *
 * @return {void}
 */
export function execute() {
  const cmd = memory.commands[memory.offset]
  if (cmd.startsWith(Token.MUTATE_VALUE_START)) {
    commandTable[cmd.at(-1)]()
  } else {
    commandTable[cmd]?.()
  }
}
