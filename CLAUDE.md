# 무작위 총력전 아수라장 내전 (ARAM Custom Team Builder)

## 프로젝트 개요
- 롤 칼바람 내전 팀짜기 **단일 HTML 웹앱** (`index.html`)
- Firebase Realtime Database로 실시간 데이터 동기화
- GitHub Pages 배포: https://sohada2.github.io/aram/
- 저장소: https://github.com/SOHADA2/aram
- 현재 버전: v2.45.264 (🌌 **시즌2 라이브 중 2026-06-10~** — 최근: 🧸 **단짝 2차 대장정(아바타3D·LP하단레이아웃·변경가능·S2보상검증·🔒보상잠금)**(v234~264·아래 세션이력 必): 단짝=좌상단 내 아바타에 움직이는 3D(`buddy-bar-mount`·뒷배경 제거·상반신줌), LP카드 하단 레이아웃 [최근10경기 한줄(flex·정사각 해제) / ⚒️전투준비 2열=강철심장칩(실아이템아이콘+성능 우상단배지+걸작효과 초소형 세로)|시너지], **단짝 언제든 변경**(`buddySelect` 재선택 허용·챔피언별 레벨/별칭 `buddyLevels_s2`에 보존·「🔄 다른 단짝으로 변경」), S2보상검증(**LP2배권=정상**·**방어권insurance=S2 무의미**→연패보상 교체), **보상/효과 설계 미정이라 `BUDDY_REWARDS_LOCKED=true`(L31891)로 수령·효과 표시만 잠금**(선정·강화·스택누적은 유지·확정 시 false로 flip하면 한번에 활성). 직전: 🔨 **강철심장 UX 대수술 + 정산/카운트다운/로비 손질**(v224~233): 강철심장 관리 시트(내아이템 슬롯 탭→장착/강화/판매·인라인💰제거)·소비탭 강화권 탭=관리시트로(실수강화 차단)·성능N 표기·강화성공 0~5 테두리색·그리드 넘침 `minmax(0,1fr)` / ⏱️ 카운트다운 시계스큐 수정·🛠️ 팀 결성 로비 배너(`/lobby`)·⚡ 정산창 지연단축(골드 Promise.all 병렬+"정산 계산 중" 로딩). **LP 병렬화(C)=검증완료(안전)·미구현**(아래 세션이력 v224~233 참조). 직전: 🧸 **단짝 메인 통합 대장정**(v210~223): 홈 대시보드에 단짝 3D 세로패널 + 레이아웃 `[단짝 190px | 매치정보(LP+내전/막고라) 1fr]` + 패스 전체폭 아래로(`wm-home-row`/`wm-home-right`/`wm-pass-full`), **별칭(nickname)** 병행표기·편집(`buddySetNickname`/`_buddyOpenName`/`_buddyNameHtml`, 한글명=`champNamesKR`), **빈상태=챔피언7종 컬렉션→컴팩트 배너**(`_buddyHomePromptHtml` 겹친카드 부채꼴, 미보유 시 자리축소·`_hasBuddy`분기), **단짝3D 홈↔패널 공유캔버스**(`_buddy3dShow(mountId)`·가시성/30fps게이트·offsetParent), **전체모션 GLB 교체**(Idle_Base 첫애니 유지→인형뽑기 무영향, 연승=Dance·탭=Joke/Laugh), 📱**모바일**(단짝 하단배치 `display:contents`+order·스크롤 검은가림 `translateZ(0)` GPU고정), 프리뷰링크 `?buddypreview`. · 🔒 **보안 감사**(미결정): 규칙 읽기공개+쓰기`auth!=null`인데 익명인증 무료라 **사실상 누구나 전체 read/write/delete**·계정 비번없음(이름매칭)·콘솔 파괴함수 노출(`deletePlayer`/`gachaTestGrant`/`clawCompleteAll` 등). 진짜 방어=구글로그인+허용목록, 1차=입장코드+콘솔가드 — 사용자 결정 대기. 직전: 🃏 가챠 시너지 재설계+밸런스, 🔨 강철심장/시너지 대기화면 아코디언, 📖 가챠 컬렉션 북, 🪟 프로필 모달 중앙 창화. ⏭️ **성능 최적화(헥스필드 등) 일부 적용**(복권창 한정·v209) — 메인 배경 상시 헥스 최적화는 미적용. ⚠️**복권 해골감소 인플레 미해결**. 🕹️ **3D 인형뽑기 정식 오픈**(v194) + 🧸 **단짝인형 구현**(v195~201), 🎁 **일정 보상**(v202~204), ⚔️ **팀원 배너 시너지/강철심장 변경**(v205~207). 브릿지 **v1.1.35**. 상세는 아래 세션 이력 v2.45.177~223)
  - ⏳ **레벨 시스템 후속**: ① 패스를 일반/내전 포인트패스 → **S1식 퀘스트 패스(내전 전용)로 되돌리기**(미완) ② 레벨 보상량/곡선 실플레이 튜닝. 레벨 코드맵: `PLV_XP`·`calcPlayerXp`·`plvLevelFromXp`·`plvReward`·`claimPlayerLevels`·`_plvCardHtml`(패스 탭 상단). 데이터 `playerLevelClaimed_s2`. 정수: 경기당+1·상점120G 폐지(레벨업만).
- ✅ **시즌2 라이브 중** (2026-06-10~) — 아래 "시즌 2 (헥스텍/마법공학)" 섹션 + 세션이력 v2.45.38~49 필독
- (배포 앱 현재 v2.45.167: 가챠 감사추적 `gachaVerify`·복권 종류별 "내가 N회"·프로필 대시보드 리디자인·시너지 균형(신성한개입 꾸준형). in-app CHANGELOG 참조)

## 🕹️ 인형뽑기 물리 프로토타입 (WIP · 다른 컴퓨터 핸드오프) ★새 세션 필독
> **앱(index.html)과 분리된 독립 3D 물리 인형뽑기.** Poki "Lucky Claw Machine"급 자체 제작. 향후 앱 미니게임(`CLAW_ENABLED`) 대체 검토. **보상/경제 구조 아직 미정.**
- **파일**: `인형뽑기-물리-목업.html`(메인) · GLB 8종(`teemo gwen vex ekko yone neeko lux poro`, modelviewer.lol 추출, 각 ~0.5~5MB, 전부 `.gitignore` 화이트리스트) · `_clawserve.mjs`(로컬서버) · `claw.html`(배포 캐시우회 사본 — 로컬작업 중엔 미동기화, 배포 때만 cp+BUILD태그)
- **실행**: 로컬 `node _clawserve.mjs "<aram경로>"`(백그라운드) → `http://localhost:8731/` (⚠️ `file://`은 CORS로 GLB 못 부름 → 반드시 http). 배포본 `https://sohada2.github.io/aram/인형뽑기-물리-목업.html`
- **스택**: three.js 0.160 + **cannon-es 0.20** + GLTFLoader/SkeletonUtils/RoomEnvironment. importmap·CDN(jsdelivr).
- **현재 BUILD 143** (HUD `BUILD N` pill로 확인 — 상단 정보 pill은 숨김, `#build-pill`만 노출). 최근: BUILD142=실게임(ENF) 리셋버튼 숨김, BUILD143=5번째 플레이 집기 먹통 수정(`updDailyHud`가 게임 진행 중엔 집기버튼 항상 활성). 매 수정 BUILD +1 + 인라인 `<script type=module>` 추출해 `node --check`(임시 .mjs) 검증 후에만 커밋. **푸시**: 그 세션의 작업브랜치(이름은 세션마다 다름, 예전엔 `claude/project-overview-skvq0h`·이번 세션은 `claude/work-from-another-computer-dq72u4`)에 커밋 후 `git push origin HEAD:main` + `HEAD:<작업브랜치>` 둘 다(Pages 자동배포 1~3분, 모바일 캐시 강함 → 시크릿/새탭). `claw.html`=캐시우회 사본(매 빌드 `cp` 후 `sed`로 `BUILD N · claw` 태그 — **소스+claw.html 둘 다 수정 필수**). 한글 커밋=heredoc UTF-8.
- **🖥️ 앱 통합(실험·v2.45.176)**: index.html 가챠 컬렉션 **3성 탭에서 프리즘 18종 완성(`_allPrismDone`) 시** 카드를 트럼프식 부채꼴 덱(`_prismDeckHtml`/`.prism-deck`)으로 묶고 「🕹️ 인형뽑기 테스트 참여하기」 버튼 노출 → `window.openClawTest3D()`가 **앱 안 "브라우저 창" 모달**(타이틀바+가짜주소창+최소화/최대화/닫기, `claw.html?embed=ts` iframe)로 띄움. **프리뷰**: URL `?prismdeck` 또는 콘솔 `prismDeckPreview()`(실데이터 무수정). ⚙️ 보상·경제 미연동(런칭 아님). 창 크기 dvh 기반(모바일 100vh 버그 회피).
- **🏟️ 배경**: 뒤편 아케이드는 **납작한 canvas 그림 평면**(z=-52, `buildArcadeBackdrop`)으로 함 — 3D 기계를 뒤에 두면 메인 **투명 뒷유리로 비쳐 "캐비닛 안"처럼 보이는 근본문제** 때문(거리로 안 풀림). 안개 `Fog(42,150)`·카메라 far 240. 뒤편 다른 기계 추가 시 평면 그림만 수정.
- **🎁 경품(`PRIZE_FILES` {file,target,dud,count})**: 8종 — **포로 20마리(`dud:true`=꽝, target 1.54)** + 챔피언 7종 각 1(target 2.89) = 27. **포로 골인=`showResult('포로다! 🐾')`**(획득·트로피·폭죽 X, 빨강 아님). `proto.dud` 분기.
- **🧸 모델 처리(로드 콜백)**: 스킨드 GLB → 재질 컷아웃 + `bakeStatic`(정적 측정/트로피용) + 통 안 시각=`skeletonClone`+`AnimationMixer`(`Idle_Base`). **⚠️ 아이들 애니는 평소 정지(스폰 시 랜덤 포즈로 굳음=더미느낌), 집힌 인형(`p===held`)만 `mixer.update(dt*1.5)`로 살아나 꿈틀**. proto에 `vr`(시각반지름=최장축½) 저장.
- **🟢 콜라이더**: `COLLIDER_SHAPE='cyl'`(원기둥 Y직립). 반지름 = footprint × `COLLIDER_R`(**0.63**). 인형별 `p.cr`·`p.clamp` 저장. 디버그 박스 3플래그(전부 false): `DEBUG_COLLIDER`/`DEBUG_PRONG`/`DEBUG_GRAB`.
- **🦾 잡기=물리 접촉식**(`GRAB_PHYSICAL=true`): 집게발 prong 바디(그룹4)가 인형(그룹2)에 `collide`로 닿은 걸 `_prongTouch`에 수집 → 하강 중 닿으면 `_lowerContactY`서 `PRONG_SINK`(0.6) 더 박고 CLOSING. `mostTouchedPrize()`로 대상·`setProngIgnore`(mask -13)로 그 인형만 안 밀침 → `LockConstraint`. grabQ=닿은 발수.
- **🖐 집게 디자인/관절**: 손목 관절 `clawPivot`(트롤리 바로 아래 고정, 케이블 수직) 아래 `clawGroup`이 `JOINT_H`(0.48) 매달려 **2축 스프링 진자**(`thetaX/thetaZ`, 이동 반대로 처지고 멈추면 출렁). 손바닥=얇은 판+돔+황동칼라. 손가락=2마디(뿌리관절+너클) **발톱이 중심서 만나 멈춤**: `BASE_OPEN/CLOSED`·`KNUCK_OPEN/CLOSED`·`CLOSE_MIN`(0)으로 `setFingerOpen(t)`.
- **📐 높이/구멍/벽**: `CLAW_TOP_Y`6.4·`GANTRY_Y`7.35(원형 파이프 레일)·`CLAW_DROP_Y`**1.2**(헛집음 시 바닥관통 방지). 출구=세로 직사각 `HOLE_RX`0.95/`HOLE_RZ`1.25, **경품 출고 도어를 `HOME.x`(구멍)에 정렬**. 벽 클램프 인형별 `p.clamp=min(2.7, BX-vr·0.92)`(가분수 유리뚫음 방지). 입구 머리 오버행 apron. world `allowSleep`.
- **🔊 효과음**(WebAudio, 첫 입력 unlock — `Sfx`): 버튼·시점·하강·**모터험**·**이동험**·집게닫힘/열림·잡힘/헛집음·미끄러짐·획득팡파레+폭죽·꽝부저·틱·자동집기경보. **🎛️ 이동속도 `JOY_SPEED`(2.8)**.
- **⏱️ 자동 집기**: READY 후 `AUTO_DROP_MS`(30초) 자동 하강(HUD ⏱·마지막5초 펄스+틱). **일일제한 `ENFORCE_DAILY_LIMIT=false`(테스트 OFF)** → `true`면 `DAILY_MAX`(10)/일.
- **🎛️ 조작**: PC WASD/방향키·Space·R·Q/E + 모바일 조이스틱/버튼. **터치(`body.is-touch`)=안내문·키힌트 숨김+조작바 슬림**. 🪧 좌우 측면 간판. 카메라 핏 `fitW`10.3/`baseFitH`17.8(가까이).
- **🎉 골인 연출**: `fireConfetti()` + 챔피언 `awardTrophy`(클로즈업→`TSHELF`). **획득 즉시 회수**(`p.collected`, 데이터훅 지점).
- **🎯 컬렉션 게임화 (BUILD 131~133 구현)**: 2단계 콘텐츠. 통=챔피언 7종(각1)+포로20.
  - **[1단계·구현]** 포로 제외 챔피언 7종 수집(localStorage `claw_collected`, 영구). checkHole: 포로=꽝·이미수집=중복꽝·새챔=수집(`proto.file` 식별). 7종 완성→`_onCollectionComplete`(배너). 테스트 `resetCollection()`.
  - **[상단 컬렉션 패널·BUILD132]** `#collection-bar`(최상단): 7칸, 수집=ddragon 초상화(`.../cdn/img/champion/loading/{Key}_0.jpg`, `_ddKey`=파일명 첫글자 대문자), 미수집=잠금"?". `renderCollectionBar`(updColl·init서 호출). 3D 선반(`_loadCollectionTrophies`/`TROPHY_MAX=7`)은 디테일로 유지. HUD pill은 `top:48px`로 내림(정보 pill 숨김상태라 패널이 주 UI).
  - **[🪙 코인 경제·BUILD133]** localStorage `claw_coins{coins,date,plays}`. 하루 +5코인 누적(`DAILY_GRANT`, 미접속 최대7일치 소급). `canPlay()`: 개발(`ENFORCE_DAILY_LIMIT=false`)=∞·코인미소모 / 1단계=하루5회(`DAILY_MAX`)+코인 / 2단계(컬렉션완성 `_collComplete`)=횟수무제한·코인만. tryDrop서 `coins--`/`playsUsed++`(ENFORCE시만). 패널 `#cb-info`에 🪙·상태. 테스트 `addCoins(n)`/`resetPlays()`. **출시 시 `ENFORCE_DAILY_LIMIT=true`.** **(BUILD137)** 코인소모를 집기→**START 버튼**으로 이전: 상태 `IDLE`(정지·`#controls.idle`서 START만)↔`READY`. `startGame()`서 코인 1소모→READY(이동+집기 1회)→집기 끝(RELEASE)나면 `IDLE` 복귀(코인 헛소모 방지). 동전 모션 `_coinDropFx`/`#coin-fx`+`Sfx.coin`, 시작 BGM `_bgmStart`(아르페지오 루프). `placeCamera` topI에 `#collection-bar` 높이 더해 간판 안 가림.
  - **[2단계·구현됨 v195~201]** 완성→**단짝인형** 1종 선택(변경불가)→그 인형 뽑을 때마다 강화(확률·3D연출) + **연승/연패 스택 능력**(내전 연승중=연승스택↑·연패중=연패스택↑·번갈면 리셋·원할 때 수령=스택0+보상=예측도박). 경기 자동연동·역추적 로그. 상세=세션이력 v195~207.
  - **[2단계 보상 명세·확정(S1 286경기 달성률 보정)]** 스택N 연장확률 ≈50%/스택(동전던지기), **3→4가 난이도 절벽(런중도달 27%→11%)**, 7은 ~1%(대부분 시즌 내내 못 봄). 단조증가·완만곡선(정수는 7 전용):
    - 🟢연승(스펙업): 2=🪙150 / 3=안정강화권×2+🪙100 / 4=골드복권×1+정밀강화권×1 / 5=과부하강화권×1+골드복권×1 / 6=프리즘복권×1+과부하강화권×1 / 7=걸작의정수×2+프리즘복권×1 (골드환산 150→180→300→450→650→900)
    - 🔴연패(LP회복·골드아님): 2=🪙150 / 3=패배방어권×1 / 4=LP2배권×1 / 5=방어권+LP2배권 / 6+=LP2배권×2+방어권 (깊이 질수록 반등도구↑)
  - 아이템 골드값 참고: 강화권 안정40·정밀100·과부하250 / 복권 실버70·골드200·프리즘400 / 정수250.
  - **[2단계 단짝인형 강화 명세·확정]** 7종 완성→**단짝 1종 선정**(⚠️"한 번 정하면 변경불가" 경고·1개만)→첫 능력=위 연승/연패 스택 보상 작동→인형뽑기서 **내 단짝 뽑을 때마다 강화 1회 시도**.
    - **레벨업=시도식 확률**(단짝 1개=1시도, 성공=Lv+1·실패=소모): Lv1→2 **30%** / 2→3 **20%** / 3→4 **15%** / 4→5 **10%**. 만렙 Lv5 평균 **~25개**. (불운방지 약한 천장=N연속 실패 시 다음 100% 추가 가능). 2단계 통은 단짝 출현율 ~1/6(단짝+포로 위주, 나머지 6종 빠짐)으로 ≈한 달.
    - **강화 효과(% 안 씀=아이템·LP도 정수연산)**: Lv2 💰골드 보너스(수령 시 +스택×25G) / Lv3 🛡안전망(스택 끊기면 **두 단계 아래** 보상 묶음 자동수령·3스택↓ 끊김은 없음) / Lv4 🎁덤(수령 시 20% 확률 보상 한 번 더) / Lv5 👑만개(덤 35% + 골드보너스 2배 스택×50G). ※% 곱셈 금지(강화권/복권/정수/방어권/LP2배권 이산이라).
    - **🔍 역추적 schema(필수 — 보상·업그레이드 전부 로그, 앱 신뢰모델+데이터손실 교훈)**: `/gold/{key}` — `buddy_s2{champion,level,selectedAt,pulls}` · `buddyUpgradeLog_s2[{at,fromLv,toLv,success,rate}]`(강화 시도 전부·성공실패·그시점 확률) · `buddyClaimLog_s2[{at,type,stack,lv,reward:{gold,tickets,scratch,essence,lp2x,insurance},bonusGold,dumDup}]`(스택 보상 수령=**실제 지급 결과 스냅샷**) · `buddyStreak_s2{type,count,lastTs}`(현재 스택). 원칙=**delta 아닌 결과 스냅샷**(emblemEffects/synergyEffects처럼 역산·감사 가능).
    - **구현 완료 (v2.45.195~201)**: 백엔드+UI+자동연동+강화 3D연출(`_showUpgradeFx`)+정보패널(`_buddyLvListHtml`)+프리뷰(`buddyUpgradePreview`/`buddyPanelPreview`). 코드맵(index.html, `_prismClawHtml` 부근 ~L31206대): 백엔드 `BUDDY_WIN/LOSS_REWARDS`·`BUDDY_UP_RATE`·`buddySelect`·`_buddyUpgradeAttempt`·`_buddyOnPull`·`_buddyGrant`·`buddyClaim`·`_buddyOnMatch` / UI `_buddyOpenSelect`(7종완성 선정·변경불가 confirm)·`_buddyOpenPanel`(스택+수령)·`_buddyEntryHtml`(입구 버튼)·`_injectBuddyCss` / 자동연동 `_buddyProcessMatches`(매치 리스너 L12168서 호출, 내 S2 참가매치 미처리분 시간순 스택 반영, `buddyLastMatchTs_s2`로 중복방지). 브릿지: 프로토타입 checkHole `_postParent('pull',{champion})`·`_onCollectionComplete`→`_postParent('complete')`, 앱 onClawMsg서 `pull`→`_buddyOnPull`·`complete`→`_buddyMaybePrompt`. 보상 지급=기존 필드(골드 goldBonusLegacy_s2·강화권 emblemTickets·복권 freeScratch·정수 emblemEssence·LP2배권/방어권 items push). 콘솔 `buddySelect/buddyMatch/buddyClaim/buddyState/buddyReset`.
    - **⚠️ 미검증/주의**: ① 7종 완성자 아직 없어 **실기기 미검증**(브라우저 postMessage·UI 못 돌려봄) ② 연패 보상 LP2배권/방어권(items push)이 **S2 LP에서 실제 작동하는지 확인 필요**(S0/S1 아이템) ③ `_buddyOnMatch` 안전망 자동지급=자기 기기서만(per-client). 다음=실기기 검증 후 튜닝.
- **🖥️ 앱 통합 정식 오픈 (v2.45.194·BUILD134)**: 3D 인형뽑기를 앱(index.html)에 iframe(`openClawTest3D`→`claw.html?embed=`)으로 띄우고 **postMessage 브릿지 + Firebase** 연동. **해금=가챠 프리즘 ★★★ 18종 완성(`_allPrismDone`)** → 컬렉션 3성탭 `_prismClawHtml` 「🕹️ 인형뽑기 하러 가기」.
  - **브릿지**: 프로토타입에 `EMBED`(=`?embed`)·`_postParent`·`ENF`(임베드면 코인경제 강제). 앱→iframe `init{collected,coins,plays,eligible}` / iframe→앱 `ready`·`save{...}`. 임베드 시 `_saveCollected`/`_saveCoins`가 localStorage 대신 parent로 post. 앱쪽 `_claw3dInit`(읽기+오픈기념)·`_claw3dSave`·`openClawTest3D` 메시지 리스너(L31169대).
  - **Firebase(sField)**: `clawCollected_s2`(수집 file배열)·`clawCoins_s2`·`clawPlays_s2`·`clawPlayDate_s2`(1단계 일일횟수 리셋용)·`clawLaunchBonus_s2`(오픈기념 5코인 1회 플래그).
  - **🪙 코인=출석 지급**(`doBingoAttendance` L20064대): 자격자에게 **오전+2·오후+3=하루5**(누적). 출석 보상팝업에 "🕹️ 인형뽑기 코인" 표시. **오픈기념 5코인**=자격자 첫 진입(`_claw3dInit`)에서 1회.
  - **테스트 콘솔**: `openClawTest3D()`(게이트무시 오픈)·`claw3dGrant(n)`(코인 강제충전)·`claw3dReset()`(claw데이터 초기화). ⚠️ iframe 콘솔 `addCoins()` 어뷰즈 가능(앱 신뢰모델상 골드와 동일, 서버검증=향후).
- **다음 작업/미결정**: ① 컬렉션 **2단계(반려인형+연승/연패 스택, 보상명세 위 확정)** 구현 ② 비자격 콘솔오픈 잠금안내문 ③ 27마리 성능·모바일 iframe GLB로딩 ④ 코인/수집 서버검증.

## 🃏 가챠 시너지 재설계 (v2.45.178 구현·배포 완료) ★다른 컴퓨터 핸드오프
> S1 실데이터(286경기·승/패 각 1069표본)로 ≈50% 보정한 시너지 **조건 개편 — 구현 완료**. "거의 무조건 발동"을 다양한 스탯 조건으로. 연승/연패 제거. 보상 LP는 구성종류별 균등(2종 +1/+2·3종 +2/+3·4종 +3/+4, **1LP≈40G**). **조건은 "긍정 효과(승리·방어)"에만 걸고, 패배 위로금·도박 패널티는 무조건.**
- **구현 위치**: 평가기 `synCondMet`/`_synStat`(GACHA_SYNERGY_GROUPS 바로 위, 호이스팅) · 발동계산부 조건분기(~16848, `condSide = lp_block ? !won : won`) · `GACHA_SYNERGY_GROUPS`(~30761) · 효과설명 `_synEffTxt`(~30672) · **대기화면 시너지 변경 아코디언**(`renderS1WaitingCard`의 synBody + `equipSynFromMain`·`_ownedSynergyList`(~31360) + `.wm-syn-*` CSS(~1665)). cond 형식: `{stat,min,label}` / 파생 `stat:'kda'|'ka'` / 복합 `{all:[...],label}`. 적용 체인(LP/골드)은 무수정(eff.procced가 "작동쪽 조건"만 반영하게 설계).
- **확정 조건·보상 (2성/3성, 달성률=S1 실측)**:

  | 시너지(sid) | 스탯 조건(달성률) | 2성★★(30%발동) | 3성★★★(50%발동) |
  |---|---|---|---|
  | 검을 뽑아라(warrior) | 킬 8+ 승리(46%) | +2 LP | +3 LP |
  | 탄환 세례(marksman) | 딜량 25,000+ 승리(51%) | +2 LP | +3 LP |
  | 그림자 주자(assassin) | 킬6+ & 데스4+ 승리(58%) | +2 LP | +3 LP |
  | 검무(ionia) | KDA 4.0+ 승리(52%) | +1 LP | +2 LP |
  | 나는 왕이다(shurima) | 킬+어시 23+ 승리(50%) | +3 LP | +4 LP |
  | 강철 심장(tank) | 데스 8+ 패배(52%) | LP 2 방어 +골드 40 | LP 3 방어 +골드 40 |
  | 여명의 의지(demacia) | KDA 2.2+ 패배(49%) | LP 2 방어 | LP 3 방어 |
  | 해적의 보물(bilgewater) | 골드 14,000+ 승리(54%) | 40 G | 60 G |
  | 신성한 개입(support) | 어시 15+ 승리(51%) | 승 40G / 패 위로금 15G | 승 60G / 패 위로금 25G |
  | 유레카(mage) | 딜량 25,000+(51%) | 승 +5 / 패 −6 LP | 승 +6 / 패 −6 LP | (v2.45.187 하향 — 기존 +8/+10·−8이 타 시너지 대비 아웃라이어)
  | 공허 균열(void) | 패배(도박) | 전액 방어 / 실패 −6 | 전액 방어 / 실패 −10 | (v2.45.188 — 실패 −4는 3성 EV +2.5LP/판으로 broken이라 −10으로, +1LP/판 정상화. 2성 −6은 EV 0 공정)

- **미결정 3개 모두 해결됨**: ①신성한 개입 위로금=무조건(조건은 승리쪽만) ②유레카 패배 −8=무조건 ③해적의 보물=골드 14,000+ 조건으로 차별화. **MVP는 폐기**(발동이 "경기 저장" 시점=MVP 투표 전이라 불가, sq_mvp 퀘스트도 "다음 매치 보류"로 처리 중 → 나는 왕이다=킬+어시 23+로 대체).
- **남은 확인(다음 세션)**: ① 실경기에서 발동·정산창 "○○ 미달" 라벨 실제 표시 테스트 ② 대기화면 아코디언 모바일 동작/레이아웃 ③ 멀티킬(double/triple…)은 데이터 전부 0이라 조건 불가(참고). 데이터 산출=`<DB>/matches.json` REST로 S1 participants 분포 분석.

## 기술 스택
- **순수 HTML/CSS/JS** (프레임워크·빌드 없음, 파일 1개)
- **Firebase**: firebase-app, firebase-database (CDN v11.0.0)
- **폰트**: Noto Sans KR, Black Han Sans (Google Fonts)
- **배포**: GitHub Pages (main 브랜치 자동 배포)

## Firebase 데이터 구조
```
/players/{key}
  name: string
  manualTier: string | null     // null이면 승점 자동 계산
  champTier1: string[]          // 1군 챔프 클래스 ID 배열
  champTier2: string[]          // 2군 챔프 클래스 ID 배열
  motto: string                 // 한마디 (최대 20자)

/session
  active: boolean               // 현재 팀이 구성된 상태인지 여부
  teamA: string[]               // 1팀 이름 배열
  teamB: string[]               // 2팀 이름 배열
  teamSize: number
  mode: 'balance' | 'random'
  isEventMatch: boolean
  spectator: string | null      // 관전자 이름 (단일, 하위 호환)
  spectators: string[] | null   // 전체 관전자 목록 (v2.32.2~, 11명 이상 시 다수)
  spectatorPick: string | null  // 첫 번째 관전자 예측 (하위 호환)
  spectatorPicks: { [normName]: string } | null  // 다중 관전자 각자 예측
  spectatorBets:  { [normName]: number } | null  // 관전자 베팅 금액 (v2.36.11~, 30/50/80/100)
  spectatorPickStartAt: number  // 예측 모달 시작 시각
  magollaMatchId: string | null // 활성 막고라 매치 ID (v2.39.0~) — 모든 기기에 막고라 모달 전파용
  // onValue로 모든 기기에 실시간 동기화됨 (일반 매치만, 이벤트 매치는 제외)

/matches/{key}
  date: string
  timestamp: number
  teamA: string[]               // 1팀(블루) 이름 배열
  teamB: string[]               // 2팀(레드) 이름 배열
  winner: 'blue' | 'red'
  mode: 'balance' | 'random'
  size: number
  season: number                // 경기 시즌 (v2.29.x~)
  itemEffects: { [playerNormName]: string[] }  // 사용된 아이템 효과
  gameTime: number              // 게임 시간(초) — 브릿지 v1.1.6 자동 수집
  participants: { [normName]: {  // 브릿지 자동 수집 플레이어 상세
    champion, kills, deaths, assists, damage, gold, cs,
    items: number[],            // 아이템 ID 배열 (0 제외)
    augments: number[],         // ARAM 증강 ID 배열
    doubleKills, tripleKills, quadraKills, pentaKills: number,
    firstBlood: boolean
  } }
  spectatorPicks: { [normName]: { pick: 'blue'|'red', correct: boolean, betAmount?: number, payout?: number } }
                                  // 다중 관전자 예측 (v2.32.2~), 베팅 시스템 (v2.36.11~ — betAmount/payout 추가)
                                  // payout: 적중 시 +betAmount / 실패 시 -betAmount
                                  // 자동 픽(betAmount=0): 적중 시 +30G 보너스 / 실패 0 (v2.36.12~)
  synergyEffects: { [normName]: { sid, tier, effType, procced, lpDelta?, goldDelta?, streak? } }
                                  // 가챠 시너지 발동 기록 (v2.43.153~) — lpDelta=적용 LP 순델타(역산용)
  emblemEffects: { [normName]: { power, lines, matchG, winG, mvpG, winLP, lossLP } }
                                  // 🔨 강철심장 걸작 스냅샷 (v2.44.51, S2) — 그 경기 시점 걸작·효과값 박제(역산/감사용).
                                  // 순수 기록(골드/LP 적용 방식 불변). 적용조건=winner/mvpWinner/mvpLoser로 판정
  secretQuests: { [normName]: { questId, questName, questDiff, questIcon, questDesc, success, won, reward, lpProtect } }
                                  // 비밀 퀘스트 토큰 (v2.43.39~) — 토큰 보유자만 저장됨
                                  // success+won=true 시 reward 골드 지급
                                  // success+won=false 시 lpProtect 만큼 LP 차감 완화 (본인 뉴비/도박권 시 비활성)
  // 하위 호환: spectatorName, spectatorPick, spectatorCorrect (단일 관전자 레거시)

/gold/{key}
  name: string
  gold: number                  // 보유 골드 (시즌 0 레거시)
  items: array                  // 보유 아이템 (시즌 0)
  gold_s1, items_s1, goldSpent_s1 ...  // 시즌 N 필드 (sField() 로 접근)
  retroApplied: boolean         // 소급 계산 완료 여부
  goldMigV2: boolean            // S0 마이그레이션 재실행 방지 가드 (v2.32.0~)
  goldBonusLegacy: number       // 구버전 goldBonus 리네임 (v2.34.x~, migrateGoldBonusToLegacy() 자동 실행)
  goldBonusLegacy_s1: number    // S1용 구버전 goldBonus_s1 리네임
  attendanceHistory: array      // 출석 이벤트 배열 { date, gold, ts } (v2.34.x~, 기존 goldBonus 대체)
  lastAttendance: string        // 마지막 출석 날짜 (YYYY-MM-DD)
  attendanceCount: number       // 누적 출석 횟수
  lotteryHistory: array         // 복권 구매·당첨 이력 (v2.31.98~) — 프리미엄은 premium:true 플래그
  lotteryCount: number          // 오늘 복권 구매 횟수 (lotteryDate 날짜 기준 리셋, 1일 10장 한도 v2.37.13~)
  lotteryDate: string           // lotteryCount 기준 날짜 (YYYY-MM-DD)
  lotteryPremiumCount: number   // 오늘 프리미엄 복권 구매 횟수 (v2.36.0~, 1일 3장 한도 v2.37.13~)
  lotteryPremiumDate: string    // lotteryPremiumCount 기준 날짜
  lotteryRefundApplied: boolean // 구버전 복권 환불 완료 플래그 (v2.31.99~)
  secretQuestCount: number      // 오늘 비밀 퀘스트 토큰 구매 횟수 (1일 2회 한도, v2.43.39~)
  secretQuestDate: string       // secretQuestCount 기준 날짜 (YYYY-MM-DD)

/config/currentSeason            // 현재 시즌 번호 (0 또는 1)
/config/riotApiKey               // Riot API Key (24h 갱신)
/config/liveOwner                // 라이브 모드 단일 소유권 (v2.31.20~)
  deviceId, label, startedAt, heartbeatAt

/season1/players/{normName}      // 시즌 1 전용 LP·티어 상태
  tier: 'unranked'|'bronze'|...|'challenger'
  lp: number
  placementGames, placementWins, placementDone
  promoActive, promoWins, promoLosses, promoGamesPlayed
```

## 탭 구성 (5탭)
1. **⚔️ 팀구성** — 참가자 선택 → 팀 설정 → 결과 → 경기 저장
2. **📋 기록** — 전체 매치 히스토리
3. **🏆 랭킹** — 승점 기반 티어, 프로필 모달 포함
4. **🛒 상점** — 골드로 아이템 구매, 내 아이템 관리
5. **🏅 업적** — 업적 달성 및 골드 보상 수령 (라이브용 계정에선 미표시)

## 티어 / 승점 시스템 (v1.8.8 기준)
- 기존 승률% 방식 → **MMR 승점 방식**으로 전면 개편
- 시작 500pt, 상한 1000pt, 하한 0pt
- 승리: **+10pt**, 패배: **-7pt**
- 아이템 `score2x` 사용 시 승리 +20pt, `insurance` 사용 시 패배 감점 없음
- **신뢰도 가중치**: `score = raw * (total/(total+10)) + 500 * (10/(total+10))`
  → 판수 적을수록 500점에 수렴
- 최소 **3판** 이상이어야 티어 부여

| 티어 | 점수 |
|------|------|
| 챌린저 | 850↑ |
| 그마 | 780↑ |
| 마스터 | 720↑ |
| 다이아 | 660↑ |
| 에메랄드 | 600↑ |
| 플래티넘 | 540↑ |
| 골드 | 480↑ |
| 실버 | 420↑ |
| 브론즈 | 360↑ |
| 아이언 | 그 외 |

## 매치 타입
- **일반 매치**: 티어 반영, 3:3 / 4:4 / 5:5, 밸런스 or 랜덤
- **이벤트 매치**: 티어 미반영, 인원 자유 (1팀/2팀 개별 설정), 저장 안 됨, 인원 많은 팀에서 핸디캡 담당자 랜덤 선정

## 골드 & 아이템 시스템
- 경기 결과에 따라 골드 자동 지급: 승리 **+15G**, 패배 **+5G**
- **출석 체크**: 하루 1회, **+30G** 지급 (패스/업적 탭 상단 카드 — 완료 시 카드 자동 숨김, 다음 날 재표시)
  - Firebase `/gold/{key}.attendanceHistory` 배열에 `{ date, gold, ts }` 이벤트 기록 (v2.34.x~)
    - 구버전 `goldBonus` → `goldBonusLegacy` 로 마이그레이션됨 (`migrateGoldBonusToLegacy()` 앱 로드 시 자동 실행)
  - `/gold/{key}.lastAttendance` (YYYY-MM-DD) 로 당일 중복 방지
  - 날짜 기준: **로컬 시간** (`getLocalDateKey()`)
- **골드 계산 통합 함수**: `calcPlayerGoldEarned(name, data)` — 경기 + goldBonusLegacy + 출석(attendanceHistory) + 업적 + 패스 + 복권 합산
  - `getMyGold()` = `calcPlayerGoldEarned(myName, myData) - goldSpent`
  - **주의**: `calcGoldFromMatches(name)` 만 쓰면 출석·업적·패스·복권 누락 → 반드시 `calcPlayerGoldEarned` 사용
- 기존 경기 기록 기반 소급 계산 자동 적용 (`retroApplied`)

## 골드 상수 버전 관리 (v2.25.0~)
- **goldVersion 필드**: 매치 데이터에 저장 — v2.25.0 이상 경기는 `goldVersion: 2`
- **MVP/SVP**: `goldVersion >= 2` → 50G / 구버전 → 10G (소급 방지)
- **관전자 적중**: `goldVersion >= 2` → 50G / 구버전 → 15G (소급 방지)
- **매너왕**: `goldVersion >= 2` 경기에만 존재, 항상 50G
- 골드 점검 시 `GOLD_MVP_LEGACY`, `GOLD_SPECTATOR_CORRECT_LEGACY` 상수 확인 필요

## 매너왕 시스템 (v2.25.2~)
- **MVP 투표 카드에 통합** — MVP·SVP·매너왕을 한 카드에서 동시에 투표
- **팀별 2인 선정**: 상대팀에서 MVP 1명 + 매너왕 1명 선택 (MVP와 매너왕은 다른 사람도 가능)
  - teamA 플레이어 → teamB에서 MVP 1명, 매너왕 1명 선택
  - teamB 플레이어 → teamA에서 MVP 1명, 매너왕 1명 선택
- **저장 조건**: MVP와 매너왕 투표 모두 완료(또는 건너뛰기)해야 저장 활성화
- **Firebase**: `session/manner/teamAVotes/{fbKey}: name` / `session/manner/teamBVotes/{fbKey}: name` / `session/manner/confirmed: { teamAManner, teamBManner }`
- **Match 저장**: `matches/{key}.mannerWinner` (승리팀 매너왕), `matches/{key}.mannerLoser` (패배팀 매너왕)
- **레거시 호환**: `matches/{key}.mannerKing` (v2.25.1 이하) — `calcGoldFromMatches()`에서 계속 지원
- **골드**: 선정자 각각 +50G (`GOLD_MANNER`)

| 아이템 | 가격 | 효과 | 시즌 |
|--------|------|------|------|
| ⚡ 승점 2배권 | 80G | 경기 전 활성화 → 승리 시 +20pt | S0 |
| 🛡️ 패배 방어권 | 60G | 경기 전 활성화 → 패배해도 감점 없음 | S0 |
| 🛡️ 승급전 방어권 | 100G | 승급전 중 패배 시 해당 판 기록 제외 · 승리 시 정상 기록 | S1 |
| ⚔️ 승급전 승리권 | 100G | 승급전 중 승리 시 2승 처리(즉시 승급) · 패배 시 1패 정상 | S1 |
| 🎲 도박권 | 60G | 일반전 전용 · 승리 +40 LP / 패배 −30 LP (승급전 중 사용 불가) | S1 |
| 🎟️ 골드 복권 | 30G | 즉시 결과 · 1일 10장 한도 · 꽝 30%~잭팟 500G 1% (EV ≈ 32G) | S1 |
| 💎 프리미엄 복권 | 200G | 즉시 결과 · **1일 3장** 한도 · 꽝 40%~메가잭팟 5000G 1% (EV ≈ 196G, 상위권 골드 흡수용) | S1 |
| 🤫 비밀 퀘스트 토큰 | 200G | 구매 즉시 자동 활성화(v2.43.47~) · 다음 정규전에 본인만 보이는 비밀 퀘스트 · 적중+승리 +500~1000G · 적중+패배 LP 감소 완화 · 1일 2회 · 매치당 1회 | S1 |
| 🎫 일반 복권 | 100G | 스크래치 5칸 · 꽝 32% · 클로버 50G~왕관 800G · 한도 없음 (v2.43.91~) | S1 |
| 🎫 고급 복권 | 300G | 스크래치 6칸 · 해골 1개 완전공개 시 -200G 패널티 · 클로버 180G~왕관 3500G | S1 |
| 🎫 프리미엄 복권 | 600G | 스크래치 7칸 · 해골 2개 (각 -400G) · 클로버 500G~왕관 10000G · 레이어 4중 | S1 |
| 🪙 긁기 동전 | 200G | **영구 소유** · 모든 복권 브러시 크기 2배 자동 적용 (v2.43.96~) | S1 |
| 🔑 만능 긁개 | 500G | **영구 소유** · 브러시 3배 + 레이어 공개 임계값 55%→35% 완화 (v2.43.96~) | S1 |

- 팀 구성 완료 후 **아이템 잠금** (경기 저장 시 자동 해제)
- 아이템 사용 통계: `calcItemStats(name)` — `matches[].itemEffects[normName]` 스캔
  - `score2xWin`: 2배권 사용 후 승리 횟수
  - `insuranceUsed`: 방어권 사용 후 패배(감점 막기) 횟수

### 상점 UI 패턴 (v2.34.1~)
- **보유 개수 배지**: 상점 목록(좌)에서 제거 → 내 아이템 슬롯(우) 좌상단에 황금빛 배지 `.inv-count-badge` 로 표시 ("N개")
  - 동일 아이템 타입의 총 보유 개수를 모든 슬롯에 표시
- **복권 한도 소진**: `lotteryCount >= 3` 이면 구매 버튼 → "한도 소진" 비활성 표시 (`.sli-price.sli-limit-hit`)
  - `renderShop()` 에서 `todayLotteryCount` 계산 후 버튼 분기 처리
- **계정 전환 토스트**: `selectMyName()` 에서 `calcPlayerGoldEarned(name, existData)` 사용 (구버전은 `calcGoldFromMatches`만 써서 출석·업적·패스·복권 누락됐었음)

## 매칭 퀘스트 시스템 (v2.5.0)
- **발동 조건**: 팀 구성에 TOP3 플레이어(3판 이상) 포함 시 15% 확률 (`QUEST_TRIGGER_RATE`)
- **발동 우선순위**: 여러 TOP3 포함 시 가장 높은 랭크(1등 우선) 퀘스트 발동
- **퀘스트 종류** (`QUEST_CONFIGS`): 1등 우선, 없으면 2등, 없으면 3등 순으로 탐색
  | 랭크 | 이름 | 상금 | 본인 패배 추가 감점 |
  |------|------|------|-----------------|
  | 1등 | 👑 왕관의 무게 | +100G | -10pt |
  | 2등 | ⚔️ 역전의 기회 | +80G | -8pt |
  | 3등 | 🚀 기회의 도약 | +50G | -5pt |
- **효과**: 승리팀 전원 상금 / 패배팀 전원 골드 없음 + 해당 플레이어 본인 추가 감점
- **상금은 독립**: MVP·뉴비·아이템 등 다른 골드 이벤트와 연산 없음
- **팝업**: 팀 구성 완료 0.7초 후 `.quest-overlay` 모달로 표시
- **저장**: `matches/{key}.questEvent` — `{ playerName, rank, bonusGold, lossExtraPt }`
- **골드 계산**: `calcGoldFromMatches()` — questEvent 있으면 일반 골드 대신 bonusGold(승)/0(패)
- **승점 계산**: `calcScore()` — 해당 플레이어 패배 시 normal loss 후 추가 lossExtraPt 감점
- **상태 변수**: `questEventState` — 팀 구성~저장 완료 사이에만 유지, 저장 후 null 초기화

## 시즌 시스템 (v2.29.x~, 시즌 1 LP v2.30.0~)
- **시즌 전환**: Firebase `/config/currentSeason` 값으로 제어 (0 또는 1)
  - 라이브 계정 푸터의 **시즌 어드민 토글**로 전환 (v2.30.1)
  - `CURRENT_SEASON` 전역 변수, 앱 기동 시 onValue 실시간 수신
- **시즌별 Firebase 필드**: `sField(field)` 헬퍼 — 시즌 0은 기존 필드명 유지, 이후 `_s1`, `_s2` suffix
  - 예: `items` (S0) / `items_s1` (S1), `goldSpent` / `goldSpent_s1`
- **매치 저장**: `matches/{key}.season` 필드에 해당 경기의 시즌 기록
- **랭킹/기록 탭 시즌 드롭다운**: 과거 시즌 기록 조회 (`viewSeason` 상태 변수)

## 시즌 1 LP 시스템 (v2.30.0)
`CURRENT_SEASON >= 1` 일 때 자동 활성화. 기존 MMR 승점 시스템 대체.

### 데이터 경로
- `/season1/players/{normName}` — 플레이어별 LP/티어 상태
- 전역 변수: `season1Data` (onValue 실시간 동기화)

### 배치고사 (5판)
- 모든 신규 플레이어는 배치고사부터 시작 (`tier: 'unranked'`)
- 5판 완료 시 승수 × **25 LP** 기준으로 티어 배정
  - 100 LP 이하 → **브론즈**, 100 LP 초과 → **실버** (초과분은 LP로 이월)
- 상수: `S1_PLACEMENT_GAMES=5`, `S1_PLACEMENT_WIN_LP=25`

### 정규전
- 승리 **+20 LP**, 패배 **−14 LP** (`S1_LP_WIN`, `S1_LP_LOSS`)
- LP 상한 **100** (`S1_LP_CAP`) — 도달 시 승급 로직 발동
- LP 0 미만 시: Bronze·Silver·Gold는 강등 없음(0LP 바닥). Platinum 이상만 강등 → 이전 티어 75LP (`S1_NO_DEMOTE`)

### 승급 / 강등
- **자동 승급** (`S1_AUTO_TIERS`): 브론즈 → 실버 (100 LP 도달 즉시)
- **승급전** (`S1_PROMO_TIERS`): 골드·플래티넘·다이아·마스터·그마 → 100 LP 도달 시 시작
  - **3판 2선승**, `promoWins/promoLosses` 추적 (판수 상한 없음 — 아이템 사용 시 자연 연장)
  - 실패(2패) 시 LP **75**로 복귀 (`S1_PROMO_FAIL_LP`)
- **챌린저**: LP 상한 없음 (무제한 누적)
- **강등 제외**: 브론즈·실버 (`S1_AUTO_TIERS`)

### 티어 순서
`unranked → bronze → silver → gold → platinum → diamond → master → grandmaster → challenger`
- 메타: `S1_TIER_META` (라벨·색상·CSS 클래스)

### 시즌 1 아이템 상호작용
- `s1_promo_win` (승급전 승리권): 승리 시 즉시 승급 처리, 패배는 1패로 정상 기록
- `s1_promo_shield` (승급전 방어권): 승급전 패배 시 해당 판 기록 제외 (승리는 정상)
- `s1_gamble` (도박권): 정규전 한정, 승 **+40 LP** / 패 **−30 LP** (`S1_GAMBLE_WIN/LOSS`)

### 핵심 함수
- `s1ApplyMatchResult(name, won, activeS1Item)` — 단일 플레이어 결과 적용
- `s1ApplyAllMatchResults(winners, losers)` — `saveMatch` 훅, 전체 일괄 적용
- `s1PromoSuccess(d)` / `s1PromoFail(d)` — 승급전 성공·실패 상태 전이
- `s1LpBarHtml(d)` — LP 바 HTML (미니카드 내부용, 바 + 수치 한 줄)
- `s1TierBadgeHtml(tier, size)` — 티어 배지 HTML, size: `'big'|'mid'|'mini'`
- `renderS1HeroCard(r, place, hasChallenger)` — 1~3위 히어로 카드
- `renderS1MiniCard(r, displayRank, hasChallenger)` — 4위~ 미니 카드

### S1 랭킹 CSS 클래스 (v2.34.3~)
- `.rk-mini-right-s1` — 미니카드 우측 영역 (min-width:84px)
- `.rk-s1-tier-lp` — 티어 배지 + LP 수치 + LP 바 세로 스택 컨테이너
- `.rk-s1-lp-big` — LP 수치 텍스트 (14px, JetBrains Mono, 티어 컬러)
- `.rk-mini-lp-bar` — LP 바 (우측 전체 너비)
- `.rk-hero-s1-lp` — 히어로카드 하단 LP 영역 (border-top 구분선)
- `.rk-hero-s1-lp-head` — 티어명(좌) + LP 수치(우) 가로 배치
- `.rk-hero-s1-lp-num` — 히어로 LP 수치 (1위 26px, 2·3위 20px, Gmarket Sans)

## EOG 자동 저장 흐름 (v2.29.57~v2.29.64)
- **경기 종료 시**: `showEogOverlay()` — 승리팀 + MVP/SVP/매너왕 투표 카드가 팝업으로 등장
- **자동 저장**: 전원 투표 완료 시 `liveMode` 기기에서 `saveMatch` 자동 트리거
- **정산창**: 저장 직후 `postSaveMatchData` 기반 정산 오버레이 표시 (골드·아이템·LP 변화 요약)
- **주의**: `finalizeVotes` 는 `session` 초기화 **이전**에 호출되어야 race condition 방지 (v2.29.57)

## 정산창 (v2.37.25~)
`window.showMatchSummary({ winners, losers, itemEffects, tierChanges, s1LpBefore, questEvent, spectatorResult, mvpWinner, mvpLoser, mannerWinner, mannerLoser })`

### 레이아웃 구조 (ms2-* CSS 클래스)
- `.match-summary-overlay` (기존 backdrop 클래스 유지) > `.ms2-sheet` (max-width:560px)
- `.ms2-header` — 승리팀명 금빛 shimmer + "N vs N · 시즌 N" 서브텍스트
- `.ms2-teams-row` (grid 1fr 1fr) — `.ms2-team-card.win` / `.ms2-team-card.lose`
- `.ms2-awards-bar` — MVP / SVP / MMP 수평 pill (없으면 숨김)
- `.ms2-btm` — 관전자 예측 서브카드 + 티어업 카드 + 닫기 버튼

### 플레이어 행 구조
```
<div class="ms2-pr [me]">
  <span class="ms2-pr-name">이름</span>
  <span class="ms2-me-tag">나</span>  ← myName 일치 시
  <div class="ms2-pr-items"><span class="ms2-item-chip">SVG</span></div>
  <div class="ms2-pr-nums">
    <span class="ms2-pr-lp plus|minus|zero">+20 LP</span>
    <span class="ms2-pr-gold">+15G</span>
  </div>
</div>
```

### 팀 레이블 결정
`isWinnersTeamA = winners.some(n => currentTeamA.some(p => normName(p.name)===normName(n)))`
→ `1팀` / `2팀` 자동 결정 (`currentTeamA`는 경기 저장 후에도 수동 초기화 전까지 유지)

### 티어업 배너 억제
- `_suppressS1SuccessBanners` 플래그: `s1ApplyAllMatchResults` 직전 `true` 설정
- `_detectAllS1Changes`에서 success 배너 skip, `_shownPromoKeys`엔 추가 (중복 방지)
- 정산창 닫기(`closeMatchSummary`) 시 `false` 복원 → `_showPendingPromoNotif()` 호출
- `_showPendingPromoNotif` success 타입은 early return (정산창에서 이미 표시)

### 목업 파일
`C:\Users\so\aram\mockup-settlement.html` — 정산창 디자인 레퍼런스
`C:\Users\so\aram\waiting_mockup.html` — 대기 화면 디자인 레퍼런스

## 대기 화면 (v2.37.28~, wm-* CSS)
팀 구성 완료 후 경기 시작 대기 중 각 멤버에게 보이는 개인 미니 대시보드.
`renderMemberWaiting()` → `#member-waiting` div에 렌더링. 팀 구성 완료 시 `my-info-bar` 숨김.

### 표시 항목
- 티어 배지 + LP 바 + 승급전 상태
- 최근 10경기 폼 도트 (오른쪽이 최신)
- 승/패 카운트, 연승/연패
- 승급 예측 (다음 경기 결과별 티어 시뮬)
- MVP/SVP/MMP 어워드 스트립 (있는 경우)
- 랜덤 팁 문구

### 티어 방어막 배지 (v2.37.36~)
`s1ApplyMatchResult` 반환값에 `newlyPromoted`, `masterShield` 플래그 포함.
- `newlyPromoted: true` — 승급 직후 다음 1판 LP 보호 (0LP 바닥 + 강등 없음)
- `masterShield: true` — 마스터/그마/챌린저 첫 진입 시 추가 2판 보호
- 배지 CSS: `.s1-shield-badge.first-chance` (⏳ 첫판 보호) / `.s1-shield-badge.zero-lp` (🛡️ 0LP 방어막)
- 두 배지 동시 표시 가능: `newlyPromoted && masterShield` 조건 체크

## 마스터/그마/챌린저 첫 달성 팝업 (v2.37.35~)
`s1TriggerMilestone(tier, participants, achieverName)` — Firebase `season1/milestones/first{Tier}` 최초 저장.
`registerMilestoneListener(tier)` — onValue로 감지 → `showMilestonePopup()` 호출 (10분 이내만 표시).

### 설정 (`TIER_POPUP_CFG`)
| 티어 | 아이콘 | 보상 골드 | 컨페티 수 |
|------|--------|-----------|-----------|
| master | 👑 | 50G | 120 |
| grandmaster | 🩸 | 100G | 150 |
| challenger | ⚡ | 150G | 200 |

- 보상 골드 필드: `witnessGold_s1_master` / `witnessGold_s1_gm` / `witnessGold_s1_ch` (경기 참가자 전원에게 지급)
- 팝업 HTML: `#master-popup` (고정 DOM), `#master-popup-title` 동적 갱신

## 시즌 1 패스 시스템 (v2.31.0, 퀘스트 기반 v2.31.1, 1000G·자동완수 제거 v2.31.3~)
`CURRENT_SEASON >= 1` 일 때 **업적 탭 자리에 "🎫 시즌 패스"로 전환**. S1 고유 업적 부재와 기존 티어·아이템 업적이 S0 MMR에 묶인 문제를 해결하려는 대체 진행·보상 시스템.

### 구조: 퀘스트 기반 순차 언락
- **각 레벨마다 고유 퀘스트 1개** (v2.31.0의 XP 누적은 폐기)
- 직전 레벨까지 전부 클레임 완료 + 현재 레벨 퀘스트 조건 충족 시 수령 가능
- 상수: `S1_PASS_MAX_LEVEL=20`, `S1_PASS_QUESTS[]`, `s1PassRewardForLevel(level)`

### 설계 철학 (v2.31.3~)
- **목표**: 주 10~15판 기준 **~1개월(~40판)** 에 20레벨 완주, 하드 플레이어는 조기 완주 가능
- **자동완수 제거**: 누적 승 카운터(5승/10승/15승) 퀘스트 제거 — 낮은 레벨 진행 중 자동으로 달성되어 후반 레벨이 의미 없어지던 문제
- **단일 경기 도전형 중심**: 한 판의 킬/어시/딜량/KDA/CS, S1 아이템 사용 성공, 연승, 사교(MVP·매너·관전) 등 각 액션이 독립적
- 평균 딜량 25~40k, KDA 2~4 등 ARAM 리얼리스틱 값 기반
- RNG 의존도 높은 조건 배제 (퍼펙트 게임 = 데스 0 + 승 삭제)
- **총 보상 1000G** — 일반 20G × 16 + 마일스톤 LV5 50 + LV10 80 + LV15 150 + LV20 400

### 퀘스트 카탈로그 (LV 1~20, ⭐=마일스톤)
| LV | 퀘스트 | 조건 | 보상 |
|----|--------|------|------|
| 1 | 첫 걸음 | S1 경기 1회 | 20G |
| 2 | 첫 승리 | 승리 1회 | 20G |
| 3 | 관찰 시작 | 관전자 1회 참여 | 20G |
| 4 | 3경기 참전 | 경기 3회 | 20G |
| 5 ⭐ | 킬 사냥꾼 | 한 판 킬 8+ | 50G |
| 6 | 신뢰의 동료 | 한 판 어시 10+ | 20G |
| 7 | 살아남기 | 데스 5 이하 + 승 | 20G |
| 8 | 딜 견습생 | 한 판 딜량 30,000+ | 20G |
| 9 | KDA 3.0 | 한 판 KDA 3.0+ | 20G |
| 10 ⭐ | 도박 성공 | 도박권 사용 후 승리 1회 | 80G |
| 11 | MVP/SVP 등극 | MVP/SVP 1회 | 20G |
| 12 | 매너왕 | 매너왕 1회 | 20G |
| 13 | 족집게 관전 | 관전 예측 1회 적중 | 20G |
| 14 | 2연승 | 2연승 달성 | 20G |
| 15 ⭐ | 대폭딜러 | 한 판 딜량 50,000+ | 150G |
| 16 | 어시 마스터 | 한 판 어시 15+ | 20G |
| 17 | KDA 4.0 클럽 | 한 판 KDA 4.0+ | 20G |
| 18 | 3연승 | 3연승 달성 | 20G |
| 19 | CS 장인 | 한 판 CS 50+ | 20G |
| 20 ⭐ | 시즌의 정점 | 한 판 킬+어시 합 25+ | 400G |

### 🎁 한 번에 수령 (v2.31.3~)
- 패스 상단 고정 버튼, 조건 충족 레벨 수와 총 골드 미리보기 포함 (`🎁 한 번에 수령 (N개 · +XXG)`)
- `claimS1PassAll()` — 현재 클레임 레벨 이후로 순차 검사 → 조건 충족한 레벨 일괄 update + 결과 팝업
- 결과 팝업 `showS1PassClaimResult()`: 수령한 레벨·퀘스트 이름·보상 목록 + 총 획득 골드, 확인 버튼으로 닫기
- 조건 미충족 레벨에서 멈춤 (순차 가드 유지)

### 통계 소스
- **`calcS1PassStats(name)`** — S1 매치 순회하며 집계:
  - 누적: `games / wins / losses / mvpCount / mannerCount / specTotal / specCorrect / attendance`
  - 단일 경기 최대치: `maxKills / maxDeaths / maxAssists / maxDamage / maxCs / maxKda / maxKa (킬+어시 합)`
  - S1 아이템 사용: `gambleWinS1` (도박권 활성 후 승리), `promoShieldUsed`, `promoWinUsed`
  - 플래그: `lowDeathWin` (데스≤3 + 승), `lowDeathWin5` (데스≤5 + 승), `perfectWin` (데스=0 + 승, v2.31.2에서 퀘스트 사용 중단)
  - 연속: `maxWinStreak`
- KDA·딜량·CS 는 `matches.participants[normName(name)]` 의 `kills/deaths/assists/damage/cs` 를 참조 (**내전 브릿지 프로그램** 자동 수집)
- S1 아이템 사용은 `matches.itemEffects[key]` 에 기록된 활성 아이템 ID 기반 (`s1_gamble` / `s1_promo_shield` / `s1_promo_win`)
- 매너왕은 레거시 `mannerKing` 포함, MVP/SVP 는 `mvpWinner/mvpLoser` 양쪽 합산
- 관전자: `specTotal` 은 `m.spectatorName===key` 전체 카운트, `specCorrect` 는 적중분만

### Firebase 저장
- `/gold/{key}.seasonPassClaimed_s1/{level}: true` — 클레임 완료 레벨 플래그
- 퀘스트 조건 판정은 매번 `calcS1PassStats` 로 동적 계산 (별도 저장 없음)

### 골드 통합
- `getMyGold()` 에 `calcS1PassGold(data.seasonPassClaimed_s1)` 합산 — S1 모드일 때만
- 보상값 조정 시 과거 수령자에게도 소급 반영 (가산식)

### 핵심 함수 & UI
- `renderS1Pass()` — 헤더(LV N/20 + 다음 퀘스트 예고) + "📊 내 시즌 1 기록" `<details>` (KDA·딜량·CS 요약) + 퀘스트 리스트
- `claimS1PassLevel(level)` — 순차 클레임 가드 (직전 레벨 미수령 or 조건 미충족 시 거부)
- `calcS1PassCurrentLevel(claimed)` — 연속으로 클레임된 가장 높은 레벨
- `renderAchievementsOrPass()` — 탭 라우터 (S0→업적 / S1→시즌 패스). 탭 버튼 라벨도 `🎫<br>패스` 로 동기화
- 탭 버튼: `.nav-tab-achievement` (라이브 계정에선 미표시), `#achievement-card-title` 동적 갱신

## 업적 시스템 (v2.7.0 → v2.8.0)
- **탭**: 🏅 업적 (5번째 탭) — 라이브용 계정에서는 탭 미표시
- **Firebase 저장**: `/gold/{key}/achievements/{id}: true` — 수령 완료 여부
- **골드 지급**: `claimAchievement(id)` → `goldBonus` 에 누적
- **통계 계산**: `calcMaxStreaks(name)` → `{ maxWin, maxLoss }`, `calcItemStats(name)` → `{ score2xWin, insuranceUsed }`
- **카테고리 4종**: 전적 기반 / 연속 기록 / 티어 기반 / 아이템

| 카테고리 | 업적 | 조건 | 보상 |
|----------|------|------|------|
| 전적 기반 | 첫 승리 | 1승 | 5G |
| 전적 기반 | 10승 달성 | 10승 | 10G |
| 전적 기반 | 50승 달성 | 50승 | 25G |
| 전적 기반 | 100승 달성 | 100승 | 50G |
| 전적 기반 | 50전 참전 | 50경기 | 15G |
| 전적 기반 | 100전 참전 | 100경기 | 25G |
| 연속 기록 | 3연승 | maxWin≥3 | 10G |
| 연속 기록 | 5연승 | maxWin≥5 | 15G |
| 연속 기록 | 10연승 | maxWin≥10 | 40G |
| 연속 기록 | 3연패 | maxLoss≥3 | 5G |
| 연속 기록 | 5연패 | maxLoss≥5 | 10G |
| 연속 기록 | 10연패 | maxLoss≥10 | 25G |
| 티어 기반 | 첫 티어 부여 | 3판↑ | 5G |
| 티어 기반 | 골드 달성 | 480pt↑ | 10G |
| 티어 기반 | 플래티넘 달성 | 540pt↑ | 15G |
| 티어 기반 | 다이아 달성 | 660pt↑ | 25G |
| 티어 기반 | 마스터 달성 | 720pt↑ | 35G |
| 티어 기반 | 그랜드마스터 | 780pt↑ | 45G |
| 티어 기반 | 챌린저 달성 | 850pt↑ | 60G |
| 아이템 | 2배권 승리 3회 | score2xWin≥3 | 10G |
| 아이템 | 2배권 승리 5회 | score2xWin≥5 | 15G |
| 아이템 | 2배권 승리 10회 | score2xWin≥10 | 30G |
| 아이템 | 철벽 방어 3회 | insuranceUsed≥3 | 5G |
| 아이템 | 철벽 방어 5회 | insuranceUsed≥5 | 15G |
| 아이템 | 철벽 방어 10회 | insuranceUsed≥10 | 25G |

## UI 개선 (v2.4.1)
- **뉴비 보너스 접기/펼치기**: 팀 카드 하단 뉴비 보너스 정보를 기본 접힘 상태로 변경
  - `🌱 뉴비 보너스 적용 중 (이름) ▾` 한 줄만 노출
  - 마우스 올리면(`:hover`) 또는 클릭(`.open` 토글)으로 상세 내용 펼쳐짐
- **1등 닉네임 금빛 shimmer**: `rank-1-name` 클래스 — 황금 그라데이션 + 2.5초 반짝임 애니메이션
  - `nameHtml(name)` 헬퍼로 1등 여부 판단 후 래핑
  - 적용 위치: 랭킹 리스트, 팀 카드, 참가자 칩, 참가자 목록, 프로필 모달

## 랭킹 TOP3 뱃지 시스템 (v2.4.0)
- `/players` + `/matches` 기반으로 승점 상위 3명을 계산 (`getTopThreeMap()`)
- 3판 이상 플레이어 중 승점 순 — 1등 🥇, 2등 🥈, 3등 🥉
- `getRankBadge(name)` 헬퍼로 뱃지 HTML 반환
- 표시 위치: 참가자 선택 칩, 참가자 목록, 팀 카드, 프로필 모달, 랭킹 리스트 이름 옆
- 랭킹 리스트에서는 `i` 인덱스 직접 사용 (중복 계산 없음)

## 뉴비 시스템 (v2.3.0, 시즌 1 이식 v2.31.5~)
- `/players/{key}.isNewbie: boolean` — 뉴비 마크 여부
- **부여/해제**: 라이브용 계정에서만 가능
  - 랭킹 탭 → 각 행 우측 🌱 버튼 (즉시 적용)
  - 랭킹 탭 → 프로필 편집 → 뉴비 마크 체크박스 (저장 시 반영)
- 팀 결과 카드 하단에 뉴비 보너스 안내 표시, `isNewbie()` 헬퍼로 현재 여부 조회

### 시즌 0 (MMR 승점)
- **뉴비 팀원과 승리 시** (뉴비 본인 제외): +3pt 추가, +5G 추가
- **뉴비 팀원과 패배 시** (뉴비 본인 제외): -4pt (기존 -7pt)
- **뉴비 본인 패배 시**: -2pt (기존 -7pt → 대폭 완화, 0pt는 랭킹 인플레 유발)
- `calcScore()` / `calcGoldFromMatches()` 에서 `matchTime >= getNewbieSince(name)` 로 뉴비 ON 이후 경기만 보너스

### 시즌 1 (LP 시스템, v2.31.5~)
- **정규전 승리**: 뉴비 팀원 있으면 **+3 LP 추가** (+20 → +23), +5G 유지
- **정규전 패배 (본인 뉴비 아님)**: 뉴비 팀원 있으면 **-3 LP 완화** (-14 → -11)
- **정규전 패배 (본인 뉴비)**: **-5 LP** (기본 -14 → -5, ~64% 완화)
- **배치고사 뉴비 본인**: 5판 완료 시 `effectiveWins = min(5, wins + 1)` — 실질 1패 무시 효과 (0승 → 1승=25LP 브론즈, 3승 2패 → 4승=100LP 실버 0LP)
- **승급전·강등 구간**: 뉴비 보너스 **미적용** (공정 경쟁 유지)
- **`s1_gamble` 활성 시**: 뉴비 보너스 전부 **무시** — 도박권은 순수 리스크 보장 (S0 `gamble` 도박 주사위와 동일 철학)
- 상수: `S1_NEWBIE_WIN_BONUS_LP=3`, `S1_NEWBIE_LOSS_REDUCE_LP=3`, `S1_NEWBIE_SELF_LOSS_LP=5`
- 함수: `s1ApplyMatchResult(name, won, activeS1Item, hasNewbieTeammate, iAmNewbie)` — 뉴비 파라미터 수신. `s1ApplyAllMatchResults` 에서 팀 기반으로 계산 후 전달
- UI: 뉴비 뱃지 🌱 툴팁이 시즌에 따라 `newbie_bonus` / `newbie_bonus_s1` 로 자동 전환 (LP 수치·배치 보정·승급전 미적용 안내 포함)

## 부가 기능
- **연승/연패 표시**: 2연속 이상 시 랭킹/팀카드에 표시
- **승급찬스/강등위기**: 다음 경기 결과 시뮬레이션으로 티어 변동 예고
- **케미 링**: 같은 팀 3판↑ 높은 승률 쌍 — 원형 컬러 링
- **웬수 링**: 같은 팀 3판↑ 40% 이하 승률 쌍 — 사각 컬러 링
- **본인 닉네임 선택**: localStorage 저장, 내 정보 바에 골드 표시
- **프로필 모달**: 바텀 시트 방식, 챔프 클래스·한마디·통계 한 번에 편집
- **챔피언 클래스**: assassin(암살) / warrior(전사) / marksman(원딜) / mage(법사) / tank(탱커) / support(서폿)

## 기본 팀원 (DEFAULT_MEMBERS)
앱 최초 실행 시 Firebase `/players`에 자동 등록:
`애긔반달곰`, `ap렉사이서폿`, `울퉁쓰`, `빛나는언즈`, `나랑듀오해듀오`, `맹독 벌꿀오소리`, `브랜딩프로`, `신규회원임`, `조조와빈찬합`

## Riot API 연동 계획 (v2.10.0~)
- **1단계 (완료)**: 플레이어 프로필에 Riot ID 등록 — `/players/{key}.riotId` (형식: `닉네임#태그`)
- **2단계 (완료)**: Firebase `/config/riotApiKey` 에서 API Key 로드 + PUUID 조회 저장
  - `lookupRiotId(fbKey)` — Riot ID → PUUID 조회 후 `/players/{key}.puuid` 저장
  - `onValue(ref(db,'config/riotApiKey'))` 로 키 실시간 수신 (코드에 키 없음)
- **3단계 (완료)**: 게임 자동 감지 + 승패 자동 판정 (v2.11.0)
  - `startGameDetection()` — makeTeams() 완료 후 자동 시작
  - `pollGameStatus()` — 30초 간격 Spectator API 폴링 (kr.api.riotgames.com)
  - `fetchMatchResult()` — 게임 종료 후 Match-v5 API로 결과 조회 (최대 6회 재시도)
  - `showAutoResultPopup()` — 자동 감지 결과 표시 + selectWinner() 자동 호출
  - 감지 실패 시 수동 입력 fallback
  - `stopGameDetection()` — saveMatch() / resetSession() 시 폴링 중단
  - UI: `#game-detection-status` — 감지 상태 실시간 표시
- **API Key 관리**: Firebase `/config/riotApiKey` 에 저장 (24시간마다 갱신 필요)

## 코드 규칙
- 모든 사용자 입력은 `escHtml()` 이스케이프 (`&` `<` `>` `"` `'` 포함)
- 이름 비교는 항상 `normName()` 사용 (trim + 연속 공백 단일화)
- Firebase 변경은 `onValue` 리스너가 자동으로 UI 갱신
- 이벤트 매치 결과는 Firebase에 저장하지 않음
- CSS 변수는 `:root`에서 관리 (`--gold`, `--blue`, `--red`, `--tier-*` 등)
- CSS 중복 선언 금지 (과거 버그 — 같은 클래스 두 번 정의된 적 있음)

## 📋 업데이트 노트 정책 (v2.43.263~) — 모든 작업자/컴퓨터 공통
업데이트 노트(`showChangelog`)는 **두 층**으로 운영한다:
1. **`CHANGELOG_MAJOR`** (팀원용 큐레이션, 모달 상단 카드) — **팀원에게 알려야 할 "큰 신규 기능/중요 변경"만** 넣는다. 진짜 게임 패치노트 톤(이모지 + 제목 + 1~2문장 설명). 예: 신규 미니게임/시스템, 새 콘텐츠, 경제·랭크 구조 변경.
2. **`CHANGELOG`** (상세 개발 로그, 모달 하단 `▸ 전체 변경 내역` 접힘) — 버전별 모든 변경(버그수정·UI 미세조정·내부 리팩터 포함). 기존처럼 자유롭게 누적.
- **새 작업 배포 시 규칙**:
  - 자잘한 수정/개선 → `CHANGELOG`에만 1줄 추가 (지금까지처럼). `CHANGELOG_MAJOR`엔 **넣지 않는다**.
  - 팀원이 알아야 할 큰 기능 → `CHANGELOG`에 상세 + **`CHANGELOG_MAJOR` 맨 위에 큐레이션 1줄** 추가.
  - "이게 팀 단톡방에 공지할 만한가?" 기준으로 판단. 애매하면 MAJOR에 넣지 않는다.
- 다른 컴퓨터에서 작업해도 동일 적용 (이 정책 파일이 기준).

## 🌌 시즌 2 (헥스텍/마법공학) — 진행상황 + 기획 (2026-06-04 갱신, 6/11 증바람 패치 연계)
롤 칼바람 **증강 업데이트(6/11)** 에 맞춰 앱도 **시즌 2** 시작. 비주얼=마법공학(헥스텍), 신규 콘텐츠=증강 연계 엠블럼 강화.
> 📄 **전체 디테일(진단·교훈·정확한 수치·강화/패스 표 전부)은 레포 루트 `SEASON2.md` 참조** — 이 섹션은 요약, SEASON2.md가 완전판.

### ✅ 확정 정책
- **전부 리셋**: LP·티어, 골드, 패스, 쓰레기통, **가챠 컬렉션(완전 리셋 확정)**. S2 필드는 빈 상태 시작.
- **S1 데이터 = 읽기전용 열람 유지** (시즌 셀렉터로 조회, _s1 필드·season1/ 노드 보존·수정 X).
- **⭐ 디자인 = 시즌 정체성 원칙**: 모든 비주얼은 그 시즌 귀속. **시즌 무관하게 쓰이는 디자인 발견 시 사용자에게 반드시 알릴 것.** 티어색(랭크색)만 예외.

### ✅ 코드 반영 완료 (v2.43.273~283, 전부 `season===2`/`.season-2` 게이트라 라이브 S1 무변)
- **작업1 — 시즌 누수 차단**: gold 노드 `_s1` 하드코딩 ~140곳 → `sField()` (v274). `season1/` 노드 → `seasonNode(sub)='season'+CURRENT_SEASON+'/'+sub`, LP/티어·마일스톤 구독을 `subscribeSeasonPlayers()`/`subscribeMilestones()`로 감싸 시즌전환 시 자동 재구독 (v275). 복권 시즌 격리: `lotteryHistory`(무접미사 공유배열)에 `season` 태그 + `calcLotteryGold`에서 `(h.season??1)===CURRENT_SEASON` 필터 (v276). **무회귀**: S1에선 sField(X)===X_s1.
- **프리뷰 툴 (v277)**: 콘솔 `previewSeason(2)`/`previewSeasonOff()` — 이 브라우저만 CURRENT_SEASON 오버라이드(localStorage `aram_season_preview`), 라이브 config·Firebase 안 건드림. 미리보기 중 자동쓰기(seed/migrate/autoCompensate) `__SEASON_PREVIEW` 가드로 차단, switchSeason도 차단. **S2 작업 검증은 이걸로.**
- **헥스텍 테마 (v278~283)**: `season-2` 클래스(CURRENT_SEASON===2 토글, renderHeaderSeasonLabel). `s1-active`(>=1, 동작 22곳)는 유지하고 `.season-2`가 시각을 덮음(.s1-active 뒤 배치). 블랙+골드 팔레트 + `--purple-light` 골드 remap. `body.season-2::before`(블랙+골드모트)/`::after`(골드글로우). `renderSeasonBackground()`+`_buildHexfield(cls,id)`가 육각회로 SVG 주입(육각 변 따라 **랜덤워크 골드펄스**, 중앙편향). 보라 스트래글러 ~35개 `.season-2` 스코프로 골드(비막고라)/레드(막고라) 덮음. 막고라="S2 컨셉의 레드"(메타UI 보라→레드 + 아레나 `#magolla-modal`에 `ensureMagollaHexBg()`로 레드 헥스필드 `.mg-hexfield` 주입). 전적색 정제: `--green/red/blue` remap(승=골드·패=회색·중립=화이트), W/L점·우편함 골드. (목업파일 `시즌2-헥스텍-목업.html`/`막고라-레드헥스텍-목업.html`은 gitignore 로컬전용)

### 🎮 S2 신규 콘텐츠 — "엠블럼 강화 + 패스 재편" (✅ v2.44.0~1 구현 완료 / 일반패스 적립만 브릿지 대기)
> **✅ 구현 완료** — 상세 코드맵·확정수치는 **`SEASON2.md §4` 상단 박스** 참조(완전판). 전부 `CURRENT_SEASON===2` 게이트라 라이브 S1 무영향, `previewSeason(2)`로만 검증.
> - **엠블럼**(index.html ~L7269): `EMBLEM_TICKETS`·`emblemEnhance`·`emblemSellPrice`·`openEmblemModal`/`renderEmblemBody`·연출 `_emblemPlayFx`. 효과: 출석 `doAttendance` · 복권A안 `_applyEmblemLotteryBoost` · 광채 `emblemShineHtml`. 데이터 `emblem_s2`/`emblemTickets_s2`/`emblemSellG_s2`. 판매환급 ~60%.
> - **패스**(엠블럼 블록 뒤): `PASS_TRACKS`·`calcCustomPassPts`(내전 자동)·`claimPassLevel`·`renderS2Pass`/`doClaimPass`(라우터 S2 분기). 데이터 `passCustom_s2`/`passNormal_s2`/`normalGamePts_s2`/`passGold_s2`/`passTitle_s2`. 비밀퀘 토큰 S2 OFF.
> - **⏳ 남은 것**: 일반게임 패스 포인트 적립 = 브릿지 `isCustomGame` 분리 후 `normalGamePts_s2` 적립(현재 `__addNormalPassPts` 디버그 훅만). 내전 패스는 이미 자동.
>
> *(아래 기획 원문은 레퍼런스로 보존)*

**루프**: 일반 증바람 플레이 → 퀘스트(브릿지 검증) → 강화재화 → 엠블럼 강화 → 효과/추격. 골드·재화 싱크로 챌린저 골드고임 해결.

**1) 엠블럼 강화 (메이플 주문서식, 수치 확정)**
- 엠블럼 1개(단일장비, 구매/판매 가능). **슬롯=5**(강화가능수치): 성공/실패 무관 시도마다 1차감, 성공=레벨+1·실패=레벨유지(슬롯만 날림), 5칸 다쓰면 LOCK. 최종레벨=성공횟수. 5칸 시각화(어떤 강화권 성공/실패).
- **레벨(+N)과 성능 분리**: +N=성공횟수(간판), 성능=성공한 칸들의 강화권 기여값 합(진짜 스탯). 같은 +5도 성능 5~30(6배차) → 고성능 추격+실패작 판매.
- **강화권 3종**: 🟢안정 100%/성능+1, 🟡정밀 60%/성능+3, 🔴과부하 30%/성능+6 (30%라 칸당 기대성능 1.0/1.8/1.8 — 밸런스OK).
- **효과(성능 비례)**: 복권 당첨확률 성능×0.2%p(캡+8%p), 출석골드 성능×3G, 광채 성능 1~9실버/10~24골드/25+프리즈매틱+칭호.
- **복권 부스트=A안(꽝→본전)**: 결과는 긁기 전 확률표에서 확정(긁기는 연출), 엠블럼이 꽝 슬라이스를 +X%p 떼서 **본전**으로 이전(잭팟 인플레X, 손실완화). 회수율~80% 싱크 보호.
- **상점가(제안)**: 베이스 엠블럼 150G·안정 40·정밀 100·과부하 250G. **비용감**: 안정路 +5 확정 350G(성능5), 올과부하 +5=~57만G·1/411(0.3^5, 성능30 프리즈매틱).
- **판매**: ✅ `emblemSellPrice` = 베이스150×0.5 + 투입강화권가×0.35 + 성능²×2. 환급률 ~60%(흑자확률 거의0, 저강화 확정이익=인플레라 금지).

**2) 패스 재편 (확정)**
- 🤫 **비밀퀘스트 토큰 → 제거** (S2 UI 게이트 OFF). 잃는것: 패배 LP완화 안전망(수용).
- 🎫 **패스: 전투/지원 → 게임타입별 2종**(둘다 무료): **일반게임 패스**(증바람으로 채움→강화권·엠블럼·소량골드=성장) + **내전게임 패스**(내전으로 채움→골드·칭호/코스메틱·소량강화권=경쟁). 역할분리: 내전=경쟁, 일반=성장.
- **각 10레벨**, 레벨당 200p, 활동으로 포인트 적립(일반: 증바람 1판+10p/승+5p/일일퀘+20~40p · 내전: 1판+15p/승+10p/MVP·매너+10p). ✅ 보상트랙 확정 = `PASS_TRACKS`.

**3) 브릿지 확장 (전제)**
- 일반게임 eog를 내전 흐름과 **분리**: LCU `/lol-gameflow/v1/session`의 **`gameData.isCustomGame`**(브릿지가 이미 이 엔드포인트 읽음, 필드 하나 추가)로 판정 — true=내전(기존 매치저장/투표), false=일반(퀘스트 로그/엠블럼 재화). 보조검증=등록팀원 구성. 6/11에 증바람 일반 queueId 확인.
- 핵심: 브릿지 eog(`/lol-end-of-game/v1/eog-stats-block`)는 **게임종류 무관 양팀 10명 전원** 챔피언·KDA·**증강(PLAYER_AUGMENT_*)**·멀티킬 캡처. **방장 1명 브릿지+같이 증바람 큐 = 함께한 팀원 전원 자동 수집**(전원 설치 불필요, 혼자 게임은 자진신고 폴백). 앱 `augmentMap`: 증강id→이름/아이콘/등급(kSilver/kGold/kPrismatic).

### ⏭️ 남은 작업 + 미정
- **switchSeason S2 버튼**: 현재 S0/S1만. 6/11 임박 시 추가(누르면 전원 즉시 S2 — 신중). 그 전엔 previewSeason(2)로만.
- **S1 읽기전용 열람 재라우팅**: sField/season1Data가 CURRENT_SEASON 전역 → S2 중 viewSeason=1로 S1 LP랭킹/컬렉션 보려면 읽기 경로가 viewSeason 타게 손봐야(전적은 match.season 필터로 됨).
- **~~엠블럼/패스 구현~~ ✅ 완료 (v2.44.0~1)**. 일일퀘 항목·보상량은 실플레이 후 튜닝.
- **일반게임 패스 적립 연결**: 브릿지 `isCustomGame` 분리 후 일반 eog 수신 시 `normalGamePts_s2` 적립 핸들러 추가(현재 `__addNormalPassPts` 디버그 훅만).
- **6/11 확인**: 증바람 일반 queueId, 일반게임 augment가 공개 match-v5에도 오는지(현재 augment는 브릿지 LCU에서만 받음).

## LCU 브릿지 (aram-bridge)
- 리포: https://github.com/SOHADA2/aram-bridge (로컬: `C:\Users\so\aram-bridge` 또는 `C:\Users\sbs_n\Desktop\aram-bridge`)
- 현재 버전: v1.1.35 (종료 버튼 cleanup로 웹앱 "연결중" 즉시 해제 · inGame배너 v1.1.34 · 일반게임분리 v1.1.33 · 진행자표시 v1.1.32)
- ⚠️ 시즌2 확장 예정: 일반게임 eog를 내전과 분리(`gameData.isCustomGame`) → 위 "시즌 2" 섹션 참조
- 배포 형태: GitHub Releases에 ZIP (exe + `이 파일을 실행해 주세요.vbs`) 업로드
- 웹사이트 다운로드 링크: GitHub API로 최신 릴리즈 .zip 에셋 자동 감지 (`index.html` line ~3510)

### 빌드
```
cd C:\Users\so\aram-bridge
node node_modules\pkg\lib-es5\bin.js . --targets node18-win-x64 --output dist/aram-bridge-vX.X.X.exe
```

### 릴리즈
```
Compress-Archive -Path dist/aram-bridge-vX.X.X.exe, "이 파일을 실행해 주세요.vbs" -DestinationPath dist/aram-bridge-vX.X.X.zip
gh release create vX.X.X dist/aram-bridge-vX.X.X.zip dist/aram-bridge-vX.X.X.exe --repo SOHADA2/aram-bridge
```

### 주요 구조
- `index.js` — LCU 폴링 + Firebase 전송 + HTTP 상태 페이지(7654포트)
- `이 파일을 실행해 주세요.vbs` — 런처 (CP949 인코딩, Zone.Identifier 자동 해제 후 exe 숨김 실행)
- 상태 페이지: `/api/status` (JSON), `/api/shutdown` (POST → 종료)

## 막고라 매치 시스템 (v2.39.0~, v2.40.x 대규모 개선)
최소 5인 세션에서 파이터 2명이 1:1 대결, 나머지는 관전자로 배팅 참여하는 미니게임.

### 발동 조건 및 UI
- `sessionPlayers.length >= 5` 이고 `liveMode` 일 때 막고라 드롭다운 항목 활성화
- 매치 타입 드롭다운 3번째 항목 (일반/이벤트/막고라), 조건 미충족 시 dim 처리
- 막고라 진행 중에는 `make-teams-btn`(팀짜기) 비활성화
- **`type="module"` 주의**: HTML onclick 사용 함수는 반드시 `window.*` 등록 필요

### Firebase 데이터 구조
```
/magolla_matches/{matchId}
  status: 'betting' | 'closed' | 'settled' | 'cancelled'
  fighter1: string          // 파이터 1 이름
  fighter2: string          // 파이터 2 이름
  spectators: string[]      // 관전자(배팅자) 이름 배열 (3명)
  bettingStartAt: number    // 배팅 시작 타임스탬프
  createdBy: string         // 생성자 이름
  season: number
  bets: {
    [normName]: {
      winner: string        // 승리 예측 이름
      cond: 'tower'|'kill2'|'cs100'  // 승리 요건 예측
      amount: number        // 배팅 금액 (10~100G, step 10)
      betAt: number
    }
  }
  result: { winner: string, cond: string }  // 라이브 결과 입력
  payouts: { [normName]: number }           // 정산 후 net 골드 (파이터: 절대값, 관전자: net)
  status: 'settled' → payouts 확정

/session/magollaMatchId: string | null  // 활성 매치 ID — 모든 기기 전파용
```

### 골드 처리
- **배팅 시**: 관전자 `goldSpent += amount` (선차감)
- **정산 시**: `mgSettleMatch()` — `goldSpent` 복구 후 `magollaHistory` 배열에 net delta 기록
- **취소 시**: `mgCancelMatch()` / `mgForceCancel()` — 모든 배팅자 `goldSpent -= amount` 환불
- **파이터**: goldSpent 변동 없음, magollaHistory goldDelta로만 earned 증가
- `calcMagollaGold(history)` — `magollaHistory_s1` 배열 합산, `calcPlayerGoldEarned`에 통합

### 배팅 배율 (군중 배율)
- 승자 예측 단독: ×1.4 / 다수 중 소수: ×1.0 / 전원 동일: ×0.8
- 요건 예측 단독: ×1.6 / 다수 중 소수: ×1.0 / 전원 동일: ×0.75
- 둘 다 맞춤: `amount × 2.20 × wm × cm`
- 하나만 맞춤: `amount × 0.88 × wm` 또는 `amount × 1.08 × cm`
- 파이터: 승리 +100G / 패배 +50G (`MAGOLLA_FIGHTER_WIN/LOSE`)

### 상태 흐름
```
null → 'betting'(90초) → 'closed'(타이머 만료)
                       → 'settled'(라이브 결과 입력 후 mgConfirmResult)
                       → 'cancelled'(매칭 취소 버튼)
```
- `closed` 상태: 배팅 마감, 라이브 결과 입력 대기 (UI에 "마감" 표시)
- `settled` → `session/magollaMatchId = null` 자동 초기화
- `cancelled` → `session/magollaMatchId = null` + 모든 기기 모달 즉시 닫힘

### 핵심 변수 (전역)
```javascript
let magollaState      = null;  // null | 'active' | 'settled'
let currentMagollaId  = null;
let magollaData       = null;  // onMagollaUpdate에서 최신 snap.val() 캐시
let magollaUnsubscribe   = null;
let magollaTimerInterval = null;
let _mgSelectedWinner = null;  // 배팅 뷰 로컬 선택값
let _mgSelectedCond   = null;
let _mgResultWinner   = null;  // 라이브 결과 입력 선택값
let _mgResultCond     = null;
let _mgBettingTabFocused = false; // 관전자 배팅탭 자동포커스 1회 가드
const MAGOLLA_BET_DURATION = 90000; // 90초
```

### 파이터 선정 로직 (v2.40.13~)
- 전체 쌍(C(n,2))을 `weight = 1/(LP차이+20)` 가중치 랜덤으로 선택 — LP 밸런스 유지하되 다양한 매치업 가능
- 직전 정산 완료된 파이터 쌍은 `localStorage('mgLastFighters')`로 저장 → 다음 매치에서 weight=0 제외

### 파이터 카드 표시 정보 (v2.40.x~)
- 티어/LP, 전체 승률/전적, 평균 KDA (K/D/A 3열 그리드), 연승/연패 배지, 최근 5경기 폼 도트
- `mgAvgKda(name)` — `Object.values(matches)` 순회, participants KDA 집계
- `mgRecentForm(name, n)` — 최근 n경기 W/L 배열
- `mgHeadToHead(n1, n2)` — 서로 다른 팀에 속했던 경기에서의 팀경기 승부 전적
- 배팅 뷰 매치업 헤더 아래 `.bet-fighter-info` 패널: KDA + 폼 도트 (라이브/파이터/배팅자 모두 표시)

### 브릿지 충돌 방지 (v2.40.16~17)
막고라 1v1 게임 종료 시 브릿지 이벤트가 일반 매치 UI를 오염하지 않도록 `magollaState === 'active'` 가드:
- `bridge/eogStats` → EOG 오버레이 차단
- `bridge/matchData` → EOG 오버레이 차단
- `bridge/voteStarted` → 탭 전환/배너 차단
- `bridge/gamePhase → InProgress` → `currentMatchParticipants` 오염 차단

### 핵심 함수
- `openMagollaModal()` — 새 매치 생성 + session/magollaMatchId 저장 + 모달 오픈
- `closeMagollaModal()` — 모달 닫기 (settled/cancelled 시 상태 초기화)
- `onMagollaUpdate(snap)` — Firebase 실시간 업데이트 핸들러, 모든 뷰 렌더링
- `mgStartTimer(data)` — 90초 카운트다운, 만료 시 liveMode 기기가 status='closed' 기록
- `mgConfirmBet()` — 배팅 확정/수정 (재배팅 허용, goldSpent 차액 조정)
- `mgConfirmResult()` — 라이브 전용, 결과 입력 후 mgSettleMatch 호출
- `mgCancelMatch()` — UI 취소 버튼 (확인 다이얼로그 포함)
- `mgForceCancel(matchId?)` — 콘솔 강제 취소/환불 (matchId 없으면 session에서 자동 조회)
- `diagMagolla()` — 콘솔 진단 함수

### 전파 메커니즘
- 호스트 기기: `push(magolla_matches)` → `set(session/magollaMatchId, matchId)`
- 다른 기기: `onValue(session/magollaMatchId)` 감지 → 자동 모달 오픈 + 리스너 구독
- 관전자: 첫 onMagollaUpdate 시 배팅 탭 자동 포커스 (`_mgBettingTabFocused` 가드)

### 주의사항
- `type="module"` 스크립트라 onclick 함수는 반드시 `window.함수명` 으로 등록해야 함
- `cancelled` 상태 수신 시 `onMagollaUpdate`에서 `magollaState=null` 먼저 세팅 후 `closeMagollaModal()` 호출
- 파이터 통계 헬퍼는 전역 `matches` 객체 사용 (`Object.values(matches)`) — `allMatches`는 함수 내 지역 변수라 접근 불가

---

## 세션 작업 이력

> 새 세션 시작 시 이 섹션을 읽어 최근 맥락 파악. 작업 완료 후 업데이트할 것.

### v2.45.234~264 (2026-06-24) — 🧸 단짝 2차 대장정: 아바타3D·LP하단 레이아웃·변경가능·S2보상검증·🔒보상잠금 ← 최신

> 이 세션 = **로컬 컴퓨터**(Firebase REST 직접 가능). 작업흐름: 인라인 `<script>` 추출→`node --check`(tmpdir .mjs)→**`&&` 게이트 통과 시에만 commit+push**(v246 때 게이트 없이 깨진 채 푸시된 사고 후 확립). 한글 커밋=heredoc. 배포 후 응답에 APP_VERSION 명시.

**🧸 단짝 아바타/대시보드 통합 (v234~257)**
- 단짝을 **좌상단 내 정보 아바타 자리에 움직이는 3D**로. `updateMyInfoBar`(~L23589) has-buddy 분기가 `#my-avatar-face`에 `<div id="buddy-bar-mount">` 넣음. **뒷 사각배경 제거**(`.my-info-avatar.has-buddy::before/after{display:none}`·자유롭게 움직임), 상반신 줌(`_buddy3dFrame` `frameMode='bust'`= `mountId==='buddy-bar-mount'`). 아바타 CSS ~L1916.
- 🎁 **연승/연패 보상 알림**: `_coachActions`(~L21357) buddyreward 항목→`#my-avatar` 옆 코치(`#attend-coach`), `window.buddyClaimPrompt` 확인창→`buddyClaim`.
- **단짝 공간=프로필**(`_buddySpaceHtml`, 닉네임/아바타 클릭) + 대시보드 미니(`_buddyMiniHtml`). 미보유 시 대시보드 단짝배너 제거.
- **3D 공유캔버스** `_buddy3dCtx`(~L32213): 홀더↔마운트 이동·가시성(`offsetParent`)·30fps 게이트. `_buddyHomeAttach`가 space-mount>bar-mount 우선부착. **챔피언 변경 시** `ctx.champ!==champFile`면 `_buddy3dLoad`로 새 GLB 재로드(L32249).

**⚒️ LP카드 하단 레이아웃 (v253~261)** — `wm-lp-bottom`(CSS ~L1653)=세로 스택(flex column): 위=최근10경기, 중간=⚒️전투준비, 아래=챔피언.
- **최근10경기**: `#wm-form-dots` `display:flex`+`.wm-fdot{flex:1}`·**정사각 고정 해제**(aspect-ratio 제거·height 27px)→너비 채움(경기수 무관).
- **⚒️전투준비**: `.wm-fx-stack` 2열 grid = **강철심장(좌)|시너지(우)**. 강철심장 칩(`emCell` ~L24281)=**실제 아이템 아이콘**(`_forgeItemImg(pw)`)+**성능 우상단 코너배지**(`.wm-emperf`)+**걸작효과 초소형 8.5px**(세로 `flex-wrap`+order: 위[아이콘+성능 ▾]/아래[걸작효과 전폭]). 2열이라 좁아 세로화.

**🔄 단짝 변경 가능 (v262)** — "평생 1명" 해제. `buddySelect`(~L31891): `_buddyData()` 차단 제거→재선택 허용. **챔피언별 레벨/별칭 로스터 `buddyLevels_s2`**: 떠나는 단짝 `{level,pulls,nickname}` 저장→들어오는 단짝 복원(예전 Lv5 챔프 복귀=그대로·`cur`가 라이브상태라 select에서만 읽고씀). 단짝공간 「🔄 다른 단짝으로 변경」(`_buddyChangeBuddy`→`_buddyOpenSelect`). 선정/변경 후 `_buddyAfterPick`(가챠탭·아바타·프로필·대시보드 갱신, 별칭 없을때만 이름짓기). "변경 불가/평생" 문구 전부 제거.

**✅ S2 보상 검증 + 연패보상 교체 (v263)**:
  - **LP2배권(s1_lp2x)=S2 정상**: `s1ApplyMatchResult`(~L29298, S2 공용함수) `useLp2x`→승리 LP×2. `relayOnly`는 **상점/buyItem만** 막음(효과 무관). 매치저장 `items.find(active && id.startsWith('s1_'))`(L29540)로 잡힘. ⚠️ 단 **시작전 아이템바(`_qibChipsHtml` ~L16104)엔 미표시**(S2세트=promo/gamble)→**인벤토리(`toggleItemActive`)서 활성화** 필요.
  - **방어권(insurance)=S2 무의미**: id가 `s1_` 아니라 `s1ApplyMatchResult` 무시(LP 영향0). `calcScore`(승점 ~L13561)만 보호하는데 **승점=프로필 보조스탯**(순위는 티어+LP·`renderS1Ranking` `tierRank→lp`). S2 전투아이템 세트에도 없음.
  - → `BUDDY_LOSS_REWARDS` 방어권 제거: `3:{gold:120,tickets:{stable:1}} 4:{lp2x:1,gold:100} 5:{lp2x:1,scratch:{1:1}} 6:{lp2x:2,tickets:{precise:1}}`.
  - `_buddyGrant`(~L31920) 필드 검증완료: gold→`goldBonusLegacy`(calcPlayerGoldEarned 합산)·tickets stable/precise/overload·scratch→freeScratch(0실버1골드2프리즘)·essence·items(lp2x/insurance). 전부 sField.

**🔒 단짝 보상·효과 임시 잠금 (v264) ★중요** — 보상/효과 설계 미정이라 `const BUDDY_REWARDS_LOCKED = true`(~L31891)로 **수령·지급·효과표시만 잠금**. 선정·강화·스택누적은 유지(나중 그대로 반영). 잠금지점: `buddyClaim`(차단)·`_buddyOnMatch` 안전망(자동지급 보류·스택 갱신은 유지)·`buddyClaimPrompt`(안내)·`_coachActions`(보상알림 숨김)·`_buddyRewardText`('미정 (준비 중)')·`_buddySpaceHtml`/패널 보상줄·수령버튼('🔒 보상 준비 중')·`_buddyLvListHtml`/강화연출 효과설명('효과 미정')·도움말. **확정 시 `false`로 flip하면 한번에 활성화.**

**단짝 코드맵(종합)**: 데이터 `buddy_s2{champion,level,selectedAt,pulls,nickname}`·`buddyStreak_s2{type,count,lastTs}`·`buddyLevels_s2{champ:{level,pulls,nickname}}`(로스터)·`buddyClaimLog/buddyUpgradeLog/buddyLastMatchTs`. 보상 `BUDDY_WIN_REWARDS`(2~7)/`BUDDY_LOSS_REWARDS`(2~6)·`_buddyCap`(승7/패6)·`_buddyRewardAt`. 레벨 `BUDDY_UP_RATE`(30/20/15/10%)·`BUDDY_MAX_LV=5`·`BUDDY_LV_NAMES/DESC`(Lv2골드·Lv3안전망·Lv4덤20%·Lv5덤35%+보너스2배). 강화=같은챔프 또뽑기(`_buddyOnPull`→`_buddyUpgradeAttempt`). 매치연동 `_buddyProcessMatches`(goldLoaded·~L12486)→`_buddyOnMatch`. ⚠️ **표시 스택=원시 카운트인데 보상은 7/6 상한**(불일치·미정리).

**미해결/다음**: ① **단짝 보상·효과 설계 확정**(`BUDDY_REWARDS_LOCKED` 풀기 전 必·표시스택 상한 정리 같이). ② 단짝 7/7 완성자 실검증(아직 없음·사장님 5/7). ③ LP2배권 시작전 바 노출(보유시만)은 보상잠금 중이라 보류. ④ 📱 모바일 단짝3D 스크롤 검은가림 실기기 확인. ⑤ 🔒 보안(공개링크) 미착수.

### v2.45.224~233 (2026-06-23~24) — 🔨 강철심장 UX 대수술 + ⏱️카운트다운 시계스큐 + 🛠️팀 결성 로비 배너 + ⚡정산창 지연단축

> 이 세션 = **원격(web) 환경**. ⚠️ Firebase egress가 네트워크 허용목록에 없어 직접 REST 못 씀(403). Firebase 읽기/쓰기 필요 시 **GitHub Actions 러너 우회**(v208~209 항목 참조). 이번 세션은 전부 `index.html` 코드 변경이라 Firebase 직접작업 없었음. **배포** = main에 push(Pages 자동빌드 ~2~3분) + 작업브랜치(`claude/review-work-from-other-computer-dp02ve`)에도 push. 배포검증 = `mcp__github__actions_list`(workflow="pages build and deployment", event:"dynamic", 최신 head_sha conclusion=success). 커밋 규칙 동일: 인라인 `<script>` 전 블록 `node --check`(importmap/json 제외) → 통과 시 커밋. 매 변경 **APP_VERSION +1 + CHANGELOG 1줄**(자잘=CHANGELOG만, 정책대로 MAJOR 미사용).

#### ⏱️ v224 — 카운트다운(아이템 단계) 시계 스큐 수정 (팀원 배너 조기 사라짐)
- **증상**: 라이브가 팀 구성 누르면 팀원 기기에서 카운트가 "째깍 몇 번"만 울리고 퀵 상점(아이템 단계) 배너가 떴다 사라짐 — **팀원 입장에서만**.
- **원인**: `startItemPhase`가 호스트 시계 기준 **절대시각**(`itemPhaseEnd=Date.now()+15000`)을 세션에 저장 → 팀원 기기가 `remaining=endTime-Date.now()`를 **자기 시계**로 계산. 팀원 시계가 N초 빠르면 remaining=(15−N)초로 줄어 조기 완료. 부분 스큐(예 11초 빠름→4초)는 "정상 범위"라 범위검사로도 못 거름.
- **수정**(`startItemCountdown` ~L14789): `endTime`을 **단계 식별자**로만 쓰고(`_itemPhaseActiveEnd` 재진입 가드 — 세션 자식쓰기로 반복 호출돼도 리셋 안 함), 각 기기는 **처음 받은 로컬 시점 + 15초**(`ITEM_PHASE_MS`)로 카운트. 호스트가 팀 쓰면 세션 리스너 `stopItemCountdown`이 팀원 배너 자동 닫음(로컬이 더 길어도 안전).

#### 🛠️ v225 — 팀 결성 로비 안내 배너 (팀원 최하단)
- 라이브가 **참가자 선택 중**/**팀 결성 취소** 시 팀원이 알 수 있게, 일반·내전 진행 배너(`.ngb`)가 뜨던 **화면 최하단**에 상태 배너(`.lsb`) 추가(팝업 아님).
- **새 `/lobby` Firebase 노드**(라이브 송신 → 팀원 구독). 참가자 선택(`sessionPlayers`)은 로컬전용이라 동기화 안 됐던 것.
- 코드: `_lobbyBroadcastPrep`(선택 chokepoint 3곳 `_autoApplyChecked`/`applyChecked`/`removeSessionPlayer`)/`_lobbyBroadcastCancel`(resetSession, 미저장 팀존재시)/`_lobbyClear`(startItemPhase·confirmFixedTeams=결성시작) · 수신 `onValue(ref(db,'lobby'))`→`updateLobbyBanner`(preparing=진행자 준비중+본인 선택여부 / cancelled=7초 표시 후 자동 prep복귀). **가드**: liveMode 본인·이벤트·막고라 제외, "결성됨" 판정은 **result-section 가시성**으로(currentTeamA는 저장 후에도 유지돼 신호 부적합), preparing 30분 stale.

#### ⚡ v227 — 정산창 늦게 뜨는 문제 (팀원 투표 완료 후 지연)
- **원인**: 팀원은 정산을 직접 계산 안 하고 호스트가 `lastSettlement` 발행해야 받음 → 호스트 `saveMatch`가 **플레이어별 골드/LP 쓰기를 순차 await**(5:5=20+ 왕복=수 초).
- **(A) "정산 계산 중…" 로딩**(`_maybeShowSettlementPending`): 팀원이 투표 확정(mvp/manner 모두 confirmed) 시 표시 → `showMatchSummary` 도착 시 제거(20초 안전망, 참여자만, 호스트 제외). `applyMvpData`/`applyMannerData` 끝에서 호출, `closeEogOverlay`엔 **일부러 안 넣음**(세션 리셋이 정산 도착 전 EOG 닫아 공백 재발 방지).
- **(B) 골드 쓰기 병렬화**: `giveMatchGold`의 `for…of await processPlayer` → `Promise.all`(플레이어별 `gold/{key}` 독립경로·`goldData` 미변경·`applyLog`는 미사용·강탈 없음 → 레이스 없음 검증).
- **(C) LP 병렬화 = 검증만(미구현)** ⚠️ 다음작업자 참고: `s1ApplyMatchResult`(~L29077, 호출처 `s1ApplyAllMatchResults` 1곳뿐)는 `season1Data[자기키]` **복사**해 읽고 **자기 노드만** Firebase 씀(메모리 `season1Data` **미변경**)·`_pendingPromoNotif`(전부 isMe 가드=단일writer)·`_emblemLpRolls`(saveMatch서 미리 굴린 **읽기전용 스냅샷**)·마일스톤은 루프 **후** `results[]` 사용 → **플레이어 간 레이스 없음=병렬 안전**. ※`season1Data`는 **이름만 S1**, 실제로 `subscribeSeasonPlayers`가 `seasonNode('players')`=`season{CURRENT_SEASON}/players` 구독이라 **현재시즌(S2) LP**를 담음(변수명 레거시). 단순 `Promise.all`은 저위험. **배치(multi-location update)**는 더 빠르나 ①쓰기분리 리팩터 누락 위험(쓰기 3지점) ②원자실패 시 "경기저장+골드지급됐는데 LP만 미적용" blast radius ③시너지 lpDelta 경로 결합 ④이 환경 무테스트 → **신중**(로컬 검증 후). 사용자 지시로 검증까지만.

#### 🔨 v226·v228~233 — 강철심장(엠블럼) UX 대수술
- **v226**: 퀵 상점 강철심장 선택부(`_qibEmAccordion`)에 실제 효과 표시 — `_qibEmEffTxt(em)`(emblemEffectsOf→eff를 EMBLEM_EFFECTS icon/name/fmt로, LP=발동확률 `_emblemLpChance`, 해골감소=당첨보너스 `_lottoPrizeBonusG`). 시너지 선택부와 통일.
- **v229**: 🔨 **강철심장 관리 시트** — 내 아이템 슬롯이 작은데 💰판매·정보 과밀 → 실수판매·강화 어려움. 슬롯 인라인 💰 **제거**(깔끔), 탭→`openEmblemDetail(id)` 상세 시트(`.emd-*`): 장착/해제·🔨강화(안정/정밀/과부하 성공률·보유수, 미장착이면 자동장착 후)·💰판매(기존 confirm)·⚒️대장간링크. 핸들러 `emblemSheet{Equip,Enhance,Sell,Forge}`·`_emblemDetailHtml`·`_refreshEmblemDetail`. 강화는 `emblemEnhance` **직접**(forge-stage 연출 비의존, 성공/실패 토스트). 코드 ~L11207~11290.
- **v228→v230**: 소비 탭 강화권 "탭=즉시 강화" 사고. v228=확인창 추가했으나 **캐시/특정 탭에서 우회돼 여전히 바로 강화**(사용자 재제보) → **v230**: `_enchFromInventory` 재작성 — 탭만으론 **강화 안 함**, 장착 강철심장 관리 시트(`openEmblemDetail`) 열기. **작업대(`forge-stage`)에 직접 드롭한 경우만** 즉시 강화(의도 명확, `fromAnvilDrop`). `_bindEnchInventoryDrag` finish가 `droppedOnAnvil` 판정·전달. (⚠️`_bindForgeDrag`/`.fg2-tk` 랙은 **미렌더·미호출 죽은 코드**.)
- **v231**: 강철심장 슬롯에 **"성능 N"** 숫자 표기(`.inv-emblem-pow`, 성능 등급색 `glow.color`). +N만 보여 품질판단 어려웠음. (핵심: +N=성공횟수=간판, **성능=진짜 스탯**. +3 성능18 > +4 성능12 가능 — 정상설계, CLAUDE.md "엠블럼 강화" 명세.)
- **v232**: 강화 성공횟수(레벨 0~5) **테두리 색** 구분 — `_EMBLEM_LV_COLOR`=[회색,초록,파랑,보라,금,빨강], `_emblemLvColor(lvl)`. 슬롯 테두리/글로우/레벨배지(`--gc`)=레벨색, 성능숫자=성능 등급색(둘 분리). 장착중=inset+강글로우.
- **v233**: 🧰 **내 아이템 그리드 패널 밖 넘침 수정**(사용자 스샷 제보) — `.inv-grid` `repeat(N,1fr)`은 `repeat(N,minmax(auto,1fr))`이라 슬롯 **최소폭(34px 썸네일+패딩)**이 컨테이너보다 커져 맨 우측 칸이 화면 밖 잘림(v232 색테두리로 드러남). → `repeat(N,minmax(0,1fr))` + `.inv-slot`/`.inv-grid` `min-width:0`. 데스크탑 repeat(4)·모바일 repeat(3) 둘 다. (앱 타 그리드도 쓰는 검증된 패턴.)

#### ⏭️ 미해결/다음
- ⚠️ 사용자가 **"에러"** 언급(맥락 끊김, 구체 정보 못 받음) — 강화 건(v230로 해결)이었을 가능성. 별개면 재확인 필요.
- LP 병렬화(C) 실구현(로컬 검증 환경에서) — 위 v227 참조.
- 기존 미결: 🔒 보안 감사(전 세션부터·미결정), 복권 해골감소 인플레, 레벨 패스 S1식 되돌리기, 메인 배경 헥스필드 상시 최적화.

### v2.45.210~223 (2026-06-23) — 🧸 단짝 메인 통합(홈 3D 패널·별칭·빈상태 디자인) + 📱 모바일 + 🔒 보안감사

> 이 세션 = **로컬 컴퓨터**(win32, `C:\Users\sbs_n`). Firebase 직접 REST 가능(러너 우회 불필요). 전부 `index.html` 단일파일 + GLB 7종 교체. 커밋 규칙 동일(인라인 모듈 `node --check`, 한글 heredoc/PowerShell). 매 배포 APP_VERSION 명시.

#### 🧸 단짝 메인 홈 통합 (핵심 — `renderS1WaitingCard` ~L23960 + buddy 모듈 ~L31480~31900)
- **레이아웃**: 홈 대시보드를 `wm-home-row` 그리드로. **단짝 보유 시**(`_hasBuddy`) `[단짝 3D 세로패널 190px | wm-home-right(LP카드 flex:1 + 내전/막고라 duo) 1fr]`, 패스는 `wm-pass-full` 전체폭 아래로. **미보유 시** 매치정보 전체폭 + `_buddyHomePromptHtml()` **컴팩트 배너**(겹친 카드 부채꼴 `.bhp-*`, hover 펼침, 자리 축소). `_buddyMidLeft`(좌측3D)/`_buddyPrompt`(배너) 분기.
- **단짝 3D 홈↔패널 공유캔버스**: `_buddy3dOpen`→`_buddy3dShow(mountId, champFile, mood)`(패널=`buddy3d-mount`/홈=`buddy-home-mount`). 렌더루프 가시성게이트(`offsetParent===null` 스킵)+`performance.now()` 30fps 캡. 패널 닫으면 `_buddy3dClose`→`_buddyHomeAttach()` 홈복귀. ⚠️**버그수정 v216**: 홈카드 CSS(`.wm-home-row`/`.buddy-home`)가 `_injectBuddyCss()`(패널 열때만) 안이라 대시보드선 미주입→텍스트만 떴음 → `_buddyHomeCardHtml`/`_buddyHomePromptHtml` 시작에서 `_injectBuddyCss()` 호출(멱등 `#buddy-css`).
- **빈상태 디자인 진화**: 곰돌이🧸→챔피언7종 컬렉션(DDragon `champion/loading/{Slug}_0.jpg` 세로일러스트, 모은건 컬러·안모은건 흑백+🔒). 꽉채움(grid-auto-rows:1fr)→flexbox %높이 함정→**stage `flex-direction:column`+collect `flex:1`**(v222)→그래도 과해서 **컴팩트 배너 축소**(v223). 로스터=`['Teemo','Gwen','Vex','Ekko','Yone','Neeko','Lux']`.
- **별칭(nickname)**: `buddy_s2.nickname`(≤10자). `_buddyChampName(file)`=한글명(`champNamesKR[_clawDdKey()]`), `_buddyNameHtml(b)`=별칭+`buddy-champtag`(챔피언명 병행), `buddySetNickname`, `_buddyOpenName()`(입력모달 `.bn-*`). 패널 이름옆 ✏️(`!pv`만), 홈카드 별칭(크게)+챔피언명(작게), 선정모달 한글명+선정직후 `_buddyOpenName` 유도.
- **전체모션 GLB 교체**: 7종 GLB 아이들전용→전체모션(**Idle_Base 첫애니 유지=인형뽑기 무영향**, 21~33클립). 단짝3D `_buddy3dLoad` 클립맵+mood매핑(`_bClip`/`_buddy3dApplyMood`: 연승=Dance_Loop·평소=Idle_Base, 탭=`_buddy3dReact` Joke/Laugh/Taunt 1회). 합계 ~33MB(인형뽑기 로드 24→33MB, meshopt 압축 여지). 프리뷰: 콘솔 `buddyPanelPreview` + URL `?buddypreview[=챔프,무드,스택,레벨]`.

#### 📱 모바일 (v220)
- **단짝 하단배치**: `@media(max-width:560px){.wm-home-row{display:contents} .buddy-home{order:98} .wm-bottom-card{order:99}}` — 그리드 풀고 order로 단짝 아래로(매치정보 먼저).
- **스크롤 검은가림 완화**: 고정배경(`.hexfield` mask+`body.season-2::before/::after` opacity애니)에 `translateZ(0)`+`backface-visibility:hidden` GPU레이어 고정. ⚠️ 재현 못해 정석수정만 — **실기기 확인 필요**.

#### 🔒 보안 감사 (사용자 "모르는 사람 링크 시 문제?" — **미결정 과제**)
- **현황**: 규칙 읽기공개+쓰기`auth!=null`(v2.36.31)인데 `signInAnonymously` 자동발급→**링크 가진 누구나 전체 read/write/delete**. 계정=이름매칭(`getMyGoldKey`) 비번없음→사칭. 콘솔 노출 파괴/치트함수(`window.deletePlayer`/`deleteMatch`/`deleteMail`/`gachaTestGrant`/`clawCompleteAll`/`grantYuumi`/`resetSession`/`buddyReset`). 읽기공개→Riot ID·소환사명·일정(시간=생활패턴) 노출. 관리자 인증게이트 없음.
- **핵심개념**: 입장게이트(JS암호)=화면만(우회가능·1차문턱) ≠ Firebase규칙(유일한 서버방어). 앱구조=그룹원이면 공유데이터 같이수정(한명이 전원에 결과적용)→경계는 "그룹입장" 하나.
- **방어책(결정 대기)**: ①입장코드+콘솔가드(빠름·1차) ②**구글로그인+허용목록**(`/members/{uid}` allowlist, 규칙 `auth!=null && root.child('members').child(auth.uid).exists()`=진짜방어) ③규칙만 조이기(wipe/임의경로만·부분). `AskUserQuestion` 했으나 "핸드오프 최신화" 선택→**미착수**. 실제 현재 규칙은 Firebase 콘솔서 확인 필요.

### v2.45.208~209 + 인형뽑기 BUILD142~143 (2026-06-22~23) — 🕹️ 인형뽑기 리셋/5번째 버그 수정·오픈공지·피해자 보상 + 📬 공지우편 + ⚡ 복권 버벅임

> 이 세션 = 원격(web) 환경. ⚠️ **이 환경은 Firebase egress가 네트워크 허용목록에 없어 직접 REST 못 씀(403 "Host not in allowlist", `dangerouslyDisableSandbox`도 무효).** CLAUDE.md에 "Firebase REST 직접 작업" 기록들은 **로컬 컴퓨터** 세션이었던 것. → **이 환경에서 Firebase 읽기/쓰기는 GitHub Actions 러너로 우회**(러너는 인터넷 무제한): `.github/workflows/<일회용>.yml`(`.gitignore`가 `*`+화이트리스트라 `git add -f` 필요)을 `on: push: branches:[main], paths:[그 파일]`로 만들어 main에 푸시→자동 실행→`get_job_logs`로 결과 읽기→**실행 후 파일 제거**. RTDB 룰이 오픈이라 인증 불필요(curl/urllib PATCH/POST). 공개 레포라 러너 로그=공개니 민감정보 최소 출력. (로컬 컴퓨터면 이 우회 불필요 — Firebase 직접 REST 가능.)

#### 🕹️ 인형뽑기 버그·운영 (BUILD142~143, 프로토타입 `인형뽑기-물리-목업.html`+`claw.html`)
- **BUILD142 — 실게임 리셋버튼 숨김**: 리셋(R)=인형 배치 재추첨인데 IDLE에서 `held===null`이라 **코인 내기 전 무한·무료 re-roll**(유리 배치 나올 때까지) 어뷰즈 가능 → `ENF`(EMBED‖ENFORCE)면 `#reset` `display:none`+R키/클릭 가드. 로컬(ENF off)만 노출.
- **BUILD143 — 5번째(마지막) 플레이 집기 먹통**(팀원 제보, 핵심): `startGame`이 마지막 코인 소모(또는 playsUsed=DAILY_MAX 도달) 직후 `updDailyHud()`가 `canPlay()`(이제 false)로 `#drop`(집기) 버튼 비활성화. 게다가 그 호출이 `state='READY'` **전**이라 READY 돼도 안 켜짐 → 5번째엔 크레인은 움직여도 집기 죽음. 수정: ① `updDailyHud`의 drop.disabled = `(state==='IDLE') ? !canPlay() : false`(진행 중엔 항상 집기 가능 — 코인 이미 지불, `canPlay`는 START만 게이트) ② `startGame`에서 `state='READY'`를 `updDailyHud`보다 먼저. **코드: `인형뽑기-물리-목업.html` ~L963 updDailyHud / ~L977 startGame.**
- **데이터 모델 메모**: 앱 임베드 claw 필드(sField) `clawPlays_s2`(오늘 사용수·`clawPlayDate_s2`==오늘이면 유효, 새날 0)·`clawCoins_s2`(잔여)·`clawCollected_s2`(수집 인형 배열, 7개=2단계 무제한). 1단계 `playsUsed` 캡=`DAILY_MAX`(5). 코인=출석 5/일+오픈기념5. `_claw3dInit`/`_claw3dSave`(index.html ~L31378).
- **운영 처리(러너)**: ① **인형뽑기 오픈 공지 우편 전체 발송**(mail id `-Ovivkybex8aGfGPzlnx`, target:all·프리즘18종 완성 해금 안내) ② **5번째 버그 피해자 6명 조회**(첫날 `clawPlays_s2>=5`): 나랑듀오해듀오·빛나는언즈·ap렉사이서폿·럼블홀릭·IfCES + 애긔반달곰(테스트계정, coins0·plays2) ③ **보상**: 각 `clawCoins_s2 +1`(헛쓴 코인 환급) + **플레이 기회 +1**. ⚠️ 보상 교훈: 처음 `clawPlays_s2=0` 리셋했다가 사장님 지적("일일 5회 한도라 0리셋은 의미없음, 코인6개여도 못 씀")으로 정정 → **`clawPlays_s2 = -1`**(음수면 canPlay가 오늘 6회 허용=원래5+1, 한도는 그대로). 애긔는 06-23 2판이라 `1`. **⚠️ +1기회는 `clawPlayDate_s2`=오늘 기준이라 그날 안 쓰면 일일리셋으로 소멸**(코인+1은 영구). ④ **보상 안내 우편 6명**(mail id `-OvkU9ORLtkiG0jHZkwN`).

#### 📬 v2.45.208 — 공지 전용 우편 지원 (index.html)
- `sendMail`(~L21246)이 보상 비면 거부하던 걸, **desc(공지)만 있으면 발송 허용**(rewards:{}). 우편함 `openMailbox`(~L21174): 보상 없는 우편은 보상칩 줄 숨김 + "보상 받기"→**"확인"**, "수령 완료"→"확인 완료". `claimMail` 토스트 보상없으면 "📬 확인했어요!". → 인형뽑기 오픈/보상 안내 같은 **공지 우편** 가능. (러너 발송 시 `season:2`·`target` 배열/`'all'` 직접 박아 POST.)

#### ⚡ v2.45.209 — 복권 긁기 버벅임 수정 (index.html, 사용자 제보 "뒷배경↔복권장 상관관계?")
- **원인 확정**: 긁기 모달 `.scard-overlay`의 풀스크린 `backdrop-filter: blur(8/9px)`(~L2859·시즌2 ~L3200)가, 상시 애니메이션 중인 **배경 헥스필드 `.hexfield .route-pulse`**(`hexFlow infinite`+drop-shadow, ~L190)를 **매 프레임 다시 블러 계산** → 긁기 캔버스 `getImageData` 리페인트(~L25636·DPR≤2)와 겹쳐 버벅임. 오버레이 배경이 불투명이라 블러는 **안 보이는데 계산만 낭비**.
- **수정**: ① `.scard-overlay`/`.season-2 .scard-overlay` backdrop-filter 제거(외관 무변) ② `body:has(.scard-overlay) .hexfield .route-pulse{animation-play-state:paused}`(`:has()` CSS라 JS·닫기경로 관리 없이 자동). ⏭️ 메인 배경 헥스 상시 최적화(펄스 수↓·모바일 drop-shadow 제거)는 여전히 미적용.

### v2.45.195~207 (2026-06-22) — 🧸 단짝인형 구현 + 🎁 일정 보상 + ⚔️ 팀원배너 효과변경

> v2.45.194(3D 인형뽑기 오픈)에서 이어서. 전부 푸시·배포 완료. 커밋 규칙 동일(인라인 모듈 `node --check` 후 커밋, 한글 heredoc UTF-8). 프로토타입 변경 시 claw.html 재생성(cp+`BUILD N · claw` sed).

#### 🧸 단짝인형 Phase 2 구현 (v195~201) — index.html `_prismClawHtml` 부근(~L31250대)
- **백엔드(v195)**: `BUDDY_WIN/LOSS_REWARDS`·`BUDDY_UP_RATE`{1:.3,2:.2,3:.15,4:.1}·`BUDDY_LV_NAMES/DESC`·`buddySelect`(변경불가)·`_buddyUpgradeAttempt`(확률강화)·`_buddyOnPull`·`_buddyGrant`(보상→기존필드)·`buddyClaim`·`_buddyOnMatch`(스택+Lv3안전망). Firebase `buddy_s2{champion,level,selectedAt,pulls}`·`buddyStreak_s2`·`buddyUpgradeLog_s2`·`buddyClaimLog_s2`·`buddyLastMatchTs_s2`(결과 스냅샷=역산).
- **UI+자동연동(v196)**: `_buddyOpenSelect`(7종완성 선정)·`_buddyOpenPanel`(스택+수령+강화단계 리스트)·`_buddyEntryHtml`(컬렉션탭 인형뽑기 입구 버튼)·`_buddyProcessMatches`(매치 리스너 L12168서 내 S2 참가매치 시간순 스택 자동반영, `buddyLastMatchTs`로 중복방지). 브릿지: 프로토타입 checkHole `_postParent('pull',{champion})`·`_onCollectionComplete`→`complete`, 앱 onClawMsg `pull`→`_buddyOnPull`·`complete`→`_buddyMaybePrompt`.
- **강화 연출 3D(v198~199)**: 단짝 뽑으면 인형뽑기(iframe) 안에서 그 챔피언 **3D 모델 클로즈업** 연출. 앱 `_buddyShowUpgradeFx`(iframe에 `upgradeFx` 메시지)→프로토타입 `_showUpgradeFx`/`_stepUpgradeFx`(등장→충전(회전가속+글로우)→리빌 성공/실패+플래시+광선+폭죽, `Sfx.charge/boom`). 2D 폴백 `_buddyUpgradeFx`. 프리뷰 `buddyUpgradePreview(t/f,lv,champ)`(인형뽑기 열고 실행=3D).
- **정보패널(v200~201)**: 패널에 `_buddyLvListHtml`(Lv1~5 효과·잠금·다음 성공률)+능력 설명. 프리뷰 `buddyPanelPreview(lv,type,count,champ)`(데이터 무변경).
- **콘솔 테스트**: `buddySelect/buddyMatch/buddyClaim/buddyState/buddyReset` · `clawCompleteAll()`(컬렉션 7종 즉시완성, v197). ⚠️ 미검증: 7종 완성자 아직 없어 실기기 미검증 / 연패 LP아이템(LP2배권·방어권 items push) S2 작동 확인 필요. 보상명세는 위 "컬렉션 2단계 보상/단짝 강화" 섹션 참조.

#### 🎁 일정 보상 (v202~204) — index.html `_renderSchedule` 부근(~L24430대)
- **규칙**: 일정 달력서 "참여 가능"으로 **사전 등록**한 날 + 그 날 실제 게임(내전 matches OR 일반 normalMatches)=**복권 1세트**(freeScratch 실버/골드/프리즘 각1) 그 날짜 셀에서 수령. 셀 🎁(가능)/✓(받음), 코너배지 🎁.
- **소급 X / 당일작성 X**: `SCHED_REWARD_FROM='2026-06-22'`(그 전 제외) + **등록시각(at)이 일정날짜보다 전이어야**(당일 작성 보상X). 헬퍼 `_tsDateKey`·`_myPlayedDates`·`_schedRewardState`·`schedClaimReward`. 저장 `schedRewardClaimed_s2={dk:true}`. 매치 리스너서 배지 갱신.
- **⚠️ availability 값 구조 변경(v204)**: `availability/{dk}/{name}` = `true` → **`{at(최초등록ms), time('HH:MM')}`** (레거시 true 호환, `_availAt`/`_availTime` 헬퍼). 편집플로우 `_schedEditSet`(Set)→`_schedEditMap`(날짜→시간), 칩에 `<input type=time>`(`schedSetTime`), 명단에 시간 표시. **시간만 수정 시 `at` 유지**(`at:_availAt(ov)||now`)라 사전등록 자격 안 깨짐.

#### ⚔️ 팀원 아이템페이즈 배너에 시너지/강철심장 변경 (v205~207) — index.html ~L15700대
- **목적**: 라이브 계정 아닌 **팀원 각자**가 팀구성 카운트다운 중 자기 **아이템+시너지+강철심장**을 한 곳에서 변경. (라이브 prep바 아님 — 원복)
- 배너(`member-item-phase-bar`, `startItemCountdown`서 빌드)에 `#mipb-fx` 추가 → `_mipbRenderFx`가 `_qibSynAccordion`+`_qibEmAccordion` 렌더.
- 시너지=`_ownedSynergyList`+`equipSynFromMain`(대기화면 L23899/23904와 **동일 함수**) / 강철심장=`getEmblems`(성능순)+`equipEmblemFromMain`(L23858/23862와 동일)+등급(실버/골드/프리즘)·해제. 래퍼 `qibEquipSyn`/`qibEquipEm`(장착후 `renderQuickItemBar`). 칩 추출 `_qibChipsHtml`. S2 톤 CSS(`.qib-acc`/`.qib-opt`/`.season-2 .qib-*` 골드). ✅ 코드대조=메인과 동일·보유분만.

### v2.45.194 (2026-06-22) — 🕹️ 3D 인형뽑기 앱 통합 정식 오픈 (컬렉션 게임 1단계)

> 독립 3D 프로토타입(`인형뽑기-물리-목업.html` BUILD134)을 앱에 **iframe + postMessage 브릿지 + Firebase**로 통합. **상세 설계·코드맵은 위 "🕹️ 인형뽑기 물리 프로토타입 > 🖥️ 앱 통합 정식 오픈" 섹션 참조(완전판).** 요약:
- **해금**=가챠 프리즘 18종 완성자만. **코인**=출석으로 지급(오전+2·오후+3=하루5, `doBingoAttendance`), **오픈기념 5코인** 1회. **게임**=포로 제외 챔피언 7종 수집(여러 날). Firebase `clawCollected/Coins/Plays/PlayDate/LaunchBonus_s2`.
- **2단계(반려인형+연승/연패 스택)**: 보상명세 확정(위 섹션), 구현은 다음. 연패 LP회복·연승 스펙업, S1 286경기 달성률로 난이도 보정.
- 프로토타입 BUILD124~134: 컬렉션 1단계·상단 패널(ddragon 초상화)·코인 경제·임베드 브릿지. claw.html=소스 cp+`BUILD N · claw`.

### v2.45.177~193 (2026-06-19~20) — 🃏 가챠 시너지 재설계·밸런스 + 강철심장/시너지 대기화면 아코디언 + 컬렉션 북 + 프로필 창화 + 스크래치 버그 + 패스 보상 라벨

> 다른 컴퓨터가 v2.45.177(레벨 표시)·v2.45.178(가챠 시너지 11종 재설계+대기화면 시너지 아코디언)을 main에 푸시. 이 세션은 거기서 이어받아 v2.45.179~193 진행. **전부 푸시·배포 완료.** 커밋 규칙 동일: 인라인 모듈 추출 `node --check`(주석줄만 매칭) → 통과 시 커밋 → 작업브랜치(`claude/work-another-computer-e8qpq9`)+`main` 양쪽 push. 커밋 author=`noreply@anthropic.com`(Unverified 경고 회피). ⚠️ Firebase REST·라이브 GitHub Pages는 **이 환경 네트워크 허용목록에 없어 직접 조회 불가**(시뮬·라이브검증 불가, 코드 분석으로 대체).

- **🔨 강철심장 걸작 대기화면 아코디언 (v179~182)**: "⚔️ 전투 준비 효과" 카드의 강철심장 칸을 시너지와 **동형 아코디언**으로. 코드 `renderS1WaitingCard`(~L23600대): `emCell`(헤더=장착중 + 성능치 + 효과) + `emBody`(보유 강철심장 목록 선택·장착). **핵심 설계**: ① 클릭한 셀 바로 아래 펼침 위해 `.wm-fx-grid`(2열)→`.wm-fx-stack`+`.wm-fx-unit`(세로) ② 보유 강철심장 목록(`getEmblems`)에서 선택→`window.equipEmblemFromMain(id)`→`emblemEquip`(=장착 교체) ③ 효과는 **이모지칩 폐지→텍스트 3줄 행**(`_emEffLines`: 걸작 3줄 모두 풀어 "경기 골드 +5"식, `emblemPerLine` 값, 승리/패배LP는 발동% 부기) ④ 펼침 화살표(`.wm-em-chev`/`.wm-syn-chev`) 골드 원형+펄스(`wmChevPulse`) 강조 ⑤ 정렬: 강철심장 `emblemPower` 내림차순·시너지 `_ownedSynergyList` tier 내림차순. CSS `.wm-em-*`(L1666대), `.season-2` 무관(전 시즌).
- **📖 가챠 컬렉션 북 (v183)**: 3성 18종 컴플리트 시 카드를 부채꼴로 묶던 `_prismDeckHtml` **제거**(뿌듯함 저하). 대신 파편/2성/3성 **모두 동일 톤 액자**(`_gachaBookHtml`/`_injectGachaBookCss`/`_gachaTierProgress`, L31039대): 등급색 프레임 + 페이지 + 수집 진행바 `N/18` + 컴플리트 시 「🏆 컴플리트」 골드 리본. 카드 그리드(`.pet-grid`)는 그대로 펼침. 3성 컴플리트 시 인형뽑기 버튼=`_prismClawHtml`(북 아래). `prismDeckPreview()`/`?prismdeck`는 이제 컴플리트 미리보기.
- **🪟 프로필 모달 = 중앙 창 (v184~186)**: 바텀시트(하단 슬라이드업)→**화면 중앙 다이얼로그**. `.profile-modal-overlay` `align-items:flex-end`→`center`, 핸들바 `display:none`, `slideUp`→`popIn`(scale), `border-radius` 전체, 높이 80vh(사방 여백=떠보임), 모바일 max440·PC max460. **시즌2 헤더 타이틀바화**: 인라인 `border-top:3px tier색`(바텀시트 느낌) 제거 → `.season-2 .pm-s1-header` 웜블랙 그라데이션+골드 상단 헤어라인+골드 하단보더(L325대). 본인/타인·S0/S1·S2(`.pm-s1`) 공용 컨테이너라 일괄 적용. ※티어색(랭크) 액센트는 유지(시즌무관 예외).
- **🃏 가챠 시너지 밸런스 (v187~188, v190 설명)**: S1실데이터 EV 점검 결과 2개 아웃라이어 하향. **유레카(mage,risk_win)**: 승+8/+10·패−8 → **승+5/+6·패−6**(타 시너지 +2~4 대비 과함). **공허 균열(void,risk_block) 3성**: 실패 −4 → **−10**(50% 전액방어+실패−4=EV+2.5LP/판 broken → +1LP/판 정상화. 2성 −6은 EV 0 공정 유지). 나머지 9종은 균등스킴(2종1/2·3종2/3·4종3/4) 부합=무변경. **효과텍스트 명확화**: 유레카=승리만 조건+확률·패배는 조건없이 확률, 공허=패배만 발동·전액방어/실패추가손실·승리무효과. `GACHA_SYNERGY_GROUPS`(~L30890)·`_synEffTxt`(~L30845). CLAUDE.md 시너지표도 갱신됨.
- **🔌 브릿지 미연결 경고 (v189)**: 팀 구성 진입(`startItemPhase`) 시 브릿지 꺼져있으면 팝업(`#bridge-warn-overlay`, 취소/그래도 진행). `_isBridgeConnected()`(operators 120s/heartbeat) 신설. 이벤트·막고라 제외, 연결 시 미표시. "그래도 진행"=`startItemPhase(true)`. 팝업=save-confirm 스타일+`.season-2` 블랙골드.
- **🎟 스크래치 복권 버그 (v191)**: 당첨(매칭) 확정 시 `finishReveal`이 `allDone=true`→`scratchAt`이 **모든 칸 긁기 차단**해 남은 칸 안 긁히던 것 수정. `scratchAt` early-return에서 `allDone` 제거(결과는 확정시점 고정·불변), `revealCell`은 `allDone` 후 해골 패널티 제외(구경용 공개). ~L26727.
- **🔶 걸작의 정수 250G (v192)**: `EMBLEM_REROLL_PRICE` 120→250(L9529). 구매·UI·되팔기(95%=238G) 전부 상수참조라 자동 반영. (만렙 LV50 해금은 그대로)
- **🎫 시즌2 패스 보상 라벨 (v193)**: 퀘스트 패스 보상이 이모지만(🪙숫자·🔶숫자·🏷️)이라 모호 → 텍스트 라벨(`_s2PassRewardChips` ~L19675: "🪙 골드 NG"·"🟢 안정 강화권 ×N"·"🔶 걸작의 정수 ×N"·"🏷️ 칭호 \"증바람의 증인\""). 보상칩을 우측 96px 칸→퀘스트 설명 아래 full-width 줄(`.s2q-reward` L5453 max-width 제거).

#### ⏭️ 다음 작업 후보 (이 세션 미적용)
- **⚡ 성능 최적화 (사용자 요청·진단만 완료, 미적용)**: 전반 점검 결과 — ① **시즌2 배경 헥스필드**(`_buildHexfield` L6502: 8펄스경로×`filter:drop-shadow`+`hexFlow infinite`)가 메인 배경에 **상시** 돌아 모바일 발열/끊김 1순위 → 펄스 4개로↓ + 모바일 drop-shadow 제거 권장 ② `renderAllWhenReady`(L12087/12147)가 matches/players 변경마다 **탭 무관 전체 재렌더**(renderMatchHistory/renderRanking) → 현재 탭만 렌더 게이트 ③ `.nav-tabs`/corner badge **상시 backdrop-filter blur** → 불투명 배경으로 ④ `gold` onValue(L12100) 디바운스. (3D 루프·renderShop은 이미 가드됨). 사용자가 "1·2·3 묶어 적용" 의향 보였으나 미실행 — **이어서 적용하면 됨.**
- **🐱 유미 파견 걸작**: 파견 시간만 단축(보상 고정·일일캡 없음)이라 "다운사이드 없는 throughput 증가"=인플레 우려. 사용자에 **유미 골드 일일캡 추가** 추천함(미결정).
- 레벨 시스템 후속(패스 되돌리기·곡선 튜닝), 복권 골드·프리즘 양수EV(해골감소 인플레) 미해결 — 기존 미결 항목 유지.

### v2.45.151~163 (2026-06-16~17) — 🕹️ 인형뽑기 미니게임(라이브 비활성) + 복권/대장간 다듬기 + 유미 노출/크기 + 복권 EV 후속 + 가챠 데이터 복구

> 이 세션은 v2.45.151부터. 전부 푸시·배포 완료. CHANGELOG/커밋 규칙(주석줄 매칭·모듈 node --check `&&` 게이트) 동일. 배포검증=pages-build-deployment + APP_VERSION 폴링.

- **v151 복권 Hub 깜박임**: gold onValue마다 `openLotteryHub()` 전체 호출(오버레이 remove+recreate)→다른 팀원 복권 시 깜박. `_lhTierAttemptStats`/`_lhSyncAttempts` 추출, 내 골드/freeScratch 변경 시만 전체렌더·아니면 `#lh-attempts-{idx}`만 제자리 갱신.
- **v152 대장간 걸작 효과 이름 …잘림**: `.fg2-eff-num`을 우측 세로스택으로(값 위/`.fg2-eff-sub` "발동N%"·"🪙당첨+NG" 아래), `.fg2-eff-lbl` flex:1+min-width:0.
- **v153 🐱 유미 파견 전 숨김**: `_renderYuumiPanel` ready 상태 `_setYuumi3d('idle')→null`(보내야 등장). v155~159 파견중(dig) 크기·위치 튜닝: `DIG_SCALE`(→0.45)·`DIG_DX`(왼쪽 −0.6, dig 상태만). 25460대 `ensureYuumi3d`.
- **v154 🗑 복권 버리기 다이얼로그**: 네이티브 `window.confirm`→커스텀(`.scard-buy-confirm-*` 재활용 + `.scard-discard-ok` 테라코타). 26700대 scard-discard 핸들러.
- **🎲 복권 EV 검증/조치 (중요·미완)**: rollScratch 100만 시뮬=기반 음수 EV 정상(실버78.8·골드69.5·프리즘76.3%). **단 강철심장 "해골감소(lottoTkt)" 걸작이 (1)해골셀↓→당첨률↑ (2)페널티↓ (3)`_myLottoPrizeBonus`(해골감소줄 보유 시 당첨 +줄당min(30,성능)G·최대90G)로 골드·프리즘을 양수 EV로 만듦**(럼블홀릭 만렙=성능24·해골감소2줄=해골70%감소+보너스48G → 실측 회수율 116.5%, 시뮬 골드110·프리즘143%). **v122에서 실버만 보너스 차단**(`_myLottoPrizeBonus(data,tierIdx)` tierIdx0→0). ⚠️ **골드·프리즘의 win-rate boost는 미해결** — 사용자 결정 대기(해골감소를 출현↓ 대신 페널티만↓로 변경 / 상한↓ / 보너스 제거 등). 시뮬: SCRATCH_TIERS+rollScratch를 Node 복제, 단순확률 말고 직접실행.
- **v160 🕹️ 인형뽑기 미니게임 (신규, 가챠 엔드게임)**: 프리즘(s3) 18종 완성 해금. 컬렉션 탭 진입배너(`_clawEntryHtml`). 크레인 좌우 스윕(rAF)→내리기→가장가까운 챔프 정렬도×집기확률(미끄러짐). 성공=그 챔프 인형(`plushies_s2`)+소량골드(`goldBonusLegacy_s2`), 하루3회(`clawCount`/`clawDate_s2`), 18종완성 1회성(정수×3·1000G·`plushieMaster_s2`). CSS는 `#claw-css` 1회주입. **⚠️ v163 `CLAW_ENABLED=false`로 라이브 비활성(튜닝중)** — `_clawEntryHtml` 배너숨김+`openClawMachine` 실사용차단. **프리뷰=콘솔 `clawTest()` 또는 URL `?claw`**(테스트모드 `_clawTest`: 해금·일일제한 무시+Firebase 미기록, 닫으면 해제). 출시=`CLAW_ENABLED=true`. 30680대.
- **🔑 가챠 테스트 도구 안전화 + 데이터 복구 사건 (교훈)**: `gachaTestGrant()`가 `champCards_s2`를 백업없이 덮어쓰고 `gachaTestReset()`이 null로 지워 **애긔반달곰(key `-OowXInAIfDm6j7PKe0M`) S2 컬렉션 소실**. ⚠️ **gachaLog_s2엔 뽑기 세션비용(450G·10연)만 기록·카드결과 미기록 → 정확복구 불가**(Firebase 버전히스토리 없음). → **130연(5850G) 동등 재현**(확률 3성3%/2성10%/파편87%, 각챔프 최소파편1, 합성안한 원본130장)으로 REST PATCH 복원. **재발방지: gachaTestGrant가 champCardsBak/champCardLogBak에 원본백업, gachaTestReset이 백업복원**(v161).

### v2.45.125~150 (2026-06-16) — 🐱 쓰레기통 유미 3D 모델화(대장정) + 복권 팝업/겹침/호버 다듬기

> 이 세션 핵심 = **쓰레기통 유미를 2D 컷 → 진짜 3D 모델로** 전환(three.js, 오른 대장간과 동일 패턴). 압축·렌더·위치·모션·효과음·발열까지 길게 반복. 전부 푸시·배포 완료. 커밋 규칙 동일(모듈 `node --check` `cd /c/Users/sbs_n/Desktop/aram &&` 프리픽스 — **작업 디렉토리 리셋되니 절대경로/프리픽스 필수**). **배포 시 버전 항상 명시**(사용자 요청, 메모리 `feedback_state_version_after_deploy`). 그 사이 v110~124는 다른 컴퓨터(스크래치 복권 목업 정합 등).

- **v125~128 복권 다듬기**: 구매확인 팝업 시인성(흰 50%→85%·배경 딤·버튼 글자 tierMeta.fg) / 스크래치 모달 열 때 백드롭 페이드(`lottOvIn`) 제거(뒷배경 겹침) / 허브 카드 호버 시 `backdrop-filter`+`transform` 합성 번쩍임 → `.lh-overlay` 블러 제거+딤↑ / **만능 긁개 구매·장착을 복권 모달로 통합**(허브 도구 섹션 제거, 미보유 시 모달서 인라인 구매=active:true).
- **v129~130 쓰레기통 재단장(2D)**: `_trashLayoutJunk` 랜덤→바닥 더미(꽉 참, 16개) / 유미를 통 리드 걸터앉기→메인 통에서 뒤지는 2D 모션(이후 3D로 대체됨).

#### 🐱 3D 유미 (v2.45.131~150) — 핵심. 코드: `ensureYuumi3d`/`_setYuumi3d`/`_evacuateYuumi3d`(~L25390~), 마운트 `#yuumi3d-mount`(트래시 HTML), CSS `#yuumi3d-mount`(~L2048), `_renderYuumiPanel` 상태 분기(~L25530)
- **에셋**: `assets/pets/Yuumi/3d/yuumi-idle.glb`·`yuumi-dig.glb`(둘 다 미니_유미(진입)=`Dance_Loop` 반복)·`yuumi-rest.glb`(미니_유미(휴식)=`Death` 1회+clamp). 원본 GLB는 바탕화면. **gitignore 화이트리스트 `!assets/pets/*/*/*`로 자동 추적**.
- **⚠️ 압축 교훈 3가지(중요)**: ① `gltf-transform optimize` 프리셋은 **flatten/join/weld가 스킨드 애니 모델을 파손** → 반드시 **`webp`/`meshopt` 개별 변환만**. ② **webp 텍스처 변환이 `KHR_materials_unlit` 모델 외형을 깨뜨림**(unlit=텍스처가 곧 외형) → **PNG 유지 + `meshopt`만**. 최종 명령: `gltf-transform meshopt in out --quantize-position 16 --quantize-normal 14 --quantize-texcoord 16 --quantize-weight 16 --quantize-generic 16` (webp 안 씀, ~1MB). ③ 오른 GLB도 스킨드+meshopt+음수스케일인데 정상 → meshopt·음수스케일 자체는 무해, optimize·webp가 범인. (gltf-transform 4.4.0은 `npm i -g @gltf-transform/cli`로 설치됨)
- **렌더 패턴**(오른과 동일): 캔버스 1개 holder 보관→마운트 이동, 렌더 루프 **자가복구**(마운트 보이면 캔버스 자동 부착, 안 그러면 영영 안 그려지던 버그). 모델을 `THREE.Group`에 담아 `position/scale/rotation` 변형. **카메라=바운딩 스피어 fit**(전체 보이게).
- **위치값**(테스트 페이지에서 잡음): `YUUMI_POS={x:0.18,y:-1.92,scale:0.68,rot:0}`(반지름 비율). 마운트 `top:-96;width:272;height:205→349`+카메라 여백 `×2.465`(=1.45×1.7) — **잘림 방지로 캔버스 확대(비례보정해 크기·위치는 동일)**. `DIG_SCALE=0.85`(뒤지기만 작게).
- **상태 매핑**: foraging→'dig', cooldown→'rest', ready/done→'idle'. 휴식(Death)은 **끝 프레임=책 상태에서 정지(숨기지 않음)**.
- **연출**: 파견 중 `_yuumiStartJunkJiggle`(430ms마다 `_trashRustle` 랜덤점 → 쓰레기 들썩+사각사각). 효과음 `_trashSfx`에 `recall`(휴식)·`deploy`(파견) 추가. 인공 다이브 `DIG_DIP=0`(Dance_Loop 자체가 뒤지기).
- **🔥 모바일 발열 완화(v150)**: 렌더 루프 **30fps 캡**(`_y3dLast` throttle)+dt 클램프, **DPR 2→1.5**, `antialias:false`+`powerPreference:'low-power'`, `.trash-overlay` **backdrop-filter 블러 제거**. 뚜껑 깜빡임(canvas 60fps가 뚜껑 위에서 재합성) → `.trash-lid`/`.trash-body`에 `will-change:transform`+`backface-visibility:hidden`로 독립 레이어.
- **🛠 진단 도구 `유미3d-테스트.html`**(gitignore 화이트리스트, 배포됨): 대기/폴짝/휴식 토글 + **버튼식 위치 조정**(위/아래/크게/작게/회전, 결과 4값 출력) — 슬라이더가 비직관적이라 버튼으로 재작성. 앱과 동일 설정(마운트·카메라·DIG_SCALE) → 값 1:1 적용. 진단용 임시 GLB(raw/safe/pt/mo, 37MB)는 v150 후 삭제 완료.
- **⏭️ 남은/제안**: 미니 '대기' 전용 모션 없어 ready/done도 Dance 사용(사용자 제공 시 분리). 발열 더 심하면 캔버스 축소·가시성 기반 렌더 정지 여지. 위치/크기/다이브 깊이는 상수(`YUUMI_POS`/`DIG_SCALE`/`DIG_DIP`)로 조절.

### v2.45.123~124 (2026-06-16) — 🎟 스크래치 복권 긁기 끊김 수정(window 바인딩) + 뒷배경 스크롤 락 + 🐱 유미 걸작 효과 검증

> 사용자 제보 2건. 전부 푸시 완료. CHANGELOG/커밋 규칙 동일(주석줄 매칭·모듈 node --check `&&` 게이트).

- **v123 🎟 긁기 원 밖 끊김 수정**: 긁기 이벤트가 각 칸 캔버스에만 `pointerdown/move/up`+`setPointerCapture`로 묶여, 셀(원) 밖으로 드래그 시 일부 환경에서 캡처 풀려 끊김. → **`pointermove`/`pointerup`을 window에 바인딩**(`_activeScratch`로 시작 칸 기억) → 어디로 나가든 그 칸 계속 긁힘. `setPointerCapture`는 유지(이중안전). 모달 닫히면 `document.body.contains(overlay)` 체크로 리스너 자동 정리. 코드 ~L26430(showScratchModal 내 바인딩).
- **v124 🎟 뒷배경 스크롤 버그**: 복권 모달(`showScratchModal`)만 **body 스크롤 락이 없었음**. → 열 때 `document.body.style.overflow='hidden'`(~L26086) + 모달 `overscroll-behavior:contain`(~L2736 오버레이·~L3109 season-2 모달). 닫는 경로가 8곳(`overlay.remove()`)+`_closeTicket`이라, **MutationObserver로 오버레이 제거 감지→락 복원**(한 곳에서 처리, 8곳 안 건드림). ⚠️ 전체 파일에 `overlay.remove();` 16개(다른 모달 8개 포함)라 전역 치환 금지 → observer 방식 채택.
- **🐱 유미 걸작 효과 검증(코드리뷰만, 변경 없음)**: `yuumiCut`(파견단축)·`yuumiCool`(휴식단축) **정상 적용** 확인. 핵심=**액션 누르는 시점 박제**: 파견(`deployYuumi`)→`f.forageMs`에 `_yuumiForageMs`(장착걸작 기준) 박제, 수령(`collectYuumi`)→`cooldownUntil`에 `_yuumiCooldownMs` 박제. `_yuumiState`가 `f.forageMs||기본` 사용 → **진행 중 장비 빼/교체해도 그 사이클 안 바뀜, 다음 사이클부터 반영**. yuumiCut=파견시점·yuumiCool=수령시점 평가(시점 다름). 하한 30분. 유미 미보유 시 dead line(의도).

### v2.45.115~122 (2026-06-15~16) — 🎟 스크래치 복권 목업 정합·레이아웃 다듬기 + 만능긁개 모달 토글 + 패스닷 버그 + 복권 EV 검증

> 다른 컴퓨터가 v2.45.85~114 진행(스크래치 셀 목업 정합·크기 프리뷰 등). 이 세션은 v2.45.115부터. 전부 푸시·배포 완료. CHANGELOG/커밋 규칙(주석줄만 매칭·모듈 node --check `&&` 게이트) 동일. 배포 검증=매 푸시 후 pages-build-deployment + APP_VERSION 폴링.

- **v115 실버 복권 목업 정합 (4종)**: 제목 가독성(흐린 메탈→음각 어두운 그라데이션·`scard-title` 3005/3058), 동전 셀 바깥 흰 링 추가(3069) + `_scardDrawCover` 실버 커버 빛반사 대각 스트릭, 칸 4칸 한 줄(폰 2×2 폴백), 모서리 ㄱ자 `.scard-corner` + 하단 `.scard-brand` 추가. **→ v121에서 모서리·브랜딩은 사용자 요청으로 다시 제거.**
- **v116 칸 간격**: 디스크 은화 링(~7px)이 gap보다 커 겹치던 것 → 3종 row-gap 20px·열 간격 확대.
- **v117 도구 배지 위로 + 비율**: 🔑 도구 배지를 본문 중간→헤더 제목 줄 아래(`.scard-head` flex-wrap+`.scard-tool-row`). 실버 디스크 키움.
- **v118 🔑 만능 긁개 모달 토글 (신규)**: 헤더 "적용" 표시 떼고 모달 최하단에 `.scard-equip-row`(장착/해제). 토글=`scratch_key` item.active 플립(Firebase)+`brushMult`/`revealThreshold`를 `let`으로 라이브 갱신. 보유자(non-test)만. resume도 현재 active 반영. ※ 만능긁개는 v2.43.234~ 장비아이템(active=장착).
- **v119 안내문 최하단·흐리게 + 채움**: rule/hint를 `.scard-foot-info`(opacity 0.5·9px)로 하단 이동. 디스크 확대로 빈 공간 채움(골드 cellwrap 104→136·grid 488 = 양옆 여백 컸던 것 해소).
- **v120 🟡 패스 탭 닷 미표시 버그 (중요)**: `updateS1PassTabBadge`가 보류된 포인트패스용 **로컬** `_isS2PassClaimable('custom'/'normal')`(9640) 호출→항상 false. **동명이인 함정**: `window._isS2PassClaimable`(19096)=활성 퀘스트패스, 로컬 함수=비활성 포인트패스. → `window._isS2PassClaimable('quest', myData)`로 교체(대기카드와 동일).
- **v121 정리**: 모서리 ㄱ자·하단 브랜딩 제거. 결과 버튼(`scard-result`/`scard-actions`) `scard-bottom` 맨 끝으로 이동(중간 삽입 느낌 제거)+축소(padding 9→6·font 13.5→11.5).
- **v122 🥈 실버 EV 차단**: `_myLottoPrizeBonus(data, tierIdx)`에 `tierIdx===0→0`. 호출부 4곳에 tier 전달. (해골감소 3줄+만렙 시 실버만 EV 양수 ~145%로 넘어가는 인플레 경로 차단. 골드·프리즘은 만렙 보너스에도 음수라 그대로.)

#### 🎲 복권 확률/EV 검증 결과 (rollScratch 100만회 시뮬, 다음 작업자 참고)
- **기반 EV 전부 음수(sink 정상)**: 실버 78.8%(당첨51.7%)·골드 69.5%(32.0%)·프리즘 76.3%(30.7%) 회수율. 잭팟(왕관) 0.03~0.5%. `rollScratch` 후처리(cap=matchCount·다중매칭방지·쪼는맛 강제배치) 로직 정상.
- **유일 엣지**: 강철심장 강화 당첨보너스 `_myLottoPrizeBonus`(해골감소 줄 보유 시 당첨 +줄당 min(30,성능)G·최대90G)가 싼 실버를 양수로 만들 수 있었음 → v122로 실버 차단. (꽝→본전 환급 효과는 v2.44.38에 이미 제거됨.)
- 시뮬 스크립트 패턴: SCRATCH_TIERS + rollScratch를 Node로 복제해 N=1e6. 단순 확률계산은 후처리 때문에 빗나가니 **항상 rollScratch 직접 실행**으로 검증.

### v2.45.110~114 (2026-06-15) — 🎟 스크래치 복권 셀 레이아웃 목업 정합(번호+SCRATCH 래퍼 구조) + 크기 조절 프리뷰

> 사용자 제보: **스크래치 셀이 서로 겹쳐/너무 큼 + 프리즘이 원형 아님 + 라이브가 목업이랑 너무 다름**. 목업(`스크래치복권-3종-목업.html`, 배포됨)을 기준으로 라이브를 맞추는 작업. ⚠️ **이 과정에서 "긁기 깨짐"을 2번 냄 → 교훈**: 긁기 캔버스/공개판정이 `.scard-cell`의 `offsetWidth`·클래스에 직접 묶여 있어, **셀 구조나 grid 컬럼을 바꾸면 긁기가 깨진다**(v110에서 silver `repeat(6)→repeat(2)`+셀 max-width+justify-items로 "긁는 부분 완전 잘못됨"). 헤드리스 브라우저가 이 환경에 없어 **시각 확인 불가** → 사용자가 직접 봐야 함.

- **v110(실패→롤백)**: 실버 `repeat(2)`+셀 max-width+justify-items, 프리즘 원형 동시 변경 → **긁기 정렬 깨짐**. `git checkout f0d869e -- index.html`로 **v109 전체 복원** 후 재시도.
- **v111**: 프리즘만 원형으로(최소). `.scard-modal.tier-2 .scard-cell` + `.season-2 ...tier-2 .scard-cell`(둘 다 영향, season-2가 더 구체적) **보석 clip-path → border-radius:50% + 프리즘 링**, 번지는 글로우 애니(scardPremGlow/scardPremPrismGlow) 제거(이웃 겹쳐보임 해소). 그리드·캔버스 **미변경**(긁기 안전).
- **v112~113(크기, 롤백됨)**: 셀이 모달(`.scard-modal` max-width **520px**)을 꽉 채워 거대화(실버 ~244px) → **그리드 컨테이너 max-width만** 추가(260/340/430 → 370/440/500). 이건 긁기 **안 깨짐**(셀/컬럼/캔버스 미변경, 그리드 폭만). 단 사용자 "너무 작아짐"·"목업이랑 다름" → **v111로 롤백**.
- **🎯 크기 프리뷰 도구**: `스크래치복권-크기-프리뷰.html`(.gitignore 화이트리스트, 배포됨) — 슬라이더로 그리드 폭 조절·셀 크기 실측. URL `https://sohada2.github.io/aram/스크래치복권-크기-프리뷰.html`.
- **✅ v114(현재) — 목업 구조 정합(안전한 래퍼 방식, 핵심)**: 라이브 `.scard-cell`(원+긁기 캔버스+모든 테마/win/skull CSS)은 **그대로 두고**, 각 셀을 **`.scard-cellwrap`로 감싸기만** 함 → 목업 `.cell` 구조(번호+SCRATCH 라벨 `위` / 원형 디스크 `아래`). **긁기 JS·캔버스·공개판정 일절 미변경**(cellEl=`.scard-cell` 그대로, querySelectorAll('.scard-cell')도 래퍼 안 셀 찾음). 변경=**HTML 렌더(래퍼+헤드 추가) + CSS(그리드가 `.scard-cellwrap` 배치, 래퍼/헤드 스타일, 목업 크기)**.
  - 그리드: 실버 `repeat(2)` max330·셀wrap 120 / 골드 `repeat(3)` max430·셀wrap 104 / 프리즘 `repeat(3)+clamp(74,20vw,108)` max530·셀wrap 88·보너스 108. nth-child 배치는 `.scard-cellwrap` 기준. 코드 ~L2766(그리드 CSS), ~L25981(렌더 `slots.map`→래퍼).
  - 헤드: `.scard-cell-head`(번호 `.scard-cell-no` + `.scard-cell-label` "SCRATCH"), 프리즘 7번째=`.scard-bonus`+"✨ BONUS ✨". 색=`--pl-shadow/--pl-deep`(메탈플레이트 변수, 밝은판에 어두운글자).
  - 메탈플레이트 보너스 셀 셀렉터도 새 구조로(~L3074 `.scard-cellwrap.scard-bonus>.scard-cell`).
  - ⏭️ **미확인**: 시각 검증 못 함. 사용자 피드백 대기 — 크기는 목업값(120/104/88)이라 또 "작다" 하면 **래퍼 max-width만** 키우면 됨(긁기 무영향). 긁기 정상인지도 사용자 확인 필요.
- ⚠️ **다음 작업자 주의**: 스크래치 셀 만질 때 **`.scard-cell` 자체(구조/grid 직접자식/offsetWidth)는 절대 안 건드리는 게 안전**. 크기·레이아웃은 `.scard-cellwrap`(래퍼)·그리드 max-width로만. 카드 타이틀은 아직 한글("실버 복권"), 목업은 영문 Cinzel("SILVER FORTUNE") — 원하면 titleMap(~L25903)만 바꾸면 됨(저위험).

### v2.45.88~109 (2026-06-15) — 🎟 스크래치 복권 리브랜딩(실버/골드/프리즘) + 긁는 느낌 목업 정합 + 해골감소 재설계 + 랭킹 내전레벨

> 이 세션 핵심 = **스크래치 복권 전면 리뉴얼**(컨셉·디자인·긁는 느낌). 목업 `스크래치복권-3종-목업.html`(gitignore 화이트리스트, 배포됨)을 만들어 반복 → 라이브 적용. 그 사이 v85~87·99~100 등 일부는 다른 컴퓨터(in-app CHANGELOG). 전부 푸시·배포 완료. **커밋 규칙 동일**: 모듈 추출 후 `node --check`(작업 디렉토리 리셋되니 `cd /c/Users/sbs_n/Desktop/aram &&` 프리픽스) → 통과 시에만 커밋. CHANGELOG 주석줄만 매칭. 배포 검증 `gh run list`(pages-build-deployment).

- **v88 패스탭 노란불**: S2 `anyClaimable` → **수령 가능한 패스(`_isS2PassClaimable('custom'||'normal')`)일 때만** 점등(빙고/레벨 보상은 제외). `updateS1PassTabBadge` ~L20144.
- **v89 강철심장 대장간 가이드 텍스트 잘림**: `.fg2-forge-guide` 이모지(👉📱) 제거 + `word-break:keep-all`(단어 중간 안 끊김)로 전문 가시화.
- **v90 스크래치 2문양 동시당첨 버그**(제보): `rollScratch` 다중매칭 방지를 `tier.idx===0`만 → **전 티어 확장**(다이아+검 같은 dual-match 차단, winSym만 남김). ~L24452.
- **v91~93 🛡️ 해골감소(`lottoTkt`) 재설계**: 기존 성능 스택(2줄=140% 문제) → **줄수 기반 `LOTTO_SKULL_PER_LINE=0.70/3`**(전 강화+3줄 합쳐 70% cap). 강화(성능)는 **당첨금 보너스로 전환**: `_lottoPrizeBonusG(power,lineCnt)`·`_myLottoPrizeBonus`, `LOTTO_PRIZE_PER_POWER=1`(줄당 최소30G, 3줄 최대 +90G — 일반복권 당첨금 안 넘게 축소). 복권창 안에 효과 배너(`.scard-emblem-fx`: 해골 -N% + 당첨 시 +NG) + 효과설명 표로 표시. `EMBLEM_EFFECTS.lottoTkt`.
- **v95~98 🎟 보류/이어하기 + 버리기**: 스크래치 창 **밖 클릭=보류(정산X·복권 유지)** — 당첨 확정 전 실수로 나가도 구매비 안 날림(`_closeTicket`). **🗑 버리기=완전 포기**(gold:0, 당첨이어도 미지급). pending 저장 `pendingScratch_s2`(slots+win+revealed) — `savePendingScratch`/`getPendingScratch`/`_lhResumeScratch`(re-roll 안 함, rec 재사용). 매칭 완성 시 즉시 당첨+"받기" 버튼. **이어하기는 같은 복권**(구매 시 1회 roll, 기회 2번 아님).
- **v96~97 🏆 랭킹 내전 레벨 표시**: `buildRankRow`에 `level:(season===2)?plvLevelFromXp(calcPlayerXp(name)):null` + `renderRankLevelBadge`. ⚠️ **진짜 렌더러는 `renderS1Ranking`/`renderS1HeroCard`/`renderS1MiniCard`**(rankViewSeason>=1) — `renderRankHeroCard`(season-0 레거시)는 안 쓰임(처음 거기 넣어서 "레벨 안 보임" 났었음).
- **v101 🎟 복권 리브랜딩**: 일반/고급/프리미엄 → **실버/골드/프리즘**. `titleMap=['실버 복권','골드 복권','프리즘 복권']`, `titleEmoji=['🥈','🥇','🌈']`, 토스트·TIER_META 등. ⚠️ 레거시 `lottery`/`lottery_premium`(구형 단일당첨 복권)은 **다른 기능이라 미변경**.
- **v102~106 ✨ 긁는 느낌 + 메탈플레이트 전면 적용**: 티어색 분리(`_tc`), 프리즘 3×2+보너스 7번칸, **메탈플레이트(밝게) 전면 개편**(`.season-2 .scard-overlay .scard-modal` prefix 블록 ~L3042~3090: `--pl-*` 변수·밝은 카드·어두운 글자). `_scardDrawCover` 티어별(실버/골드/홀로그래픽).
- **v107~108 📊 확률표 ?패널 이동 + 오버플로 수정**: 항상 떠있던 확률표 → "?" 도움말 패널 안 "📊 확률표"로 이동(목업처럼 단일 컬럼). v108=패널이 커져 모달이 화면 밖으로 넘쳐 안 닫히던 것 → 모달 `max-height:92vh`+스크롤, 패널 캡, 확률표 2열. CSS ~L3079~3093.
- **v109 🎟 긁는 느낌 목업 정합(이번 마지막)**: 라이브가 `destination-out alpha 0.85` 반투명이라 흐릿 → **목업 모델 이식**: `scratchLine` 완전 불투명(`rgba(0,0,0,1)`)+끝점 청크 아크, 브러시=`캔버스폭×0.062×배율`, **DPR 선명화**(CSS 100% 고정이라 안전), 공개판정 `alpha<40`(완전 벗겨진 비율). **`SCRATCH_TOOLS` 만능 `2.15/0.70`·동전 `1.6/0.78`·맨손 `1.0/0.83`**(목업 동일). 만능만 부스러기 2배. **이어하기 시 toolId 복원**(보류 후 도구 소실 버그 수정). 코드: SCRATCH_TOOLS ~L24510, scratchLine/spawnDust/checkCellReveal ~L26025~26100, _lhResumeScratch ~L25849. 3-에이전트 적대적 검증 PASS.
- **📬 버그보상 우편**(ap렉사이서폿·럼블홀릭·빛나는언즈): ⚠️ **PowerShell `Invoke-RestMethod`가 한글 본문을 `????`로 깨뜨림** → curl/bash UTF-8 `--data-binary @file` + `xxd` 바이트 검증으로 발송. (메모리 `feedback_mail_send_utf8.md` 저장됨)
- **⏭️ 참고(미조치)**: 구형 `lottery_premium`(휠 방식 단일당첨 복권, `showLotteryModal`/lsc ~L24877)은 아직 blur 9px 흐린 방식 — 스크래치 복권과 별개 코드라 안 건드림. 통일 원하면 추후.

### v2.45.81~84 (웹) + 브릿지 v1.1.35 (2026-06-14) — 🐱 유미 걸작 효과 2종 + 출석 상향 + 패스카드 수정 + 브릿지 종료 정리

> 다른 컴퓨터가 v2.45.72~80 진행(결혼 이벤트·진행중배너 위치·해골감소 줄수비례 등 — in-app CHANGELOG). 이 세션은 v2.45.81부터. 전부 푸시·배포 완료. CHANGELOG/커밋 규칙(주석줄만 매칭·모듈 node --check를 `&&`로 게이트) 동일. 배포 검증: 매 푸시 후 `gh run list`(pages-build-deployment) + 배포본 APP_VERSION 폴링.

- **v81~82 🐱 유미 파견 걸작 효과 2종** (요청): 강철심장 걸작에 `yuumiCut`(유미 파견시간 단축)·`yuumiCool`(파견 후 쿨다운 단축) 추가. 둘 다 `EMBLEM_EFFECTS` base 4·cap 30, `줄수×성능` 비례로 최대 -30분(1시간→30분). 적용=`_yuumiForageMs`/`_yuumiCooldownMs`(myEmblemEff). **파견 시점/수령 시점에 박제**(deployYuumi의 `f.forageMs`, collectYuumi의 cooldownUntil)라 도중 강화/판매 무영향. `_yuumiState`가 `f.forageMs||YUUMI_FORAGE_MS` 사용. 보내기 버튼·수령정산에 단축시간 표시. EMBLEM_EFFECT_POOL에 둘 다 추가(유미 미보유자에겐 dead line — 의도, 설명에 "유미 보유자 전용"). 콘솔 테스트 `grantYuumi()`→`yuumiSkip()`.
- **v83 📅 출석 골드 상향**: `EMBLEM_EFFECTS.attend.base` 12→15(+25%, 상한 없음 유지). 중앙 base 1곳이라 카드·툴팁·doAttendance·빙고출석 전부 자동 반영. 3줄 만렙 +144→+180G.
- **v84 🎫 대기화면 시즌2 패스카드 수정** (제보): ① 제목 "SEASON 2 · 퀘스트 패스"가 한글인데 `JetBrains Mono`(한글 글리프 없음)라 깨지고 줄바꿈 → "SEASON 2"(영문 mono)+`.wmp2-title`"퀘스트 패스"(한글 기본폰트)로 분리. ② `.wmp2-sl`(획득/남은 레벨) `white-space:nowrap`. ③ `.wmp2-next-lbl` mono 제거. ④ `_claim` 배지에 `goldLoaded&&matchesLoaded` 가드. ⑤ **수령 후 "수령 가능" 잔존** = `doClaimS2Pass`가 패스탭만 재렌더 → `renderWaitingCard()`+`updateS1PassTabBadge()` 추가(staleness 해소). ※ S2 퀘스트패스는 순차형(`s2PassAfterTs`=이전레벨 수령시각 이후 게임만 집계)이라 동시 2레벨 수령가능 불가 → 수령 즉시 배지 사라지는 게 정상.
- **🔌 브릿지 v1.1.35** (제보): 상태페이지 **종료 버튼**(`/api/shutdown`)이 `cleanup()` 없이 `process.exit(0)`만 해서, 종료해도 `bridge/operators/{id}` 노드가 남아 웹앱이 최대 120초간 "브릿지 연결중"으로 표시(웹 판정=`_updateBridgeDot`, operators.at<120000). → 종료 핸들러가 `cleanup()`(operators/heartbeat/inGame null) 완료 후 종료(+3초 안전망). 빌드·릴리즈 완료(gh release v1.1.35, zip+exe). **웹앱 무수정**(onValue 실시간). ⚠️ 비정상종료(크래시)는 여전히 120초 폴백(정상).
- **GitHub Pages 인증 장애 경험**: 세션 초반 v2.45.52~53 배포가 `deploy-pages` 401(GitHub 측 "Authentication issues related to API requests" Critical 장애)로 실패 → 장애 복구 후 자동 재배포됨. 코드/`.nojekyll` 무관, GitHub 인시던트였음.

### v2.45.57~71 (2026-06-11) — 🛠️ 시즌2 출시 후속 다듬기 (빙고·복권·대장간·패스·밸런스·정산창·진행배너)

> 시즌2 라이브 후 사용자 제보·요청 기반 연속 수정. 전부 푸시 완료. CHANGELOG/커밋 규칙(주석줄 매칭·node --check 후 커밋) 동일. **이번 세션 Firebase REST 직접 작업 다수**(읽기·쓰기 인증없이 됨, DB URL은 "시즌2" 섹션 참조).

- **v57 빙고 출석현황 닉네임 중복**: 로스터가 `Object.values(goldData)`를 돌아 같은 닉 중복 표시. 원인=**`MangoStinz` gold 문서 6개**(등록 seed 글리치, /players엔 1명). → 표시 `normName` dedupe(오전/오후 OR 병합) + **빈 중복문서 5개 REST 삭제**(1개만 남김).
- **v58 빙고 보상안내 + 완성줄 출석자**: 빙고판 아래 1·2·3줄 보상(bingoReward 동기화) + 완성된 줄의 칸별 출석자 표시(`_bingoRewardChips`/`_bingoLineLabel`).
- **v60 빙고 출석자 비공개**: v58에서 모든 칸에 hover title 달아 미완성 칸도 다 보이던 것 → **완성된 줄 칸에서만 공개**.
- **v59 일정**: 지난 날짜 탭 시 조용히 막던 것 → 안내 토스트. + 일정 달력 `.season-2` 골드 톤.
- **v61 우편 정수 지원**: `claimMail`이 `rw.essence`→`emblemEssence_s2` 누적 지원(우편으로 정수 지급용). `_mailRewardChips`/`sendMail`도.
- **v62 대장간 모바일 강화**: 세로 드래그 어려움 → `_bindEnchInventoryDrag` finish에서 **탭/제자리에서 떼기만으로 강화**(작업대 밖 드래그만 취소), 탭 시 forge-stage 스크롤.
- **v63 문구**: 강화 5/5 "슬롯 소진·판매하세요" → "✨ 강화 완료(5/5)".
- **v64 복권 연결성**: 스크래치 확인/✕/바깥탭으로 닫으면 상점까지 나가던 것 → 전부 `openLotteryHub()` 복귀. 중복된 "← 뒤로" 버튼 제거.
- **v65 복권 제목 이모지**: `.scard-title`이 그라데이션 클립(`text-fill:transparent`)이라 이모지가 잘려 보임 → 이모지를 `.scard-title-em` 별도 요소로 분리(🎟🎫💎).
- **v66 신규템 되팔기**: 강화권·정수를 정가 95%(수수료5%)로 판매(`sellEmblemTicket`/`sellEmblemEssence`→`resellGold_s2`). 강철심장은 `emblemSellPrice`로 장비슬롯에서도 판매. `.inv-sell-btn`에 `onpointerdown stopPropagation`으로 강화 드래그와 분리.
- **v67 패스카드 재디자인**: 대기화면 시즌2 패스 카드 이모지 줄이고 정보형(`.wm-pass-card-v2`/`.wmp2-*`): 레벨/진행률 + 획득/남은/전체 스탯 + 다음퀘스트(이름·설명·보상). S2 전용, S1 패스(탭) 유지.
- **v68 밸런스 팀짜기**: ① 라벨 "티어 기반"→"**승률 기반**"(실제=`getWinRateScore`=이번시즌 승률 보정. `getS1BalanceScore`(LP/티어)는 참가목록 정렬에만). ② **전판 똑같은 팀 반복** 완화: 정렬+지그재그+그리디가 늘 같은 최적해 수렴→ **랜덤시작 16회 밸런싱 후 균형허용오차(0.12) 내 후보 중 전판과 다른 조합 우선**(순서무관 키).
- **v69~70 정산창 칩 정리**: `ITEM_NAMES`에 누락된 `secret_quest`→"비밀 퀘스트 토큰", `scratch_key`/`scratch_coin` 한글명 추가. **긁기 도구(영구보유라 매 경기 itemEffects에 박혀 칩으로 뜸)는 `_NON_MATCH_ITEMS`로 정산창 칩에서 제외**(경기 무관).
- **v71 진행중 게임 배너**: 일반만 뜨던 상단 배너(`bridge/inGame` 기반, `.ngb`)를 **내전(⚔️)에도** + **"진행 N분"** 실시간(30s). `_bridgeInGame.isCustom`/`.at` 사용. 막고라는 기존 배팅모달로 표시(배너 숨김). ⚠️ **브릿지 v1.1.34가 이미 `inGame={isCustom,players,at}` 다 씀**(다른 컴퓨터가 추가, 6/10 릴리즈) → 추가 브릿지 작업 불필요. 동작조건=운영자가 v1.1.34+ 실행.

#### 📬 이번 세션 Firebase 직접 작업 (REST)
- **버그 수집가 우편**(5명: 럼블홀릭·울퉁쓰·빛나는언즈·나랑듀오해듀오·맹독 벌꿀오소리) — 무료 복권 1세트(freeScratch{0:1,1:1,2:1}). season:2.
- **시즌2 오픈 기념 우편**(전원, target:'all') — 500G + 복권 1세트 + 정수 1개. season:2. (정수 지급 위해 v61 먼저 배포·라이브 반영 확인 후 발송)
- ⚠️ **Firebase가 `{0:1,1:1,2:1}` 연속정수키 객체를 배열 `[1,1,1]`로 자동변환** — 앱은 `[0/1/2]`로 동일하게 읽어 무해.
- **MangoStinz 중복 gold 문서 5개 삭제**(v57 관련).
- ※ 이전 세션 애긔반달곰 S2 테스트잔재 정리도 참고(v2.45.38~49 항목).

### v2.45.50~56 (2026-06-10) — 🎯 출석 발견성·빙고 알림 + 챔피언풀 시즌누수 + GitHub Pages 배포수정

> v2.45.50~53은 다른 컴퓨터/세션 진행(LEVEL UP 배너 새로고침 버그·일반게임 진행중 배너·실시간 토스트 등 — 상세 in-app CHANGELOG). 이 세션은 **v2.45.54부터**. 전부 푸시 완료. **CHANGELOG/커밋 규칙(주석줄만 매칭·모듈단위 node --check·`&&` 게이트 커밋)은 이전 항목 동일 적용.**

- **v54 챔피언 풀 전체보기 시즌 누수**: `calcChampPool(name, season=CURRENT_SEASON)`(~L18426)이 시즌 필터 없이 전체 시즌(S0+S1+S2) 매치를 합산 → S2인데 옛 시즌 챔프가 섞여 보임. `if((m.season??0)!==season) continue;` 추가. 헤더 "시즌 N" 표기.
- **🚀 GitHub Pages 배포 오류 수정 (중요)**: v52~53에서 Pages "Page build failed"/빌드 멈춤 — 브랜치 직접배포가 **기본 Jekyll**로 거대한 index.html 파싱하다 실패. → **`.nojekyll` 파일 추가**(Jekyll 비활성화). ⚠️ `.gitignore`가 `*` + 화이트리스트라 `!.nojekyll` 추가해야 추적됨. 이후 빌드 정상(ee7cd7a "built").
- **v55 협력 빙고 출석 첫선택/중복 알림 보강**: `doBingoAttendance`(~L19110)가 `wasFirst`/`dupWith`→`sub`를 **보상 팝업 한 줄(`.brw-sub` 11px)로만** 띄워 골드 보상에 묻혀 안 보이던 것. 트랜잭션 직후 **토스트로도** 알림 추가(`🎨 처음 골랐어요!`/`🔴 X님이 이미 골랐어요`). 블라인드 보드 설계(출석 후 공개) 유지. *주의: 본인이 이미 고른 칸은 dup·first 둘 다 false라 무알림이 정상.*
- **🎯 v56 출석 발견성 개선 (이 세션 핵심)**: 좌상단 배지(명예의전당·일정·출석체크·우편함·노트)가 전부 비슷한 골드 테두리라 출석을 못 찾던 문제.
  - **메인 아바타 코치마크**: 출석 가능 시 `#my-avatar`에 골드 링 강조(`.attend-ready`)+🎯 골드 점(`#mib-attend-dot`), 바로 아래 말풍선 `#attend-coach`("오늘 출석 보상이 기다려요! 탭해서 출석") — 누르면 `goToRelayBoard()`로 바로 출석창. ✕로 이번 슬롯 닫기(`_attendCoachDismiss`=date_slot 키, `window._dismissAttendCoach`).
  - **코너 버튼 차별화**: 출석 가능 시 `.relay-event-btn.attend-live`(채워진 골드+`🎯 출석하기`+강한 펄스), 보상만 대기면 `.glow-attend`+`🎁 보상 받기`. 라벨은 `#reb-label` 동적 변경.
  - 코어 함수: `updateAttendCoach(canAttendNow?)`·`positionAttendCoach()`(아바타 rect 기준 fixed 배치)·`_attendSlotKey()`. `updateRelayEventBtn` 끝(~L19895)에서 버튼+코치마크 동시 갱신 → 골드 onValue·이름선택·출석완료 시 자동 반영. `showTab`에도 호출(탭전환 위치 재계산). 팀구성 완료로 아바타 숨김 시 `offsetParent===null`로 코치마크 자동 숨김. resize/scroll(capture) 리스너로 말풍선 위치 추적. CSS는 `.reb-arrow` 정의 뒤(~L4712) 블록.
  - ⏭️ 실기기 확인 후 말풍선 위치/문구/강조 강도 미세조정 여지.

### v2.45.38~49 (2026-06-10) — 🌌 시즌2 라이브 오픈 + 🎓 대장간 튜토리얼 + 출시일 정리/수정

> **이날 시즌2 정식 오픈** (`switchSeason(2)` → `config/currentSeason=2`). 전환 감사(3-에이전트+직접검증) 결과 쇼스토퍼 0. 전환 메커니즘=순수 config 쓰기, onValue 리스너가 `season2/`로 재구독. 이후 출시일에 발견된 시즌격리 누락·UI 깜빡임 등을 줄줄이 수정. CHANGELOG/커밋 규칙(주석줄만 매칭·node --check 후 커밋) 동일 적용.

- **v38~39 메인 대기화면**: 최근10경기↔챔피언 세로스택 → **좌우 2열**(`.wm-lp-bottom` grid `auto 1fr`, 폼도트 5+5). 챔피언 카드 시인성↑(초상화 42px·이름16px), `align-items:stretch`로 칸 꽉 채움.
- **v40~43 🎓 오른 대장간 인터랙티브 튜토리얼** (신규 핵심): 시즌2 대장간 첫 진입 시 스포트라이트 가이드 자동 1회(`localStorage forgeTutSeen`) + 우상단 🎓 사용법 버튼 재생. **전용 샌드박스 `FORGE_TUT`**(인메모리, Firebase 무접근)에서 구매/강화/리롤/판매 시연 — 실제 골드·정산 무영향. 게터 가드 3곳(`renderEmblemBody`/`getMyGoldData`/`_healEmblemLines`)만 기존수정, `window.emblemDo*` 핸들러는 시작 시 오버라이드→종료 복원. 실제 연출(`_emblemForge`·`_emblemReelAnim`) 재사용. 코드: `_ftBuildSteps`(13단계)·`_ftLayout`(watch모드=옅은딤+말풍선 가장자리고정, box모드=링)·`_ftWatch`·`startForgeTut`. v41=오른 가림 수정(타깃 `#forge-stage`)+걸작 설명정정("3줄=특별보너스 아님, 같은효과 합산"), v42=`.fg2-tut-btn` CSS를 메인시트로(주입CSS라 튀던것), v43=튜토중 토스트 z4300·상단배치 + 링 위치transition 제거(opacity 페이드).
- **v44 라이브모드 바**: `.season-2` 골드 톤 + 복권 하우스골드 지표(`calcLotteryHouseGold`) 표시 제거.
- **v45**: 대기화면 MVP/SVP/MMP가 `calcS1AwardStats` **season 인자 누락**으로 항상 S1집계 → `_liveSeason` 전달. + 시즌2 안내팝업(`showS2Tutorial`) **확인(세션만·재표시)/다시안보기(영구 `s2TutorialSeen`) 2버튼** 분리.
- **v46 출석 시즌격리**: 일일게이트 `lastAttendance`/`lastAttendance2`가 시즌무관 공유필드라 S1 오늘출석이 S2를 막던것 → `sField`로 시즌별(8곳: `isAttendSlotDone`·`doBingoAttendance`·빙고로스터3·S1릴레이`doAttendance`). S2는 빈 `lastAttendance_s2`라 S1무관 출석가능.
- **v47 복권허브** 팀시도통계(`tierAttemptStats` ~24753)에 `(h.season??1)===CURRENT_SEASON` 추가(전시즌 누적 보이던것).
- **v48 🗑️ 쓰레기통 동전 하루 250G 캡** (`TRASH_DAILY_GOLD_CAP`/`_trashGoldRemaining`/`trashGoldDay`): 직접뒤지기+유미 합산. 초과시 "바닥까지 다 긁었다" 메시지. 이스터에그 +300G 미포함, 무료권 3장캡 유지. (직접 ~0.27G/회·1100px드래그 → 250G에 ~30분~1시간 / 유미 1회 130~290G로 거의 캡).
- **v49 부팅 깜빡임**: 첫진입 S1→S2 깜빡임 = 부팅스크립트(head/body)가 `s1-active`만 즉시걸고 `season-2`는 모듈로드후 적용해서. → 부팅스크립트에 캐시시즌(=2) 기반 `season-2` 즉시추가. `.season-2{--gold..}`가 html레벨 셀렉터라 첫페인트부터 팔레트/카드 S2. (단 `aram_season` 캐시=2여야 — 전환후 1회 접속하면 갱신됨).

#### 🔧 출시일 데이터 정리 (Firebase REST 직접 — 읽기·쓰기 인증없이 됨)
- **DB**: `https://aramchaos-ca022-default-rtdb.asia-southeast1.firebasedatabase.app` — `/gold.json`(전체)·`/gold/{key}.json`·`/season2_bingo.json`. PowerShell `Invoke-RestMethod`로 조회/PATCH/PUT.
- **⚠️ 테스트 잔재 함정**: 🧪검증패널 "테스트골드"(`__s2dbg.gold`)가 `goldBonusLegacy_s2`에 누적 → `calcPlayerGoldEarned`가 실골드로 합산. 프리뷰 테스트한 계정(애긔반달곰)이 S2라이브에서 골드·엠블럼·가챠·패스·레벨·빙고 잔재 보유. **다른사람은 0에서 깨끗 시작**(전환 정상, 그 계정만 더럽혀진것).
- **애긔반달곰(key `-OowXInAIfDm6j7PKe0M`) 전체초기화 완료**: 모든 `_s2` 필드 0/삭제 + `lotteryHistory` 351→344(season===2 7개만 제거). `_s1`·S0 무손상.
- **공유 빙고판(`season2_bingo`) 리셋**: 테스트픽 15칸·빙고1줄·로그1개 → 새판(round1·36칸·로그0)으로 PUT. (패스탭 노란점=빙고미수령보상이 전원에 뜨던것 해소. 단 **레벨1 시작보상(정수1+안정2)** 미수령은 정상 — `plvLevelFromXp(0)=1`이라 전원 레벨1, `_isPlvClaimable`=true. 의도된 시작보상.)



### v2.45.15~37 (2026-06-08) — 🏛 시즌1 명예의 전당 + 대기화면 정렬·강화현황 + 걸작 "해골 감소"

> 이 세션 전, **다른 컴퓨터가 v2.44.85~v2.45.14** 진행(시즌2 전환 토글·브릿지 일반게임 분리·일반패스 적립·튜토리얼·대기화면 다듬기 등 — 상세는 in-app CHANGELOG). 이 세션은 v2.45.15부터. 전부 푸시 완료. **CHANGELOG/커밋 규칙(주석줄만 매칭·`&&`로 구문검사 묶기)은 이전 항목 참조 — 이번 세션도 동일 적용.**

#### 🏛 시즌1 명예의 전당 (v2.45.31~37) — 이번 세션 핵심
- **위치/구조**: `showS1HallOfFame()`(index.html ~L20768, async). 라우터 `showHallOfFame()`(~L20712): `CURRENT_SEASON>=1 → S1, else showS0HallOfFame()`(레거시 하드코딩). 좌상단 `🏛 명예의전당` 버튼(`corner-badge`).
- **동적 계산**(S0는 수동 하드코딩이었음): `_s1HofPlayers(s1node)`가 matches(season===1)·calcStats·calcS1AwardStats·calcMaxStreaks·mgFighterStats·calcGoldFromMatches + goldData(`lotteryHistory`/`gachaLog_s1`/`champCards_s1`/`attendanceHistory` 직접) 집계. 참여자(=S1 1판+) 전원 수집.
- **⚠️ 시즌 격리 버그 수정(중요)**: `season1Data` 전역은 `seasonNode('players')`=**현재 시즌** 노드라, S2 프리뷰에선 S2 LP를 담음. → HOF 열 때 `CURRENT_SEASON!==1`이면 `get(ref(db,'season1/players'))`로 **진짜 S1 노드 직접 fetch**해서 티어/LP 표시(`s1node`). 경기통계는 원래 season===1 필터라 무관.
- **구성**: 👑정점 TOP3(티어·LP) → 🏅부문상 **23부문 각 TOP5 순위**(1·2·3·4·5, 자기 등수 확인용) → 📊**TMI**(시즌1 전체 숨은통계: 누적킬뎃어시·딜량·멀티킬·복권/가챠/출석·막고라·관전·국민챔피언 등) → 🎖️**명예 명단**(참여자 전원 1칭호씩, `_s1HofTitle`).
- **티어 배지**: 정점 TOP3에만(대부분 챌린저라 부문상순위·명단의 반복배지 제거).
- **부문상 정의** = `AWDEFS` 배열 `[ico,ttl,val(p),flt(p),fmt(p),asc]`. TMI = `_s1HofTMI()`(실데이터)/`_s1HofTMISample()`(샘플).
- **프리뷰 폴백**: 데이터 없는 프리뷰(`__SEASON_PREVIEW`)에서 P 비면 `_s1HofSample()`(11명)로 자동 표시. 콘솔 `previewS1Hof()` / URL `?hofdemo`도 샘플. 라이브엔 샘플 미적용(실데이터 있으면 우선).
- **스크롤 최적화(v35)**: `.hof-overlay`의 `backdrop-filter:blur(8px)`가 스크롤마다 뒤 애니배경 블러 재계산→끊김. 블러 제거+불투명 배경(#080510)+overscroll-behavior:contain.
- **CSS**: `.hof-award-list2`/`.hof-award2`/`.hof-rk`(순위행) · `.hof-roster*` · `.hof-tmi-*`(기존) · `.hof-alt-btn`(시즌 교차 보기).
- ⏭️ **미결 제안**: 부문상 1인 독식 방지(1인 최대 N개 상한 → 더 많은 사람 노출) — 사용자에 제안만 함, 미적용. 출석/가챠 TMI는 _s1 필드라 S1 한정이나 `attendanceHistory`는 전시즌 공유라 누적이 all-time일 수 있음(TMI라 OK).

#### 그 외 (v2.45.15~30)
- **v15~16 대기화면 챔피언·최근경기 정렬**: MOST/BEST를 flex:1 균등 카드로(다닥다닥). `.wm-lp-bottom`을 가로그리드→세로 풀폭 스택, 폼도트 flex로 폭 채움.
- **v17~19 능력치 육각 레이더**: 추가→브릿지 전투6축 개편→**사용자가 "별로"라 완전 제거**(되돌림). _buildStatRadar/calcCombatStats 전부 삭제됨. (다시 만들 거면 git에서 v2.45.17~18 참조)
- **v20 가챠 버그**: doGachaPull이 성공 경로에서 버튼 disabled 안 풀어 재시도 블락 → 재활성화 추가.
- **v21 오른 대장간 연출**: 강화 **실패 시 오른 실패모션 제거**(playFail 호출 삭제, 안빌 흔들림만). 강화 **성공 시 버스트**(`_forgeBurst`: 플래시+충격파링+빛줄기, `.fg2-burst-*` CSS).
- **v22~28 걸작 효과 "복권 지급" 대장정 → 최종 "해골 감소"**: ① 매경기 무료복권1장(골드인플레 과함) → ② 가챠·복권 혼합 → ③ **최종: 🛡️해골 감소**(이름 "해골 감소", id는 `lottoTkt` 유지). `_lottoSkullReduce(power)`=성능×3%p·캡70%. `rollScratch` 내부에서 본인 강철심장 성능으로 skullAppear 가중치 차감(호출처 무수정). 골드 안 풀어 인플레0. **가챠/부스트/freeScratch 지급 코드는 전부 되돌림**. (밸런스 검토: 무료 일반복권 EV~55G/경기 = 다른 골드효과의 3~9배라 과했던 게 계기)
- **v29 강화 현황**: 실패칸 **✕** 표시(`fg2-sdot.fail`/`wm-pip.fail`), 성능 수치 크게(`.fg2-pow-n` 24px). 대장간+대기화면 강철심장 둘 다.
- **v30 전투 준비 효과 카드**: 강철심장 셀이 6행이라 시너지 셀(2행)과 안 맞던 것 → 강철심장도 "헤더+효과칩 1줄"로 압축, 그리드 stretch로 높이 맞춤.

### v2.44.72~84 (2026-06-08) — 🌌 시즌2 톤앤매너 전면 통일 + 대기화면 재구성 + 대장간 렉 수정

> 전부 `CURRENT_SEASON===2` 게이트(라이브 S1 무영향). `?preview=2`로 검증. 모두 푸시 완료. **헥스텍 정체성 = 블랙+골드 + 육각 회로 골드 펄스**(`_buildHexfield`)를 시즌2 전역에 적용하는 작업.

#### ⚠️ 작업 규칙 (이번 세션에서 확립 — 다음 작업자 필독)
- **CHANGELOG 편집은 반드시 "주석 줄만 매칭"해서 그 아래 새 블록을 끼울 것.** `{ ver: 'v2.44.XX', ... changes: [` 여는 줄을 old_string에 넣고 교체하면 그 여는 래퍼가 사라져 **인라인 모듈 전체 SyntaxError → 사이트 먹통**이 남(이번 세션 3회 재발). 안전 패턴: old_string = `  // 최신순 정렬. tag: 'new'...` 한 줄, new_string = 주석 + 새 `{ ver:..., changes:[...] },` 블록.
- **커밋 전 구문검사를 `&&`로 묶을 것**: `[ $ok = 1 ] && git add ... && git commit ... && git push`. 안 묶으면 검사 실패해도 깨진 코드가 푸시됨(이번 세션 1회 발생).
- 구문검사 = 모듈 인식 방식(`<script type=module>` 포함 전 블록 추출 후 `node --check`). importmap/application/json 블록은 제외.

#### 작업 내역 (시간순)
- **v2.44.73~74 정수 아이콘**: 🔶 이모지 → 롤 아이템 이미지(반들거울 ddragon 4642). **v74 = 긴급 핫픽스**: `EMBLEM_ESSENCE_IMG`를 모듈 최상위 const로 만들며 아직 `let` 선언 전인 `DDRAGON_VERSION` 참조 → **TDZ ReferenceError로 사이트 먹통**. URL을 호출시점 생성 함수 `_essenceImgSrc()`로 전환해 해결. (교훈: 모듈 최상위 const가 아래쪽 let을 참조하면 TDZ. node --check로 못 잡는 런타임 에러.)
- **v2.44.75 스크래치 복권 S2**: 허브/스크래치 카드 보라·핑크 → 블랙+골드. 3티어 골드 등급 진행(일반=앤틱골드/고급=엘렉트럼/프리미엄=프리즈매틱골드), 커버 캔버스(`_scardDrawCover`) 프리미엄 핑크홀로 → 골드프리즈매틱, 카드 내부 `ensureLotteryHexBg`로 골드 헥스 주입. 티어 색은 JS에서 `CURRENT_SEASON===2` 분기(`_tc`/`tierMeta`).
- **v2.44.76 ⚡대장간 렉 수정 (중요)**: 3D 오른 렌더 루프(`index.html` ~L9434 `(function loop(){requestAnimationFrame(loop)...renderer.render})`)가 **정지 조건 없이 세션 내내 60fps WebGL 렌더**. 대장간 닫아도 캔버스가 화면 밖 `#ornn-holder`로 대피될 뿐 `display:none`이 아니라 계속 렌더. → 캔버스 부모가 `#ornn-mount`이고 `!document.hidden`일 때만 렌더하도록 가드. **S2 대장간 1회라도 연 사용자 상시 발열 해소.**
- **v2.44.77 우편함 S2 + 시즌 격리**: 모달 본체(시트·"보상받기" 버튼·아이템칩) 파랑/보라 → 골드. **+ 우편 시즌 격리(중요)**: `/mailbox`는 전역인데 수령여부만 시즌별(`mailClaimed_s2`)이라 S2 오픈 시 과거 S1 우편이 전부 미수령으로 떠 재지급되던 누수 차단. `sendMail`에 `season:CURRENT_SEASON` 박고 `_myMails`/`claimMail`에서 `(m.season??1)===CURRENT_SEASON` 필터(과거 우편=태그없음=S1 취급).
- **v2.44.78~84 대기화면(팀구성 프로필 대시보드) 재구성** — `renderS1WaitingCard`(~L20800):
  - **v78**: 전투/지원 패스 탭(S1 유료패스 잔재, `paidPassHtml`은 사실 죽은 코드) 제거 → S2 단일 퀘스트패스(`passQuestClaimed_s2`/`S2_PASS_QUESTS`/LV25). 시너지·강철심장 인라인 배지 → 새 "⚔️ 전투 준비 효과" 카드(`wm-fx-*`)로 분리.
  - **v79→80**: 승률 영역을 ⚔️내전/🎰막고라 **2박스**(`wm-duo-*`)로. 레벨행·정수/강화권 보유타일은 사용자 요청으로 제거(레벨은 상단에 이미 있음).
  - **v81**: 헥스텍 정체성 — 대시보드(`#member-waiting`)에 `ensureWaitingHexBg`로 골드 헥스 배경 주입(`.wm-root` z-index:1로 위에), 카드 회색 → 웜블랙 그라데이션+골드 테두리+LP골드글로우.
  - **v82**: **랭킹 탭** = S2 `--rk-card`/`--rk-sub`/`--rk-border` 토큰을 웜블랙+골드로 교체(히어로·미니카드 일괄). **프로필 모달** = `.season-2 .profile-modal*` 오버라이드(블루 아바타→골드). 막고라 박스 풍부화.
  - **v83**: 막고라 박스에 **파이터 실제 대전 전적**(대전승/대전패) 추가 — `mgFighterStats(name,season)` 신설(`magolla_matches`의 `result.winner`+`fighter1/2` 집계). 골드손익만으론 파이터 승패 구분 불가(승+100/패+50 둘다 +)라 최근폼도 골드증감→실제 대전승패로.
  - **v84**: 강철심장 표시 개편 — 효과를 이모지+숫자칩(🪙+5G) → "효과명+값"(경기 골드 +5G) 줄로, 아이템 설명 추가, **강화도 시각화**(5칸 핍=성공/실패/빈칸 + 성능 등급배지 미강화/실버/골드/프리즈매틱 `emblemEffects(power).glow` + 성능·성공칸수). fx카드 2열→세로스택.

#### ⏭️ 남은/제안 (다음 작업자)
- **🏅 S2 칭호 배지**: 대기화면 추가 정보 후보 중 사용자가 보류. 패스 완주('증바람의 증인')·광채 칭호가 실제 쌓이면 그때 넣기 제안함.
- 토큰 교체(`--rk-*`)로 랭킹·대기화면이 골드 톤 따라옴 — 혹시 과한 곳 있으면 개별 조정.
- 막고라 파이터 전적은 시즌 스코프(`m.season??1`) — S2 미오픈이라 preview에선 0승0패가 정상.

### v2.44.48~49 (2026-06-07) — ⚡ 걸작 LP 스케일 + 🌱 S2 뉴비 OFF + LP 밸런스 감사

> 전부 `CURRENT_SEASON===2` 게이트(라이브 S1 무영향). `?preview=2`로 검증. 코드 푸시 완료.

- **v2.44.48 — 걸작 LP 효과 스케일 개선**: winLP/lossLP가 base 0.5/cap 6이라 성능 0~19가 전부 +1 LP로 뭉툭하던 문제. 승리 LP `base 1.0·cap 12`, 패배 방어 `base 1.0·cap 8`로 상향 → 강화(성능)할수록 LP 꾸준히 상승, 상한은 3줄+만렙 극단 투자에서만 닿는 자연 천장. (`EMBLEM_EFFECTS.winLP/lossLP`)
- **v2.44.49 — 시즌2 뉴비 보너스 효과 OFF (표식 유지)**: S2는 전원 배치고사 새 출발이라 뉴비 보호(승리 +3LP/+5G·패배 완화·배치 1패무시) 제거. 🌱 뱃지·마크·부여버튼은 유지(툴팁만 `newbie_bonus_s2`="시즌2 미적용"). 게이트 지점: `s1ApplyMatchResult`(정규전 뉴비블록+배치 effectiveWins, `CURRENT_SEASON!==2`) · 재계산 루프 2곳(~11508/~11633, `m.season!==2`) · 정산창 `playerRow`(`_nbOn`) · `calcGoldFromMatches` +5G(`m.season!==2`). S1 기록·골드 무영향.

#### 🔍 LP 시스템 밸런스 감사 결과 (워크플로우, 2026-06-07) — 다음 작업자 참고
> ⚠️ **용어**: 코드 내부 변수는 옛 이름 `emblem*` 그대로(=강철심장/걸작). 보고서의 "엠블럼 winLP/lossLP" = 강철심장 걸작 승리LP/패배방어.
- **판정**: 구조적으로 견고(오픈 OK). 패배→+LP 불가, 시너지 단일 슬롯, 캡 우회 없음, 전부 합산이라 폭주 불가(한 판 승리 최대 +71). 단 아래 2건 권고.
- **⏭️ 미결 권고 (우선순위)**:
  1. **[✅ 해결 v2.44.50+51] 걸작 LP/골드 역산** — 운영자 LP 재계산이 걸작 LP·시너지 LP를 빼먹어 S2 재시뮬 시 경기당 최대 ~28LP 어긋남. **(v2.44.50)** S2 중 `s1Resimulate` **차단**(`CURRENT_SEASON===2 && !opts.force` early return, force escape). **(v2.44.51) 근본 해결 — 걸작 효과 경기별 기록**: 기존엔 걸작 골드가 `goldBonusLegacy_s2` 한 덩어리, 걸작 LP는 기록조차 없어 역산 불가였음. 이제 매 경기 저장 시 `matches/{key}.emblemEffects[name]={power,lines,matchG,winG,mvpG,winLP,lossLP}` 박제(순수 기록, 적용방식 불변) → 가챠 시너지처럼 완전 역산/감사 가능. **과거 경기는 기록 없어 소급 불가(지금부터)**. 향후 resim을 기록 기반으로 고치면 force 차단도 풀 수 있음.
  2. **[중·선택] 챌린저 인플레** — 챌린저 LP 무캡 + 단판 +71. 그중 가챠 유레카(risk_win) 3성 단독 +16(정규승 80%). 조치: 유레카 v3 `+16→+10` OR 챌린저 구간 시너지 LP 게이트. ※ 가챠 시너지 LP를 S2에서 유지/축소/제거할지 결정하면 자동 해소 가능(가챠는 강철심장 걸작과 LP 소스 중복).
  3. **[하] 묶음** — 비챌린저 캡 100 초과 LP 증발 UI 안내 · 아이템 동시활성(LP2x↔도박권 등) `saveMatch` 직전 1개만 남기는 방어코드.

### v2.44.8~47 (2026-06-05) — 🔨 오른 3D 대장간·걸작 시스템 + S2 알림/효과 폴리시

> 전부 `CURRENT_SEASON===2` 게이트(라이브 S1 무영향). `previewSeason(2)`/`?preview=2`로 검증. 코드는 모두 푸시됨.

- **v2.44.8~35 (다른 컴퓨터)**: 🔥 오른 3D 대장간 연출(`assets/forge/*.glb` idle1/idle2/forge/fail) + 🏆 걸작(masterpiece) 시스템 — 효과 3줄을 "걸작의 정수"로 랜덤 리롤(같은 효과 모을수록 강화), 강화하기(성능)/걸작 만들기(줄) 분리, 정수 인벤·릴 연출. 상세는 in-app CHANGELOG.
- **v2.44.36 (이 세션)**: 🎨 알림 토스트 테마 토큰화(`--notif-*`) — showS1Toast 보라가 S2에서도 보라로 뜨던 것 → 시즌별 remap(:root 보라/.season-2 골드). 향후 테마 톤은 토큰 블록만 수정.
- **v2.44.37~39**: 걸작 효과 풀 재조정 — 🔨강화권 할인·🎟복권 효과 제거, 골드 base 상향(경기5·승리8·출석12·MVP15), 🛡️패배 방어 LP 추가(승리 LP와 별도 유지=공격/수비 빌드). 풀 7종(matchG·winG·attend·mvpG·magollaG·winLP·lossLP), `EMBLEM_EFFECTS`/`EMBLEM_EFFECT_POOL`.
- **v2.44.40~41**: 걸작 표시 — 카드값×줄수=총합 일치(`emblemEffectsOf`: 줄값 먼저 반올림 후 합산), 패배방어 LP 줄바꿈 깨짐(이름 단축+nowrap).
- **v2.44.42~46 (오른 3D)**: ⚡ GLB 4종 meshopt+webp 압축 **40MB→1.2MB(~33×)**, 메쉬 보존(`GLTFLoader.setMeshoptDecoder`). 카메라 핏을 모델 박스 기준 자동(여백 ×2.6 = 작게). 강화 실패 모션 끝까지 보이게 `endDelay`=fail재생시간+500ms.
- **v2.44.47**: 걸작 줄 "비어있음" 자동 치유 — 옛 엠블럼의 제거된 효과(복권/강화권할인) 줄을 대장간 열 때 새 랜덤 효과로 채워 저장(`emblemSanitizeLines`/`_healEmblemLines`, renderEmblemBody 진입 시).
- **⏭️ 대장간 후속(사용자 피드백 대기)**: 오른 크기/연출 미세조정, 효과 cap·밸런스, 패스 트랙 최종 등.

### v2.44.0~7 (2026-06-04~05) — 🌌 시즌2 엠블럼 강화(→오른 대장간 재설계) + 패스 재편 + S2 폴리시

> 상세 코드맵·확정 수치는 **SEASON2.md §4 상단 박스**(완전판). 전부 `CURRENT_SEASON===2` 게이트라 라이브 S1 무영향. `previewSeason(2)` 또는 태블릿 URL `?preview=2`로 검증. 시즌2 미오픈이라 팀원엔 안 보임.

#### v2.44.4~7 (2026-06-05, 검증·재설계 라운드) — ⭐ 내일 이어서 작업 시 여기부터
- **v2.44.4 — 엠블럼/패스 코드리뷰 수정 3종**: 독립 에이전트 리뷰로 (1) 패스 칭호 `passTitle_s2` 저장만 되고 미표시 → `s2TitleHtml`로 프로필 배지 표시 (2) 패스 LV5 엠블럼 보상 이미 보유 시 증발 → 베이스가 150G 환급 폴백 (3) 강화 연출 중 onValue 선갱신 스포일러 → `_emblemFxBusy` 중 재렌더 스킵. **리뷰 결론: 골드 누수·시즌게이트·클레임 가드 모두 견고**(어뷰즈 없음 확인)
- **v2.44.5 — 태블릿 검증 도구**: 콘솔 없이 (1) URL `?preview=2`/`?preview=off` 진입·해제(`_urlSeasonPreview`) (2) 미리보기 활성 시 우하단 🧪 디버그 패널(`renderSeasonDebugPanel`/`window.__s2dbg`: 테스트 골드·일반패스 포인트·S2 데이터 초기화·끄기). `__SEASON_PREVIEW` 활성 시에만 표시
- **v2.44.6 — 부동소수점 표시 수정**: 복권확률 "+0.6000000000000001%p" → 정수연산 `Math.round(power*2)/10`
- **v2.44.7 — 🔨오른 대장간 드래그 강화 전면 재설계** (사용자 요청, 메이플 주문서식): 추상 "엠블럼" 배지 → **롤 아이템 이미지**(ddragon, 광채등급별 진화 도란링→로켓벨트→존야→라바돈) 모루 위 배치. **강화권을 인벤토리에서 모루로 드래그**(pointer·터치지원)하거나 탭 → 강화. 연출은 **모루 위 인플레이스**(망치질3+불꽃, 풀스크린 제거). 코드: `renderEmblemBody`(대장간), `_forgeItemMeta`/`_forgeItemImg`, `_bindForgeDrag`/`_forgeDragState`/`_isOverAnvil`, `_emblemForge`/`_forgeSparks`, CSS `.forge-*`
- **⏭️ 대장간 후속(사용자 피드백 대기)**: 아이템 종류 변경·연출 속도/강도·오른 본인 초상화 추가 등. 실테스트 후 조정 예정

#### v2.44.0~3 (원래 구현)

#### v2.44.0 — 마법공학 엠블럼 강화 (4단계, index.html ~L7269 블록)
- **1단계 스키마/코어**: `EMBLEM_TICKETS`(🟢안정100%/+1·40G · 🟡정밀60%/+3·100G · 🔴과부하30%/+6·250G), 슬롯5(시도마다1소모·LOCK), 레벨(+N)=성공수·성능=성공칸 기여합 분리. `emblemEnhance`/`emblemBuyBase`/`emblemBuyTicket`/`emblemSellPrice`. 데이터: `emblem_s2{slots:[{t,ok}],createdAt}`·`emblemTickets_s2`·`emblemSellG_s2`(`calcPlayerGoldEarned` 합산)
- **2단계 UI**: 상점 진입카드(season2 소비탭) → `openEmblemModal`/`renderEmblemBody`(5칸 시각화·강화권 구매·강화·판매). CSS `.emblem-*`
- **3단계 연출**: `_emblemPlayFx`(차징1초→성공 골드파티클/실패 흔들림, `_gSfx.mergeCharge/mergeImpact/reveal`). CSS `.emfx-*`
- **4단계 효과 연결**: 출석 `doAttendance`(`emblemAttendBonus`=성능×3G) · 복권 A안 `_applyEmblemLotteryBoost`(꽝→본전, 성능×0.2%p·캡8%, 4지점: 헬퍼+유료경로+onComplete gold+모달 결과표시) · 광채 `emblemShineHtml`/`emblemGlowMeta`(💠실버/🔶골드/🌈프리즈매틱, 성능25+ "마법공학 장인" 칭호 — 랭킹 hero/mini·프로필 pm-s1-name·대기화면 배지). CSS `.em-shine`/`.em-title`
- **판매공식 결정 (사용자와 논의)**: 환급률 ~60%로 확정. **핵심 교훈: 저강화 확정이익은 절대 금지**(안정 100%라 무한 골드머신=복권 인플레 재현). 운좋아 고성능이면 흑자(도박성·OK). 200만회 몬테카를로로 환급률·흑자확률(거의0) 검증

#### v2.44.1~2 — S2 UI 폴리시 (다른 컴퓨터)
- **v2.44.1**: 📬 우편함 버튼 이모지 → 라인 봉투 SVG(전 시즌 공통). S2에선 has-mail 봉투·배지 골드 통일(빨강 제거, `.season-2 .mb-badge`/`.mailbox-btn.has-mail`). + 엠블럼 슬롯 투명배경 → 불투명(`.emblem-slot` background)
- **v2.44.2**: 🌨️ S2 배경 겹침 — 시즌1 눈보라(`.sf`, z:1)가 헥스텍 위로 흩날리던 것 `body.season-2 .sf{display:none}`로 숨김. S1은 그대로

#### v2.44.3 — 패스 재편 (P1~P4)
- **2종 패스**(무료): 🎮일반게임(증바람·성장)/⚔️내전게임(내전·경쟁), 각10레벨·레벨당200p. `PASS_META`·`PASS_TRACKS`·`PASS_PT_PER_LEVEL=200`·`PASS_MAX_LEVEL=10`
- **포인트**: 내전=`calcCustomPassPts`(S2 매치 순회 자동계산, 1판15·승10·MVP/매너10) / 일반=`calcNormalPassPts`(`normalGamePts_s2` 누적, 브릿지 전제)
- **클레임/UI**: `claimPassLevel`(직전레벨+도달 가드, 강화권/엠블럼/골드/칭호 지급) · `renderS2Pass`/`switchS2Pass`/`doClaimPass`(라우터 `renderAchievementsOrPass` S2 분기). 데이터 `passNormal_s2`/`passCustom_s2{claimed}`·`passGold_s2`(합산)·`passTitle_s2`. 탭배지 `_isS2PassClaimable`. CSS `.s2p-*`
- **비밀퀘 토큰 S2 OFF**: 상점 필터 + `_maybeShowSecretQuestModal` early return
- **보상트랙**: SEASON2.md §4-2 초안 그대로 확정. 10강 칭호 "마법공학 견습"(일반)/"내전의 지배자"(내전)

#### ⏳ 다음 작업 (다른 컴퓨터에서 이어서)
- **일반게임 패스 적립 연결**: 브릿지 `isCustomGame` 분리(SEASON2.md §4-3) 후, 일반 eog 수신 시 `normalGamePts_s2` 적립 핸들러 추가. 현재 `__addNormalPassPts(n)` 디버그 훅만 있음
- **switchSeason S2 버튼 / S1 읽기전용 재라우팅**: 6/11 임박 시 (SEASON2.md §5)
- **6/11 확인**: 증바람 일반 queueId, 일반게임 augment 공개 match-v5 여부

### v2.43.265~272 (2026-06-03) — 출석 버그 긴급 수정 + 브릿지 재연결 패치 + 기록 필터

> v2.43.177~264는 다른 컴퓨터/이전 세션에서 진행(복권 음수 EV 재밸런스·재오픈, 우편함 시스템, 무료 복권권, 가챠 시너지 골드 정리, 챔피언 명대사/음성, 시너지 2성/3성 분리, 브릿지 미연결 수동 투표 등). **상세는 in-app CHANGELOG 참조.**

#### 출석체크 관련 3종 수정 (v2.43.265~268) — 이날 핵심
- **v265 출석 "실패" 오표시**: 출석 시 Firebase 저장은 성공했는데 직후 UI 갱신(우편 배지 등)에서 에러 나면 catch로 떨어져 "❌ 출석 체크 실패" 토스트가 뜸. `doAttendance`에서 **저장과 UI 갱신 분리**(저장 성공=출석 완료, UI 에러 격리) + `updateMailBadge` try-catch 방어
- **v266 출석 진행도 손실 긴급 복구 + 재발 방지** ⚠️ 중요:
  - 7명(신규·울퉁·브랜딩·맹독·조조·나랑·빛나)의 `relayProgress`가 옛 `_RELAY_ROLLBACK` 값으로 되돌려진 사고. **옛 캐시 버전의 `revertRelaySogeup` 재적용이 원인**
  - 복구: `attendanceHistory.relayStep` 최대값 + 오늘 출석분으로 Firebase PATCH (신규15·울퉁23·브랜딩18·맹독18·조조16·나랑23·빛나13). 검증 완료
  - 재발 방지: (1) onValue에서 `revertRelaySogeup()` 호출 제거 (2) **`autoFixRelayShrink()` 신설** — relayProgress < attendanceHistory relayStep 최대면 자동 복구(본인 데이터만, 줄었을 때만 → 루프 없음). 어떤 경로로 줄어도 최신 기기가 즉시 복구
- **v267 릴레이 보드 팀원 현황 실시간 갱신**: 다른 팀원 출석이 열린 보드에 바로 반영 안 되던 것 → onValue(gold)에서 릴레이 모달 열려있으면 재렌더 (복권 Hub와 동일)
- **v268 "다음 받을 칸" ✓완료 오표시**: 오늘 출석 마치면 다음 칸(Day27)에 "✓완료" 배지가 붙어 진행도+1로 보임 → "다음 차례"(중립색)로 교체. 진행도 숫자는 처음부터 정확

#### 기록 탭 "내 경기" 필터 (v272)
- 기록 탭 헤더에 `👤 내 경기` 토글. 본인 1팀/2팀 참여 경기만 필터. `_recordMineOnly` 상태, 시즌 드롭다운과 함께 동작. 닉네임 없으면 버튼 숨김

#### ⏳ 미완 작업 — 브릿지 aram-bridge v1.1.31 (다른 컴퓨터에서 빌드·릴리즈 필요)
**문제**: 라이브 계정이 브릿지 켜고 게임 중 **롤 클라이언트 재시작 시 브릿지가 재연결 못 하고 멈춤** → 다음 단계(EOG 투표) 진행 불가.
- **원인**: 롤 비정상 종료 시 lockfile이 안 지워지고 남음 → 재시작 시 새 port로 덮어써지는데, `_connected=true`라 새 port를 무시하고 죽은 옛 port로 헛요청
- **수정 완료(로컬)**: `index.js`의 `LockfileConnector`에 (1) port 변경 감지 → disconnect 후 재연결 (2) `forceReset()` + poll 연속 4회 실패 시 강제 재연결. package.json 1.1.30→1.1.31
- **⚠️ push 못 함**: codespace 토큰이 `aram` 리포 전용이라 `aram-bridge`에 push 403. → **patch + 가이드를 `aram/bridge-patch/`에 보관**(GitHub에 푸시됨)
- **다른 컴퓨터(aram-bridge 있는)에서 할 일**: `git apply bridge-patch/bridge-v1.1.31.patch` → pkg 빌드 → `gh release create v1.1.31`. (웹앱은 이미 v259~271로 수동 투표 폴백 있어 당장 경기엔 지장 없음). 적용 후 `bridge-patch/` 삭제 가능

#### 웹앱 측 브릿지 끊김 대응 (이미 됨, v259~271)
- 브릿지 죽어도 라이브 계정이 승리팀 수동 선택 → "🏆 MVP·매너왕 투표창 열기" 버튼(`open-vote-btn`, 일반매치 항상 표시) → `session/manualEog` 브로드캐스트 → 전 팀원 투표창

---

### v2.43.175~176 (2026-05-29 후속) — 가챠 시너지 LP 밸런스 + 강탈 재설계 논의

이전 세션에서 가동된 가챠 시너지의 **인플레/밸런스 문제를 점검**하고 LP 증감 시너지를 대폭 하향. 골드 관련 시너지(지원형·탱커 위로금)는 재설계 논의만 하고 **결정 대기 중**.

#### 검증 결과 — 골드 시너지 인플레 위험 (시뮬레이션으로 확인)
- **골드 강탈(steal, 빌지워터)**: 승리 시 패자 전원에게서 per(15/25G) 강탈 → thief 전액 수령. 문제: (1) victim 보유량 미확인 → 음수 클램프(`Math.max(0)`)로 **골드 생성 누수**, (2) 다중 thief 동시 발동 시 한 victim이 여러 번 털림, (3) 시스템 sink 아니라 단순 재분배라 인플레 억제 0
- **신성한 개입(win_gold, 서폿)**: 승리 시 +120/180G **순수 생성**. 5:5 승자 5명 전원 발동 시 최대 **+900G/경기** 무한 생성
- **탱커 위로금(unbreakable)**: 패배 시 +20/40G 순수 생성
- 음수 방지: `getMyGold`/대기화면/골드점검 **표시값엔 `Math.max(0)` 가드 있음** → 표시상 음수 안 뜸. 단 강탈 누수는 그 가드 때문에 발생하는 부작용
- **일반 경기 평균 수령 골드 = 약 35G/인** (시즌1 205경기 기준, 기본 승15/패5 + MVP·매너 각 50G가 거의 매경기 4명). → 시너지 골드 적정선 판단 기준점

#### win_lp "무조건 켜기" 문제
- win_lp 계열은 **승리 시에만 발동·패배 시 무효과** → 다운사이드 0 → 항상 켜는 게 최적해(도박권 활성 시만 억제). 슈리마 연승 보너스가 이를 증폭(부익부)
- 슈리마 연승 계산은 정확: `_currentWinStreak`(매치 저장 직전 연승 수) × streakStep, streakMax 상한. won일 때만 발동이라 연승 끊긴 경기엔 안 뜸 (버그 아님)

#### 적용 완료 (v2.43.175~176) — LP 증감만, 골드는 미적용
공격형(win_lp) 2차에 걸쳐 대폭 하향:
| 시너지 | 원본 | v175 | v176(현재) |
|---|---|---|---|
| 전사/원딜/암살자 | 5/7 | 4/6 | **2/3** |
| 검무(아이오니아) | 4/5 | 3/4 | **1/2** |
| 슈리마 | 6/8 | 5/7 | **3/4** |
| 슈리마 streakStep | 2 | 1 | 1 |
| 슈리마 streakMax2/3 | 4/6 | 4/6 | **2/3** |

방어형(lp_block) 완화량 축소:
| 시너지 | 원본 | v175 | v176(현재) |
|---|---|---|---|
| 탱커 | 8/12 | 5/8 | **3/5** |
| 데마시아 | 4/6 | 3/4 | **1/2** |

- 슈리마 최대 보너스 도달: 2성=직전 2연승(+5), 3성=직전 3연승(+7)
- `_synEffTxt`가 v2/v3/streakStep 동적 참조 → 도감·미리보기 자동 반영 (하드코딩 없음)

#### ⏳ 미결정 — 다음 세션 이어갈 작업 (골드 시너지)
**골드 강탈(빌지워터) 재설계** — 사용자에게 "골드를 실제로 빼오는(sink) 콘텐츠"로 만들지 논의 중. 제시한 방안:
- 방안 A: **강탈세** — thief가 일부만 받고 나머지 시스템 소멸 (약한 sink)
- 방안 B: **보유 골드 비례 %** 강탈 — 부자 집중 타겟, 음수 불가
- 방안 C: **순수 sink** — 패자 골드 시스템 완전 소멸, thief는 소량만
- 방안 D: 강탈 풀 + 잭팟 (도파민형)
- 공통 안전장치 필수: ① victim 실보유량 `min()` 체크 ② 다중 thief 합산 캡 ③ 정산창 victim 피해 표시("🏴‍☠️ 약탈당함 -NG")

**아직 손 안 댄 골드 시너지** (전부 인플레 위험):
- 🔴 신성한 개입(서폿) win_gold +120/180G — 순수 생성, 최우선
- 🔴 탱커 위로금(unbreakable) +20/40G
- 💫 리스크형(유레카 risk_win +12/16·패-6, 공허 risk_block) — LP라 인플레는 아니나 유레카 상승폭 큼

**정산창 강탈 표시 버그** (v153~ 현존): victim(골드 깎이는 쪽)이 본인 시너지 미장착이면 synLine 안 뜸 + 메인 골드 숫자에 시너지 골드 미반영 → playerRow의 `gold` 변수가 GOLD_WIN/LOSE+MVP+매너+뉴비만 합산([index.html ~11004]), 시너지 goldDelta/steal 누락. 골드 시너지 확정 시 함께 수정 필요

#### 핵심 코드 위치
```
GACHA_SYNERGY_GROUPS  : index.html ~22139 (효과값 정의)
SYN_PROC = {2:30,3:50}: index.html ~22054
_synEffTxt(grp,tier)  : index.html ~22055 (효과 텍스트, 동적)
_currentWinStreak     : index.html ~6785
매치 저장 시 시너지 롤 : index.html ~11526 (_synergyEffects)
LP 적용              : index.html ~20040 (s1ApplyMatchResult)
골드 적용            : index.html ~6748 (calcGoldFromMatches, steal/goldDelta)
정산창 시너지 라인    : index.html ~11052 (synLine, victim 미표시 버그)
```

---

### v2.43.152~174 (2026-05-29) — 챔피언 가챠 시스템 가동 + UI 다듬기

이날 단일 세션에서 가챠를 "껍데기만 있던 상태"에서 실제 작동까지 끌어올리고 UI를 대폭 다듬음.

**핵심 — 가챠 시너지 정식 가동 (v152~153)**
- `GACHA_SYNERGY_GROUPS` 11개를 **4분류(공격/방어/지원/리스크)** 재편. effType: win_lp/lp_block/win_gold/steal/risk_win/risk_block. 2성/3성 효과값 차등(v2/v3), 발동확률 `SYN_PROC`{2:30,3:50}
- 특수: 군림(연승)·불굴(방어+위로금)·약탈(상대 골드 강탈, 제로섬)·유레카/공허(반전 도박)
- **뽑기/합성 스텁 해제** (doGachaPull 50G/450G, doGachaMerge 3개→상위)
- 경기 결과 연결: saveMatch에서 시너지 발동 1회 롤 → `matches/{key}.synergyEffects` 기록(보유검증·도박권억제·군림 연승 스냅샷). `s1ApplyMatchResult`가 LP 적용(정규전 한정), `calcGoldFromMatches`가 골드/강탈 정산
- 활성 시너지 = `gold/{key}.activeSynergy_s1={sid,tier}`. 카드: `champCards_s1[slug]={s1,s2,s3}`, 도감 `champCardLog_s1`

**추적성 (v157, 롤백 대비)**: `gachaSpent_s1`+`gachaLog_s1`(뽑기 소모), `synergyEffects.lpDelta`(시너지 LP), 시너지 골드/강탈은 매치에 per-match 기록

**UI 다듬기 (v155~174)**: 2탭(🎲뽑기/📖컬렉션), 컬렉션 등급탭(◇파편/★★2성/★★★3성), 시너지 신규완성 알림(네비 초록배지+localStorage seen), 시너지 효과 미공개(전원 모으면 공개), 활성화 직관 버튼(드롭다운 제거), 카드 상세 = 서사 글귀(`GACHA_CHAMP_LORE` b[티어별]+모스트 「{p}」 실시간), 미보유 카드도 클릭 가능, 합성 버튼 톤·하단 이동, 대기화면/정산창 시너지 표시
- reveal/카드 이미지 = 티어별 커스텀 아트 `assets/pets/{slug}/{silver|gold|prism}/default.png` (전 18챔프 존재). 배경막·고속실루엣·경기투표카드만 ddragon(의도)

**⚠️ v166 치명 사고 + 교훈**: v165 CHANGELOG 편집 시 v164 항목 `{ver,changes:[}` 래퍼를 빠뜨려 **인라인 스크립트 전체 SyntaxError → 사이트 먹통**(연결중 멈춤·테스트FAB노출·버튼 동작X). 원인이 캐시인 줄 알고 헤맴. **교훈: `node --check`를 `<script type="module">`뿐 아니라 모든 `<script>` 블록(CHANGELOG가 든 인라인 포함)에 돌릴 것.** 검증 스니펫: `const re=/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g`

**미검증**: 가챠 LP/골드 경로 실경기 테스트는 아직 (node --check 구문만). 복권은 여전히 `SCRATCH_LOTTERY_LOCKED=true` 잠금.

### v2.43.x (2026-05-28) — 스크래치 복권 정식 오픈 + 전면 롤백

오전~오후: 다른 컴퓨터에서 v2.43.125~146 진행 (프리미엄 셀 디자인·Hub UX·정식 오픈·가격/잭팟 재조정·구당첨금 소급 회수).
저녁: 인플레 문제로 전체 잠금 → 전 사용자 완전 pre-v135 상태 롤백 (v2.43.147~151).

#### 다른 컴퓨터 작업분 (v2.43.125~146)

##### 프리미엄 셀 디자인 완성 (v2.43.125, 128, 131)
- v2.43.125: 12면 보석체 clip-path 제거 → 원형 통일 + 레인보우 글로우 (1차 1차원 시도)
- v2.43.128: 3열(3+3+1) → 8컬럼 4+3 피라미드 배열 (균등 크기)
- v2.43.131: **최종** — 원형 → 9점 gem clip-path 크리스탈 실루엣 + box-shadow/border → filter:drop-shadow() 전환 (clip-path 환경 대응). 6컬럼 2+3+2 다이아몬드 배치. scardPremBorder → scardPremGlow (drop-shadow 레인보우)

##### Hub UX 다듬기 (v2.43.126, 129~130, 132~133)
- v2.43.126: 복권 ? 버튼 2종 추가 (Hub 카드 ? + 스크래치 모달 헤더 ?)
  - 해골 있는 티어는 "다 긁지 마세요!" 전략 강조
- v2.43.129: ? 버튼 클리핑 수정 (header-row 밖으로 이동), 팝오버 위치 카드 좌측 → 버튼 바로 아래
- v2.43.130: 팝오버 → 인라인 확장(`.lh-tier-help`)으로 교체 — `.show/.active` 토글, overflow 클리핑 해결
- v2.43.132~133: 팀 시도 횟수 표시 + 총 시도 0이면 자동 숨김

##### 스크래치 UX (v2.43.127, 137)
- v2.43.127: 첫 셀 reveal 직후부터 확인 버튼 활성화 — 해골 회피 전략 가능 ("중간에 멈추고 확인")
- v2.43.137: 복권 구매 확인 팝업 + 긁기 전 X 취소 시 환불 (한 획이라도 그으면 환불 X)

##### 정식 오픈 + 가격 리워크 (v2.43.134~136, 138, 139) ← 매우 중요
- **v2.43.134** (16:26 KST): 가격 100/300/600G → **70/200/400G** (-33%), 잭팟 상한 캡 (일반 1500→1000G, 고급 6000→3000G + 해골패 200→150G, 프리미엄 12000→5000G + 해골패 400→250G)
- **v2.43.135** (16:47 KST): **정식 오픈** — SCRATCH_LOTTERY_TESTMODE=false, 어드민 복권 로그(openLotteryLog) 추가
  - `SCRATCH_LAUNCH_TS = new Date('2026-05-28T00:00:00+09:00').getTime() = 1779894000000` 기준점
- v2.43.136 (16:52): 시도 횟수 집계 launch_ts 이후로 한정
- v2.43.138 (17:28): **가격 불일치 버그 수정** — S1_SHOP_ITEMS(100/300/600G)가 SCRATCH_TIERS(70/200/400G)와 달라 골드 체크 잘못 막힘. scratch_tier 분기에서 tierDef.price 단일 출처
- v2.43.139 (17:35): **과다차감 자동 환불** — `autoRefundLotteryOvercharge()` liveMode 진입 시 1회 자동 실행, 구가-신가 차액 환불. `config/lotteryOverchargeRefundDone` 플래그

##### 일반 복권 임시 잠금·재밸런싱 (v2.43.140~143)
- v2.43.140 (17:56): `SCRATCH_NORMAL_LOCKED=true` — Hub 카드 비활성. _lhBuyTier 이중 가드로 우회 차단
- v2.43.141 (18:12): 일반 5칸→4칸, 심볼 9개 (❄️눈꽃·⚡번개 추가). appear 재분배 (클로버 30→18). 당첨률 87%→~54%. CSS tier-0 그리드 3+2 → 2+2
- **v2.43.142** (18:19): **일반 복권 구 당첨금 소급 회수**
  - calcLotteryGold 에 `lotteryNormalRollbackG_s1` 차감 로직 추가 (별도 필드)
  - Firebase 직접 PATCH 8명:
    - 당첨금 회수: 27,950G (lotteryNormalRollbackG_s1)
    - 구매비 환불: 14,910G (goldSpent_s1 감소, **트래킹 필드 없음**)
    - 맹독 벌꿀오소리 제보 위로금: 1,000G (goldBonusLegacy_s1 추정)
- v2.43.143 (18:21): SCRATCH_NORMAL_LOCKED=false, 4칸 9심볼 ~54% 정식 오픈

##### 전 티어 밸런스 + 환불 정책 강화 (v2.43.144~145)
- v2.43.144 (18:44): **전 티어 재조정**
  - 일반(안B): 수익률 131%→92%. 눈꽃 90→70G, 왕관 1000→700G
  - 고급: 상금 ×2.5 + 해골패 150→60G. 수익률 8%→98%. 클로버 200→500G, 왕관 3000→7500G
  - 프리미엄: 상금 ×2.5 + 해골패 250→100G. 수익률 -16%→91%. 클로버 400→1000G, 왕관 5000→12500G
- v2.43.145 (19:03): 고급 skullPenalty 60→**150G 원복**, 프리미엄 100→**250G 원복**, 상금 ×2.80/×3.30 스케일. `hasScratched` 플래그 추가 — 한 획이라도 그으면 환불 불가

##### 일반 심볼 확장 (v2.43.146)
- v2.43.146 (19:18): 일반 심볼 9→11종 (🔥불꽃 90G, 💠보석 380G 추가). 당첨률 ~60%→~52%, 수익률 ~96%

---

#### 인플레 문제 인지 후 전면 잠금 + 롤백 (v2.43.147~151)

3시간 19분(16:53~20:12) 동안 1,113건 거래에서 +231,085G 발생. 실제 회수율 ~121% (목표 90~96% 대비 과대). 럼블 488회·맹독 326회 등 그라인딩 극심. 사용자 결정: 전면 잠금 + pre-v135 상태로 완전 복원.

##### 1차 잠금 (v2.43.147~148)
- v2.43.147: `SCRATCH_LOTTERY_LOCKED = true` — 일반·고급·프리미엄 + 긁기 도구 전부 차단. 토스트 "⚖️ 스크래치 복권 밸런스 패치 중입니다!". 단 처음엔 상점 카드 자체가 숨김되던 문제
- v2.43.148: 잠금 정책 수정 — **카드는 노출하고 클릭만 차단** (토스트로 안내). `.lot-entry-locked` CSS 추가 (grayscale 0.45, cursor:not-allowed). **테스트 FAB 영구 숨김** (정식 오픈 후 잔재, SCRATCH_LOTTERY_LOCKED 분기 제거하고 무조건 hide)

##### 2차 롤백 — 1차 net profit 회수 (v2.43.149)
- calcLotteryGold 에 `lotteryRollbackG_s1` 차감 로직 추가 (signed: 양수=회수·음수=보상)
- 11명 일괄 PATCH — 정식 오픈 이후 lottery_history net profit (winnings - new_price * count) - lotteryNormalRollbackG_s1
- 회수 24,080G(ap렉사이 10850·신규 8010·럼블 5220) + 보상 12,145G(맹독 6375 과회수 보정·애긔 3620·애블린 1350)
- **버그**: Python 스크립트에서 SCRATCH_LAUNCH_TS = 1748358000000(2025년!) 잘못 사용 → 5/27 거래 9건 포함. 즉시 보정 (3명: 애긔 -10, 브랜딩 -30, 맹독 +120)

##### 3차 롤백 — v142/v139 부수효과 회수 (v2.43.150)
- 사용자 지적: "v149만으로 pre-v135 상태가 아니다" — v142의 구매비 환불(14,910G) + 위로금(1,000G) + v139 자동환불(5,600G)이 아직 잔고에 남음
- **역추산 검증**: pre-v142 모든 T0 거래 × 70G = 14,910G → changelog와 정확히 일치
- 누락 보정 21,510G 추가 적용 (9명, 맹독 +10,600·럼블 +6,240·신규 +3,550)

##### 스크래치 도구 환불·회수 (v2.43.151)
- 5명 보유 (럼블/신규 동전+만능, 맹독/ap렉사이/애긔 만능)
- items_s1 에서 제거 + 가격(200G/500G)만큼 goldBonusLegacy_s1 가산
- 총 2,900G 환불. 잔여 0개 검증 완료

---

#### 회고 — 시뮬레이션이 실패한 원인 (사용자 지적)

처음 "다음에 시뮬해라"고 조언했으나 사용자가 "이미 했다"고 지적. 진짜 원인 재분석:
1. **rollScratch 후처리 룰 미모델링** — cap=matchCount, 다중 매칭 방지, 쪼는 맛(winSym 마지막 셀 강제)이 raw 추첨보다 win rate를 끌어올림. cap이 사실상 "당첨 floor"
2. **다중 매칭 방지(v122)의 EV 영향** — 낮은 가치 매칭 제거하고 winner만 남기니 평균 당첨금 상승
3. **해골 확률화(v124) 변동성 재계산 누락 의심** — 평균은 동일하나 분포가 달라짐
4. **연쇄 패치의 누적 효과 미검증** — v134→144→145→146 각자 90% 회수율로 계산했어도 합쳐서는 안 봤을 가능성
5. **평균 EV만 보고 분포 무시** — 잭팟 적중자 5%가 경제 왜곡

#### 핵심 데이터 구조 변경 (이 세션)

```js
// 신규 필드
/gold/{key}.lotteryRollbackG_s1: number  // signed, calcLotteryGold 차감 (v149~)
//   양수 = 회수, 음수 = 보상

// 기존 필드 (v2.43.142~)
/gold/{key}.lotteryNormalRollbackG_s1: number  // 일반 복권 구당첨금 차감

// 계산 통합 (v150 기준)
calcLotteryGold(data) = raw_winnings 
                     - data.lotteryNormalRollbackG_s1 
                     - data.lotteryRollbackG_s1

// 코드 상수
const SCRATCH_LAUNCH_TS = new Date('2026-05-28T00:00:00+09:00').getTime();
// = 1779894000000  (Python으로 작업 시 주의 — 2025 아님!)
const V142_TS = ...  // 2026-05-28 18:19:50 KST (커밋 시각)
const V139_TS = ...  // 2026-05-28 17:35:25 KST
```

#### 남은 작업 (다음 세션)

1. **복권 시스템 재설계** (사용자 결정 대기)
   - 음수 EV 모델 (회수율 75~85%) — 현실 복권 톤
   - 하드 캡 (일반 3장/고급 1장/프리미엄 0~1장 일 단위)
   - 잭팟 분할 지급 (즉시 경제 왜곡 방지)
   - 단계적 출시 (일반만 2주 → 고급 추가 → 프리미엄)
   - 시뮬레이션 모델: 실제 rollScratch 직접 N회 호출 + 분포(p50/p90/p99) 검증

2. **위로금/제보 협력 보상 재요청 처리** (사용자가 별도로 요청 예정)
   - v150에서 회수했으니 재지급 시 별도 추적 필드 사용 권장

3. **잠금 해제 시점** — v2.43.147~148의 `SCRATCH_LOTTERY_LOCKED=true`를 언제 false로 되돌릴지

---

### v2.43.x (2026-05-27 후속) — 스크래치 복권 풀 리워크 (이전 세션)

#### 스크래치 복권 풀 리워크 + 환불·보상 일괄 처리 (v2.43.97~124, 2026-05-27)

이날 단일 세션에서 스크래치 복권 시스템 전반·릴레이 보상 정산·도구 환불·UI 다듬기까지 약 28개 패치 진행. 시간 순으로 요약:

##### 비밀 퀘스트 토큰 race condition 정리 (v2.43.97)
- `buyItem` 중복 가드 (신규회원임 case)

##### 스크래치 복권 통합 진입점 + 테마/UX 빌드업 (v2.43.98~108)
- v2.43.98: 상점 카드 단일 → 통합 hub 모달 진입점 신설
- v2.43.99~101: 셀 디자인 (원형 동전, 그리드, 난이도 완화)
- v2.43.102: 티어별 테마 차별화 시도 (1차) — 실제 복권 긁기 느낌(다중 라인 + 가루 파티클)
- v2.43.103: matchCount 도입 — 일반 2매칭, 고급/프리미엄 3매칭. 보상 재밸런싱
- v2.43.104~105: 단일 레이어 통일, "마지막!" 텍스트 제거, cover alpha 0.92~0.93
- v2.43.106: 실시간 진행 상태 표시 (가장 많이 모인 심볼 카운트 + 해골 + net 금액)
- v2.43.107: 치명 — `matchCount`가 `rollScratch` 스코프에만 있어서 결과 화면 안 뜨던 ReferenceError 수정 (showScratchModal 상단에 `const matchCount = activeTier.matchCount || 2` 추가)
- v2.43.108: 해골 회피 매커닉 강화 (해골만 reveal 임계값 0.65로 고정 등)

##### 출연 확률 시스템 + 7종 심볼 확장 (v2.43.109~111)
- v2.43.109: prob(전체 당첨 확률) → appear(셀당 출연 확률) 시스템. 해골 reveal 임계값 분기 제거 (티 안 나게)
- v2.43.110: 5종 → 7종 (⚔️ 검 + 🛡️ 방패 추가). 블랭크 제거 — 모든 슬롯에 무조건 심볼
- v2.43.111: 매칭 완성 자동 종료 제거 (사용자가 더 긁어볼 수 있음), 보상 대폭 하향 (잭팟 일반 7000→1500G·고급 15000→6000G·프리미엄 30000→12000G, EV 100~115%)

##### 출석 릴레이 보상 복구 (v2.43.112~113) — Firebase 직접 보정
- v2.43.112: 5/21 릴레이 도입 후 출석은 됐지만 `relayProgress` 갱신 안 된 7명(신규회원임·울퉁쓰·브랜딩프로·맹독 벌꿀오소리·조조와빈찬합·나랑듀오해듀오·빛나는언즈) 자동 보정 코드 추가 (`autoCompensateRelayV1`). 누락 칸 RELAY_REWARDS 일괄 지급 (+2640G + s1_lp2x ×9)
- v2.43.113: 치명 — v2.43.26에서 추가한 `revertRelaySogeup`이 매 onValue 호출 시 자동 보정값을 옛 값으로 되돌리던 문제. 영구 비활성화 (`_relayRollbackDone = true; return;`)
- **추후 별도 패치**: 7명에 대해 `relayClaimed_s1`/`relayProgress_s1`을 target(6~10)으로 끌어올리되, calcRelayGold 증가분만큼 `goldBonusLegacy_s1`에서 차감 → **순 골드 0 변동**. items_s1 미터치 (이미 지급된 마일스톤 아이템 유지). 환불 스크립트 ([summary 참고](#))

##### 스크래치 다중 매칭 방지 + 쪼는 맛 (v2.43.114~115)
- v2.43.114: 일반 복권 동일 심볼 cap=2 (`tier.idx === 0`만) — 3·4·5개 겹쳐 보이는 시각 혼란 차단
- v2.43.115: **쪼는 맛 강화** — 당첨이면 winSym 1개를 마지막 셀(cells-1)에 강제, 나머지는 앞쪽 셀 랜덤. cap=matchCount를 전 티어 확장 → winSym 정확히 matchCount 개 → 강제 배치 안정성

##### 긁기 속도 슬로다운 (v2.43.116)
- 메인 brush alpha 0.65→0.40, 가장자리 0.35→0.20·갯수 3→2, reveal 임계값 0.45→0.55, 도구 임계값 비례 조정

##### 긁기 도구 시뮬레이션 토글 + 사전 구매분 환불 (v2.43.117)
- 테스트 모드에서만 노출되는 [없음/🪙 동전/🔑 만능] 3버튼 토글 (Hub 모달 상단)
- `_scratchTestTool` 모듈 변수, `scratch_tier` 구매 흐름에서 override
- **환불 Firebase 직접 적용**: 브랜딩프로 만능 긁개 500G, 맹독 벌꿀오소리 동전+만능 700G → `goldBonusLegacy_s1`에 가산, `items_s1`에서 제거

##### 스크래치 결과 액션 3종 (v2.43.118)
- `#scard-confirm` 단독 → `#scard-actions` 그룹으로 교체
- [← 뒤로][🔁 한 번 더 (-NG)][✓ 보유 NG · 확인] 3버튼
- 뒤로: onComplete 후 `window.openLotteryHub()` / 한 번 더: onComplete 후 `window.buyItem(tierDef.id)` / 확인: 기존 동작
- 테스트 모드는 2버튼 (한 번 더 없음 — 확인이 onNext = 다시 긁기)

##### 비침·배치·도형 1차 (v2.43.119)
- emoji opacity 0.13→0.22, blur 5px→3px, cover alpha 0.92→0.82 (peek-through 강화)
- 일반 복권 5칸 한 줄 → 3+2 2행 (6컬럼 그리드, 각 셀 span 2, 셀 크기 tier1과 동일)
- 프리미엄 셀 원형 → 육각형 (clip-path polygon)

##### 비침·속도·도형 2차 + 모드 토글 제거 (v2.43.120)
- emoji opacity 0.22→0.55, cover alpha 0.82→0.75 (더 강화 — 그러나 user 피드백: "긁기 전에 알면 안 됨" → v2.43.121에서 되돌림)
- 메인 brush alpha 0.40→0.30, 가장자리 0.20→0.12, 픽셀 클리어 임계값 `d[i] < 200` → `< 120` (셀당 ~2배 스트로크)
- 프리미엄 육각형 → 팔각형 (중앙 영역 넓힘) + 자식(.scard-sym/.scard-canvas) 명시적 클립
- **드래그/홀드 토글 완전 제거** — `.scard-mode-tog`/`.scard-mode-btn` CSS, `scratchMode` 변수, `startHold/stopHold` 로직 일괄 삭제. pointer drag 단일화

##### 비침 스포일러 차단 (v2.43.121) ← 중요 수정
- v2.43.120의 cover alpha 0.75가 너무 투명해 긁기 전에 심볼 정체 노출되던 문제 (user 피드백: "긁기도 전에 알면 안 된다, 긁을수록 보여야")
- cover alpha 0.75 → **0.94** 복구. emoji opacity 0.55는 유지 → 긁은 자리만 destination-out으로 픽셀 투명화될수록 점진 노출. 임계값 도달 시 sharp reveal

##### 일반 복권 다중 매칭 방지 (v2.43.122)
- 5칸 2매칭 구조 → 달2 + 클로버2 같은 다중 매칭 케이스 가능 → 결과 모호성
- cap 통과 후 후처리: 매칭 심볼이 2종 이상이면 가장 가치 큰 것만 winner로 남기고, 다른 매칭 심볼은 1개 인스턴스를 cnt=0 싱글톤으로 교체 → 항상 단일 매칭
- 고급·프리미엄은 6/7칸·3매칭 구조상 다중 매칭 불가능해 영향 없음

##### 프리미엄 복권 셀 디자인 업그레이드 (v2.43.123)
- 도형: 팔각형 → **12면 cushion-cut 보석체** `polygon(25% 0%, 75% 0%, 90% 8%, 100% 25%, 100% 75%, 90% 92%, 75% 100%, 25% 100%, 10% 92%, 0% 75%, 0% 25%, 10% 8%)`
- 배경: 단일 라디얼 → 멀티 레이어 (핑크 하이라이트 + 보라 그림자 + 다크 보라 베이스)
- 외곽 글로우: `filter:drop-shadow(0 0 6px rgba(232,121,249,0.35))` (clip-path 모양 따라 자연 렌더)
- 당첨 셀 펄스: `scardGemPulse` 1.6s 사이클 drop-shadow 강도 펄싱
- **커버 텍스처 차별화**: `_scardDrawCover(ctx, w, h, layerLeft, tierIdx)`로 인자 확장. 일반·고급은 황금 그라데이션 / 프리미엄은 핑크-퍼플-골드 멀티 그라데이션 + 십자 facet 광택선 + 흰 글리터 점

##### 해골 확률 출현 (v2.43.124)
- 기존: tier1=1개 / tier2=2개 고정 출현
- 변경: `skullAppear` 가중치 필드 추가 — tier1=20 (~17% 셀당), tier2=40 (~29% 셀당). 셀별 독립 추첨 시 `심볼 100 + skullAppear`의 합산 가중치 풀에서 추첨
- 평균 갯수는 기존과 동일 (1.0, 2.0) but 변동성 ↑ (운 좋으면 0개, 운 나쁘면 3개+)
- Hub 확률표·모달 우측 당첨표·룰 텍스트·상점 카드 설명 모두 % 표시로 갱신
- `rollScratch` 내부에서 `skulls` 참조 → `skullCount` 동적 변수로 교체

#### 핵심 함수/상수 변화 정리

```js
// 추가/변경된 변수·상수
let _scratchTestTool = null;                           // 테스트 도구 시뮬레이션 (v2.43.117~)
const SCRATCH_TIERS[i].skullAppear = 0|20|40;         // 해골 가중치 (v2.43.124~)
const SCRATCH_TIERS[i].matchCount = 2|3|3;            // 매칭 갯수 (v2.43.103~)

// 변경된 함수 시그니처
_scardDrawCover(ctx, w, h, layerLeft, tierIdx)        // tierIdx 추가 (v2.43.123)
showScratchModal(result, gold, { tierDef, toolParams, onComplete, testMode, onNext })

// 새 window 함수
window._setScratchTestTool(toolId)                    // 토글 핸들러 (v2.43.117)
window.openLotteryHub() / window.closeLotteryHub()    // Hub 모달
window._lhBuyTier(id), window._lhBuyTool(id)          // Hub 내 버튼 핸들러

// rollScratch 내부 로직 핵심
- 셀당 독립 추첨 (심볼 + 해골 가중치 풀)
- cap=matchCount: 같은 심볼 matchCount 초과 시 미달 심볼로 교체
- 다중 매칭 방지 (tier 0): 가장 가치 큰 winner 외 다른 매칭 심볼은 cnt=0 싱글톤으로 교체
- 쪼는 맛: 당첨이면 winSym 1개를 cells-1에 강제 배치, 나머지는 앞쪽 셀 랜덤
```

#### CSS 핵심 클래스 (v2.43.x)

```
.scard-overlay / .scard-modal.tier-0/1/2          /* 모달 컨테이너, 티어별 테마 */
.scard-grid.tier-0  → 6컬럼 그리드, 3+2 배치 (v2.43.119)
.scard-grid.tier-2  → 4컬럼, 5/6/7번 셀 재배치
.scard-cell         → 원형 (tier 0/1), 12면 보석체 (tier 2, clip-path)
.scard-sym-emoji    → opacity 0.55, blur 3px (긁힌 자리에서 점진 노출용)
.scard-canvas       → tier 2 는 동일 clip-path 명시
.scard-actions      → [뒤로/한 번 더/확인] 3버튼 그룹
.scard-act-back / .scard-act-replay / .scard-act-confirm
.lh-test-tool-row   → 테스트 도구 토글 노란 점선 박스
@keyframes scardGemPulse  → 프리미엄 당첨 셀 펄스
```

#### 다음 작업 (미구현, 사용자 요청 보류)

- **긁기 도구 의미 부여**: 현재 도구가 큰 차이 없음. 4가지 방안 제안 중:
  - A: 브러시 alpha 자체 ↑ (coin 0.30→0.50, key 0.30→0.80)
  - B: 픽셀 클리어 임계값 차등 (coin <170, key <220 → 한 번 닿으면 cleared)
  - C: 도구별 고유 메커닉 (coin = 가루 폭발, key = 자동 미리보기)
  - D: 결과 보너스 (coin = +10% 골드, key = +1 무료 reveal + +15% 골드)
  - 추천: A+B 조합. 사용자 의사결정 대기 중

---

### v2.43.x (2026-05-27 전반)

#### 챔피언 가챠 프리즘 카드 + 복권 개선 (v2.43.82~89, 2026-05-27)

##### 복권 긁기 시스템 개편 (v2.43.82~86)
- **v2.43.82**: 3줄 평행선 긁기 → 단일 스트로크로 변경 시도 (dark blob 문제)
- **v2.43.83**: 이모지 즉시 노출 시도 (유저 요청으로 롤백)
- **v2.43.84**: `lineCap:'square'` 사각형 긁기로 변경
- **v2.43.85**: `globalAlpha:0.45` 레이어 효과 추가 (한 꺼풀씩 벗겨지는 느낌)
- **v2.43.86**: **최종 확정** — 이모지를 캔버스 아래에 즉시 노출(opacity:1), destination-out + globalAlpha:0.45로 긁을수록 비쳐 보이는 구조. checkCellReveal 임계값 `< 200` (1번 긁힌 픽셀도 카운트)
  - 핵심: 캔버스(은박 커버)가 불투명하게 이모지를 가리고, 긁으면 캔버스가 반투명해지며 아래 이모지 노출

##### 복권 확률/골드 조정 (v2.43.87)
- 🍀 클로버 5%→**30%** 50G / 🌙 달 20%→**25%** 100G / ⭐ 별 8% 200G / 💎 다이아 4% 400G / 👑 왕관 1.5%→**1%** 1000G→**800G**
- 총 당첨률 38.5%→**68%**, 꽝 **32%**
- `rollScratch()` 누적 확률 구간 갱신

##### 챔피언 가챠 프리즘 이미지 (v2.43.88~89)
- 프리즘 카드 이미지 18종 추가 (`assets/pets/{slug}/prism/default.png`)
  - 스타일: StarCraft Remastered Cartooned DLC 스타일 (Adobe Firefly 생성)
  - 골드=기본 스킨 치비 일러스트 / 프리즘=유료 스킨 동일 스타일
  - 스킨 목록: Cyber Pop 아크샨, Re-Gifted 아무무, Zombie 브랜드, Corporate 문도, Fuzz 피즈, Sultan 갱플랭크, High Noon 진, Mecha 카직스, Pool Party 룰루, Glacial 말파이트, Snow Day 말자하, Prestige Winterblessed 멜, Sinful Succulence 모르가나, Soul Fighter 나피리, Lollipoppy, Durian Guardian 람머스, 악마의 저주(대혼란) 베인, PROJECT 야스오
- `gacha_mockup.html` 추가 (gitignore됨 — 로컬 테스트용)
- `gachaTestGrant()` / `gachaTestReset()` 콘솔 함수 추가 (전 챔피언 카드 임시 부여/초기화)
- 카드 배경 아트 밝기 조정: t1(파편) brightness(0.5), t2(골드) 0.32, t3(프리즘) 0.28

##### 다음 작업 (미구현)
- **시너지 효과 적용 로직**: `activeSynergy_s1` {sid, tier} 읽어서 경기 결과(`s1ApplyMatchResult`) + 출석(`doAttendance`) 시 LP/골드 발동 계산
  - `win_lp`: 승리 시 확률(2성 10%/3성 20%) → LP 추가
  - `loss_lp`: 패배 시 확률 → LP 감소 방어
  - `attend_g`: 출석 시 확률 → 골드 추가
- **뽑기/합성 기능 활성화**: `doGachaPull`, `doGachaMerge` 함수 "준비 중" 잠금 해제

### v2.43.x (2026-05-22~23)

#### 비밀 퀘스트 토큰 엣지 케이스 5종 보강 (v2.43.48, 2026-05-23)
프로세스 정밀 검토에서 발견된 엣지 케이스 일괄 수정.

- **#1 한도 우회 차단**:
  - `buyItem` 가드: `existingItems.some(it => it.id === 'secret_quest')` — active 무관, 보유 자체로 추가 구매 차단
  - `toggleItemActive` OFF 분기: `secret_quest` 토글 OFF 시 `questId`/`activatedAt` 함께 제거 → 재활성화 시 새 questId 강제 부여 (어뷰즈 차단)
  - 상점 카드 버튼: active=true → `다음 판 발동` / active=false → `보유 중`
- **#2 이벤트/막고라 매치 모달 차단**: `_maybeShowSecretQuestModal`에 `isEventMatch` + `magollaState === 'active'` 가드 추가 (saveMatch 없는 흐름에서 사용자 혼란 방지)
- **#3 sq_mvp 토큰 보존**: MVP 정보 부재(`!_mvpInfoAvailable`) 시 토큰 보존
  - `window._preservedSqPlayersForThisMatch` Set으로 saveMatch → giveMatchGold 전달
  - `giveMatchGold` 필터에서 secret_quest + preserved 케이스는 `return true`로 active 유지
  - 본인이면 토스트 안내 "MVP 투표 미확정으로 다음 매치로 미뤄짐"
- **#4 자동 비활성화 알림 강화**: 토스트 + `showSecretQuestPreservedNotice` 모달 결합. 시안 톤 검정 배경, 인벤토리 보존 명시
- **#5 fallback 식별 플래그**: `wasFallback: true` 필드 추가 (saveMatch에서 questId 즉석 부여 케이스). 정산창 `.ms-sq-fb-badge` 로 🔄 복구 배지 표시

#### 비밀 퀘스트 토큰 구매=즉시 활성화 정책 전환 (v2.43.47, 2026-05-23)
인벤토리 적재로 못 쓰는 토큰 발생 가능성을 원천 차단.

- **buyItem**: secret_quest 구매 시 `active:true, activatedAt:Date.now()` 로 인벤토리 추가 → `_maybeShowSecretQuestModal()` 자동 트리거 대상
- **사전 차단**: 구매 시점에 배치/승급전/도박권/이미 활성화된 토큰 보유 여부 체크 → 200G 낭비 방지
- **상점 카드**: `📅 오늘 N/2 · 구매 즉시 다음 매치 자동 발동` 안내 + `한도 소진 (N/2)` / `다음 판 발동` 상태 분기
- **showSecretQuestPurchaseInfo**: "즉시 활성화 완료 · 별도 활성화 불필요" 로 안내 문구 갱신
- 인벤토리 토글로 비활성화는 여전히 가능 (사용자가 원하면 끄기)

#### 비밀 퀘스트 토큰 안정성 보강 (v2.43.46, 2026-05-23)
새로고침·재팀짜기 케이스에서 토큰이 소실되거나 200G가 증발하던 엣지 케이스 차단.

- **재팀짜기 정책**: `questId` 한 번 부여되면 saveMatch까지 고정(어뷰즈·리롤 차단), 모달은 새 팀 발표마다 재노출
- **`_shownSqForTeamTs` 가드**: `_currentTeamsFormedAt`과 비교해 같은 팀 형성 중 중복 모달 방지
- **Option A (백업 트리거)**: `applySessionData`에서 `teamsChanged === true` 시 9초 후 `_maybeShowSecretQuestModal()` 호출 — 발표 오버레이를 놓친 기기 (탭 이동·새로고침) 대비
- **Option B (saveMatch fallback)**: `active=true` 토큰에 `questId`가 없으면 즉석 부여(`pickRandomSecretQuest()`)해서 판정·소비 — 모달 노출 전 새로고침된 케이스에서 토큰 손실 방지
- **소비 시점 원칙**: 토큰은 saveMatch 시점에만 소비됨 → 게임 미완료(reset/cancel) 시 토큰 보존
- `resetSession`에서 `_shownSqForTeamTs = 0` 초기화

#### 릴레이 보드 UI + 버그 수정 집중 (v2.43.21~32, 다른 컴퓨터 작업)

- **v2.43.21**: 릴레이 30칸 완료 후 패스 탭 노란 dot 오표시 수정
  - `updateS1PassTabBadge` / `updateRelayEventBtn` 두 곳에 `Math.min(..., 30)` 캡 추가
- **v2.43.22**: 릴레이 완주 후 출첵 0G 버그 수정
  - 30스텝 완료 후 이후 출첵에서 슬롯당 50G 기본 보상 지급 (attendanceHistory.gold 기록)
- **v2.43.23**: `migrateRelayBase()` 비활성화 — `relayBase > relayClaimed` 상태 야기하는 근본 원인
- **v2.43.24**: `fixRelayBaseOnly()` 도입 — relayBase > relayClaimed인 유저 6명 relayBase=0 일괄 초기화
  - 영향 유저: 애긢반달곰·신규회원임·울퉁쓰·브랜딩프로·조조와빈찬합·빛나는언즈
- **v2.43.25**: `fixRelaySogeup()` — 전원 relayClaimed 소급 + 마일스톤 아이템 자동 지급 (→ 과지급 발생)
- **v2.43.26**: `revertRelaySogeup()` — v2.43.25 과지급 롤백, 원본값 스냅샷 복원
  - `fixRelaySogeup`은 빈 함수로 비활성화 유지, `fixRelayBaseOnly`만 앱 로드 시 실행
- **v2.43.27**: **릴레이 보상 전면 상향** — 일반 칸 20G→**50G**, 마일스톤 전체 상향, 총합 **2160G**
  - Day5: 40→70G+LP2x / Day10: 55→100G+LP2x / Day15: 65→130G+도박권
  - Day20: 90→160G+승급전방어권 / Day25: 110→200G+LP2x / Day30: 160→300G+LP2x
- **v2.43.28**: LP 2배권 EOG 표시 버그 수정 + 아이콘 개선
  - `renderRelayBoard`의 `rlb-lp2x` 텍스트 뱃지 분기 제거 → `SHOP_ITEMS.icon` SVG로 통합
  - `s1Resimulate()`에 s1_lp2x 분기 추가 (재시뮬 시 +40LP 적용)
  - `buyItem`에 `relayOnly` 가드 추가 (콘솔 익스플로잇 방어)
- **v2.43.29**: LP 2배권 릴레이 보드 아이콘 SVG 적용 완료
- **v2.43.30**: 릴레이 보드 UI 정리
  - 팀원 현황 기본 접힘, 출석법 호버 툴팁 추가
- **v2.43.31**: 릴레이 보드 UI 개선
  - 타이틀 크기/정렬, 단계 표시, 보상판에 출석 버튼 추가
- **v2.43.32**: 릴레이 보드 오전/오후 출첵 상태 텍스트 제거 (오늘 둘 다 완료 시에만 표시)

#### LP 2배권 (s1_lp2x) 아이템 설계
- `relayOnly:true`, `price:0` — 상점에서 구매 불가, 릴레이 보상으로만 획득 (Day5/10/25/30)
- 정규전 전 활성화 시: 승리 → **+40 LP** / 패배 → 아이템 소모 + **-14 LP** (일반 패배)
- 배치고사·승급전 중 사용 불가

#### 현재 RELAY_REWARDS 구조 (v2.43.27~)
```
총 2160G = 24칸×50G + 마일스톤 6개(70+100+130+160+200+300)
Day5:+LP2x  Day10:+LP2x  Day15:+도박권  Day20:+승급전방어권  Day25:+LP2x  Day30:+LP2x
```

#### 릴레이 소급/마이그레이션 함수 현황
- `migrateRelayBase()`: **비활성화** (v2.43.23~, 과지급 원인)
- `fixRelaySogeup()`: **빈 함수** (v2.43.26 롤백)
- `revertRelaySogeup()`: v2.43.25 과지급 복원용 (앱 로드 시 실행)
- `fixRelayBaseOnly()`: relayBase>relayClaimed 초기화만 수행 (앱 로드 시 실행)

#### 릴레이 출석 호환성 (v2.43.15~17)
- **v2.43.15**: `relayBase_s1` 필드 도입 — v2.43.14 이전 유저의 이중 골드 지급 방지
  - `calcRelayGold(claimed, base)` — `RELAY_REWARDS.slice(base, claimed)` 합산
  - `calcPlayerGoldEarned`에서 `relayBase` 참조
  - `doAttendance`에서 `isLegacyUser` 판별 후 `newBase` 설정
- **v2.43.16**: `migrateRelayBase()` — v2.43.14 창 유저 자동 마이그레이션 (출석 이력 기반 `correctBase` 계산)
- **v2.43.17**: `attendanceHistory` 항목에 `relayStep` 필드 추가 (출석 시 현재 릴레이 단계 기록)

#### 챔피언 가챠 개편 (v2.43.18~20)
- **v2.43.18**: 1성 → **파편** 리네임 (배경만 존재, 누끼 없음, 효과 없음)
  - `GACHA_TIER_KR`, `GACHA_STAR_LABEL`, `GACHA_STAR_FLAVOR` 갱신
  - `_gachaCardHtml`: `isShard = star===1` 분기 — 파편은 petWrap/roleText/효과 미표시
- **v2.43.19**: 가챠 확률 복원 — 파편 87% / 2성 10% / 3성 3% (`gachaRollStar` 정상화)
- **v2.43.20**: **시너지 시스템 전면 개편**
  - `GACHA_CHAMPS`에 `faction` 필드 추가 (ionia/void/bilgewater/demacia/shurima/null)
  - `GACHA_SYNERGY_GROUPS` 3개 → **11개** (역할 6 + 진영 5)
    - 역할: 검을 뽑아라(전사), 신성한 개입(서폿), 탄환 세례(원딜), 그림자 주자(암살자), 강철 심장(탱커), 유레카(마법사)
    - 진영: 검무(아이오니아), 공허 균열(공허), 골드 강탈(빌지워터), 여명의 의지(데마시아), 나는 왕이다(슈리마)
  - 카드 개별 타입/효과 표시 제거 (`GACHA_PET_TYPE`, `GACHA_EFFECT_TXT`, `GACHA_SET_CFG` 폐기)
  - **시너지 효과**: 발동률 2성=10% / 3성=20%, 효과값은 멤버수 기준 (2명→약, 3명→중, 4명→강)
  - **토글 조건**: 2성 토글 = 전원 s2≥1 / 3성 토글 = 전원 s3≥1, 동시 1개만 활성화
  - Firebase: `activeSynergy_s1: {sid, tier}` 저장
  - `_renderSynGroup()`: 시너지 row 렌더 (챔피언 실루엣 줄 + 토글 버튼 + 효과 미리보기 드롭다운)
  - `window.toggleGachaSynergy(sid, tier)`: 토글 ON/OFF + Firebase 저장
  - CSS: `.syn-row`, `.syn-fig`, `.syn-toggle`, `.dex-syn-group` 등 시너지 row 스타일 추가

#### 시너지 효과 설계
| 시너지 | 이름 | 효과 타입 | 효과값 |
|--------|------|----------|--------|
| 전사(3명) | 검을 뽑아라 | 승리 LP | +6 |
| 서폿(2명) | 신성한 개입 | 패배 LP 방어 | -3 방어 |
| 원딜(3명) | 탄환 세례 | 승리 LP | +6 |
| 암살자(3명) | 그림자 주자 | 출석 골드 | +12G |
| 탱커(4명) | 강철 심장 | 패배 LP 방어 | -8 방어 |
| 마법사(3명) | 유레카 | 출석 골드 | +12G |
| 아이오니아(2명) | 검무 | 승리 LP | +4 |
| 공허(2명) | 공허 균열 | 패배 LP 방어 | -3 방어 |
| 빌지워터(2명) | 골드 강탈 | 출석 골드 | +8G |
| 데마시아(3명) | 여명의 의지 | 승리 LP | +6 |
| 슈리마(4명) | 나는 왕이다 | 승리 LP | +9 |

#### 다음 작업 (미구현)
- 시너지 실제 효과 적용 로직 (`activeSynergy_s1` 읽어서 경기 결과·출석 시 LP/골드 발동 계산)
- 챔피언 이미지 파일 (`assets/pets/{slug}/silver|gold|prism/default.png`) 준비
- 뽑기 기능 활성화 (현재 "준비 중" 상태)

### v2.42.x (2026-05-21)
- **v2.42.0~3**: 챔피언 가챠 시스템 index.html 통합
  - 상점 탭 "펫" 카테고리 → 뽑기/카드/도감 3탭 구조
  - RPG 카드 디자인: `aspect-ratio:5/7`, `.pc-art/.pc-vignette/.pc-top/.pc-pet-wrap/.pc-bottom`
  - `GACHA_CHAMPS` 18종 (desc 필드 추가, DrMundo role fighter 수정)
  - `GACHA_SYNERGY_GROUPS`, `GACHA_PET_TYPE`, `GACHA_EFFECT_TXT`, `GACHA_TIER_PATH` 등 상수
  - `_gachaCardHtml()`, `_gachaDexFigure()`, `renderGachaDex()`, `showGachaCardZoom()` 함수
  - 카드 줌: `#card-zoom-overlay` > `.cz-wrap` > `.cz-card-host` + `.cz-detail` (역할칩/타입/효과/설명/합성)
  - 뽑기/합성 구매는 "준비 중" 상태 유지 (이미지 미완성)
  - 펫 이미지 경로: `assets/pets/{slug}/{silver|gold|prism}/default.png`
- **v2.42.4**: 팀원용 아이템 페이즈 배너 (`#member-item-phase-bar`)
  - 라이브 계정이 팀짜기 시작 시 비(非)라이브 팀원 전 기기에 탭 무관 전역 표시
  - 타이머(좌) + 구분선 + 아이템 구매·활성화 칩(우) 레이아웃
  - `startItemCountdown()` / `stopItemCountdown()` / `tick()` 연동
  - `_qibRenderChips('mipb-chips', true)` — 기존 qib 칩 재사용
- **v2.42.5**: 팀 결과 UI 개선 3종
  - `#quick-item-bar`: 전체 목록 대신 활성화된 아이템만 뱃지(`.qib-active-badge`)로 표시
  - `closeMatchSummary()`: 닫힐 때 `teams-grid` 재렌더 → LP/티어 즉시 최신화
  - 챌린저 LP: `⚡` 제거, `#ffe040` 노란색, 닉네임-배지 사이 인라인 배치 (`tc-lp-chall`)
- **v2.42.6**: 챌린저 LP + 아이템 페이즈 배너 리디자인
  - 챌린저 `tc-lp-chall`: `lpBefore` 필드로 tp-main-row 내 인라인 배치 확정
  - 배너 골드 테마: 상단 3px 진행바(금→레드), 타이머 32px 금색 + `SEC` 서브라벨, 수직 구분선
  - urgent(≤3초): 전체 보더/타이머/바 레드 + 글로우 애니메이션, `.mipb-wrap.urgent` 클래스

### v2.41.x (2026-05-12~19)
- **v2.41.4**: `calcChampDetail` 시즌 필터 폴백 제거 — S1 브릿지 데이터 없을 때 S0 챔피언이 S1 랭킹에 표시되던 버그 수정. `entries` 없으면 null 반환으로 단순화
- **v2.41.0**: 기록 탭 막고라 파트 추가
  - 시즌 드롭다운에 "⚔️ 막고라" 항목 (`selectViewSeason('magolla')`)
  - `viewSeason` 타입 확장: 숫자 → 숫자 | `'magolla'`
  - `magollaMatches = {}` 전역 캐시 + `/magolla_matches` onValue 리스너
  - `renderMagollaHistory()` — settled 경기만 표시, 파이터 VS 카드 + 배팅 결과 행
  - `window.mgHistoryPreview()` — 콘솔 미리보기 헬퍼 (Firebase 쓰기 없음)
  - `calcMagollaGold(history)` → `calcPlayerGoldEarned`에 통합
- **v2.41.1**: 막고라 기록 카드 색상 — 초록 제거, 보라(`#b48aff`) + 금빛(`var(--gold-light)`) 통일
- **v2.41.2**: 막고라 인트로 팝업 (`#mgintro-popup`, `.mgintro-*` CSS)
  - 앱 로드 후 1.4초 뒤 표시 (`showMgIntro()` in `renderAllWhenReady`)
  - `localStorage.mgIntroSeen = '1'` 시 영구 숨김 ("다시 안보기")
  - "확인" 버튼은 세션 닫기만 (다음 접속 시 재표시)
- **v2.41.3**: 이스터에그 2종
  - `_eggChaos()` — `h1` 1.6초 내 10회 연타 → 텍스트 변경 + shake + 이모지 낙하 3초
  - `_lateNightEgg()` — 새벽 2~4시 접속 시 시간대별 토스트 (`.late-toast` CSS)
- **v2.41.22**: 대기 화면 패스 탭(전투/지원) + 지원 패스 순차 언락; 펫 시스템 추가 후 revert (미완성)
- **v2.41.23**: EOG 투표 UI 색상 통일
- **v2.41.24**: EOG 카드 1~2인 시 초상화 비율 버그 수정
- **v2.41.25**: 팀 재구성(recompose) 기능 — 기존 체크 유지 수정
- **v2.41.26**: EOG 투표 카드 전적 표시 (KDA, 딜량, CS)
- **v2.41.27**: EOG 카드 증강 아이콘 초기 구현
- **v2.41.28**: EOG 증강 아이콘 옵션 B 확정 (KDA + 딜량 + 증강, CS 제거)
  - 증강 아이콘 크기 버그 수정: `.eog-cc img` → `.eog-cc>img` (CSS 특이성 충돌)
  - 증강 호버 툴팁 (`showAugTip/hideAugTip` 재활용)
  - 툴팁 raw 변수 문자열(`@var@`, `%var%`) 제거 — `stripTags` 정규식 보강
  - 희귀도 레이블: "프리즈매틱" → "프리즘" (`kPrismatic` rMap)
  - `__mockEog()` 콘솔 헬퍼 추가
- **v2.41.29**: 대기 화면 패스 탭 텍스트 줄바꿈 수정 (`white-space:nowrap`)
- **v2.41.30**: 패스 탭 이모지 제거 (⚔️전투→전투, 🤝지원→지원); 대기 화면 챔피언 카드 "전체 보기 ›" 버튼
- **v2.41.31**: 챔피언 풀 카테고리 필터 — 주력(첫 번째) 태그만 사용 (`champTags[slug][0]`), 베인/트위치/야스오 암살자 오분류 수정
- **v2.41.32**: 챔피언 풀 필터 탭 카테고리별 챔피언 수 표시
- **v2.41.33**: 팀 결과 카드 LP 텍스트 표시 (티어 배지 옆 `tc-lp-mini`)
- **v2.41.34**: `APP_VERSION` 상수 버그 수정 (v2.41.28에 고착됨); 챔피언 풀 승률 바 (wins/losses 텍스트 대체, `cp-wr-bar`)
- **v2.41.35**: 참가자 선택 목록 승률 % 만 표시 (wins/losses 제거); LP 바 추가 (`sp-lp-wrap/bar/fill`)
- **v2.41.36**: 팀 결과 카드 LP 바 1차 (티어 배지 아래)
- **v2.41.37**: 팀 결과 카드 LP 바 최종 — 닉네임-티어 사이 전체 너비 배치
  - `.team-player` column flex 재구성, `.tp-main-row` + `.tp-lp-row`
  - 일반 티어: lp/100% 바 + "XX LP" / 승급전: promoWins/2 바 + "XW/XL" / 챌린저: LP 텍스트만 / 배치: 바 없음
- **(다른 컴퓨터, v2.41.37 이후 — APP_VERSION 미변경)**
  - **퀵 아이템 바** (`renderQuickItemBar`, `_qibRender`): 아이템 사용 시간 중(`#quick-item-bar-prep`) + 팀 결과 화면(`#quick-item-bar`) 두 곳에 표시
    - 라이브 계정/이벤트 매치에서는 숨김; 팀 결성 전(allowBuy=true)은 구매 가능, 후(false)는 상태 표시만
    - `quickToggleItem(idx)` / `quickBuyItem(itemId)` — window 등록, toggleItemActive와 동일한 충돌 검사 적용
    - CSS: `.qib-wrap`, `.qib-chip`, `.qib-icon`, `.qib-btn`, `.qib-status` 등
  - **관전 패스 버그 수정** (`calcS1PassStats`): 관전자는 teamA/B에 없으므로 `spectatorPicks` 기반 별도 스캔 분리 — specTotal/specCorrect 누락 수정
  - **복권 통계 헬퍼** (`window.lotteryStats()`): 전체 팀원 복권 현황 요약 `console.table` 출력 (일반/프리미엄/순이익/최고당첨, 하우스 수익 합계)
  - **펫 목업** (`pet_mockup.html`): 사이트 톤앤매너 리디자인, 드라마틱 가챠 리빌 연출, RPG 장비창 스타일 장착 UI, 프로필 모달 peek 애니메이션 (index.html 미통합)

### v2.40.x (다른 컴퓨터 작업)
- **v2.40.0~1**: 막고라 CSS/JS/HTML 전면 재구현, 드롭다운 3번째 항목으로 이동
- **v2.40.2~7**: 버그 수정 (onclick, disabled, 역할 판정 등) + 콘솔 헬퍼
- **v2.40.8**: `mgPreview()` 콘솔 UI 미리보기
- **v2.40.9~11**: 모바일 이름 말줄임 수정
- **v2.40.12~13**: 파이터 선정 가중치 랜덤(LP 차이 역비례)
- **v2.40.14**: 취소 후 버튼 상태 초기화 버그 수정
- **v2.40.15**: `mgLastFighters` localStorage — 직전 파이터 쌍 재선정 제외
- **v2.40.16~17**: 브릿지 이벤트 오염 방지 (EOG/matchData/voteStarted/InProgress 가드)
- **v2.40.18~24**: 파이터 카드 — 폼 도트, 연승배지, H2H 전적, avg KDA(K/D/A 3열)
- **v2.40.25**: 배팅 뷰 `.bet-fighter-info` 패널 — 모든 역할 KDA+폼 도트

### 다음 작업: 펫 시스템 (미구현 — 설계 확정)

#### 최종 확정 설계
- **50G 뽑기** → 항상 **기본 클래식 포로** 지급 (랜덤 아님)
- **1판 완료** → 10종 중 랜덤 변신 (이게 수집 요소, 레벨 시스템 없음)
- 스페셜(cosplay5) 확률 미확정 (유저에게 물어볼 것: 5%? 10%?)
- 기존 펫 보유 중 뽑기 시 "기존 포로가 사라집니다" 경고 팝업 필수
- **컬렉션(도감)**: 한 번이라도 획득한 포로는 영구 기록 (펫 교체해도 도감은 유지)
- 1인 1펫 — 동시에 여러 마리 보유 불가

#### 이미지 소스 (Community Dragon CDN)
```
기본 포로 (항상 이 이미지로 시작):
https://raw.communitydragon.org/latest/game/assets/characters/petporo/hud/loadscreen_poro_base_classic_tier1.png

변신 후 랜덤 10종 (variant1~5 + cosplay1~4 + cosplay5스페셜):
https://raw.communitydragon.org/latest/game/assets/characters/petporo/hud/loadscreen_poro_base_variant{1~5}_tier1.png
https://raw.communitydragon.org/latest/game/assets/characters/petporo/hud/loadscreen_poro_cosplay_cosplay{1~4}_tier1.png
https://raw.communitydragon.org/latest/game/assets/characters/petporo/hud/loadscreen_poro_cosplay_cosplay5_tier1.png  ← 스페셜
```

#### Firebase 데이터 구조 (추가 필드)
```
/gold/{key}
  pet_s1: {
    type: 'classic' | 'variant1'~'variant5' | 'cosplay1'~'cosplay5' | null
    obtained: number   // 변신 완료 timestamp (null이면 아직 기본 포로 상태)
    pulledAt: number   // 뽑기 timestamp
  }
  petLog_s1: string[]  // 도감 — 획득한 type 문자열 배열 (중복 제거, 영구 누적)
```

#### UI 구현 위치
- 상점 탭(`🛒 상점`) 내 새 카테고리 **"🐾 펫"** 추가
- 뽑기 버튼 (50G), 보유 펫 카드 표시 (loadscreen 이미지 카드 스타일)
- 1판 대기 중: 기본 포로 카드 + "다음 경기 후 변신!" 안내
- 컬렉션 그리드: 11종, 미획득은 실루엣(filter:brightness(0) opacity(0.2)) + 🔒
- 카드 스타일: 세로 카드, 아트 위/이름 아래, rounded border

### v2.38.x ~ v2.39.x
- **v2.39.0**: 막고라 매치 JS 최초 구현 (v2.40에서 전면 재구현)
- **v2.38.21**: 패스 탭 출석 제거 + 상단 버튼 glow 애니메이션
- **v2.38.18~20**: 랭킹 me-tag 위치 조정, 상단바 출석 퀵버튼
- **v2.38.8**: 챔피언 이름 전역 한글화 (`loadChampNamesKR()` 앱 초기화 시 선로드)
- **v2.38.7**: 대기화면 챔피언 한글명, `renderS1WaitingCard` async 전환
- **v2.38.0~6**: 유료 패스 2종 (전투/지원 패스권 500G, 25레벨), 패스 탭 UI 정리
