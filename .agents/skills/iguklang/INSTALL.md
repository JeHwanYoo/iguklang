# iguklang 스킬 설치

이 스킬의 정본은 이 저장소의 `.agents/skills/iguklang/SKILL.md` 이며, 퍼블릭 GitHub raw 링크로 받아 각 에이전트에 설치한다.

정본 URL:

```
https://raw.githubusercontent.com/JeHwanYoo/iguklang/main/.agents/skills/iguklang/SKILL.md
```

## Claude Code

개인(전역)에 설치:

```sh
mkdir -p ~/.claude/skills/iguklang
curl -fsSL https://raw.githubusercontent.com/JeHwanYoo/iguklang/main/.agents/skills/iguklang/SKILL.md \
  -o ~/.claude/skills/iguklang/SKILL.md
```

특정 프로젝트에만 설치하려면 `~/.claude` 대신 프로젝트 루트의 `.claude` 를 쓴다:

```sh
mkdir -p .claude/skills/iguklang
curl -fsSL https://raw.githubusercontent.com/JeHwanYoo/iguklang/main/.agents/skills/iguklang/SKILL.md \
  -o .claude/skills/iguklang/SKILL.md
```

설치 후 새 세션에서 `.iguk` 파일이나 이국랭 관련 요청 시 자동으로 로드된다.

## Gemini CLI

```sh
mkdir -p ~/.gemini/skills/iguklang
curl -fsSL https://raw.githubusercontent.com/JeHwanYoo/iguklang/main/.agents/skills/iguklang/SKILL.md \
  -o ~/.gemini/skills/iguklang/SKILL.md
```

Gemini CLI가 스킬 디렉터리를 지원하지 않는 버전이라면, 내려받은 `SKILL.md` 내용을 프로젝트 `GEMINI.md` 에서 참조하도록 한 줄 추가한다.

## Codex CLI

Codex는 `AGENTS.md` 를 컨텍스트로 읽는다. 스킬을 받아 프로젝트에 두고 `AGENTS.md` 에서 링크한다:

```sh
mkdir -p .agents/skills/iguklang
curl -fsSL https://raw.githubusercontent.com/JeHwanYoo/iguklang/main/.agents/skills/iguklang/SKILL.md \
  -o .agents/skills/iguklang/SKILL.md
```

그리고 `AGENTS.md` 에 다음을 추가한다:

```md
이국랭(`.iguk`) 작업 시 `.agents/skills/iguklang/SKILL.md` 를 참고한다.
```

## 저장소 내부(정본 + 심볼릭 링크)

이 저장소 자체에서 여러 에이전트를 쓸 때는 다운로드 대신 정본을 심볼릭 링크로 연결한다:

```sh
mkdir -p .claude/skills .gemini/skills
ln -sf ../../.agents/skills/iguklang .claude/skills/iguklang
ln -sf ../../.agents/skills/iguklang .gemini/skills/iguklang
```
