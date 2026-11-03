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

## 테니스 커리어 시뮬레이션: 퓨처스에서 그랜드슬램까지

`tennis/` 에는 kickru.com(벤치에서 발롱까지)을 REA로 분석한 뒤 테니스에 맞게 새로 설계한
커리어 시뮬레이션 게임이 들어 있습니다. 분석 결과와 대응표는 `docs/kickru-analysis.md` 에 있습니다.

| 경로 | 내용 |
| --- | --- |
| `tennis/index.html` | 게임 페이지(ES 모듈, 로컬 서버로 열기) |
| `tennis/engine.js` | 시뮬레이션 엔진(선수 생성, 시즌, 성장, 노화, 부상, 수상, 은퇴) |
| `tennis/app.js` | 화면과 저장(localStorage, 내보내기/가져오기) |
| `tennis/sim.mjs` | 밸런스 점검용 헤드리스 시뮬레이터 |
| `tennis/build-artifact.mjs` | 단일 파일 번들(`tennis/dist/single.html`) 생성 |

```bash
node tennis/build-artifact.mjs
```

```bash
node tennis/sim.mjs 300 777 --trace=월드클래스
```

빌드된 `tennis/dist/single.html` 은 서버 없이 브라우저에서 바로 열립니다.
게시된 버전: https://claude.ai/artifact/3icqgHX8jVanATkheYPuAp (소유자와 공유받은 사람만 열 수 있습니다).
