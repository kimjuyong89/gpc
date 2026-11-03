// 퓨처스에서 그랜드슬램까지 — UI. 엔진 네임스페이스 E 를 받아 화면을 그립니다.
export function boot(E, root) {
  const SAVE_KEY = 'fgs-save-v1', HOF_KEY = 'fgs-hof-v1', LAST_KEY = 'fgs-last-setup-v1';
  const $ = (sel, el = root) => el.querySelector(sel);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch { } },
  };

  let S = store.get(SAVE_KEY);
  if (S && !E.validState(S)) S = null;
  let tab = 'home';
  let create = { step: 'form', name: '', gender: 'm', nationality: 'KR', path: 'kr_school', style: 'allcourt', focus: ['serve', 'forehand'], candidates: null, seed: null, error: '' };
  let ui = { openEntry: null, importText: '', importMsg: '', confirmNew: false, confirmRetire: false, exportOpen: false, savedNote: '' };

  function save() { if (S) ui.savedNote = store.set(SAVE_KEY, S) ? '' : '브라우저 저장 공간을 쓸 수 없어 진행이 저장되지 않습니다. 설정에서 내보내기를 해 두세요.'; }
  function act(action) { if (!S) return; E.applyAction(S, action); if (S.stage === 'retired' && !S.hofSaved) { S.hofSaved = true; const hof = store.get(HOF_KEY) ?? []; hof.push(E.hallOfFameEntry(S)); hof.sort(E.compareHof); store.set(HOF_KEY, hof.slice(0, 50)); } save(); render(); }

  const fmtRank = r => r == null ? '랭킹 없음' : r >= 2500 ? '2500위 밖' : `${r.toLocaleString()}위`;
  const money = n => E.fmtMoney(n);
  const pct = x => `${Math.round(x * 100)}%`;
  const styleLabel = s => E.STYLES[s]?.label ?? s;
  const ovrOf = p => E.overall(p);

  // ── 레이더 차트 (SVG)
  function radar(attrs, size = 180) {
    const c = size / 2, r = size / 2 - 26, n = E.ATTRS.length, pad = 34;
    const pt = (i, v) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + Math.cos(a) * r * v, c + Math.sin(a) * r * v]; };
    const ring = v => E.ATTRS.map((_, i) => pt(i, v).join(',')).join(' ');
    const poly = E.ATTRS.map((a, i) => pt(i, Math.max(.05, attrs[a] / 100)).join(',')).join(' ');
    const labels = E.ATTRS.map((a, i) => { const [x, y] = pt(i, 1.22); return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" class="radar-label">${E.ATTR_LABELS[a]} <tspan class="radar-val">${Math.round(attrs[a])}</tspan></text>`; }).join('');
    return `<svg viewBox="${-pad} -6 ${size + pad * 2} ${size + 12}" class="radar" role="img" aria-label="능력치 레이더"><polygon points="${ring(1)}" class="radar-ring"/><polygon points="${ring(.66)}" class="radar-ring"/><polygon points="${ring(.33)}" class="radar-ring"/>${E.ATTRS.map((_, i) => { const [x, y] = pt(i, 1); return `<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" class="radar-ring"/>`; }).join('')}<polygon points="${poly}" class="radar-fill"/>${labels}</svg>`;
  }
  function bars(attrs, prev) {
    return `<div class="bars">${E.ATTRS.map(a => { const v = attrs[a], d = prev ? v - prev[a] : 0; return `<div class="bar-row"><span class="bar-name">${E.ATTR_LABELS[a]}</span><span class="bar-track"><span class="bar-fill" style="width:${Math.max(2, Math.min(100, v))}%"></span></span><span class="bar-num">${Math.round(v)}${prev ? `<small class="${d >= .5 ? 'up' : d <= -.5 ? 'down' : ''}">${d >= .5 ? `+${d.toFixed(1)}` : d <= -.5 ? d.toFixed(1) : ''}</small>` : ''}</span></div>`; }).join('')}</div>`;
  }

  // ── 화면들
  function render() {
    root.innerHTML = S ? appShell() : createScreen();
    bind();
  }
  function appShell() {
    const p = S.player;
    const body = tab === 'home' ? homeTab() : tab === 'records' ? recordsTab() : tab === 'shop' ? shopTab() : tab === 'hof' ? hofTab() : settingsTab();
    return `<header class="appbar"><div class="appbar-inner"><div class="brand">퓨처스에서 그랜드슬램까지</div><div class="chip-row"><span class="chip">${S.year}년</span><span class="chip">${p.age}세</span><span class="chip chip-strong">${p.pro ? fmtRank(p.rank) : `주니어 ${p.juniorRank ? p.juniorRank + '위' : '무랭킹'}`}</span></div></div></header>
    <main class="main">${ui.savedNote ? `<p class="notice warn">${esc(ui.savedNote)}</p>` : ''}${body}</main>
    <nav class="tabbar" aria-label="메뉴">${[['home', '홈'], ['records', '기록'], ['shop', '상점'], ['hof', '전당'], ['settings', '설정']].map(([id, l]) => `<button class="tab ${tab === id ? 'active' : ''}" data-tab="${id}">${l}</button>`).join('')}</nav>`;
  }

  function playerCard() {
    const p = S.player, ovr = ovrOf(p);
    const grade = p.age >= 19 && p.pro ? `<span class="chip">스카우트 평가 · ${E.potentialGrade(p.hidden.potential)}</span>` : `<span class="chip">잠재력 미공개</span>`;
    const moraleTxt = p.morale >= 3 ? '최고' : p.morale >= 1 ? '좋음' : p.morale > -1 ? '보통' : p.morale > -3 ? '나쁨' : '바닥';
    return `<section class="card player">
      <div class="player-head"><div><h1 class="player-name">${esc(p.name)}</h1><div class="player-sub">${E.COUNTRY_MAP[p.nationality].name} · ${styleLabel(p.style)} · ${p.gender === 'm' ? '남자 투어' : '여자 투어'}</div></div><div class="ovr"><div class="ovr-num">${ovr}</div><div class="ovr-label">오버롤</div></div></div>
      <div class="chip-row wrap">${grade}<span class="chip">사기 ${moraleTxt}</span><span class="chip">명성 ${Math.round(p.fame)}</span><span class="chip">잔고 ${money(p.balance)}</span>${p.coach ? `<span class="chip">코치 · ${esc(p.coach.name)}</span>` : ''}${p.sponsor ? `<span class="chip">후원 · ${esc(p.sponsor.brand)}</span>` : ''}${p.military === 'serving' ? '<span class="chip chip-warn">군 복무 중</span>' : p.military === 'exempt' ? '<span class="chip">병역 혜택</span>' : ''}${p.injuries.some(i => i.remaining > 0) ? `<span class="chip chip-warn">${esc(p.injuries[0].name)} · ${p.injuries[0].remaining}주</span>` : ''}</div>
      <div class="player-body">${radar(p.attributes)}${bars(p.attributes)}</div>
      <p class="muted small">집중 훈련: ${p.focus.map(a => E.ATTR_LABELS[a]).join(', ') || '없음'} · 최고 랭킹 ${p.peakRank ? p.peakRank + '위' : '없음'} · 통산 ${p.career.wins}승 ${p.career.losses}패 · 우승 ${p.career.titles}회${p.career.gs ? ` (그랜드슬램 ${p.career.gs})` : ''}</p>
    </section>`;
  }

  function homeTab() {
    const stage = S.stage;
    let panel = '';
    if (stage === 'ready') panel = readyPanel();
    else if (stage === 'result') panel = resultPanel();
    else if (stage === 'event') panel = eventPanel();
    else if (stage === 'offers') panel = offersPanel();
    else if (stage === 'advice') panel = advicePanel();
    else if (stage === 'retired') panel = retiredPanel();
    return playerCard() + panel;
  }

  function readyPanel() {
    const plans = E.availablePlans(S).map(id => E.planSummary(S, id));
    return `<section class="card"><h2 class="h2">시즌 일정 고르기</h2><p class="muted">${esc(S.message)}</p>
      <div class="plans">${plans.map(pl => `<label class="plan"><input type="radio" name="plan" value="${pl.id}" ${pl.id === plans[plans.length - 1].id ? 'checked' : ''}><div><div class="plan-head"><strong>${pl.label}</strong><span class="diff diff-${['쉬움 · 성장 제한', '적당함', '도전적', '버거움', '무리'].indexOf(pl.difficulty)}">${pl.difficulty}</span></div><div class="muted small">${pl.desc}</div><div class="small">대회 ${pl.events}개 · 본선 ${pl.main} · 예선 ${pl.qual}${pl.none ? ` · 자격 없음 ${pl.none}` : ''} · 평균 상대 ${pl.strength} · 경비 ${money(pl.travel)}</div></div></label>`).join('')}</div>
      <button class="btn primary big" data-act="play">시즌 진행</button>
      ${S.player.pro && S.player.age >= 24 ? (ui.confirmRetire ? `<div class="inline-confirm"><span>정말 은퇴할까요? 되돌릴 수 없습니다.</span><button class="btn danger" data-act="retire">은퇴한다</button><button class="btn" data-act="cancel-retire">취소</button></div>` : `<button class="btn ghost" data-act="ask-retire">은퇴하기</button>`) : ''}
    </section>`;
  }

  function entryRow(e) {
    const t = E.TIERS[e.tier];
    const result = e.skipped ? `<span class="res res-skip">${esc(e.skipped)}</span>` : e.title ? `<span class="res res-win">우승</span>` : `<span class="res">${esc(e.result ?? '')}</span>`;
    const open = ui.openEntry === e.name + e.week;
    const matches = e.matches?.length ? `<ul class="matches">${e.matches.map(m => `<li class="${m.won ? 'won' : 'lost'}"><span>${esc(m.round)}</span><span>${m.won ? '승' : '패'} vs ${esc(m.opp)}${m.oppRank ? ` (${m.oppRank}위)` : ''}</span><span class="score">${esc(m.score)}</span></li>`).join('')}</ul>` : '';
    return `<li class="entry ${open ? 'open' : ''}"><button class="entry-head" data-entry="${esc(e.name + e.week)}"><span class="entry-tier">${t?.short ?? ''}</span><span class="entry-name">${esc(e.name)}<small class="muted"> · ${E.SURFACES[e.surface]?.label ?? ''}${e.entry === 'qual' ? ' · 예선부터' : ''}</small></span>${result}<span class="entry-pts">${e.points ? `+${e.points}` : ''}</span></button>${open ? matches : ''}</li>`;
  }

  function resultPanel() {
    const h = S.lastSeason, p = S.player, g = h.growth;
    const rankTxt = h.plan === 'junior' ? `주니어 ${h.juniorRank}위` : `${fmtRank(h.rank)}${h.prevRank && h.rank ? ` <small class="${h.rank < h.prevRank ? 'up' : h.rank > h.prevRank ? 'down' : ''}">(${h.prevRank}위 → ${h.rank}위)</small>` : ''}`;
    return `<section class="card"><h2 class="h2">${h.year} 시즌 결과 <small class="muted">${h.age}세 · ${esc(h.planLabel)}</small></h2>
      <div class="stat-grid"><div class="stat"><div class="stat-num">${h.wins}승 ${h.losses}패</div><div class="stat-label">승패</div></div><div class="stat"><div class="stat-num">${h.pts.toLocaleString()}</div><div class="stat-label">시즌 포인트</div></div><div class="stat"><div class="stat-num">${rankTxt}</div><div class="stat-label">연말 랭킹</div></div><div class="stat"><div class="stat-num">${h.titles.length}</div><div class="stat-label">우승</div></div><div class="stat"><div class="stat-num">${money(h.prize)}</div><div class="stat-label">상금</div></div><div class="stat"><div class="stat-num">${g.before} → ${g.after}</div><div class="stat-label">오버롤</div></div></div>
      ${h.titles.length ? `<p><strong>우승:</strong> ${h.titles.map(t => esc(t.name)).join(', ')}</p>` : ''}
      ${h.awards.length ? `<p class="award">🏆 ${h.awards.map(esc).join(' · ')}</p>` : ''}
      ${h.national?.length ? `<p><strong>국가대항전:</strong> ${h.national.map(n => `${esc(n.name)} ${esc(n.result)}`).join(', ')}</p>` : ''}
      <h3 class="h3">성장</h3>${bars(g.attrs, h.startAttrs)}
      <ul class="notes">${[...g.notes, ...h.notes].map(n => `<li>${esc(n)}</li>`).join('')}${h.injuries.length ? `<li>부상: ${h.injuries.map(esc).join(', ')} (결장 ${h.missed}개 대회)</li>` : ''}<li class="muted">출전율 ${pct(g.participation)} · 활약도 ${pct(g.performance)}${g.decline ? ` · 노화 −${g.decline}` : ''}</li></ul>
      <h3 class="h3">대회별 결과</h3><ul class="entries">${h.entries.map(entryRow).join('')}</ul>
      ${h.gsWinners?.length ? `<details class="world"><summary>올해의 그랜드슬램 챔피언</summary><ul>${h.gsWinners.map(w => `<li>${esc(w.name)}: ${w.me ? '<strong>나</strong>' : esc(w.winner)}</li>`).join('')}</ul></details>` : ''}
      <p class="muted small">수입 ${money(h.prize + h.sponsor)} · 지출 경비 ${money(h.travel)} + 코치 ${money(h.coachFee)} · 잔고 ${money(p.balance)}</p>
      <button class="btn primary big" data-act="continue">계속</button></section>`;
  }

  function eventPanel() {
    const ev = S.event;
    return `<section class="card event"><div class="eyebrow">전환점</div><h2 class="h2">${esc(ev.title)}</h2><p>${esc(ev.text)}</p>
      <div class="options">${ev.options.map(o => `<button class="btn option" data-option="${esc(o.id)}"><span>${esc(o.label)}</span>${o.chance != null ? `<small>성공 ${pct(o.chance)} · 성공 시 ${effectText(o.success)} · 실패 시 ${effectText(o.fail)}</small>` : o.effect ? `<small>${effectText(o.effect)}</small>` : ''}</button>`).join('')}</div></section>`;
  }
  function effectText(e) {
    if (!e) return '';
    const parts = [];
    for (const a of E.ATTRS) if (e[a]) parts.push(`${E.ATTR_LABELS[a]} ${e[a] > 0 ? '+' : ''}${e[a]}`);
    if (e.laterServe) parts.push(`2년 뒤 서브 +${e.laterServe}`);
    if (e.morale) parts.push(`사기 ${e.morale > 0 ? '+' : ''}${e.morale}`);
    if (e.fame) parts.push(`명성 ${e.fame > 0 ? '+' : ''}${e.fame}`);
    if (e.money) parts.push(`${e.money > 0 ? '+' : '−'}${money(Math.abs(e.money))}`);
    if (e.durability) parts.push(`내구성 ${e.durability > 0 ? '상승' : '하락'}`);
    if (e.doubles) parts.push('복식 병행(부상 위험 ↑)');
    if (e.style) parts.push('스타일 전환');
    if (e.nationality) parts.push('국적 변경');
    if (e.rival) parts.push('라이벌 지정');
    if (e.focus) parts.push(`집중 훈련: ${e.focus.map(a => E.ATTR_LABELS[a]).join(', ')}`);
    if (e.newCoach) parts.push('새 코치 제안');
    if (e.mentalRisk) parts.push('멘탈 +1 또는 사기 −1');
    return parts.join(' · ') || '변화 없음';
  }

  function offersPanel() {
    return `<section class="card"><div class="eyebrow">비시즌 제안</div><h2 class="h2">계약 제안</h2>
      <div class="offers">${S.offers.map(o => o.kind === 'coach' ? `<div class="offer"><div class="offer-head"><strong>${esc(o.name)}</strong><span class="chip">${esc(o.label)}</span></div><p class="muted small">${esc(o.pitch)}</p><p class="small">훈련 효율 ×${o.mult.toFixed(2)} · 연 ${money(o.fee)} · ${o.years}년${o.rejected ? ` · <span class="down">${esc(o.rejected)}</span>` : ''}</p><button class="btn primary" data-offer="${esc(o.id)}">계약한다</button></div>` : `<div class="offer"><div class="offer-head"><strong>${esc(o.brand)}</strong><span class="chip">후원</span></div><p class="small">${esc(o.pitch)} · ${o.years}년</p><button class="btn primary" data-offer="${esc(o.id)}">계약한다</button></div>`).join('')}</div>
      <p class="muted small">현재: 코치 ${esc(S.player.coach.name)}(훈련 ×${S.player.coach.mult.toFixed(2)}, 연 ${money(S.player.coach.fee)})${S.player.sponsor ? ` · 후원 ${esc(S.player.sponsor.brand)} 연 ${money(S.player.sponsor.fee)} (${S.player.sponsor.years}년 남음)` : ' · 후원 없음'}</p>
      <button class="btn ghost" data-act="decline-offers">모두 거절하고 넘어가기</button></section>`;
  }

  function advicePanel() {
    const a = S.advice;
    return `<section class="card"><div class="eyebrow">${a.forced ? '은퇴' : '은퇴 권고'}</div><h2 class="h2">${a.forced ? '이제 라켓을 내려놓을 때입니다' : '다음 인생을 생각해 볼 때'}</h2><p>${esc(a.reason)}</p>
      <div class="row">${a.forced ? '' : '<button class="btn" data-act="advice-continue">한 시즌 더 뛴다</button>'}<button class="btn danger" data-act="advice-retire">은퇴한다</button></div></section>`;
  }

  function retiredPanel() {
    const s = S.summary, p = S.player;
    const hidden = `숨은 성장 곡선 ${s.hiddenCurve} · 잠재력 ${s.potential}(${s.potentialGrade}) · 노화 체질 ${({ fast: '이른 노화', normal: '보통', late: '늦은 노화', iron: '철인' })[s.aging]} · 내구성 ${p.hidden.durability.toFixed(2)}`;
    return `<section class="card"><div class="eyebrow">커리어 종료</div><h2 class="h2">${esc(p.name)}, ${esc(s.title)}</h2>
      <div class="chip-row wrap">${s.tags.map(t => `<span class="chip chip-strong">${esc(t)}</span>`).join('') || '<span class="chip">기록 없음</span>'}</div>
      <div class="stat-grid"><div class="stat"><div class="stat-num">${s.gs}</div><div class="stat-label">그랜드슬램</div></div><div class="stat"><div class="stat-num">${s.no1}</div><div class="stat-label">연말 1위</div></div><div class="stat"><div class="stat-num">${s.peakRank ?? '-'}</div><div class="stat-label">최고 랭킹</div></div><div class="stat"><div class="stat-num">${s.titles}</div><div class="stat-label">통산 우승</div></div><div class="stat"><div class="stat-num">${s.wins}승 ${s.losses}패</div><div class="stat-label">통산 전적</div></div><div class="stat"><div class="stat-num">${money(s.earnings)}</div><div class="stat-label">통산 수입</div></div></div>
      <h3 class="h3">인생 이야기</h3><ol class="story">${s.story.map(t => `<li>${esc(t)}</li>`).join('')}</ol>
      <h3 class="h3">역대 기록과 비교</h3><div class="alltime">${s.allTime.map(r => `<div class="alltime-row"><span>${esc(r.label)}</span><span class="bar-track"><span class="bar-fill" style="width:${Math.min(100, r.mine / r.record * 100)}%"></span></span><span class="bar-num">${r.mine.toLocaleString()} <small class="muted">/ ${esc(r.note)}</small></span></div>`).join('')}</div>
      <p class="muted small">공개된 숨은 특성: ${hidden}</p>
      <p class="muted small">이 커리어는 기기의 명예의 전당에 등록됐습니다.</p>
      <button class="btn primary big" data-act="new-career">새 커리어 시작</button></section>`;
  }

  function recordsTab() {
    const p = S.player, w = S.world;
    const rows = S.history.map(h => `<tr><td>${h.year}</td><td>${h.age}</td><td>${esc(h.planLabel)}</td><td>${h.wins}-${h.losses}</td><td>${h.pts}</td><td>${h.plan === 'junior' ? `J${h.juniorRank}` : (h.rank ?? '-')}</td><td>${h.titles.length}</td><td>${h.growth.after}</td></tr>`).join('');
    return `<section class="card"><h2 class="h2">시즌별 기록</h2><div class="table-wrap"><table class="table"><thead><tr><th>연도</th><th>나이</th><th>일정</th><th>승패</th><th>포인트</th><th>랭킹</th><th>우승</th><th>OVR</th></tr></thead><tbody>${rows || '<tr><td colspan="8" class="muted">아직 기록이 없습니다.</td></tr>'}</tbody></table></div></section>
    <section class="card"><h2 class="h2">우승과 수상</h2>${p.titles.length ? `<ul class="plain">${p.titles.slice().reverse().map(t => `<li>${t.year} · ${esc(t.name)} <span class="chip">${E.TIERS[t.tier]?.short ?? t.tier}</span></li>`).join('')}</ul>` : '<p class="muted">아직 우승이 없습니다.</p>'}${p.awards.length ? `<ul class="plain">${p.awards.slice().reverse().map(a => `<li>🏆 ${a.year} · ${esc(a.name)}</li>`).join('')}</ul>` : ''}${p.records.length ? `<ul class="plain">${p.records.map(r => `<li>${esc(r.label)} ${r.value}${esc(r.unit)} (${r.year})</li>`).join('')}</ul>` : ''}</section>
    <section class="card"><h2 class="h2">이 시대의 투어</h2><p class="small">연말 1위: ${w.no1History.slice(-6).map(n => `${n.year} ${n.me ? '<strong>나</strong>' : esc(n.name)}`).join(' · ') || '아직 없음'}</p><p class="small">현재 톱5: ${w.npcs.slice(0, 5).map(n => `${esc(n.name)}(${E.COUNTRY_MAP[n.nat]?.name ?? ''}, ${n.age}세)`).join(', ')}</p>${p.rival ? `<p class="small">라이벌: ${esc(p.rival.name)}</p>` : ''}<details><summary>최근 그랜드슬램 챔피언</summary><ul class="plain">${w.gsWinners.slice(-12).reverse().map(g => `<li>${g.year} ${esc(g.name)} · ${g.me ? '<strong>나</strong>' : esc(g.winner)}</li>`).join('')}</ul></details></section>`;
  }

  function shopTab() {
    const p = S.player;
    const item = id => E.SHOP_MAP[id];
    return `<section class="card"><h2 class="h2">상점</h2><p class="muted">잔고 ${money(p.balance)} · 시즌마다 새 상품 3개 · 한 시즌에 하나만 살 수 있습니다.${p.shop.bought ? ' 이번 시즌 구매를 마쳤습니다.' : ''}</p>
      <div class="shop">${p.shop.stock.map(id => { const it = item(id); const can = !p.shop.bought && p.balance >= it.price; return `<div class="shop-item"><div><strong>${esc(it.name)}</strong><div class="small muted">${it.aging ? `노화 속도 −${Math.round(it.aging * 100)}%` : `${E.ATTR_LABELS[it.stat]} +${it.value}`}</div></div><div class="shop-buy"><span class="price">${money(it.price)}</span><button class="btn ${can ? 'primary' : ''}" data-buy="${it.id}" ${can ? '' : 'disabled'}>${p.balance < it.price ? '자금 부족' : '구매'}</button></div></div>`; }).join('')}</div>
      ${p.shop.owned.length ? `<h3 class="h3">보유 아이템</h3><div class="chip-row wrap">${p.shop.owned.map(id => `<span class="chip">${esc(item(id)?.name ?? id)}</span>`).join('')}</div>` : ''}</section>`;
  }

  function hofTab() {
    const hof = store.get(HOF_KEY) ?? [];
    return `<section class="card"><h2 class="h2">명예의 전당</h2><p class="muted small">이 기기에서 은퇴한 선수들입니다. 그랜드슬램 → 연말 1위 → 최고 랭킹 → 통산 우승 순으로 비교합니다.</p>
      ${hof.length ? `<ol class="hof">${hof.map(h => `<li><div class="hof-head"><strong>${esc(h.name)}</strong><span class="muted small">${E.COUNTRY_MAP[h.nationality]?.name ?? ''} · ${styleLabel(h.style)} · ${esc(h.title)}</span></div><div class="small">GS ${h.gs} · 1위 ${h.no1}년 · 최고 ${h.peakRank >= 2500 ? '-' : h.peakRank + '위'} · 우승 ${h.titles} · ${h.wins}승 · ${h.retireAge}세 은퇴</div></li>`).join('')}</ol>` : '<p class="muted">아직 은퇴한 선수가 없습니다.</p>'}</section>`;
  }

  function settingsTab() {
    return `<section class="card"><h2 class="h2">설정</h2>
      <p class="muted small">진행 상황은 이 브라우저에 자동 저장됩니다. 기기를 바꾸거나 데이터를 지우면 사라지니 내보내기로 백업하세요.</p>
      <div class="row"><button class="btn" data-act="export">저장 파일 내보내기</button><button class="btn" data-act="copy-export" ${ui.exportOpen ? '' : 'hidden'}>복사</button></div>
      ${ui.exportOpen ? `<textarea id="export-area" class="textarea" readonly>${esc(JSON.stringify(S))}</textarea>` : ''}
      <h3 class="h3">저장 파일 가져오기</h3><textarea id="import-area" class="textarea" placeholder="내보낸 저장 파일 내용을 붙여넣으세요">${esc(ui.importText)}</textarea><div class="row"><button class="btn" data-act="import">가져오기</button>${ui.importMsg ? `<span class="small">${esc(ui.importMsg)}</span>` : ''}</div>
      <h3 class="h3">새 커리어</h3>${ui.confirmNew ? `<div class="inline-confirm"><span>지금 커리어는 사라집니다. 계속할까요?</span><button class="btn danger" data-act="new-career">새로 시작</button><button class="btn" data-act="cancel-new">취소</button></div>` : '<button class="btn ghost" data-act="ask-new">현재 커리어를 버리고 새로 시작</button>'}
      <p class="muted small">퓨처스에서 그랜드슬램까지 · 테니스 커리어 시뮬레이션. 모든 선수·코치·브랜드 이름은 가상입니다.</p></section>`;
  }

  // ── 선수 생성
  function createScreen() {
    const c = create;
    if (c.step === 'candidates') return candidatesScreen();
    const last = store.get(LAST_KEY);
    return `<header class="appbar"><div class="appbar-inner"><div class="brand">퓨처스에서 그랜드슬램까지</div></div></header><main class="main">
      <section class="card hero"><div class="eyebrow">테니스 커리어 시뮬레이션</div><h1 class="hero-title">15세, 첫 라켓을 잡는다</h1><p>주니어 대회에서 퓨처스, 챌린저, 투어를 거쳐 그랜드슬램과 연말 세계 1위까지. 능력치와 선택, 그리고 운이 커리어를 만듭니다.</p></section>
      <form class="card" id="create-form">
        ${c.error ? `<p class="notice warn">${esc(c.error)}</p>` : ''}
        <label class="field"><span>선수 이름 <small class="muted">실명 대신 닉네임을 권합니다</small></span><input id="f-name" type="text" maxlength="20" value="${esc(c.name)}" placeholder="예: 코트의 늑대"></label>
        <div class="field"><span>투어</span><div class="seg">${[['m', '남자 투어'], ['f', '여자 투어']].map(([v, l]) => `<label class="seg-item"><input type="radio" name="gender" value="${v}" ${c.gender === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></div>
        <label class="field"><span>국적</span><select id="f-nat">${E.COUNTRIES.map(n => `<option value="${n.id}" ${c.nationality === n.id ? 'selected' : ''}>${n.name}</option>`).join('')}</select></label>
        <div class="field"><span>시작 경로</span><div class="choice-grid">${Object.entries(E.START_PATHS).map(([id, p]) => `<label class="choice"><input type="radio" name="path" value="${id}" ${c.path === id ? 'checked' : ''}><div><strong>${p.label}</strong><div class="small muted">${p.desc}</div><div class="small">훈련 효율 ×${p.coachMult} · 연 ${money(p.cost)}</div></div></label>`).join('')}</div></div>
        <div class="field"><span>플레이 스타일</span><div class="choice-grid">${Object.entries(E.STYLES).map(([id, s]) => `<label class="choice"><input type="radio" name="style" value="${id}" ${c.style === id ? 'checked' : ''}><div><strong>${s.label}</strong><div class="small muted">${s.desc}</div><div class="small">핵심: ${E.ATTRS.slice().sort((a, b) => s.w[b] - s.w[a]).slice(0, 2).map(a => E.ATTR_LABELS[a]).join(', ')}</div></div></label>`).join('')}</div></div>
        <div class="field"><span>집중 훈련 <small class="muted">최대 2개. 나중에 코치 제안으로만 바뀝니다.</small></span><div class="seg wrap">${E.ATTRS.map(a => `<label class="seg-item"><input type="checkbox" name="focus" value="${a}" ${c.focus.includes(a) ? 'checked' : ''}><span>${E.ATTR_LABELS[a]}</span></label>`).join('')}</div></div>
        <div class="row"><button class="btn primary big" type="submit">후보 선수 보기</button>${last ? '<button class="btn ghost" type="button" data-act="load-last">지난 설정 불러오기</button>' : ''}</div>
      </form>
      ${(store.get(HOF_KEY) ?? []).length ? `<section class="card"><h2 class="h2">명예의 전당</h2><ol class="hof">${(store.get(HOF_KEY) ?? []).slice(0, 5).map(h => `<li><strong>${esc(h.name)}</strong> <span class="muted small">${esc(h.title)} · GS ${h.gs} · 1위 ${h.no1}년</span></li>`).join('')}</ol></section>` : ''}
      </main>`;
  }
  function candidatesScreen() {
    const c = create;
    return `<header class="appbar"><div class="appbar-inner"><div class="brand">퓨처스에서 그랜드슬램까지</div></div></header><main class="main">
      <section class="card"><div class="eyebrow">후보 선수</div><h2 class="h2">${esc(c.name)} · ${styleLabel(c.style)}</h2><p class="muted">세 후보 모두 오버롤 45입니다. 차이는 능력치 분포뿐이고, 잠재력과 성장 곡선은 숨겨져 있습니다.</p>
      <div class="cands">${c.candidates.map((cd, i) => `<div class="cand"><div class="cand-head"><strong>${cd.label}</strong><span class="chip">OVR ${E.overall({ style: c.style, attributes: cd.attributes })}</span></div>${radar(cd.attributes, 160)}${bars(cd.attributes)}<button class="btn primary" data-cand="${i}">이 선수로 시작</button></div>`).join('')}</div>
      <div class="row"><button class="btn ghost" data-act="recand">다른 후보 보기</button><button class="btn ghost" data-act="back-form">설정으로 돌아가기</button></div></section></main>`;
  }

  // ── 이벤트 바인딩
  function bind() {
    root.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; ui.exportOpen = false; render(); });
    root.querySelectorAll('[data-entry]').forEach(b => b.onclick = () => { ui.openEntry = ui.openEntry === b.dataset.entry ? null : b.dataset.entry; render(); });
    root.querySelectorAll('[data-option]').forEach(b => b.onclick = () => act({ type: 'resolveEvent', option: b.dataset.option }));
    root.querySelectorAll('[data-offer]').forEach(b => b.onclick = () => act({ type: 'acceptOffer', offer: b.dataset.offer }));
    root.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => act({ type: 'buy', item: b.dataset.buy }));
    root.querySelectorAll('[data-cand]').forEach(b => b.onclick = () => startCareer(Number(b.dataset.cand)));
    root.querySelectorAll('[data-act]').forEach(b => b.onclick = (ev) => { ev.preventDefault(); action(b.dataset.act); });
    const form = $('#create-form'); if (form) form.onsubmit = (ev) => { ev.preventDefault(); readForm(); if (!create.name.trim()) { create.error = '선수 이름을 입력하세요.'; render(); return; } if (!create.focus.length) { create.error = '집중 훈련 종목을 하나 이상 고르세요.'; render(); return; } create.error = ''; makeCands(); };
  }
  function readForm() {
    const c = create;
    c.name = $('#f-name')?.value ?? c.name; c.nationality = $('#f-nat')?.value ?? c.nationality;
    c.gender = root.querySelector('input[name=gender]:checked')?.value ?? c.gender;
    c.path = root.querySelector('input[name=path]:checked')?.value ?? c.path;
    c.style = root.querySelector('input[name=style]:checked')?.value ?? c.style;
    c.focus = [...root.querySelectorAll('input[name=focus]:checked')].map(i => i.value).slice(0, 2);
  }
  function makeCands() { create.seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0; create.candidates = E.makeCandidates({ seed: create.seed, style: create.style, gender: create.gender }); create.step = 'candidates'; render(); }
  function startCareer(i) {
    const c = create, cand = c.candidates[i];
    store.set(LAST_KEY, { name: c.name, gender: c.gender, nationality: c.nationality, path: c.path, style: c.style, focus: c.focus });
    S = E.newCareer({ name: c.name, gender: c.gender, nationality: c.nationality, path: c.path, style: c.style, focus: c.focus, candidate: cand, seed: (c.seed + 7) >>> 0, startYear: 2026 });
    tab = 'home'; save(); render();
  }
  function action(id) {
    switch (id) {
      case 'play': { const plan = root.querySelector('input[name=plan]:checked')?.value; act({ type: 'playSeason', plan }); window.scrollTo({ top: 0 }); break; }
      case 'continue': act({ type: 'continue' }); window.scrollTo({ top: 0 }); break;
      case 'decline-offers': act({ type: 'declineOffers' }); break;
      case 'advice-continue': act({ type: 'advice', retire: false }); break;
      case 'advice-retire': act({ type: 'advice', retire: true }); break;
      case 'ask-retire': ui.confirmRetire = true; render(); break;
      case 'cancel-retire': ui.confirmRetire = false; render(); break;
      case 'retire': ui.confirmRetire = false; act({ type: 'retire' }); break;
      case 'ask-new': ui.confirmNew = true; render(); break;
      case 'cancel-new': ui.confirmNew = false; render(); break;
      case 'new-career': { ui.confirmNew = false; S = null; store.del(SAVE_KEY); create.step = 'form'; create.candidates = null; tab = 'home'; render(); break; }
      case 'export': ui.exportOpen = !ui.exportOpen; render(); break;
      case 'copy-export': { const ta = $('#export-area'); if (!ta) break; const text = ta.value; (navigator.clipboard?.writeText(text) ?? Promise.reject()).then(() => { ui.importMsg = '복사했습니다.'; render(); }).catch(() => { ta.focus(); ta.select(); ui.importMsg = '자동 복사가 막혀 있어 텍스트를 선택했습니다. 직접 복사하세요.'; render(); }); break; }
      case 'import': { const ta = $('#import-area'); ui.importText = ta?.value ?? ''; try { const parsed = JSON.parse(ui.importText); if (!E.validState(parsed)) throw new Error('형식이 맞지 않습니다.'); S = parsed; ui.importMsg = '가져왔습니다.'; ui.importText = ''; tab = 'home'; save(); } catch (e) { ui.importMsg = `가져오기 실패: ${e.message}`; } render(); break; }
      case 'load-last': { const last = store.get(LAST_KEY); if (last) Object.assign(create, last); render(); break; }
      case 'recand': makeCands(); break;
      case 'back-form': create.step = 'form'; render(); break;
    }
  }
  render();
}
