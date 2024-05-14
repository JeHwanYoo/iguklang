/**
 * Tokenizes the given code by matching specific patterns.
 *
 * @param {string} code - The code to be tokenized.
 *
 * @returns {Array.<string>} - An array of tokens extracted from the code.
 */
export function tokenize(code) {
  return code
    .match(/이구(우+)욱|이구(구+)국|고수\?|하-|신|킹갓 충무공 제너럴|이국 왤캐 고수임\?|이국이 처럼 살고싶다.|\/\/(.*?)(\n|$)/g)
    .filter(t => !t.startsWith('//'))
}

/**
 * Represents a set of tokens used in a programming language.
 *
 * @typedef {Object} Token
 * @property {string} MUTATE_VALUE_START - Represents the token for starting a mutation (이구).
 * @property {string} INCREMENT_VALUE_END - Represents the token for incrementing a value (욱).
 * @property {string} DECREMENT_VALUE_END - Represents the token for decrementing a value (국).
 * @property {string} INCREMENT_POINTER - Represents the token for incrementing the pointer (고수?).
 * @property {string} DECREMENT_POINTER - Represents the token for decrementing the pointer (하-).
 * @property {string} START_LOOP - Represents the token for starting a loop (신).
 * @property {string} END_LOOP - Represents the token for ending a loop (킹갓 충무공 제너럴).
 * @property {string} INPUT_VALUE - Represents the token for inputting a value (이국 왤캐 고수임?).
 * @property {string} OUTPUT_VALUE - Represents the token for outputting a value (이국이 처럼 살고싶다.).
 */
export const Token = {
  MUTATE_VALUE_START: '이구',
  INCREMENT_VALUE_END: '욱',
  DECREMENT_VALUE_END: '국',
  INCREMENT_POINTER: '고수?',
  DECREMENT_POINTER: '하-',
  START_LOOP: '신',
  END_LOOP: '킹갓 충무공 제너럴',
  INPUT_VALUE: '이국 왤캐 고수임?',
  OUTPUT_VALUE: '이국이 처럼 살고싶다.',
}

/**
 * Represents different operator values for incrementing or decrementing a value.
 *
 * @typedef {Object} Operator
 * @property {string} INCREMENT_ONE - The operator to increment by one.
 * @property {string} DECREMENT_ONE - The operator to decrement by one.
 */
export const Operator = {
  INCREMENT_ONE: '우',
  DECREMENT_ONE: '구',
}
