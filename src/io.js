import * as fs from 'node:fs'

const byte = Buffer.alloc(1)
const idle = new Int32Array(new SharedArrayBuffer(4))

/**
 * Reads a single byte from stdin, blocking until one is available.
 *
 * The input command operates on a byte stream, so read one byte at a time
 * without line buffering. Returns 0 at EOF. When stdin is non-blocking (some
 * platforms) readSync throws EAGAIN; sleep briefly and retry instead of
 * busy-spinning.
 *
 * @returns {number} The byte read (0-255), or 0 at EOF.
 */
export function inputValue() {
  while (true) {
    try {
      return fs.readSync(0, byte, 0, 1, null) === 1 ? byte[0] : 0
    } catch (err) {
      if (err.code === 'EAGAIN') {
        Atomics.wait(idle, 0, 0, 4)
        continue
      }
      if (err.code === 'EOF') return 0
      throw err
    }
  }
}
