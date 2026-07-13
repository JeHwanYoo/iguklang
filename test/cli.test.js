import {test} from 'node:test'
import assert from 'node:assert/strict'
import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {fileURLToPath} from 'node:url'
import * as path from 'node:path'

const run = promisify(execFile)
const root = fileURLToPath(new URL('..', import.meta.url))
const main = path.join(root, 'src', 'main.js')
const example = (name) => path.join(root, 'example', name)

function iguk(name, input = '') {
  const child = run('node', [main, example(name)])
  child.child.stdin.end(input)
  return child
}

test('print-hello 예제', async () => {
  assert.equal((await iguk('print-hello.iguk')).stdout, 'Hello, World!')
})

test('fibonacci 예제', async () => {
  assert.equal((await iguk('fibonacci.iguk')).stdout, '112358')
})

test('digits 예제', async () => {
  assert.equal((await iguk('digits.iguk')).stdout, '0123456789')
})

test('adder 예제: 공백으로 구분된 두 십진수의 합을 출력한다', async () => {
  assert.equal((await iguk('adder.iguk', '5 16')).stdout, '21')
})

test('echo 예제: stdin 바이트를 순차로 그대로 출력한다', async () => {
  assert.equal((await iguk('echo.iguk', 'AB')).stdout, 'AB')
})

test('파일 인자가 없으면 에러 코드로 종료한다', async () => {
  await assert.rejects(() => run('node', [main]), err => err.code === 1)
})
