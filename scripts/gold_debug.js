const DB = 'https://aramchaos-ca022-default-rtdb.asia-southeast1.firebasedatabase.app';

async function main() {
  const res = await fetch(`${DB}/gold.json`);
  const goldData = await res.json();
  const [key, d] = Object.entries(goldData)[0];

  console.log('=== 애긢반달곰 상세 ===');
  console.log('attendanceHistory_s1 길이:', d.attendanceHistory_s1?.length ?? 'undefined');
  console.log('attendanceHistory_s1 샘플:', JSON.stringify((d.attendanceHistory_s1||[]).slice(0,3)));
  console.log('lotteryHistory 샘플:', JSON.stringify((d.lotteryHistory||[]).slice(0,3)));
  console.log('magollaHistory_s1:', JSON.stringify(d.magollaHistory_s1));
  console.log('goldBonusLegacy_s1:', d.goldBonusLegacy_s1);
  console.log('relayClaimed_s1:', d.relayClaimed_s1, '/ relayBase_s1:', d.relayBase_s1);
  console.log('seasonPassClaimed_s1:', JSON.stringify(d.seasonPassClaimed_s1));
  console.log('witnessGold_s1_master:', d.witnessGold_s1_master, '/ witnessGold_s1_ch:', d.witnessGold_s1_ch);
}
main().catch(console.error);
