# gpc

이 저장소에는 [REA (Reverse Engineer Anything)](https://github.com/morluto/rea)가
Claude Code용으로 설치되어 있습니다.

## 구성

| 경로 | 역할 |
| --- | --- |
| `.mcp.json` | 프로젝트 범위 MCP 등록. `npx -y rea-agents@6.8.0 mcp`로 REA 서버를 실행합니다. |
| `.claude/skills/reverse-engineer-anything/` | REA가 배포하는 Claude Code 스킬 (사용법 지침과 참고 문서). |

이 저장소에서 Claude Code를 열면 `rea` MCP 서버와 `reverse-engineer-anything`
스킬이 자동으로 로드됩니다. Node.js 22.23.4 이상(또는 24.22.1 이상, 26.12.1 이상)이 필요합니다.

## 터미널에서 직접 사용

```bash
npm install --global rea-agents
rea doctor
rea analyze-javascript-application /absolute/path/to/app --json
```

## 참고

- 정적 JavaScript/Electron 분석은 추가 엔진 없이 동작합니다.
- 네이티브 바이너리 분석에는 Hopper, Ghidra, IDA, Kuna 중 하나가 별도로 필요합니다
  (`rea doctor`가 설정 방법을 안내합니다).
- 버전을 올릴 때는 `.mcp.json`의 `rea-agents@6.8.0` 버전을 함께 갱신하세요.
