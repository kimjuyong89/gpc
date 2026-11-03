// 단일 파일 번들 생성: node tennis/build-artifact.mjs → tennis/dist/single.html
// engine.js 와 app.js 를 인라인해, 서버 없이 파일 하나로도 열리는 버전을 만듭니다.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, 'index.html'), 'utf8');
const engine = readFileSync(join(here, 'engine.js'), 'utf8');
const app = readFileSync(join(here, 'app.js'), 'utf8');

const slice = (s, a, b) => s.slice(s.indexOf(a) + a.length, s.indexOf(b));
const head = slice(html, '<!-- artifact:head:start -->', '<!-- artifact:head:end -->').trim();
const body = slice(html, '<!-- artifact:body:start -->', '<!-- artifact:body:end -->').trim();

const names = [...engine.matchAll(/^export (?:function|const|let) ([A-Za-z_$][\w$]*)/gm)].map(m => m[1]);
const engineInline = engine.replace(/^export /gm, '');
const appInline = app.replace(/^export function boot/m, 'function boot');
const script = `<script type="module">\n${engineInline}\nconst E = { ${names.join(', ')} };\n${appInline}\nboot(E, document.getElementById('app'));\n</script>`;

// 아티팩트용(스켈레톤 없이 본문만)과 독립 실행용(완전한 문서) 두 가지를 만든다.
const artifact = `${head}\n${body}\n${script}\n`;
const standalone = `<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${head}\n</head>\n<body>\n${body}\n${script}\n</body>\n</html>\n`;
mkdirSync(join(here, 'dist'), { recursive: true });
writeFileSync(join(here, 'dist', 'artifact.html'), artifact);
writeFileSync(join(here, 'dist', 'single.html'), standalone);
console.log(`built dist/artifact.html (${artifact.length} bytes) and dist/single.html (${standalone.length} bytes); engine exports: ${names.length}`);
