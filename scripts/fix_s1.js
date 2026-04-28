const fs = require('fs');
let html = fs.readFileSync('C:/Users/so/aram/index.html', 'utf8');
let ok = 0, fail = 0;

const bt = String.fromCharCode(96); // backtick `

function rep(old, nw, label) {
  const cnt = html.split(old).length - 1;
  if (cnt !== 1) { console.error('FAIL(' + cnt + '):', label); fail++; return false; }
  html = html.replace(old, nw);
  console.log('OK:', label);
  ok++;
  return true;
}

// ─── 1. renderSessionPlayers: S1 tier badge ──────────────────────────────────
const oldBadge = '      <span class="tier-badge ${t.cls}">${t.label}</span>\r\n      ${s.total>0?' + bt + '<span class="player-stats">';

// New badge: IIFE that returns appropriate HTML for S0 or S1
// Using string concatenation to avoid template literal conflicts
// 배치 = 배치, 승급전 = 승급전
const s1BadgeIife =
  '${(()=>{ if(CURRENT_SEASON>=1){\n' +
  '    const _d=season1Data[normName(p.name)];\n' +
  '    if(!_d||!_d.placementDone){\n' +
  '      const _n=(_d?.placementGames)||0;\n' +
  '      return \'<span class="tier-badge s1t-unranked">\' + \'배치 \' + _n + \'/5</span>\';\n' +
  '    }\n' +
  '    if(_d.promoActive){\n' +
  '      const _m=S1_TIER_META[_d.tier]||S1_TIER_META.bronze;\n' +
  '      return \'<span class="tier-badge \'+_m.cls+\'">승급전</span>\';\n' +
  '    }\n' +
  '    const _m=S1_TIER_META[_d.tier]||S1_TIER_META.unranked;\n' +
  '    return \'<span class="tier-badge \'+_m.cls+\'">\'+_m.label+\' \'+((_d.lp)||0)+\'LP</span>\';\n' +
  '  }\n' +
  '  return \'<span class="tier-badge \'+t.cls+\'">\'+t.label+\'</span>\';\n' +
  '})()}';

// Convert newlines to CRLF for consistency and wrap in proper context
const newBadge =
  '      ' + s1BadgeIife.replace(/\n/g, '\r\n      ') + '\r\n' +
  '      ${s.total>0?' + bt + '<span class="player-stats">';

rep(oldBadge, newBadge, 'renderSessionPlayers S1 tier badge');

// ─── 2. saveMatch: s1LpBefore snapshot ───────────────────────────────────────
const commentLine = '    // 순서 중요: S1 아이템 효과(LP/승급전) 먼저 반영 후 아이템 소모.\r\n    // giveMatchGold의 fallback 필터(processPlayer)가 s1_* active 아이템을\r\n    // 소모·비활성화시켜 버려서, 먼저 처리해야 함 (v2.31.4 수정)\r\n    await s1ApplyAllMatchResults(winners, losers);';

// Find the comment directly
const applyIdx = html.indexOf('await s1ApplyAllMatchResults(winners, losers);');
console.log('s1Apply at:', applyIdx);
// Get 300 chars before it to find where to insert
const before300 = html.slice(applyIdx - 300, applyIdx);
console.log('before:', JSON.stringify(before300.slice(-100)));

// Insert LP snapshot code before the comment block
const snapshotCode =
  '    // S1 LP 스냅샷 — 결과 화면 LP 변동 표시용\r\n' +
  '    const s1LpBefore = {};\r\n' +
  '    if (CURRENT_SEASON >= 1) {\r\n' +
  '      allMatchPlayers.forEach(p => {\r\n' +
  '        const _k = normName(p.name);\r\n' +
  '        s1LpBefore[_k] = season1Data[_k] ? { ...season1Data[_k] } : s1DefaultPlayer();\r\n' +
  '      });\r\n' +
  '    }\r\n    ';

// Replace by finding the exact surrounding text
const applySearchStr = '    await s1ApplyAllMatchResults(winners, losers);';
// Find it in context
const commentBefore = '// giveMatchGold의 fallback 필터(processPlayer)가 s1_* active 아이템을\r\n    // 소모·비활성화시켜 버려서, 먼저 처리해야 함 (v2.31.4 수정)\r\n    await s1ApplyAllMatchResults(winners, losers);';
const commentBeforeNew = '// giveMatchGold의 fallback 필터(processPlayer)가 s1_* active 아이템을\r\n    // 소모·비활성화시켜 버려서, 먼저 처리해야 함 (v2.31.4 수정)\r\n    ' + snapshotCode.trim() + '\r\n    await s1ApplyAllMatchResults(winners, losers);';

rep(commentBefore, commentBeforeNew, 'saveMatch s1LpBefore snapshot');

// ─── 3. postSaveMatchData main: add s1LpBefore ───────────────────────────────
const oldPost = 'postSaveMatchData = {\r\n      winners, losers, itemEffects, tierChanges,\r\n      questEvent: questEventState ? { ...questEventState } : null,\r\n      spectatorResult,\r\n    };';
const newPost = 'postSaveMatchData = {\r\n      winners, losers, itemEffects, tierChanges, s1LpBefore,\r\n      questEvent: questEventState ? { ...questEventState } : null,\r\n      spectatorResult,\r\n    };';
rep(oldPost, newPost, 'postSaveMatchData main add s1LpBefore');

// ─── 4. showMatchSummary: add s1LpBefore to destructure ─────────────────────
rep(
  'function showMatchSummary({ winners, losers, itemEffects, tierChanges, questEvent, spectatorResult, mvpWinner, mvpLoser, mannerWinner, mannerLoser }) {',
  'function showMatchSummary({ winners, losers, itemEffects, tierChanges, s1LpBefore, questEvent, spectatorResult, mvpWinner, mvpLoser, mannerWinner, mannerLoser }) {',
  'showMatchSummary signature'
);

// ─── 5. showMatchSummary: add S1 item icons ──────────────────────────────────
rep(
  "const ITEM_ICONS = { score2x: '⚡', insurance: '🛡️', gamble: '🎲' };\r\n  const ITEM_NAMES = { score2x: '승점 2배', insurance: '패배 방어', gamble: '도박 주사위' };",
  "const ITEM_ICONS = { score2x: '⚡', insurance: '🛡️', gamble: '🎲', s1_gamble: '🎲', s1_promo_win: '⚔️', s1_promo_shield: '🛡️' };\r\n  const ITEM_NAMES = { score2x: '승점 2배', insurance: '패배 방어', gamble: '도박 주사위', s1_gamble: '도박권', s1_promo_win: '승급전 승리권', s1_promo_shield: '승급전 방어권' };",
  'showMatchSummary S1 items'
);

// ─── 6. showMatchSummary playerRow: S1 LP 표시 ───────────────────────────────
// Find the ptLabel final block
const oldPtFinal = '    const totalPtLoss = ptChange + questExtraPt;\r\n    if (isWin) ptLabel = `+${ptChange}pt`;\r\n    else if (totalPtLoss === 0) ptLabel = `±0pt`;\r\n    else ptLabel = `-${totalPtLoss}pt` + (questExtraPt > 0 ? ` (퀴스트 -${questExtraPt})` : \'\');\r\n\r\n    const ptClass = isWin ? \'plus\' : (totalPtLoss === 0 ? \'zero\' : \'minus\');';
console.log('ptFinal check:', html.indexOf(oldPtFinal));

// Try finding it without the 퀘스트 text to see what's there
const ptSearchShort = '    const totalPtLoss = ptChange + questExtraPt;';
const ptIdx = html.indexOf(ptSearchShort);
console.log('ptShort at:', ptIdx);
if (ptIdx >= 0) {
  const ptCtx = html.slice(ptIdx, ptIdx + 300);
  console.log('ptCtx:', JSON.stringify(ptCtx));
}

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('\nok:', ok, 'fail:', fail);
