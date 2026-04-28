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

// 1. Add global _s1LpSnapshot variable near other saveMatch globals
rep(
  'let _saveInProgress = false; // saveMatch 진행 중 동기 잠금 (중복 저장 방지)',
  'let _saveInProgress = false; // saveMatch 진행 중 동기 잠금 (중복 저장 방지)\r\nlet _s1LpSnapshot = null; // showMatchSummary용 S1 LP 스냅샷 (pre-match)',
  'add _s1LpSnapshot global'
);

// 2. In saveMatch, store snapshot globally right after building it
// Current code: "}\r\n    await s1ApplyAllMatchResults(winners, losers);"
// after the forEach that fills s1LpBefore
rep(
  '      });\r\n    }\r\n    await s1ApplyAllMatchResults(winners, losers);',
  '      });\r\n      _s1LpSnapshot = s1LpBefore; // 글로벌 저장\r\n    }\r\n    await s1ApplyAllMatchResults(winners, losers);',
  'saveMatch: store snapshot globally'
);

// 3. Update showMatchSummary playerRow to use _s1LpSnapshot as fallback
// Change: if (CURRENT_SEASON >= 1 && s1LpBefore) {
// To:     if (CURRENT_SEASON >= 1) {
//           const _snap = (s1LpBefore && Object.keys(s1LpBefore).length) ? s1LpBefore : _s1LpSnapshot;
//           if (_snap) {
//           ... and replace s1LpBefore[_k] with _snap[_k]
const oldLpOverride =
  '    // S1: pt 표시 대신 LP 표시\r\n' +
  '    if (CURRENT_SEASON >= 1 && s1LpBefore) {\r\n' +
  '      const _k = normName(name);\r\n' +
  '      const _b = s1LpBefore[_k];\r\n' +
  '      if (_b) {';

const newLpOverride =
  '    // S1: pt 표시 대신 LP 표시\r\n' +
  '    if (CURRENT_SEASON >= 1) {\r\n' +
  '      const _snap = (s1LpBefore && Object.keys(s1LpBefore).length > 0) ? s1LpBefore : _s1LpSnapshot;\r\n' +
  '      const _k = normName(name);\r\n' +
  '      const _b = _snap ? _snap[_k] : null;\r\n' +
  '      if (_b) {';

rep(oldLpOverride, newLpOverride, 'showMatchSummary: use _s1LpSnapshot fallback');

// 4. Bump version
rep("const APP_VERSION = 'v2.31.51';", "const APP_VERSION = 'v2.31.52';", 'version bump');

// Verify
console.log('\n--- Verification ---');
console.log('_s1LpSnapshot global:', html.indexOf('_s1LpSnapshot = null') > 0 ? 'OK' : 'MISSING');
console.log('_s1LpSnapshot saved in saveMatch:', html.indexOf('_s1LpSnapshot = s1LpBefore') > 0 ? 'OK' : 'MISSING');
console.log('_s1LpSnapshot used in playerRow:', html.indexOf('_s1LpSnapshot') > 0 ? 'OK' : 'MISSING');

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('\nok:', ok, 'fail:', fail);
