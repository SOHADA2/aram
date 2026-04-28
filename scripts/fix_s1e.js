const fs = require('fs');
let html = fs.readFileSync('C:/Users/so/aram/index.html', 'utf8');
let ok = 0, fail = 0;

function rep(old, nw, label) {
  const cnt = html.split(old).length - 1;
  if (cnt !== 1) { console.error('FAIL(' + cnt + '):', label); fail++; return false; }
  html = html.replace(old, nw);
  console.log('OK:', label);
  ok++;
  return true;
}

// Fix s1ApplyAllMatchResults:
// 1. Add async keyword
// 2. winners/losers are name strings, not objects — remove .name accesses
const oldFn =
  'function s1ApplyAllMatchResults(winners, losers) {\r\n' +
  '  if (CURRENT_SEASON < 1) return;\r\n' +
  '  const itemsKey = sField(\'items\');\r\n' +
  '  for (const p of [...winners, ...losers]) {\r\n' +
  '    const isWin = winners.some(w => normName(w.name) === normName(p.name));\r\n' +
  '    const myTeam = isWin ? winners : losers;\r\n' +
  '    // 뉴비 판정 (본인 제외 팀원 중 뉴비 여부 + 본인 뉴비 여부)\r\n' +
  '    const iAmNewbie = isNewbie(p.name);\r\n' +
  '    const hasNewbieTeammate = myTeam.some(t =>\r\n' +
  '      normName(t.name) !== normName(p.name) && isNewbie(t.name));\r\n' +
  '    // 활성화된 S1 아이템 확인\r\n' +
  '    const entry = Object.entries(goldData).find(([,g]) => normName(g.name) === normName(p.name));\r\n' +
  '    let activeS1Item = null;\r\n' +
  '    if (entry) {\r\n' +
  '      const items = entry[1][itemsKey] || [];\r\n' +
  '      const active = items.find(it => it.active && it.id.startsWith(\'s1_\'));\r\n' +
  '      if (active) activeS1Item = active.id;\r\n' +
  '    }\r\n' +
  '    await s1ApplyMatchResult(p.name, isWin, activeS1Item, hasNewbieTeammate, iAmNewbie);\r\n' +
  '  }\r\n' +
  '}';

const newFn =
  'async function s1ApplyAllMatchResults(winners, losers) {\r\n' +
  '  if (CURRENT_SEASON < 1) return;\r\n' +
  '  const itemsKey = sField(\'items\');\r\n' +
  '  for (const p of [...winners, ...losers]) {\r\n' +
  '    const isWin = winners.some(w => normName(w) === normName(p));\r\n' +
  '    const myTeam = isWin ? winners : losers;\r\n' +
  '    // 뉴비 판정 (본인 제외 팀원 중 뉴비 여부 + 본인 뉴비 여부)\r\n' +
  '    const iAmNewbie = isNewbie(p);\r\n' +
  '    const hasNewbieTeammate = myTeam.some(t =>\r\n' +
  '      normName(t) !== normName(p) && isNewbie(t));\r\n' +
  '    // 활성화된 S1 아이템 확인\r\n' +
  '    const entry = Object.entries(goldData).find(([,g]) => normName(g.name) === normName(p));\r\n' +
  '    let activeS1Item = null;\r\n' +
  '    if (entry) {\r\n' +
  '      const items = entry[1][itemsKey] || [];\r\n' +
  '      const active = items.find(it => it.active && it.id.startsWith(\'s1_\'));\r\n' +
  '      if (active) activeS1Item = active.id;\r\n' +
  '    }\r\n' +
  '    await s1ApplyMatchResult(p, isWin, activeS1Item, hasNewbieTeammate, iAmNewbie);\r\n' +
  '  }\r\n' +
  '}';

rep(oldFn, newFn, 's1ApplyAllMatchResults: async + string names fix');

// Also clean up any "undefined" key that may have been written to season1/players
// (The retroactive fix script will handle Firebase cleanup)

// Bump version
rep("const APP_VERSION = 'v2.31.52';", "const APP_VERSION = 'v2.31.53';", 'version bump');

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('\nok:', ok, 'fail:', fail);
