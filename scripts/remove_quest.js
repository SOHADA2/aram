// 매칭 퀘스트(1등/2등/3등 발동) 완전 제거
// 기존 Firebase questEvent 매치의 골드/LP 소급 계산은 유지
const fs = require('fs');
let html = fs.readFileSync('C:/Users/so/aram/index.html', 'utf8');
let ok = 0, fail = 0;

function rep(old, nw, label) {
  const cnt = html.split(old).length - 1;
  if (cnt !== 1) { console.error('FAIL(' + cnt + '):', label); fail++; return false; }
  html = html.split(old).join(nw);
  console.log('OK:', label);
  ok++;
  return true;
}

// ── 1. CSS: 퀘스트 오버레이/모달/배너 (886~908줄) ─────────────────────────
rep(
  '.quest-overlay{position:fixed;inset:0;z-index:1100;background:rgba(4,11,21,0.93);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.25s ease;}\n' +
  '.quest-modal{background:var(--surface);border:1px solid rgba(255,200,50,0.35);border-radius:16px;width:100%;max-width:360px;padding:26px 22px 22px;animation:popIn 0.35s cubic-bezier(0.175,0.885,0.32,1.275);text-align:center;box-shadow:0 0 40px rgba(255,200,50,0.12);}\n' +
  '.quest-alert-label{font-size:10px;color:rgba(255,200,50,0.65);letter-spacing:3px;font-weight:700;margin-bottom:10px;text-transform:uppercase;}\n' +
  '.quest-name{font-family:\'Black Han Sans\',sans-serif;font-size:24px;letter-spacing:1px;color:var(--gold);margin-bottom:6px;}\n' +
  '.quest-player-line{font-size:12px;color:var(--text-dim);margin-bottom:18px;line-height:1.6;}\n' +
  '.quest-rule-box{background:rgba(255,200,50,0.05);border:1px solid rgba(255,200,50,0.18);border-radius:10px;padding:13px 15px;text-align:left;font-size:11px;line-height:2.1;margin-bottom:18px;}\n' +
  '.quest-rule-win{color:var(--green);font-weight:700;}\n' +
  '.quest-rule-lose{color:var(--red);font-weight:700;}\n' +
  '.quest-penalty-note{color:rgba(220,100,100,0.8);font-size:10px;padding-left:4px;line-height:1.7;margin-top:3px;opacity:0.9;}\n' +
  '.quest-active-banner{display:flex;align-items:center;gap:12px;padding:10px 14px;background:rgba(255,200,50,0.07);border:1px solid rgba(255,200,50,0.25);border-radius:8px;margin-top:10px;animation:fadeIn 0.3s ease;}\n' +
  '.quest-active-icon{font-size:20px;flex-shrink:0;}\n' +
  '.quest-active-title{font-size:12px;font-weight:700;color:var(--gold);margin-bottom:2px;}\n' +
  '.quest-active-sub{font-size:10px;color:var(--text-dim);line-height:1.6;}\n' +
  '.quest-result-overlay{position:fixed;inset:0;z-index:1100;background:rgba(4,11,21,0.92);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.25s ease;}\n' +
  '.quest-result-modal{background:var(--surface);border:1px solid rgba(255,200,50,0.3);border-radius:14px;width:100%;max-width:340px;padding:22px 20px;animation:popIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275);text-align:center;}\n' +
  '.quest-result-title{font-family:\'Black Han Sans\',sans-serif;font-size:18px;color:var(--gold);margin-bottom:4px;}\n' +
  '.quest-result-sub{font-size:11px;color:var(--text-dim);margin-bottom:16px;}\n' +
  '.quest-result-row{display:flex;justify-content:space-between;align-items:center;padding:9px 13px;border-radius:8px;margin-bottom:6px;font-size:12px;text-align:left;}\n' +
  '.quest-result-row.win{background:rgba(0,199,122,0.08);border:1px solid rgba(0,199,122,0.22);}\n' +
  '.quest-result-row.lose{background:rgba(220,50,50,0.06);border:1px solid rgba(220,50,50,0.18);}\n' +
  '.quest-result-row.penalty{background:rgba(220,120,50,0.07);border:1px solid rgba(220,120,50,0.2);margin-top:8px;}\n' +
  '.quest-defeat-warning{margin-top:12px;padding:10px 13px;background:rgba(220,50,50,0.08);border:1px solid rgba(220,50,50,0.25);border-radius:8px;font-size:11px;color:rgba(220,100,100,0.95);line-height:1.8;text-align:left;}\n' +
  '.quest-defeat-warning strong{font-size:13px;color:var(--red);display:block;margin-top:2px;}',
  '',
  'remove quest CSS'
);

// ── 2. CSS: .ta-quest (팀발표 퀘스트 배너) ────────────────────────────────
rep(
  '.ta-quest{width:100%;max-width:580px;margin-top:12px;background:rgba(255,200,50,0.06);border:1px solid rgba(255,200,50,0.28);border-radius:10px;padding:12px 16px;text-align:center;animation:taPlayerIn 0.45s ease both;box-shadow:0 0 20px rgba(255,200,50,0.08);}\n' +
  '.ta-quest-label{font-size:10px;color:rgba(255,200,50,0.6);letter-spacing:3px;font-weight:700;margin-bottom:6px;}\n' +
  '.ta-quest-name{font-family:\'Black Han Sans\',sans-serif;font-size:18px;color:var(--gold);margin-bottom:6px;}\n' +
  '.ta-quest-desc{font-size:11px;color:var(--text-dim);line-height:1.9;}',
  '',
  'remove ta-quest CSS'
);

// ── 3. HTML: quest-result-modal + quest-modal 제거 ────────────────────────
rep(
  '<!-- 본인 선택 모달 -->\n' +
  '<div class="quest-result-overlay" id="quest-result-modal" style="display:none;">\n' +
  '  <div class="quest-result-modal">\n' +
  '    <div class="quest-result-title" id="quest-result-title">결과</div>\n' +
  '    <div class="quest-result-sub" id="quest-result-sub"></div>\n' +
  '    <div id="quest-result-rows"></div>\n' +
  '    <button class="btn" style="width:100%;display:flex;justify-content:center;margin-top:6px;" onclick="document.getElementById(\'quest-result-modal\').style.display=\'none\'">확인</button>\n' +
  '  </div>\n' +
  '</div>\n' +
  '\n' +
  '<div class="quest-overlay" id="quest-modal" style="display:none;">\n' +
  '  <div class="quest-modal">\n' +
  '    <div class="quest-alert-label">⚠ 매칭 퀘스트 발동</div>\n' +
  '    <div class="quest-name" id="quest-modal-name"></div>\n' +
  '    <div class="quest-player-line" id="quest-modal-player"></div>\n' +
  '    <div class="quest-rule-box" id="quest-modal-rules"></div>\n' +
  '    <button class="btn" style="width:100%;justify-content:center;" onclick="closeQuestModal()">확인</button>',
  '<!-- 본인 선택 모달 -->',
  'remove quest modal HTML'
);

// ── 4. JS: checkQuestEvent 함수 본문을 noop으로 교체 ─────────────────────
rep(
  '  questEventState = null;\n' +
  '  if (isEventMatch) return;\n' +
  '  const top3 = getTopThreeMap();\n' +
  '  const allPlayers = [...currentTeamA, ...currentTeamB];\n' +
  '  // 1등 우선, 없으면 2등, 없으면 3등\n' +
  '  let triggeredRank = null, triggeredPlayer = null;\n' +
  '  for (let rank = 1; rank <= 3; rank++) {\n' +
  '    const found = allPlayers.find(p => top3[normName(p.name)] === rank);\n' +
  '    if (found) { triggeredRank = rank; triggeredPlayer = found.name; break; }\n' +
  '  }\n' +
  '  if (!triggeredRank) return;\n' +
  '  if (Math.random() > QUEST_TRIGGER_RATE) return;\n' +
  '  questEventState = { rank: triggeredRank, playerName: triggeredPlayer, ...QUEST_CONFIGS[triggeredRank] };\n' +
  '  // 팝업은 showTeamAnnounce 오버레이에 통합 — 별도 호출 없음\n' +
  '}',
  '  questEventState = null;\n}',
  'neutralize checkQuestEvent'
);

// ── 5. JS: showTeamAnnounce — questHtml 섹션 제거 ────────────────────────
rep(
  '  // 퀘스트 섹션 — 팀원 등장 후 나타남\n' +
  '  const questDelay = (0.45 + maxLen * 0.1 + 0.3).toFixed(2);\n' +
  '  const questHtml = questEventState ? `\n' +
  '    <div class="ta-quest" style="animation-delay:${questDelay}s">\n' +
  '      <div class="ta-quest-label">⚠ 매칭 퀘스트 발동</div>\n' +
  '      <div class="ta-quest-name">${questEventState.emoji} ${questEventState.name}</div>\n' +
  '      <div class="ta-quest-desc">\n' +
  '        <strong>${escHtml(questEventState.playerName)}</strong>에게 발동됐습니다<br>\n' +
  '        승리팀 <strong style="color:var(--green)">+${questEventState.bonusGold}G</strong> 상금 &nbsp;·&nbsp; 패배팀 골드 없음<br>\n' +
  '        ${escHtml(questEventState.playerName)} 패배 시 <strong style="color:var(--red)">-${questEventState.lossExtraPt}pt</strong> 추가\n' +
  '      </div>\n' +
  '    </div>` : \'\';\n',
  '',
  'remove questHtml in showTeamAnnounce'
);

rep(
  '      ${questHtml}\n      <div class="ta-dismiss">',
  '      <div class="ta-dismiss">',
  'remove ${questHtml} from team announce template'
);

// ── 6. JS: renderResult — 퀘스트 발동 배너 제거 ─────────────────────────
rep(
  '  // 퀘스트 발동 배너\n' +
  '  const questBannerEl = document.getElementById(\'quest-banner-section\');\n' +
  '  if (questEventState && !isEventMatch) {\n' +
  '    questBannerEl.innerHTML = `<div class="quest-active-banner">\n' +
  '      <span class="quest-active-icon">${questEventState.emoji}</span>\n' +
  '      <div>\n' +
  '        <div class="quest-active-title">${questEventState.name} 발동 중!</div>\n' +
  '        <div class="quest-active-sub">승리팀 <strong style="color:var(--green)">+${questEventState.bonusGold}G</strong> 상금 · 패배팀 골드 없음 · ${escHtml(questEventState.playerName)} 패배 시 <strong style="color:var(--red)">-${questEventState.lossExtraPt}pt</strong> 추가</div>\n' +
  '      </div>\n' +
  '    </div>`;\n' +
  '  } else {\n' +
  '    questBannerEl.innerHTML = \'\';\n' +
  '  }',
  '  document.getElementById(\'quest-banner-section\').innerHTML = \'\';',
  'remove quest banner from renderResult'
);

// ── 7. JS: showMatchSummary — questHtml 제거 ─────────────────────────────
rep(
  '  // 퀘스트 결과\n' +
  '  let questHtml = \'\';\n' +
  '  if (questEvent) {\n' +
  '    const questPlayerWon = winners.some(n => normName(n) === normName(questEvent.playerName));\n' +
  '    questHtml = `<div class="ms-section">\n' +
  '      <div class="ms-section-title">${questEvent.emoji || \'⚠\'} ${escHtml(questEvent.name || \'매칭 퀘스트\')}</div>\n' +
  '      <div class="ms-player-row" style="justify-content:center;gap:12px;">\n' +
  '        <span>${escHtml(questEvent.playerName)}</span>\n' +
  '        <span style="color:${questPlayerWon ? \'var(--green)\' : \'var(--red)\'}">${questPlayerWon ? \'생존 성공\' : `-${questEvent.lossExtraPt}pt 추가 감점`}</span>\n' +
  '      </div>\n' +
  '    </div>`;\n' +
  '  }',
  '',
  'remove questHtml in showMatchSummary'
);

rep(
  '        ${questHtml}${specHtml}${tierHtml}',
  '        ${specHtml}${tierHtml}',
  'remove ${questHtml} from match summary template'
);

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('\nok:', ok, 'fail:', fail);
