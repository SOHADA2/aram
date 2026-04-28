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

// Fix dup-guard #1: add s1LpBefore: {}
const old1 = 'postSaveMatchData = {\r\n        winners, losers, itemEffects, tierChanges: [],\r\n        questEvent: questEventState ? { ...questEventState } : null,\r\n        spectatorResult: (currentSpectator && spectatorPick)\r\n          ? { name: currentSpectator.name, correct: spectatorPick === selectedWinner }\r\n          : null,\r\n      };';
const new1 = 'postSaveMatchData = {\r\n        winners, losers, itemEffects, tierChanges: [], s1LpBefore: {},\r\n        questEvent: questEventState ? { ...questEventState } : null,\r\n        spectatorResult: (currentSpectator && spectatorPick)\r\n          ? { name: currentSpectator.name, correct: spectatorPick === selectedWinner }\r\n          : null,\r\n      };';
rep(old1, new1, 'dup-guard #1: add s1LpBefore: {}');

// Fix dup-guard #2: add s1LpBefore: {}
const old2 = 'postSaveMatchData = {\r\n          winners, losers, itemEffects, tierChanges: [],\r\n          questEvent: questEventState ? { ...questEventState } : null,\r\n          spectatorResult: (currentSpectator && spectatorPick)\r\n            ? { name: currentSpectator.name, correct: spectatorPick === selectedWinner }\r\n            : null,\r\n        };';
const new2 = 'postSaveMatchData = {\r\n          winners, losers, itemEffects, tierChanges: [], s1LpBefore: {},\r\n          questEvent: questEventState ? { ...questEventState } : null,\r\n          spectatorResult: (currentSpectator && spectatorPick)\r\n            ? { name: currentSpectator.name, correct: spectatorPick === selectedWinner }\r\n            : null,\r\n        };';
rep(old2, new2, 'dup-guard #2: add s1LpBefore: {}');

// Also verify the LP override block is present
const lpIdx = html.indexOf('S1: pt');
console.log('LP override block at:', lpIdx);

// Verify renderSessionPlayers IIFE
const iife = html.indexOf('CURRENT_SEASON>=1');
console.log('S1 IIFE at:', iife);

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('\nok:', ok, 'fail:', fail);
