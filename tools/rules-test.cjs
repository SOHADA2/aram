// 🔐 aramchaos 규칙 시험(2026-11-07) — node tools/rules-test.cjs
//  인증 없이 REST로(사이트·오버레이·브릿지와 같은 조건) · 진짜 데이터는 안 건드림:
//   허용 = 각 노드 아래 시험 칸(__rt)을 만들었다 지움 · 막힘 = 시험 전용 _rt 칸(같은 규칙 모양)에서만 「통째 지우기·덮어쓰기」
//  끝나면 시험 칸 정리(실패해도 남는 건 __rt·_rt 뿐 — 관리자 도구로 지우면 됨)
const DB = 'https://aramchaos-ca022-default-rtdb.asia-southeast1.firebasedatabase.app';
let pass = 0, fail = 0;
const req = async (m, p, v) => (await fetch(`${DB}/${p}.json`, { method: m, body: v === undefined ? undefined : JSON.stringify(v) })).status;
const ok = (c, msg) => { console.log(`${c ? '✅' : '❌'} ${msg}`); c ? pass++ : fail++; };
(async () => {
  console.log('── 허용(지금 프로그램들이 하는 쓰기)');
  for (const p of ['gold', 'players', 'matches', 'normal_matches', 'magolla_matches', 'mailbox', 'availability', 'accountSession', 'config', 'bridge', 'plaza', 'session', 'lastSettlement', 'plaza_props', 'season2_bingo', 'season2/players', 'season2/milestones', 'lobby', 'crumble/diag', 'crumble/profiles']) {
    const a = await req('PUT', `${p}/__rt`, { t: 1 }), b = await req('DELETE', `${p}/__rt`);
    ok(a === 200 && b === 200, `${p}/__rt 쓰기 ${a} · 지우기 ${b}`);
  }
  { // 여러 경로 한 번에(사이트 update(ref(db), updates)와 같은 방식)
    const a = await req('PATCH', '', { 'gold/__rt/x': 1, 'magolla_matches/__rt/y': 1, 'session/__rt': 1 });
    const b = await req('PATCH', '', { 'gold/__rt': null, 'magolla_matches/__rt': null, 'session/__rt': null });
    ok(a === 200 && b === 200, `루트 여러 경로 한 번에 쓰기 ${a} · 지우기 ${b}`);
  }
  { const a = await req('PUT', 'lobby', { names: ['__rt'], at: 1 }), b = await req('DELETE', 'lobby'); ok(a === 200 && b === 200, `대기실 배너 통째 쓰기 ${a} · 지우기 ${b}(원래 비어 있음)`); }
  console.log('── 막힘(시험 전용 _rt 칸 · 같은 규칙 모양)');
  await req('PUT', '_rt/col/a', 1); await req('PUT', '_rt/obj/a', 1); await req('PUT', '_rt/ses/sub/a', 1);
  ok(await req('PATCH', '', { __rt_root: 1 }) === 401, '모르는 최상위 칸 만들기 = 막힘');
  ok(await req('PUT', '_rt/col', { z: 1 }) === 401, '목록 통째 덮어쓰기(골드·선수 등과 같은 모양) = 막힘');
  ok(await req('DELETE', '_rt/col') === 401, '목록 통째 지우기 = 막힘');
  ok(await req('DELETE', '_rt/obj') === 401, '묶음 통째 지우기(세션·정산 등과 같은 모양) = 막힘');
  ok(await req('DELETE', '_rt/ses/sub') === 401, '시즌 하위 통째 지우기(season2/players 등과 같은 모양) = 막힘');
  ok(await req('PUT', 'runewar/__rt', 1) === 401, 'runewar 쓰기 = 막힘(읽기 전용)');
  ok(await req('PUT', 'today/__rt', 1) === 401, '옛 today 쓰기 = 막힘(읽기 전용)');
  ok(await req('PUT', '_rt/col/a', 2) === 200 && await req('DELETE', '_rt/col/a') === 200, '목록 한 칸 쓰기·지우기 = 허용');
  console.log(`\n통과 ${pass} · 실패 ${fail}  (_rt 칸은 규칙상 통째로 못 지움 → 관리자 도구로 정리)`);
})();
