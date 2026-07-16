// 🖤 블랙 복권 EV 시뮬 (리포 레퍼런스 · 2026-07-16)
//  - index.html BLACK_TIER 파라미터와 일치: price700·winChance0.32·happyChance0.10·happyWinChance0.01·potRate70·skulls2×-20.
//  - 다른 컴퓨터에서 팟 비율/변신·당첨 확률/상금풀을 바꿔 재조정할 때: 아래 상수만 고치고 `node 블랙복권-시뮬.mjs`.
//  - 원칙: 팟 적립률은 회수율에 그대로 +로 더해짐(구매=소각·지급=발행) → 총(일반당첨+팟+불운+강철심장) < 100% 유지 필수.
//  - 현재 검증: 기본75.4%·불운81.9%·강철심장81.2%·최악86.0% <100% (N=3백만).
const PRICE=700, POT_RATE=70, TRANSFORM=0.10, POT_WIN=0.01;
const NORM_WIN=0.32, SKULLS=2, PEN=20, PITY_CAP=20;
const POOL=[[700,45],[1000,25],[1500,15],[2500,8],[5000,4],[10000,2],[25000,0.7],[50000,0.3]];
const TOT=POOL.reduce((a,p)=>a+p[1],0);
const pick=()=>{let r=Math.random()*TOT;for(const[v,w]of POOL){if((r-=w)<=0)return v;}return 700;};
function sim(N,o={}){
  const {emblem=false,pity=false}=o;
  let spent=0,ret=0,stack=0,pot=0,pays=0,paySum=0,payMax=0,potWins=0,normWins=0;
  for(let i=0;i<N;i++){
    spent+=PRICE; pot+=POT_RATE;
    const transform=Math.random()<TRANSFORM;
    if(transform){
      // 블랙팟 티켓: 개별상금 없음. 당첨 1%면 팟 전액.
      if(Math.random()<POT_WIN){ ret+=pot; paySum+=pot; if(pot>payMax)payMax=pot; pot=0; pays++; potWins++; stack=0; }
      else { const sk=SKULLS; ret-=sk*PEN; stack=Math.min(PITY_CAP,stack+1+sk*0.5); }  // 팟 미당첨=꽝(불운 스택)
    } else {
      let win=Math.random()<NORM_WIN;
      if(!win&&pity&&stack>0&&Math.random()*100<stack)win=true;
      if(win){ let prize=pick()+(emblem?80:0); let sk=0; const smax=emblem?1:SKULLS; for(let k=0;k<smax;k++)if(Math.random()<0.5)sk++; ret+=prize-sk*PEN; normWins++; stack=0; }
      else { const sk=emblem?1:SKULLS; ret-=sk*PEN; stack=Math.min(PITY_CAP,stack+1+sk*0.5); }
    }
  }
  return {rate:ret/spent, payFreq:pays/N, avgPay:pays?paySum/pays:0, payMax, potWins, normWins};
}
const N=3_000_000, pct=r=>(r*100).toFixed(1)+'%';
console.log('=== 블랙 v2 (변신 '+(TRANSFORM*100)+'% · 변신시 당첨 '+(POT_WIN*100)+'% · 팟적립 '+POT_RATE+'G) N='+N.toLocaleString()+' ===');
const b=sim(N), p=sim(N,{pity:true}), e=sim(N,{emblem:true}), w=sim(N,{emblem:true,pity:true});
console.log('기본            : '+pct(b.rate)+`  (팟당첨 1/${Math.round(1/b.payFreq).toLocaleString()}장 · 평균팟 ${Math.round(b.avgPay).toLocaleString()}G · 최대 ${Math.round(b.payMax).toLocaleString()}G)`);
console.log('+불운 스택      : '+pct(p.rate));
console.log('+강철심장 max   : '+pct(e.rate));
console.log('최악(둘 다)     : '+pct(w.rate)+'   '+(w.rate<1?'✅ <100% 인플레불가':'❌ 재조정'));
console.log('100장 손익(기본): '+Math.round((b.rate-1)*PRICE*100).toLocaleString()+'G');
