/**
 * Instruction opcodes produced by {@link import('./compiler.js').compile} and
 * dispatched by {@link import('./vm.js').run}.
 *
 * @readonly
 * @enum {number}
 */
export const Opcode = {
  ADD: 0,
  MOVE: 1,
  LOOP_START: 2,
  LOOP_END: 3,
  INPUT: 4,
  OUTPUT: 5,
}

/**
 * Source operators counted inside a mutation token to derive its ADD amount.
 *
 * @typedef {Object} Operator
 * @property {string} INCREMENT_ONE - The operator to increment by one.
 * @property {string} DECREMENT_ONE - The operator to decrement by one.
 */
export const Operator = {
  INCREMENT_ONE: '우',
  DECREMENT_ONE: '구',
}
