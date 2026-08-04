// 🧪 오프라인 상대 반복 약탈 차단 검증 — B를 구독 해제(=오프라인)해 inbox 미처리 상태로 두고 A가 연속 2회 공격
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const J = o => JSON.stringify(o);

(async () => {
  const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
  const page = await browser.newPage({ viewport:{width:1500,height:900} });
  const errs=[]; page.on('pageerror', e=>errs.push('PAGEERR: '+e.message));
  page.on('console', m=>{ const t=m.text(); if(m.type()==='error'&&!t.includes('404')) errs.push('CONSOLE: '+t); });

  await page.goto('http://127.0.0.1:8907/_p3harness.html', {waitUntil:'load'});
  await sleep(7000);
  const fs = page.frames().filter(f=>f.url().includes('embed'));
  const A = fs.find(f=>new URL(f.url()).port==='8907'), B = fs.find(f=>new URL(f.url()).port==='8908');

  await A.evaluate(()=>window.startGame()); await B.evaluate(()=>window.startGame());
  await sleep(2000);
  for(const f of [A,B]) await f.evaluate(()=>window.go('map'));
  await B.evaluate(()=>{ const S=window.rune(); window.runeArmy(5); S.v.blds.storage=12; S.v.blds.hide=0;
    S.world[Object.keys(S.world).find(k=>S.world[k].owner==='me')].protectUntil=0; });
  await A.evaluate(()=>{ const S=window.rune(); window.runeArmy(300); S.v.blds.storage=12;
    S.world[Object.keys(S.world).find(k=>S.world[k].owner==='me')].protectUntil=0; });
  await sleep(2500);
  await B.evaluate(()=>{ const S=window.rune(); S.v.res={wood:9000,clay:9000,iron:9000}; });
  await sleep(22000);

  const w1 = await page.evaluate(()=>JSON.parse(JSON.stringify(window.H.villages)));
  const bCoord = Object.keys(w1).find(k=>w1[k].owner==='KEY_B');
  const opId = 'op_'+bCoord.replace(',','_');
  console.log('B 발행 스냅샷:', 'dstack='+J(w1[bCoord].dstack||{}), 'loot='+J(w1[bCoord].loot||{}));

  // 🔌 B 오프라인화(공유월드 수신 중단 → inbox 정산 안 함)
  await page.evaluate(()=>{ window.H.subbed.fb=0; });
  console.log('→ B 오프라인 전환(구독 해제)\n');

  const attack = async (label) => {
    const r1 = await A.evaluate(id=>{ window.goVillage(id);
      const ov=document.querySelector('.rl-ov'); if(!ov) return 'no-info';
      const b=ov.querySelector('.oi-attack'); if(!b||b.disabled) return 'disabled'; b.click(); return 'ok'; }, opId);
    if(r1!=='ok') return r1;
    await sleep(500);
    const r2 = await A.evaluate(()=>{ const ov=document.querySelector('.picker.atk'); if(!ov) return 'no-modal';
      // 파성추/정찰병 빼고 전투병만 최대
      ['spear','axe','lcav'].forEach(u=>{ const b=ov.querySelector(`.atk-step button[data-u="${u}"][data-d="max"]`); if(b) b.click(); });
      const go=ov.querySelector('.atk-go'); go.click(); return 'sent'; });
    if(r2!=='sent') return r2;
    await A.evaluate(()=>{ const S=window.rune(); S.marches.forEach(m=>{ if(m.mode==='attack') m.arriveAt=Date.now()-10; }); });
    await sleep(2200);
    const rep = await A.evaluate(()=>{ const r=window.rune().reports[0]; return r&&{win:r.win, defUnits:r.defUnits, loot:r.loot}; });
    console.log(label, '→ 승리:'+rep.win, '수비:'+J(rep.defUnits||{}), '약탈:'+J(rep.loot));
    // 귀환시켜 병력 회수
    await A.evaluate(()=>{ const S=window.rune(); S.marches.forEach(m=>{ m.arriveAt=Date.now()-10; }); });
    await sleep(1800);
    return rep.loot;
  };

  const l1 = await attack('1차 공격');
  const snapA = await A.evaluate(c=>{ const o=(window.rune(), null); return null; }, bCoord);
  const inbox1 = await page.evaluate(c=>Object.values(window.H.villages[c].inbox||{}).map(e=>e.kind), bCoord);
  console.log('  상대 inbox(미처리):', J(inbox1));
  const l2 = await attack('2차 공격');
  const l3 = await attack('3차 공격');

  const tot = o => o? (o.wood+o.clay+o.iron) : 0;
  console.log('\n=== 판정 ===');
  console.log(' 1차 약탈 합계:', tot(l1), '/ 2차:', tot(l2), '/ 3차:', tot(l3));
  console.log(' 반복 약탈 차단:', (tot(l2) < tot(l1) && tot(l3) <= tot(l2))? '✅ 스냅샷이 깎여 감소' : '❌ 동일 스냅샷 재사용(자원 복사)');

  // B 재접속 → 밀린 inbox 정산
  await page.evaluate(()=>{ window.H.subbed.fb=1; });
  await page.evaluate(()=>{ const arr=Object.values(window.H.villages); document.getElementById('fb').contentWindow.postMessage({type:'runeWorld', villages:JSON.parse(JSON.stringify(arr))},'*'); });
  await sleep(3000);
  const bAfter = await B.evaluate(()=>{ const S=window.rune();
    return {res:JSON.parse(JSON.stringify(S.v.res)), troops:JSON.parse(JSON.stringify(S.v.troops)), reports:S.reports.filter(r=>r.type==='defense').length}; });
  console.log('\n B 재접속 정산:', J(bAfter));
  const inbox2 = await page.evaluate(c=>Object.values(window.H.villages[c].inbox||{}).length, bCoord);
  console.log(' 남은 inbox:', inbox2, inbox2===0? '✅ 전부 정산':'⚠️ 잔여');
  console.log('\n=== 에러 ===', errs.length? errs.slice(0,8):'none');
  await browser.close();
})();
