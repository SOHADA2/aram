// S1 소급 LP 계산 및 Firebase 반영 스크립트
// Usage: node s1_retroactive.js [--dry-run]

const https = require('https');
const DB_URL = 'aramchaos-ca022-default-rtdb.asia-southeast1.firebasedatabase.app';

const DRY_RUN = process.argv.includes('--dry-run');

// ── S1 상수 (index.html과 동일) ──────────────────────────────────
const S1_LP_WIN              = 20;
const S1_LP_LOSS             = 14;
const S1_PLACEMENT_WIN_LP    = 25;
const S1_PLACEMENT_GAMES     = 5;
const S1_LP_CAP              = 100;
const S1_PROMO_FAIL_LP       = 75;
const S1_DEMOTION_LP         = 75;
const S1_PROMO_EXPIRY        = 5;
const S1_GAMBLE_WIN          = 40;
const S1_GAMBLE_LOSS         = 30;
const S1_NEWBIE_WIN_BONUS_LP = 3;
const S1_NEWBIE_LOSS_REDUCE_LP = 3;
const S1_NEWBIE_SELF_LOSS_LP = 5;

const S1_TIER_ORDER  = ['bronze','silver','gold','platinum','diamond','master','grandmaster','challenger'];
const S1_AUTO_TIERS  = new Set(['bronze','silver']);
const S1_PROMO_TIERS = new Set(['gold','platinum','diamond','master','grandmaster']);

function normName(n) { return String(n).trim().replace(/\s+/g,' '); }

function s1DefaultPlayer() {
  return { tier:'unranked', lp:0, placementWins:0, placementGames:0, placementDone:false,
           promoActive:false, promoWins:0, promoLosses:0, promoGamesPlayed:0 };
}

function s1NextTier(tier) {
  const i = S1_TIER_ORDER.indexOf(tier);
  return (i >= 0 && i < S1_TIER_ORDER.length - 1) ? S1_TIER_ORDER[i+1] : null;
}
function s1PrevTier(tier) {
  const i = S1_TIER_ORDER.indexOf(tier);
  return (i > 0) ? S1_TIER_ORDER[i-1] : null;
}

function s1CalcPlacementResult(wins) {
  const lp = wins * S1_PLACEMENT_WIN_LP;
  return lp >= S1_LP_CAP ? { tier:'silver', lp: lp - S1_LP_CAP } : { tier:'bronze', lp };
}

function s1PromoSuccess(d) {
  const next = s1NextTier(d.tier);
  return { ...d, tier: next || d.tier, lp:0,
           promoActive:false, promoWins:0, promoLosses:0, promoGamesPlayed:0 };
}
function s1PromoFail(d) {
  return { ...d, lp: S1_PROMO_FAIL_LP, promoActive:false, promoWins:0, promoLosses:0, promoGamesPlayed:0 };
}

// ── HTTP helpers ─────────────────────────────────────────────────
function encodePath(path) {
  // Encode each segment separately to allow slashes through
  return path.split('/').map(seg => encodeURIComponent(seg)).join('/');
}

function fbGet(path) {
  return new Promise((resolve, reject) => {
    const url = `https://${DB_URL}/${encodePath(path)}.json`;
    https.get(url, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function fbPut(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const opts = {
      hostname: DB_URL,
      path: `/${encodePath(path)}.json`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function fbDelete(path) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: DB_URL,
      path: `/${encodePath(path)}.json`,
      method: 'DELETE',
    };
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.end();
  });
}

// ── Apply one match result to a player state ─────────────────────
function applyMatchResult(d, won, activeS1Item, hasNewbieTeammate, iAmNewbie) {
  d = { ...d };

  // 배치고사
  if (!d.placementDone) {
    d.placementGames = (d.placementGames || 0) + 1;
    if (won) d.placementWins = (d.placementWins || 0) + 1;
    if (d.placementGames >= S1_PLACEMENT_GAMES) {
      const effectiveWins = iAmNewbie
        ? Math.min(S1_PLACEMENT_GAMES, (d.placementWins || 0) + 1)
        : (d.placementWins || 0);
      const res = s1CalcPlacementResult(effectiveWins);
      d.tier = res.tier; d.lp = res.lp; d.placementDone = true;
    }
    return d;
  }

  // 승급전
  if (d.promoActive) {
    d.promoGamesPlayed = (d.promoGamesPlayed || 0) + 1;
    if (d.promoGamesPlayed > S1_PROMO_EXPIRY) { return s1PromoFail(d); }
    if (activeS1Item === 's1_promo_win') {
      if (won) { return s1PromoSuccess(d); }
      else { d.promoLosses = (d.promoLosses||0)+1; if (d.promoLosses>=2) return s1PromoFail(d); }
    } else if (activeS1Item === 's1_promo_shield' && !won) {
      // 방어권: 패배 무효
    } else {
      if (won) { d.promoWins=(d.promoWins||0)+1; if(d.promoWins>=2) return s1PromoSuccess(d); }
      else     { d.promoLosses=(d.promoLosses||0)+1; if(d.promoLosses>=2) return s1PromoFail(d); }
    }
    return d;
  }

  // 정규전
  const useGamble = activeS1Item === 's1_gamble';
  let gain = useGamble ? S1_GAMBLE_WIN  : S1_LP_WIN;
  let lose = useGamble ? S1_GAMBLE_LOSS : S1_LP_LOSS;

  if (!useGamble) {
    if (won && hasNewbieTeammate) gain += S1_NEWBIE_WIN_BONUS_LP;
    if (!won && iAmNewbie)        lose = S1_NEWBIE_SELF_LOSS_LP;
    else if (!won && hasNewbieTeammate) lose = Math.max(0, lose - S1_NEWBIE_LOSS_REDUCE_LP);
  }

  const isChallenger = d.tier === 'challenger';
  if (won) {
    if (isChallenger) {
      d.lp = (d.lp || 0) + gain;
    } else {
      d.lp = Math.min((d.lp || 0) + gain, S1_LP_CAP);
      if (d.lp >= S1_LP_CAP) {
        if (S1_AUTO_TIERS.has(d.tier)) {
          const next = s1NextTier(d.tier);
          if (next) { d.tier = next; d.lp = 0; }
        } else if (S1_PROMO_TIERS.has(d.tier)) {
          d.promoActive = true; d.promoWins = 0; d.promoLosses = 0; d.promoGamesPlayed = 0;
        }
      }
    }
  } else {
    const newLp = (d.lp || 0) - lose;
    if (newLp < 0 && !S1_AUTO_TIERS.has(d.tier)) {
      const prev = s1PrevTier(d.tier);
      if (prev) { d.tier = prev; d.lp = S1_DEMOTION_LP; } else { d.lp = 0; }
    } else {
      d.lp = Math.max(0, newLp);
    }
  }
  return d;
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== LIVE RUN ===');

  // 1. Fetch all data
  console.log('\n[1] Firebase 데이터 읽기...');
  const [matchesRaw, playersRaw, season1Raw] = await Promise.all([
    fbGet('matches'),
    fbGet('players'),
    fbGet('season1/players'),
  ]);

  if (!matchesRaw) { console.log('matches 없음'); return; }

  // 2. Build newbie set from registered players
  const newbieSet = new Set();
  if (playersRaw) {
    Object.values(playersRaw).forEach(p => {
      if (p.isNewbie) newbieSet.add(normName(p.name));
    });
  }
  console.log('뉴비 목록:', [...newbieSet]);

  // 3. Filter and sort S1 matches
  const s1Matches = Object.entries(matchesRaw)
    .filter(([,m]) => m.season === 1)
    .sort(([,a],[,b]) => (a.timestamp||0) - (b.timestamp||0));

  console.log(`\n[2] S1 경기 수: ${s1Matches.length}개`);
  s1Matches.forEach(([key,m], i) => {
    const winners = m.winner === 'blue' ? m.teamA : m.teamB;
    const losers  = m.winner === 'blue' ? m.teamB : m.teamA;
    console.log(`  #${i+1} [${m.date}] 승: ${winners.join(', ')} / 패: ${losers.join(', ')}`);
    if (m.itemEffects) {
      const s1items = Object.entries(m.itemEffects)
        .map(([k,effects]) => effects.filter(e=>e.startsWith('s1_')).map(e=>`${k}:${e}`))
        .flat();
      if (s1items.length) console.log(`       S1아이템: ${s1items.join(', ')}`);
    }
  });

  // 4. Replay LP for all players
  const playerStates = {}; // normName -> state

  for (const [, match] of s1Matches) {
    const winners = match.winner === 'blue' ? (match.teamA||[]) : (match.teamB||[]);
    const losers  = match.winner === 'blue' ? (match.teamB||[]) : (match.teamA||[]);
    const allPlayers = [...winners, ...losers];

    for (const pName of allPlayers) {
      const key = normName(pName);
      if (!playerStates[key]) playerStates[key] = s1DefaultPlayer();

      const isWin = winners.some(w => normName(w) === key);
      const myTeam = isWin ? winners : losers;
      const iAmNewbie = newbieSet.has(key);
      const hasNewbieTeammate = myTeam.some(t => normName(t) !== key && newbieSet.has(normName(t)));

      // Check S1 items from match
      let activeS1Item = null;
      if (match.itemEffects) {
        // itemEffects keys are normName(playerName)
        const effects = match.itemEffects[key] || [];
        const s1item = effects.find(e => e.startsWith('s1_'));
        if (s1item) activeS1Item = s1item;
      }

      const before = { ...playerStates[key] };
      playerStates[key] = applyMatchResult(playerStates[key], isWin, activeS1Item, hasNewbieTeammate, iAmNewbie);

      const after = playerStates[key];
      let change = '';
      if (!before.placementDone && after.placementDone) {
        change = `배치완료 → ${after.tier} ${after.lp}LP`;
      } else if (!after.placementDone) {
        change = `배치 ${after.placementGames}/${S1_PLACEMENT_GAMES}`;
      } else {
        const lpDiff = after.lp - before.lp;
        change = `${after.tier} ${before.lp}→${after.lp}LP (${lpDiff>=0?'+':''}${lpDiff})`;
      }
      console.log(`  ${pName}: ${isWin?'승':'패'} ${activeS1Item?'['+activeS1Item+']':''} → ${change}`);
    }
    console.log('');
  }

  // 5. Summary
  console.log('\n[3] 최종 LP 상태:');
  for (const [key, d] of Object.entries(playerStates)) {
    if (!d.placementDone) {
      console.log(`  ${key}: 배치 ${d.placementGames}/${S1_PLACEMENT_GAMES} (${d.placementWins}승)`);
    } else {
      console.log(`  ${key}: ${d.tier} ${d.lp}LP${d.promoActive?' [승급전]':''}`);
    }
  }

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Firebase 미반영. --live 없이 재실행하면 실제 반영됩니다.');
    return;
  }

  // 6. Write to Firebase
  console.log('\n[4] Firebase season1/players 업데이트...');

  // Delete "undefined" junk key if exists
  if (season1Raw && season1Raw['undefined']) {
    console.log('  "undefined" 키 삭제 중...');
    await fbDelete('season1/players/undefined');
  }

  for (const [key, d] of Object.entries(playerStates)) {
    console.log(`  ${key} 업데이트...`);
    await fbPut(`season1/players/${key}`, d);
  }

  console.log('\n완료!');
}

main().catch(console.error);
