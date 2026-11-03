// 밸런스 점검용 헤드리스 시뮬레이터: node tennis/sim.mjs [careers] [seed]
import * as E from './engine.js';

const N = Number(process.argv[2] ?? 200), SEED = Number(process.argv[3] ?? 12345);
const styles = Object.keys(E.STYLES), paths = Object.keys(E.START_PATHS);
const rows = [];
const ovrByAge = {};
for (let i = 0; i < N; i++) {
  const seed = SEED + i * 7919;
  const style = styles[i % styles.length], path = paths[i % paths.length];
  const gender = i % 2 ? 'f' : 'm';
  const cands = E.makeCandidates({ seed, style, gender });
  const cand = cands[i % 3];
  const st = E.newCareer({ name: `T${i}`, gender, nationality: E.START_PATHS[path].country, path, style, focus: ['serve', 'forehand'], candidate: cand, seed: seed + 1, startYear: 2026 });
  let guard = 0;
  while (st.stage !== 'retired' && guard++ < 400) {
    if (st.stage === 'ready') {
      const plans = E.availablePlans(st).map(id => E.planSummary(st, id));
      const ok = plans.filter(p => !['무리', '버거움'].includes(p.difficulty));
      const choice = (ok.length ? ok : plans)[Math.max(0, (ok.length ? ok : plans).length - 1)];
      E.applyAction(st, { type: 'playSeason', plan: choice.id });
      const a = st.player.age - 1; (ovrByAge[a] ??= []).push(E.overall(st.player));
      if (st.player.age >= 24 && st.player.pro && (st.player.rank ?? 9999) > 1200 && st.player.age >= 27) { E.applyAction(st, { type: 'continue' }); while (st.stage !== 'ready' && st.stage !== 'retired') stepMisc(st); if (st.stage === 'ready') E.applyAction(st, { type: 'retire' }); }
    } else stepMisc(st);
  }
  const s = st.summary ?? E.careerSummary(st);
  const traceArg = process.argv.find(a => a.startsWith('--trace='));
  if (traceArg && s.potentialGrade === traceArg.split('=')[1] && !globalThis.__traced) {
    globalThis.__traced = true;
    console.log(`TRACE ${style}/${path} pot=${s.potential} curve=${st.player.hidden.curve} dur=${st.player.hidden.durability}`);
    for (const h of st.history) console.log(`${h.year} age${h.age} ${h.planLabel.padEnd(10)} ovr ${h.growth.before}->${h.growth.after} part=${h.growth.participation} perf=${h.growth.performance} W-L ${h.wins}-${h.losses} pts=${h.pts} rank=${h.rank ?? '-'} titles=${h.titles.length} prize=${h.prize} ${h.injuries.join(',')} ${h.notes.join(' | ').slice(0, 80)}`);
  }
  rows.push({ style, path, pot: s.potential, grade: s.potentialGrade, curve: st.player.hidden.curve, peakRank: s.peakRank ?? 9999, gs: s.gs, no1: s.no1, titles: s.titles, retireAge: s.retireAge, earnings: Math.round(s.earnings), wins: s.wins, losses: s.losses, acl: st.player.acl, peakOvr: Math.max(...st.history.map(h => h.growth?.after ?? 0)) });
}
function stepMisc(st) {
  if (st.stage === 'result') E.applyAction(st, { type: 'continue' });
  else if (st.stage === 'event') E.applyAction(st, { type: 'resolveEvent', option: st.event.options[0].id });
  else if (st.stage === 'offers') { const o = st.offers.find(x => x.kind === 'coach' && (st.player.balance >= x.fee * .5 || st.player.coach.academy)) ?? st.offers[0]; const before = st.offers.length; E.applyAction(st, { type: 'acceptOffer', offer: o.id }); if (st.stage === 'offers' && st.offers.length === before) E.applyAction(st, { type: 'declineOffers' }); }
  else if (st.stage === 'advice') E.applyAction(st, { type: 'advice', retire: st.advice?.forced || (st.player.age >= 33) });
  else if (st.stage === 'ready') { /* handled by caller */ }
}
const pct = (arr, q) => { const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };
const avg = arr => arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
console.log(`careers=${rows.length}`);
console.log('peakRank p10/p50/p90:', pct(rows.map(r => r.peakRank), .1), pct(rows.map(r => r.peakRank), .5), pct(rows.map(r => r.peakRank), .9));
console.log('share top100:', avg(rows.map(r => r.peakRank <= 100 ? 1 : 0)).toFixed(2), 'top10:', avg(rows.map(r => r.peakRank <= 10 ? 1 : 0)).toFixed(2), 'no1:', avg(rows.map(r => r.no1 > 0 ? 1 : 0)).toFixed(2), 'gs:', avg(rows.map(r => r.gs > 0 ? 1 : 0)).toFixed(2));
console.log('gs titles max/avg:', Math.max(...rows.map(r => r.gs)), avg(rows.map(r => r.gs)).toFixed(2), ' no1 years max:', Math.max(...rows.map(r => r.no1)));
console.log('retireAge p10/p50/p90:', pct(rows.map(r => r.retireAge), .1), pct(rows.map(r => r.retireAge), .5), pct(rows.map(r => r.retireAge), .9));
console.log('earnings p50/p90 ($):', pct(rows.map(r => r.earnings), .5).toLocaleString(), pct(rows.map(r => r.earnings), .9).toLocaleString());
console.log('ACL rate:', avg(rows.map(r => r.acl > 0 ? 1 : 0)).toFixed(2), ' winrate avg:', avg(rows.map(r => r.wins / Math.max(1, r.wins + r.losses))).toFixed(2));
console.log('ovr by age (avg):', Object.entries(ovrByAge).map(([a, v]) => `${a}:${avg(v).toFixed(1)}`).join(' '));
const byGrade = {};
for (const r of rows) (byGrade[r.grade] ??= []).push(r);
for (const [g, v] of Object.entries(byGrade)) console.log(`grade ${g}: n=${v.length} peakOvr=${avg(v.map(r => r.peakOvr)).toFixed(1)} pot=${avg(v.map(r => r.pot)).toFixed(1)} peakRank(p50)=${pct(v.map(r => r.peakRank), .5)} gs=${avg(v.map(r => r.gs)).toFixed(2)} no1=${avg(v.map(r => r.no1)).toFixed(2)}`);
const byCurve = {};
for (const r of rows) (byCurve[r.curve] ??= []).push(r);
for (const [g, v] of Object.entries(byCurve)) console.log(`curve ${g}: n=${v.length} peakOvr=${avg(v.map(r => r.peakOvr)).toFixed(1)} pot=${avg(v.map(r => r.pot)).toFixed(1)}`);
if (process.argv.includes('--dump')) console.log(rows.slice(0, 12));
