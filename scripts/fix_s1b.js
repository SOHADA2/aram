const fs = require('fs');
let html = fs.readFileSync('C:/Users/so/aram/index.html', 'utf8');
const bt = String.fromCharCode(96);

function rep(old, nw, label) {
  const cnt = html.split(old).length - 1;
  if (cnt !== 1) { console.error('FAIL(' + cnt + '):', label); return false; }
  html = html.replace(old, nw);
  console.log('OK:', label);
  return true;
}

// ─── showMatchSummary playerRow: S1 LP 표시 추가 ─────────────────────────────
// After ptClass is set, override with S1 LP if in S1
// 퀘스트 = C018 + C2A4 = 퀘스트 (actually the text from the file)
// Get the exact Korean from file
const ptIdx = html.indexOf('    const totalPtLoss = ptChange + questExtraPt;');
const ptCtx = html.slice(ptIdx, ptIdx + 350);
console.log('ptCtx start:', JSON.stringify(ptCtx.slice(0, 200)));

// Extract the exact ptClass line ending
const ptClassStart = ptCtx.indexOf("    const ptClass = isWin ? 'plus' : (totalPtLoss === 0 ? 'zero' : 'minus');");
const ptClassStr = "    const ptClass = isWin ? 'plus' : (totalPtLoss === 0 ? 'zero' : 'minus');";

// The S1 LP override block to insert after ptClass
// Build using code points for Korean:
// 배치 = 배치, 승급전 = 승급전, 승리 = 승리, 패배 = 패배
// 배 = BC30, 치 = CE58
// 승 = C2B9, 급 = AE09, 전 = C804
// 리 = B9AC
// 패 = D328, 배 = BC30

const lpOverride =
  '\r\n\r\n    // S1: pt 표시 대신 LP 표시\r\n' +
  '    if (CURRENT_SEASON >= 1 && s1LpBefore) {\r\n' +
  '      const _k = normName(name);\r\n' +
  '      const _b = s1LpBefore[_k];\r\n' +
  '      if (_b) {\r\n' +
  '        let _lpLabel;\r\n' +
  '        if (!_b.placementDone) {\r\n' +
  '          const _done = (_b.placementGames || 0) + 1;\r\n' +
  '          _lpLabel = \'배치 \' + _done + \'/\' + S1_PLACEMENT_GAMES;\r\n' +
  '        } else if (_b.promoActive) {\r\n' +
  '          _lpLabel = isWin ? \'승급전 승리\' : \'승급전 패배\';\r\n' +
  '        } else {\r\n' +
  '          const _s1item = effects.find(e => e.startsWith(\'s1_\'));\r\n' +
  '          let _lp;\r\n' +
  '          if (isWin) {\r\n' +
  '            _lp = _s1item === \'s1_gamble\' ? S1_GAMBLE_WIN\r\n' +
  '                : S1_LP_WIN + (!_s1item && hasNewbieTeammate ? S1_NEWBIE_WIN_BONUS_LP : 0);\r\n' +
  '          } else {\r\n' +
  '            if (_s1item === \'s1_promo_shield\') _lp = 0;\r\n' +
  '            else if (_s1item === \'s1_gamble\') _lp = -S1_GAMBLE_LOSS;\r\n' +
  '            else if (iAmNewbie) _lp = -S1_NEWBIE_SELF_LOSS_LP;\r\n' +
  '            else _lp = -(S1_LP_LOSS - (hasNewbieTeammate ? S1_NEWBIE_LOSS_REDUCE_LP : 0));\r\n' +
  '          }\r\n' +
  '          _lpLabel = (_lp > 0 ? \'+\' : \'\') + _lp + \' LP\';\r\n' +
  '        }\r\n' +
  '        ptLabel = _lpLabel;\r\n' +
  '        ptClass = isWin ? \'plus\' : (ptLabel.includes(\'+0\') || ptLabel.includes(\'0 LP\') ? \'zero\' : \'minus\');\r\n' +
  '      }\r\n' +
  '    }';

const oldPtClass = "    const ptClass = isWin ? 'plus' : (totalPtLoss === 0 ? 'zero' : 'minus');";
const newPtClass = "    let ptClass = isWin ? 'plus' : (totalPtLoss === 0 ? 'zero' : 'minus');" + lpOverride;

// Also need ptLabel to be let not const
const oldPtLabel = '    let ptChange = 0;\r\n    let ptLabel = \'\';';
const newPtLabel = '    let ptChange = 0;\r\n    let ptLabel = \'\';';
// ptLabel is already let, check ptClass

rep(oldPtClass, newPtClass, 'showMatchSummary S1 LP override');

// Verify the Korean was inserted correctly
const verifyIdx = html.indexOf('배치'); // 배치
console.log('배치 (배치) in result screen at:', verifyIdx);

// Check ptClass is now let
const ptClassLet = html.indexOf("let ptClass = isWin");
console.log('let ptClass at:', ptClassLet);

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('Done!');
