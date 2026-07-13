# AGENTS.md

이국랭(iGuk Language) 저장소에서 작업하는 AI 에이전트를 위한 안내서입니다.

## 프로젝트 개요

Brainfuck과 1:1 대응하는 난해한 프로그래밍 언어(esolang)의 JavaScript 구현체입니다. 8비트 셀 32,768개로 이루어진 메모리 배열 위에서 포인터를 조작합니다. 언어 스펙과 키워드는 `README.md`를 참고하세요.

## 실행 파이프라인

소스는 세 단계를 거쳐 실행됩니다.

```
tokenizer.tokenize(code) → compiler.compile(tokens) → vm.run(program)
```

C 컴파일러(tokenizer → compiler → VM) 관례를 따른다. 외부에서 인터페이스로 참조하는 상수는 명사형 파일로 분리한다.

로직(단계):

- **`src/tokenizer.js`** — 렉서. `tokenize`: 정규식 한 번으로 소스를 토큰 배열로 만든다(주석 `//` 제거).
- **`src/compiler.js`** — 컴파일러. `compile`: 토큰을 flat 바이트코드(`{ops: Uint8Array, args: Int32Array, length}`)로 변환. 여기서 성능의 핵심이 결정된다.
  - 연속된 값 증감(ADD)·포인터 이동(MOVE)을 하나로 folding.
  - `이구...욱`/`이구...국`의 증감량을 컴파일 시 한 번만 계산(런타임 regex 제거).
  - 루프 괄호(`신`/`킹갓 충무공 제너럴`)의 대응 인덱스를 스택으로 사전 계산 → **점프 테이블**. 실행 중에는 매칭 괄호를 절대 재탐색하지 않는다.
- **`src/vm.js`** — 바이트코드 VM. `run`: 숫자 opcode에 대한 `switch` 디스패치 루프. 출력은 버퍼링 후 입력 직전·종료 시 `fs.writeSync(1, ...)`로 flush.
- **`src/main.js`** — 드라이버/CLI 진입점. `iguk <파일>`.

상수(명사):

- **`src/token.js`** — 토큰 상수(`Token`).
- **`src/op.js`** — VM 명령 코드(`Opcode`)와 소스 증감 연산자(`Operator`, `우`/`구`).
- **`src/mem.js`** — VM 메모리 테이프 싱글턴(`array`, `pointer`).

I/O:

- **`src/io.js`** — `inputValue`: `fs.readSync(0, ...)`로 stdin에서 1바이트씩 읽는다(EOF면 0).

## 개발 명령

```sh
npm test              # node:test 통합 테스트 (예제 실행 결과 검증)
node src/main.js example/print-hello.iguk   # 실행: "Hello, World!"
node src/main.js example/fibonacci.iguk     # 실행: "112358"
```

## 규칙

- **의존성 0.** Node 내장 모듈만 사용한다. 새 npm 의존성을 추가하지 말 것.
- **주석은 JSDoc만.** 인라인 `//` 주석을 쓰지 말고, 설명이 필요하면 함수·상수 위의 JSDoc 블록(`/** … */`)에 적는다.
- **성능 회귀 금지.** 실행 핫루프(`run`)나 `compile`을 수정할 때 루프 경계 재탐색이나 명령별 할당(정규식/객체 생성)을 다시 들이지 말 것. 예제 두 개의 출력은 골든 값(`Hello, World!`, `112358`)으로 고정되어 있으니 `npm test`로 확인한다.
- **셀 wrap-around**은 `Uint8Array` 저장으로 자동 처리된다(256 모듈러). 별도 마스킹 불필요.
- Brainfuck 시맨틱을 바꾸는 변경은 금지. 최적화는 관측 가능한 동작을 보존해야 한다.

## 이국랭 코드 작성

이국랭 프로그램(`.iguk`)을 직접 읽거나 쓸 때는 `.agents/skills/iguklang/SKILL.md`(언어 레퍼런스·Brainfuck 대응표·작성 절차)를 참고한다. 다른 에이전트에 설치하는 방법은 `.agents/skills/iguklang/INSTALL.md` 참고.

## 릴리스

GitHub Actions의 **Release** 워크플로(`.github/workflows/release.yml`)를 `workflow_dispatch`로 실행한다. `version` 입력을 주면 `package.json`을 그 버전으로 올려 커밋하고, 비우면 현재 버전을 쓴다. 이후 `v<version>` 태그 생성·push → `npm publish --provenance` → GitHub Release 생성까지 한 번에 처리한다(`NPM_TOKEN` 시크릿 필요). `ci.yml`은 PR/푸시에서 테스트만 돌린다.
