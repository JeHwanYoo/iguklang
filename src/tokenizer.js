/**
 * Tokenizes the given code by matching specific patterns.
 *
 * @param {string} code - The code to be tokenized.
 *
 * @returns {Array.<string>} - An array of tokens extracted from the code.
 */
export function tokenize(code) {
  return (code.match(/이구(우+)욱|이구(구+)국|고수\?|하-|신|킹갓 충무공 제너럴|이국 왤캐 고수임\?|이국이 처럼 살고싶다.|\/\/(.*?)(\n|$)/g) ?? [])
    .filter(t => !t.startsWith('//'))
}
