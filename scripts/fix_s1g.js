const fs = require('fs');
let html = fs.readFileSync('C:/Users/so/aram/index.html', 'utf8');

// Insert preview helper just before </script>
const previewFn =
  '\r\n// ── 정산창 미리보기 (콘솔용) ─────────────────────────────────\r\n' +
  'window.previewMatch = function(opts = {}) {\r\n' +
  '  const allNames = Object.values(registeredPlayers).map(p => p.name);\r\n' +
  '  const half = Math.ceil(allNames.length / 2);\r\n' +
  '  const w = opts.winners || allNames.slice(0, half);\r\n' +
  '  const l = opts.losers  || allNames.slice(half);\r\n' +
  '  // before 스냅샷: 현재 season1Data 기반, LP를 승리 1회분 전으로\r\n' +
  '  const before = {};\r\n' +
  '  [...w, ...l].forEach(name => {\r\n' +
  '    const k = normName(name);\r\n' +
  '    const d = season1Data[k] ? { ...season1Data[k] } : s1DefaultPlayer();\r\n' +
  '    if (d.placementDone && !d.promoActive) {\r\n' +
  '      d.lp = Math.max(0, (d.lp || 0) - S1_LP_WIN);\r\n' +
  '    }\r\n' +
  '    before[k] = d;\r\n' +
  '  });\r\n' +
  '  showMatchSummary({\r\n' +
  '    winners: w, losers: l,\r\n' +
  '    itemEffects: opts.itemEffects || {},\r\n' +
  '    tierChanges: [],\r\n' +
  '    s1LpBefore: before,\r\n' +
  '    questEvent: null, spectatorResult: null,\r\n' +
  '    mvpWinner: opts.mvpWinner || w[0] || null,\r\n' +
  '    mvpLoser:  opts.mvpLoser  || l[0] || null,\r\n' +
  '    mannerWinner: opts.mannerWinner || null,\r\n' +
  '    mannerLoser:  opts.mannerLoser  || null,\r\n' +
  '  });\r\n' +
  '};\r\n';

const old = '\r\n</script>';
const cnt = html.split(old).length - 1;
console.log('</script> count:', cnt);

// Replace last </script>
const lastIdx = html.lastIndexOf('\r\n</script>');
html = html.slice(0, lastIdx) + previewFn + '\r\n</script>' + html.slice(lastIdx + '\r\n</script>'.length);
console.log('Injected previewMatch function');

// Version bump
html = html.replace("const APP_VERSION = 'v2.31.54';", "const APP_VERSION = 'v2.31.55';");
console.log('Version bumped to v2.31.55');

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('Done');
