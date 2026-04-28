// 중복 gold 키 정리 스크립트
// 같은 name을 가진 gold 엔트리가 여러 개인 경우, 데이터가 있는 키 1개만 남기고 나머지 삭제
const https = require('https');
const DB_URL = 'aramchaos-ca022-default-rtdb.asia-southeast1.firebasedatabase.app';
const DRY_RUN = process.argv.includes('--dry-run');

function fbGet(path) {
  return new Promise((resolve, reject) => {
    https.get(`https://${DB_URL}/${path}.json`, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

function fbDelete(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(`https://${DB_URL}/${path}.json`);
    const req = https.request({ hostname: url.hostname, path: url.pathname + url.search, method: 'DELETE' }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    });
    req.on('error', reject);
    req.end();
  });
}

function scoreEntry(entry) {
  // 데이터가 얼마나 풍부한가를 점수화 (높을수록 보존)
  let s = 0;
  if (entry.goldBonus)         s += entry.goldBonus * 10;
  if (entry.goldBonus_s1)      s += entry.goldBonus_s1 * 10;
  if (entry.lastAttendance)    s += 1000;
  if (entry.lastAttendance_s1) s += 500;
  if (entry.seasonPassClaimed_s1) s += 100;
  if (entry.retroApplied)      s += 50;
  if (entry.items && entry.items.length) s += entry.items.length * 5;
  if (entry.items_s1 && entry.items_s1.length) s += entry.items_s1.length * 5;
  if (entry.goldSpent_s1)      s += entry.goldSpent_s1;
  return s;
}

async function main() {
  console.log(DRY_RUN ? '[DRY RUN]' : '[LIVE]', '중복 gold 키 정리 시작\n');
  const goldData = await fbGet('gold');
  if (!goldData) { console.log('gold 데이터 없음'); return; }

  // name → [ {key, entry} ] 로 그룹화
  const byName = {};
  for (const [key, entry] of Object.entries(goldData)) {
    if (!entry || !entry.name) continue;
    if (!byName[entry.name]) byName[entry.name] = [];
    byName[entry.name].push({ key, entry });
  }

  let totalDeleted = 0;
  for (const [name, entries] of Object.entries(byName)) {
    if (entries.length <= 1) continue;

    // 점수 높은 순으로 정렬 → 1등 보존, 나머지 삭제
    entries.sort((a, b) => scoreEntry(b.entry) - scoreEntry(a.entry));
    const keep   = entries[0];
    const remove = entries.slice(1);

    console.log(`\n[${name}] ${entries.length}개 키 발견`);
    console.log(`  보존: ${keep.key} (score=${scoreEntry(keep.entry)})`);
    for (const r of remove) {
      console.log(`  삭제: ${r.key} (score=${scoreEntry(r.entry)})`);
      if (!DRY_RUN) {
        await fbDelete(`gold/${r.key}`);
        console.log(`    → 삭제 완료`);
      }
      totalDeleted++;
    }
  }

  console.log(`\n총 ${totalDeleted}개 중복 키 ${DRY_RUN ? '(dry-run, 실제 삭제 안 됨)' : '삭제 완료'}`);
}

main().catch(console.error);
