const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const J = o => JSON.stringify(o);

(async () => {
  const browser = await chromium.launch({
    executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']
  });
  const page = await browser.newPage({ viewport:{width:1500,height:900} });
  const errs=[];
  page.on('pageerror', e=>errs.push('PAGEERR: '+e.message));
  page.on('console', m=>{ const t=m.text(); if(m.type()==='error' && !t.includes('404')) errs.push('CONSOLE: '+t); });

  await page.goto('http://127.0.0.1:8907/_p3harness.html', {waitUntil:'load'});
  await sleep(7000);
  const fs = page.frames().filter(f=>f.url().includes('embed'));
  const A = fs.find(f=>new URL(f.url()).port==='8907');
  const B = fs.find(f=>new URL(f.url()).port==='8908');
  if(!A||!B){ console.log('FRAME MISSING'); await browser.close(); return; }

  // 시작
  await A.evaluate(()=>window.startGame()); await B.evaluate(()=>window.startGame());
  await sleep(2000);
  // 지도 진입(공유월드 구독) + 병력/자원
  for(const f of [A,B]) await f.evaluate(()=>window.go('map'));
  await B.evaluate(()=>{ const S=window.rune(); window.runeArmy(30);
    S.v.blds.wall=3; S.v.blds.hide=1; S.v.blds.storage=8;
    S.world[Object.keys(S.world).find(k=>S.world[k].owner==='me')].protectUntil=0;   // 🛡️ 테스트: 보호막 해제
  });
  await A.evaluate(()=>{ const S=window.rune(); window.runeArmy(150);
    S.world[Object.keys(S.world).find(k=>S.world[k].owner==='me')].protectUntil=0; });
  await sleep(3000);
  await B.evaluate(()=>{ const S=window.rune(); S.v.res={wood:4000,clay:4000,iron:4000}; });
  await sleep(23000);   // 스로틀 주기(20s) 안에 반드시 발행되는지 확인

  const w1 = await page.evaluate(()=>JSON.parse(JSON.stringify(window.H.villages)));
  console.log('=== 발행된 월드(스로틀 검증) ===');
  for(const k in w1){ const v=w1[k]; console.log(' ',k,v.name,'def='+v.def,'wall='+v.wall,'prot='+(v.prot>Date.now()?'Y':'N'),'dstack='+J(v.dstack||{}),'loot='+J(v.loot||{})); }
  const saves = await page.evaluate(()=>window.H.log.filter(l=>l.type==='runeSave').length);
  console.log(' runeSave 수신 횟수:', saves, saves>2? '(오토세이브 정상)':'(⚠️ 발행 부족)');

  const bCoord = Object.keys(w1).find(k=>w1[k].owner==='KEY_B');
  const opId = 'op_'+bCoord.replace(',','_');
  const bBefore = await B.evaluate(()=>{ const S=window.rune(); return {troops:JSON.parse(JSON.stringify(S.v.troops)), res:JSON.parse(JSON.stringify(S.v.res)), wall:S.v.blds.wall}; });

  const drive = async (f, btnSel) => {
    const r1 = await f.evaluate(({id,sel})=>{
      window.goVillage(id);
      const ov=document.querySelector('.rl-ov'); if(!ov) return 'no-info-modal';
      const b=ov.querySelector(sel); if(!b) return 'no-btn'; if(b.disabled) return 'btn-disabled';
      b.click(); return 'ok';
    }, {id:opId, sel:btnSel});
    if(r1!=='ok') return r1;
    await sleep(500);
    return await f.evaluate(()=>{
      const ov=document.querySelector('.picker.atk'); if(!ov) return 'no-atk-modal';
      [...ov.querySelectorAll('.atk-step .mx')].forEach(b=>b.click());
      const go=ov.querySelector('.atk-go'); if(!go||go.disabled) return 'no-go';
      go.click(); return 'sent';
    });
  };
  const resolveNow = async (f) => { await f.evaluate(()=>{ const S=window.rune(); S.marches.forEach(m=>{ m.arriveAt=Date.now()-10; }); }); await sleep(2000); };

  // ── 정찰 ──
  console.log('\n=== 🧭 A → B 정찰 ===');
  console.log(' 발송:', await drive(A,'.oi-scout'));
  await resolveNow(A);
  console.log(' A 보고서:', J(await A.evaluate(()=>{ const r=window.rune().reports[0]; return r&&{type:r.type,op:r.op,win:r.win,spy:r.spy&&{def:r.spy.def,wall:r.spy.wall,troops:r.spy.troops,res:r.spy.res}}; })));
  await sleep(3000);
  console.log(' B 보고서:', J(await B.evaluate(()=>{ const r=window.rune().reports[0]; return r&&{type:r.type,scouted:r.scouted,win:r.win,from:r.from&&r.from.name}; })));

  // ── 공격 ──
  console.log('\n=== ⚔️ A → B 공격 ===');
  const s2 = await drive(A,'.oi-attack');
  await sleep(400);
  const conf = await A.evaluate(()=>{ for(const ov of document.querySelectorAll('.ov')){ if(/보호/.test(ov.textContent)){ const b=[...ov.querySelectorAll('button')].find(x=>/공격|계속|해제|출발/.test(x.textContent)); if(b){ b.click(); return 'confirm:'+b.textContent.trim(); } } } return 'none'; });
  console.log(' 발송:', s2, conf, '· 행군수', await A.evaluate(()=>window.rune().marches.length));
  await resolveNow(A);
  console.log(' A 보고서:', J(await A.evaluate(()=>{ const r=window.rune().reports[0]; return r&&{type:r.type,op:r.op,win:r.win,atk:r.atkPow,def:r.defPow,sent:r.sent,lost:r.lost,defUnits:r.defUnits,defLost:r.defLost,loot:r.loot,wall:r.wallFrom+'→'+r.wallTo}; })));
  const snapNow = await page.evaluate(c=>{ const v=window.H.villages[c]; return {inbox:Object.values(v.inbox||{}).map(e=>e.kind)}; }, bCoord);
  console.log(' 상대 inbox:', J(snapNow));
  // 반복 약탈 차단 확인: A의 OTHERS 스냅샷이 깎였는가
  await sleep(3500);
  const bAfter = await B.evaluate(()=>{ const S=window.rune(); const r=S.reports[0];
    return {troops:JSON.parse(JSON.stringify(S.v.troops)), res:JSON.parse(JSON.stringify(S.v.res)), wall:S.v.blds.wall,
      rep:r&&{type:r.type,win:r.win,from:r.from&&r.from.name,myLost:r.myLost,loot:r.loot}}; });
  console.log('\n B before:', J(bBefore));
  console.log(' B after :', J(bAfter));

  // ── 귀환 ──
  await resolveNow(A);
  console.log('\n A 귀환 후 자원:', J(await A.evaluate(()=>window.rune().v.res)), '· 남은 행군', await A.evaluate(()=>window.rune().marches.length));
  console.log(' A 병력:', J(await A.evaluate(()=>window.rune().v.troops)));

  console.log('\n=== 에러 ===', errs.length? errs.slice(0,8) : 'none');
  await browser.close();
})();
