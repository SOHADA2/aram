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

// ─── 1. renderMemberGrid: 정렬을 S1 기준으로 ────────────────────────────────
const oldSort =
  '  const playerArr = Object.values(registeredPlayers).sort((a,b)=>{\r\n' +
  '    const tierA = TIERS[getEffectiveTier(a.name, a.manualTier)]?.score ?? 0;\r\n' +
  '    const tierB = TIERS[getEffectiveTier(b.name, b.manualTier)]?.score ?? 0;\r\n' +
  '    return tierB - tierA; // 티어 높은 순\r\n' +
  '  });';

const newSort =
  '  const playerArr = Object.values(registeredPlayers).sort((a,b)=>{\r\n' +
  '    if (CURRENT_SEASON >= 1) return getS1BalanceScore(b.name) - getS1BalanceScore(a.name);\r\n' +
  '    const tierA = TIERS[getEffectiveTier(a.name, a.manualTier)]?.score ?? 0;\r\n' +
  '    const tierB = TIERS[getEffectiveTier(b.name, b.manualTier)]?.score ?? 0;\r\n' +
  '    return tierB - tierA; // 티어 높은 순\r\n' +
  '  });';

rep(oldSort, newSort, 'renderMemberGrid: S1 sort');

// ─── 2. renderMemberGrid: 티어 배지를 S1으로 ──────────────────────────────────
const oldBadge =
  '      <span class="tier-badge member-chip-tier ${t.cls}">${t.label}</span>\r\n' +
  '    </div>`;';

const newBadge =
  '      ${(()=>{\r\n' +
  '        if(CURRENT_SEASON>=1){\r\n' +
  '          const _d=season1Data[normName(p.name)];\r\n' +
  '          if(!_d||!_d.placementDone){\r\n' +
  '            const _n=(_d?.placementGames)||0;\r\n' +
  '            return \'<span class="tier-badge s1t-unranked member-chip-tier">\'+\'배치 \'+_n+\'/5</span>\';\r\n' +
  '          }\r\n' +
  '          if(_d.promoActive){\r\n' +
  '            const _m=S1_TIER_META[_d.tier]||S1_TIER_META.bronze;\r\n' +
  '            return \'<span class="tier-badge \'+_m.cls+\' member-chip-tier">승급전</span>\';\r\n' +
  '          }\r\n' +
  '          const _m=S1_TIER_META[_d.tier]||S1_TIER_META.unranked;\r\n' +
  '          return \'<span class="tier-badge \'+_m.cls+\' member-chip-tier">\'+_m.label+\' \'+(_d.lp||0)+\'LP</span>\';\r\n' +
  '        }\r\n' +
  '        return \'<span class="tier-badge member-chip-tier \'+t.cls+\'">\'+t.label+\'</span>\';\r\n' +
  '      })()}\r\n' +
  '    </div>`;';

rep(oldBadge, newBadge, 'renderMemberGrid: S1 badge');

// ─── 3. teamCard: 티어 배지를 S1으로 ─────────────────────────────────────────
const oldTeamBadge =
  '        <span class="tier-badge ${t.cls}">${t.label}</span>\r\n' +
  '      </div>\r\n' +
  '    </div>`;';

const newTeamBadge =
  '        ${(()=>{\r\n' +
  '          if(CURRENT_SEASON>=1){\r\n' +
  '            const _d=season1Data[normName(p.name)];\r\n' +
  '            if(!_d||!_d.placementDone) return \'<span class="tier-badge s1t-unranked">\'+\'배치</span>\';\r\n' +
  '            if(_d.promoActive){\r\n' +
  '              const _m=S1_TIER_META[_d.tier]||S1_TIER_META.bronze;\r\n' +
  '              return \'<span class="tier-badge \'+_m.cls+\'">승급전</span>\';\r\n' +
  '            }\r\n' +
  '            const _m=S1_TIER_META[_d.tier]||S1_TIER_META.unranked;\r\n' +
  '            return \'<span class="tier-badge \'+_m.cls+\'">\'+_m.label+\'</span>\';\r\n' +
  '          }\r\n' +
  '          return \'<span class="tier-badge \'+t.cls+\'">\'+t.label+\'</span>\';\r\n' +
  '        })()}\r\n' +
  '      </div>\r\n' +
  '    </div>`;';

rep(oldTeamBadge, newTeamBadge, 'teamCard: S1 badge');

// Version bump
rep("const APP_VERSION = 'v2.31.53';", "const APP_VERSION = 'v2.31.54';", 'version bump');

fs.writeFileSync('C:/Users/so/aram/index.html', html, 'utf8');
console.log('\nok:', ok, 'fail:', fail);
