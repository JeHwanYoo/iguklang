import {Token} from './token.js'
import {Opcode, Operator} from './op.js'

function countChar(str, ch) {
  let n = 0
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ch) n++
  }
  return n
}

/**
 * A compiled program ready for {@link run}.
 *
 * @typedef {Object} Program
 * @property {Uint8Array} ops - One {@link Opcode} per instruction.
 * @property {Int32Array} args - Per-instruction operand: signed delta for ADD/MOVE, matching bracket index for LOOP_START/LOOP_END.
 * @property {number} length - Number of instructions.
 */

/**
 * Compiles a token stream into a flat instruction program.
 *
 * Folds runs of ADD/MOVE, resolves the increment amount once, and precomputes a
 * bracket jump table so the interpreter never rescans for a matching loop boundary.
 *
 * @param {Array.<string>} tokens - Tokens from {@link tokenize}.
 * @returns {Program}
 */
export function compile(tokens) {
  const ops = []
  const args = []

  const push = (op, arg) => {
    ops.push(op)
    args.push(arg)
  }
  const foldOrPush = (op, delta) => {
    if (ops.length && ops[ops.length - 1] === op) args[args.length - 1] += delta
    else push(op, delta)
  }

  for (const tok of tokens) {
    if (tok.startsWith(Token.MUTATE_VALUE_START)) {
      const body = tok.slice(Token.MUTATE_VALUE_START.length)
      const isIncrement = tok.endsWith(Token.INCREMENT_VALUE_END)
      const unit = isIncrement ? Operator.INCREMENT_ONE : Operator.DECREMENT_ONE
      foldOrPush(Opcode.ADD, countChar(body, unit) * (isIncrement ? 1 : -1))
    } else if (tok === Token.INCREMENT_POINTER) {
      foldOrPush(Opcode.MOVE, 1)
    } else if (tok === Token.DECREMENT_POINTER) {
      foldOrPush(Opcode.MOVE, -1)
    } else if (tok === Token.START_LOOP) {
      push(Opcode.LOOP_START, 0)
    } else if (tok === Token.END_LOOP) {
      push(Opcode.LOOP_END, 0)
    } else if (tok === Token.INPUT_VALUE) {
      push(Opcode.INPUT, 0)
    } else if (tok === Token.OUTPUT_VALUE) {
      push(Opcode.OUTPUT, 0)
    }
  }

  const stack = []
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === Opcode.LOOP_START) {
      stack.push(i)
    } else if (ops[i] === Opcode.LOOP_END) {
      const start = stack.pop()
      if (start === undefined) throw new SyntaxError("'킹갓 충무공 제너럴'에 대응하는 '신'이 없습니다.")
      args[start] = i
      args[i] = start
    }
  }
  if (stack.length) throw new SyntaxError("'신'에 대응하는 '킹갓 충무공 제너럴'이 없습니다.")

  return {
    ops: Uint8Array.from(ops),
    args: Int32Array.from(args),
    length: ops.length,
  }
}
