const DB = 'https://aramchaos-ca022-default-rtdb.asia-southeast1.firebasedatabase.app';

const RELAY_REWARDS = [
  50,50,50,50,{g:70},{g:100,item:'lp2x'},
  50,50,50,50,{g:100},{g:100,item:'lp2x'},
  50,50,50,50,{g:130},{g:130,item:'gamble'},
  50,50,50,50,{g:160},{g:160,item:'shield'},
  50,50,50,50,{g:200},{g:200,item:'lp2x'},
  50,50,50,50,{g:300},{g:300,item:'lp2x'},
];
const PASS_REWARDS = [0,20,20,20,20,50,20,20,20,20,80,20,20,20,20,150,20,20,20,20,400];

function calcRelayGold(claimed, base) {
  let sum = 0;
  const end = Math.min(claimed||0, 30);
  for (let i = (base||0); i < end; i++) {
    const r = RELAY_REWARDS[i];
    sum += (typeof r === 'object') ? r.g : r;
  }
  return sum;
}

function calcPassGold(claimed) {
  if (!claimed) return 0;
  let sum = 0;
  // 배열 형식: [null, ts1, ts2, ...] — truthy = 클레임 완료
  const arr = Array.isArray(claimed) ? claimed : Object.entries(claimed).map(([k,v])=>v);
  for (let i = 1; i <= 20; i++) {
    if (arr[i]) sum += PASS_REWARDS[i] || 0;
  }
  return sum;
}

async function main() {
  const [goldRes, matchesRes] = await Promise.all([
    fetch(`${DB}/gold.json`),
    fetch(`${DB}/matches.json`),
  ]);
  const goldData    = await goldRes.json();
  const matchesData = await matchesRes.json();

  const s1Matches = matchesData
    ? Object.values(matchesData).filter(m => m.season === 1)
    : [];

  const norm = n => (n||'').trim().replace(/\s+/g,' ');

  const rows = [];

  for (const [, d] of Object.entries(goldData)) {
    const name = d.name || '?';

    // ── 매치 골드 ──
    let matchGold = 0;
    for (const m of s1Matches) {
      const all = [...(m.teamA||[]), ...(m.teamB||[])];
      if (!all.some(p => norm(p) === norm(name))) continue;
      const won = (m.winner==='blue' ? m.teamA : m.teamB).some(p => norm(p)===norm(name));
      matchGold += won ? 15 : 5;
      const gv = m.goldVersion||1;
      const mvpG = gv>=2 ? 50 : 10;
      const specG = gv>=2 ? 50 : 15;
      if (norm(m.mvpWinner)===norm(name)||norm(m.mvpLoser)===norm(name)) matchGold += mvpG;
      if (norm(m.mannerWinner)===norm(name)||norm(m.mannerLoser)===norm(name)) matchGold += 50;
      if (norm(m.mannerKing)===norm(name)) matchGold += 50;
      // 관전자
      const sp = m.spectatorPicks?.[norm(name)];
      if (sp?.correct) {
        matchGold += sp.betAmount > 0 ? (sp.payout||sp.betAmount) : specG;
      }
      // 퀘스트
      if (m.questEvent) {
        const winners = m.winner==='blue' ? m.teamA : m.teamB;
        if (winners.some(p=>norm(p)===norm(name))) matchGold += m.questEvent.bonusGold||0;
      }
    }

    // ── 출석 (S1) ──
    const attend = (d.attendanceHistory_s1||[]).reduce((s,e) => s + (e.gold||0), 0);

    // ── 복권 당첨 ──
    const lottery = (d.lotteryHistory||[]).reduce((s,e) => s + (e.gold||0), 0);

    // ── 릴레이 ──
    const relay = calcRelayGold(d.relayClaimed_s1, d.relayBase_s1);

    // ── 시즌 패스 ──
    const pass = calcPassGold(d.seasonPassClaimed_s1);

    // ── 막고라 수익 ──
    const magollaEarned = (d.magollaHistory_s1||[]).filter(e=>e.delta>0).reduce((s,e)=>s+e.delta,0);
    const magollaLoss   = (d.magollaHistory_s1||[]).filter(e=>e.delta<0).reduce((s,e)=>s+Math.abs(e.delta),0);

    // ── 기타 ──
    const legacy   = d.goldBonusLegacy_s1 || 0;
    const witness  = (d.witnessGold_s1_master||0) + (d.witnessGold_s1_gm||0) + (d.witnessGold_s1_ch||0);

    const totalEarned = matchGold + attend + lottery + relay + pass + magollaEarned + legacy + witness;
    const spent       = d.goldSpent_s1 || 0;
    const balance     = totalEarned - spent;

    rows.push({ name, matchGold, attend, lottery, relay, pass, magollaEarned, magollaLoss, legacy, witness, totalEarned, spent, balance });
  }

  // 활성 유저만 (아무 활동 있는 경우)
  const active = rows.filter(r => r.totalEarned > 0 || r.spent > 0);
  active.sort((a,b) => b.totalEarned - a.totalEarned);

  const pad = (s,n) => String(s).padStart(n);
  const pn  = (v,n) => pad(v+'G',n);

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║          Season 1 골드 현황 (2026-05-22)              ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('\n' + '이름'.padEnd(18) + ' ' + '번 돈'.padStart(7) + ' ' + '쓴 돈'.padStart(7) + ' ' + '잔액'.padStart(7));
  console.log('─'.repeat(44));
  for (const r of active) {
    const bal = r.balance >= 0 ? `+${r.balance}G` : `${r.balance}G`;
    console.log(`${r.name.padEnd(18)} ${pn(r.totalEarned,7)} ${pn(r.spent,7)} ${pad(bal,8)}`);
  }
  const tE = active.reduce((s,r)=>s+r.totalEarned,0);
  const tS = active.reduce((s,r)=>s+r.spent,0);
  console.log('─'.repeat(44));
  console.log(`${'[전체 합계]'.padEnd(18)} ${pn(tE,7)} ${pn(tS,7)}`);

  console.log('\n── 항목별 합계 (전체) ─────────────────────────────');
  const sum = k => active.reduce((s,r)=>s+r[k],0);
  const items = [
    ['매치 골드', 'matchGold'],['출석', 'attend'],['복권 당첨','lottery'],
    ['릴레이','relay'],['시즌 패스','pass'],['막고라 수익','magollaEarned'],
    ['막고라 손실','magollaLoss'],['레거시','legacy'],['마일스톤 목격','witness'],
  ];
  for (const [label, key] of items) {
    const v = sum(key);
    if (v > 0) console.log(`  ${label.padEnd(12)}: ${v}G`);
  }

  console.log('\n── 개인별 상세 ────────────────────────────────────');
  for (const r of active) {
    console.log(`\n▸ ${r.name}`);
    if (r.matchGold)      console.log(`    매치:      ${r.matchGold}G`);
    if (r.attend)         console.log(`    출석:      ${r.attend}G`);
    if (r.lottery)        console.log(`    복권:      ${r.lottery}G`);
    if (r.relay)          console.log(`    릴레이:    ${r.relay}G`);
    if (r.pass)           console.log(`    패스:      ${r.pass}G`);
    if (r.magollaEarned)  console.log(`    막고라(+): ${r.magollaEarned}G`);
    if (r.magollaLoss)    console.log(`    막고라(-): -${r.magollaLoss}G`);
    if (r.legacy)         console.log(`    레거시:    ${r.legacy}G`);
    if (r.witness)        console.log(`    마일스톤:  ${r.witness}G`);
    console.log(`    합계: 번 돈 ${r.totalEarned}G / 쓴 돈 ${r.spent}G / 잔액 ${r.balance}G`);
  }
}

main().catch(console.error);
