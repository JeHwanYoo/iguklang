import {Operator, Token} from './token.js'

/**
 * Increments the value based on the Korean characters in the input command.
 *
 * @param {string} cmd - The input command
 * @returns {number} The final value after incrementing the initial 0 value based on the input characters
 */
export function incrementValue(cmd) {
  return (cmd.slice(2).match(new RegExp(`${Operator.INCREMENT_ONE}`, 'g')) ?? []).reduce((acc, token) => {
    if (token === Operator.INCREMENT_ONE) return acc + 1
    else return acc
  }, 0)
}

/**
 * Decreases the value based on the input command.
 *
 * @param {string} cmd - The input command
 * @returns {number} The final value after decreasing the initial 0 value based on the input characters
 */
export function decrementValue(cmd) {
  return (cmd.slice(2).match(new RegExp(`${Operator.DECREMENT_ONE}`, 'g')) ?? []).reduce((acc, token) => {
    if (token === Operator.DECREMENT_ONE) return acc - 1
    else return acc
  }, 0)
}

/**
 * Increase the given pointer by one.
 *
 * @param {number} pointer - The initial value of the pointer.
 * @return {number} The value of the pointer after incrementing by one.
 */
export function increasePointer(pointer) {
  return pointer + 1
}

/**
 * Decrease the given pointer by one.
 *
 * @param {number} pointer - The initial value of the pointer.
 * @returns {number} - The value of the pointer after decrementing by one.
 */
export function decreasePointer(pointer) {
  return pointer - 1
}

/**
 * Checks if the value at the specified memory pointer in the given memory array is zero.
 *
 * @param {Uint8Array} array - The memory array.
 * @param {number} pointer - The memory pointer.
 * @returns {boolean} - True if the value at the specified memory pointer is zero, otherwise false.
 */
export function isZeroByte(array, pointer) {
  return array[pointer] === 0
}

/**
 * Iterate through the commands starting from the given current index and find the index of the last occurrence of Token.END_LOOP.
 * If Token.END_LOOP is not found, return the index of the last command.
 *
 * @param {Array} commands - The list of commands.
 * @param {number} current - The index from which iteration should start.
 * @return {number} - The index of the last occurrence of Token.END_LOOP or the index of the last command if Token.END_LOOP is not found.
 */
export function forward(commands, current) {
  for (let i = current; i < commands.length; i++) {
    if (commands[i] === Token.END_LOOP) {
      return i
    }
  }
  return commands.length - 1
}

/**
 * Rewinds the given array of commands and returns the offset of the last occurrence of "START_LOOP" command.
 *
 * @param {string[]} commands - The array of commands to rewind.
 * @param {number} current - The current offset to start rewinding from.
 * @return {number} - The offset of the last occurrence of the "START_LOOP" command. Returns 0 if the command is not found.
 */
export function rewind(commands, current) {
  for (let i = current; i >= 0; i--) {
    if (commands[i] === Token.START_LOOP) {
      return i
    }
  }
  return 0
}

/**
 * Function that reads input from the user and returns the ASCII code of the first character.
 *
 * @param {import('readline/promises').Interface} rl - The readline interface object used to read input from the user.
 * @returns {Promise<number>} - A promise that resolves to the ASCII code of the first character entered by the user.
 */
export async function inputValue(rl) {
  const inputChar = (await rl.question('')).charCodeAt(0)

  if (!Number.isInteger(inputChar)) return 0

  return inputChar
}

/**
 * Returns the string representation of the value stored in the memory at the given pointer.
 *
 * @param {Uint8Array} array - The memory array containing the values.
 * @param {Number} pointer - The offset of the value in the memory array.
 * @returns {string} The string representation of the value at the given pointer.
 */
export function outputValue(array, pointer) {
  return String.fromCharCode(array[pointer])
}
