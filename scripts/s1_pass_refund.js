// S1 시즌 패스 골드 회수 스크립트
// Usage: node s1_pass_refund.js [--dry-run]

const https = require('https');
const DB_URL = 'aramchaos-ca022-default-rtdb.asia-southeast1.firebasedatabase.app';
const DRY_RUN = process.argv.includes('--dry-run');

function encodePath(p) { return p.split('/').map(s => encodeURIComponent(s)).join('/'); }

function fbGet(path) {
  return new Promise((resolve, reject) => {
    https.get(`https://${DB_URL}/${encodePath(path)}.json`, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

function fbDelete(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname: DB_URL, path: `/${encodePath(path)}.json`, method: 'DELETE' },
      res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(d)); });
    req.on('error', reject); req.end();
  });
}

// S1 패스 보상 (index.html과 동일)
function s1PassRewardForLevel(lv) {
  if (lv === 20) return 400;
  if (lv === 15) return 150;
  if (lv === 10) return 80;
  if (lv === 5)  return 50;
  return 20;
}

function calcS1PassGold(claimed) {
  if (!claimed) return 0;
  return Object.keys(claimed).reduce((sum, lv) => sum + s1PassRewardForLevel(Number(lv)), 0);
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== LIVE — 실제 회수 ===');

  const goldData = await fbGet('gold');
  if (!goldData) { console.log('gold 데이터 없음'); return; }

  let totalRefund = 0;
  const toRefund = [];

  for (const [key, data] of Object.entries(goldData)) {
    const claimed = data.seasonPassClaimed_s1;
    if (!claimed || Object.keys(claimed).length === 0) continue;

    const gold = calcS1PassGold(claimed);
    const claimedLevels = Object.keys(claimed).sort((a,b)=>Number(a)-Number(b)).join(', ');
    console.log(`  ${data.name || key}: LV [${claimedLevels}] 클레임 → ${gold}G 회수`);
    totalRefund += gold;
    toRefund.push({ key, name: data.name || key, gold });
  }

  if (toRefund.length === 0) {
    console.log('  클레임된 패스 골드 없음');
    return;
  }

  console.log(`\n총 회수 대상: ${toRefund.length}명, ${totalRefund}G`);

  if (DRY_RUN) {
    console.log('\n[DRY RUN] 실제 반영 안 됨. --dry-run 없이 실행하면 됩니다.');
    return;
  }

  // seasonPassClaimed_s1 삭제 → calcS1PassGold가 0 반환
  for (const { key, name, gold } of toRefund) {
    await fbDelete(`gold/${key}/seasonPassClaimed_s1`);
    console.log(`  ✓ ${name}: ${gold}G 회수 완료`);
  }

  console.log(`\n완료! 총 ${totalRefund}G 회수됨.`);
  console.log('패스 퀘스트 수정 후 재배포하면 됩니다.');
}

main().catch(console.error);
