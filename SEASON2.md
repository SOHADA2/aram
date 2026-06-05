# 🌌 시즌 2 (헥스텍/마법공학) — 전체 기획·진행 메모 (GitHub 공유본)

> 이 문서 = 로컬 작업 메모리의 완전판을 GitHub에 박은 것. 어느 컴퓨터에서든 이걸 보고 이어서 작업.
> 요약판은 `CLAUDE.md`의 "🌌 시즌 2" 섹션. 최종 갱신: 2026-06-04 (v2.43.283 기준).

---

## 0. 목표
6/11 롤 **증바람(증강 칼바람) 패치**에 맞춰 앱도 **시즌 2 오픈**. `config/currentSeason` 토글로 즉시 전환. 단 S0→S1 때처럼 옛 시즌 데이터가 새는 일 없이 깔끔하게. 비주얼=마법공학(헥스텍), 신규 콘텐츠=증강 연계 엠블럼 강화.

## 1. 확정 정책
- **전부 리셋**: LP·티어, 골드, 패스, 쓰레기통, **가챠 컬렉션(완전 리셋 확정)**. S2 필드는 빈 상태 시작 → carry 없어 마이그레이션 불필요.
- **S1 데이터 = 읽기전용 열람 유지**: 시즌 셀렉터로 S1 랭킹/전적/컬렉션 조회. `_s1` 필드·`season1/` 노드 보존, 절대 수정 X.
- **⭐ 디자인 = 시즌 정체성 원칙**: 모든 비주얼은 그 시즌 귀속. 새 디자인은 그 시즌 것. **시즌 무관하게 쓰이는 디자인 발견 시 사용자에게 반드시 알릴 것.** 티어색(랭크색)만 예외.

## 2. 시즌 데이터 구조 (왜 S0→S1이 지저분했나 + 해결)
- 원인: 시즌 데이터를 가리키는 **단일 스위치 부재**. 코드가 접미사를 직접 박아 토글 후에도 옛 필드를 읽음. S2에선 거울상 버그(`_s1` 하드코딩이 S2에서도 S1 읽음).
- **패턴 A (필드 접미사)**: `gold/{이름}` 단일 노드, `items_s1`·`trashGold_s1`… → `sField(f)=f+seasonSuffix(CURRENT_SEASON)`. (seasonSuffix: s===0?'':'_s'+s)
- **패턴 B (노드 경로)**: `season1/players`, `season1/milestones` → `seasonNode(sub)='season'+CURRENT_SEASON+'/'+sub`. LP/티어·promo 저장소. `season1Data` 전역(=현재시즌 데이터 그릇, 이름만 season1).
- ⚠️ **sField·season1Data는 CURRENT_SEASON 전역 기준**(viewSeason 안 받음) → "S1 읽기전용 열람"하려면 읽기 경로가 viewSeason 타게 손봐야(전적은 match.season 필터로 됨).
- 원칙: **리터럴 0개** — `_s1`/`season1` 문자열이 헬퍼 밖에 한 곳도 없게.

## 3. ✅ 코드 반영 완료 (v2.43.273~283) — 전부 `season===2`/`.season-2` 게이트라 라이브 S1 무변
### 작업1 — 시즌 누수 차단
- **1a (v274)**: gold 노드 `_s1` 하드코딩 ~140곳 → `sField()`. 특수: witnessGold(중위접미사 `sField('witnessGold')+'_master'`), goldBonus/Legacy(파라미터-시즌 `'goldBonus'+seasonSuffix(s)`), magollaHistory 경로결합 `'gold/'+gk+'/'+sField('magollaHistory')`, seasonPassClaimed 템플릿키. **newbie_bonus_s1은 팁키(UI)라 의도적 유지**(시즌모드 기준).
- **1b (v275)**: season1/ 노드 → `seasonNode()`. 구독을 `subscribeSeasonPlayers()`/`subscribeMilestones()`로 감싸 config/currentSeason 전환 시 자동 재구독.
- **1c (v276)** — 누수 감사 워크플로우로 **숨은 누수** 발견: ⚠️ **함정=시즌 무접미사 공유 필드**. `lotteryHistory`는 `_s1` 없는 공유배열이라 리터럴 스윕에 안 걸림. calcLotteryGold가 이 배열(전 시즌 당첨금) 합산하면서 차감 롤백만 sField(_s2=0)라 S2에서 S1 당첨금 누수. 수정: 복권 항목에 `season:CURRENT_SEASON` 태그 + `(h.season??1)===CURRENT_SEASON` 필터(복권은 S1 전용이라 레거시 무태그=S1). **교훈: _s1 없는 시즌무관 필드도 점검**.
- 무회귀 보장: S1에선 sField(X)===X_s1, seasonNode('players')==='season1/players'.

### 프리뷰 툴 (v277)
- 콘솔 `previewSeason(2)`/`previewSeasonOff()` — 이 브라우저만 CURRENT_SEASON 오버라이드(localStorage `aram_season_preview`), 라이브 config·Firebase 안 건드림. 미리보기 중 자동쓰기(seed/migrate/autoCompensate)는 `window.__SEASON_PREVIEW` 가드로 차단, switchSeason도 차단. **S2 작업 검증은 이걸로.**

### 헥스텍 테마 (v278~283)
- 컨셉: S2 본체=**블랙+골드 헥스텍**, 막고라=**"S2 컨셉의 레드"**(블랙+레드 헥스텍, 같은 언어 색만 다름).
- `season-2` 클래스(CURRENT_SEASON===2 토글, renderHeaderSeasonLabel). `s1-active`(>=1, 동작 22곳)는 유지하고 `.season-2`가 시각을 덮음(`.s1-active` 뒤 배치). 블랙+골드 팔레트 + `--purple-light` 골드 remap.
- 배경: `body.season-2::before`(블랙+골드모트)/`::after`(골드글로우). `renderSeasonBackground()`+`_buildHexfield(cls,id)`가 육각회로 SVG 주입 — **육각 변 따라 랜덤워크 골드펄스, 중앙편향**.
- 스트래글러 스코핑(v280): S1 보라 ~35개 컴포넌트(rlb-*/relay-modal/rm-*, bet-aug/ric-aug, mgintro/mgh/mtt-btn/mgo/mg-fight, hof/col-count/late-toast/czd) `.season-2`로 골드(비막고라)/레드(막고라) 덮음. 마일스톤 펄스 animation-name→rlbPulseGold.
- 막고라 아레나(2b, v281): `ensureMagollaHexBg()`가 openMagollaModal 시 `#magolla-modal`에 레드 헥스필드 `.mg-hexfield`(z:0, position:fixed) 주입 — season===2만.
- 전적색 정제(v282~283): `--green/red/blue` remap → 승=골드(#e8c860)·패=회색(#9a8f88)·중립=화이트(#cfd2da). W/L점·우편함 골드(mbGlowGold). "색 변종 최소화, 골드만 도드라지게".
- 목업파일 `시즌2-헥스텍-목업.html`/`막고라-레드헥스텍-목업.html`은 gitignore 로컬전용(실제 테마는 index.html에 있음, previewSeason(2)로 확인).

## 4. 🎮 S2 신규 콘텐츠 — "마법공학 엠블럼 강화 + 패스 재편" (✅ v2.44.0~1 구현 완료 / 일반패스 브릿지 적립만 대기)
**루프**: 일반 증바람 플레이 → 퀘스트(브릿지 검증) → 강화재화 → 엠블럼 강화 → 효과/추격. 골드·재화 싱크로 챌린저 골드고임 해결.

> **✅ 구현 완료 (v2.44.0~7). 엠블럼은 v2.44.7에서 🔨오른 대장간 드래그 강화로 전면 재설계. 전부 `CURRENT_SEASON===2` 게이트라 라이브 S1 무영향. `previewSeason(2)` 또는 태블릿은 URL `?preview=2`로 검증.**
> - **엠블럼 코어 (index.html, ~L7269 블록)**: 상수/헬퍼/강화코어 `EMBLEM_TICKETS`·`emblemEnhance`·`emblemSellPrice`·`emblemEffects`(lotteryBoostPct 정수연산). 데이터: `emblem_s2{slots:[{t,ok}],createdAt}` · `emblemTickets_s2{stable,precise,overload}` · `emblemSellG_s2`(판매환급, `calcPlayerGoldEarned` 합산).
> - **엠블럼 UI = 🔨오른 대장간 (v2.44.7 재설계)**: `renderEmblemBody`가 모루(`#emblem-anvil`)+롤아이템+강화권 인벤토리 렌더. 아이템 `_forgeItemMeta`/`_forgeItemImg`(ddragon, 광채등급별 진화: 도란링1056→로켓벨트3152→존야3157→라바돈3089). 드래그 `_bindForgeDrag`(pointer 이벤트·터치지원·setPointerCapture, `_forgeDragState`/`_isOverAnvil`)+탭 둘 다 강화. 연출 `_emblemForge`(모루 위 **인플레이스**: 망치질3+`_forgeSparks`불꽃+성공/실패, 풀스크린X). CSS `.forge-*`. (구 `_emblemPlayFx` 풀스크린·`.emfx-*`는 제거됨).
> - **엠블럼 효과연결**: 출석 `doAttendance`(`emblemAttendBonus`) · 복권 A안 `_applyEmblemLotteryBoost`(꽝→본전 4지점. 무료권 미적용=의도) · 광채 `emblemShineHtml`/`emblemGlowMeta`(랭킹 hero/mini·프로필·대기화면).
> - **패스 (index.html, 엠블럼 블록 뒤)**: `PASS_META`·`PASS_TRACKS`(보상)·`PASS_PT_PER_LEVEL=200`·`PASS_MAX_LEVEL=10`. `calcCustomPassPts`(내전=매치순회 자동) · `calcNormalPassPts`(일반=`normalGamePts_s2` 누적) · `claimPassLevel` · UI `renderS2Pass`/`switchS2Pass`/`doClaimPass`(라우터 `renderAchievementsOrPass`에 S2 분기). 데이터: `passNormal_s2`/`passCustom_s2{claimed:{lv:true}}` · `normalGamePts_s2` · `passGold_s2`(합산) · `passTitle_s2`. 비밀퀘 토큰 S2 OFF(상점 필터+`_maybeShowSecretQuestModal` early return).
> - **검증 콘솔**: `previewSeason(2)` → 상점 "🔷 마법공학 엠블럼" 카드 / 🎫 패스 탭. `__emblemDiag()`, `emblemBuyTicket('overload',5)`, `__addNormalPassPts(450)`(일반패스 포인트 테스트), `previewSeasonOff()`.
> - **⏳ 유일한 미연결**: 일반게임 패스 포인트 적립 = 브릿지 `isCustomGame` 분리(§4-3) 후 `normalGamePts_s2`에 적립해야 채워짐. 내전 패스는 이미 자동(매치 순회).

### 4-1. 엠블럼 강화 (메이플 주문서식, 수치 확정)
- 엠블럼 1개(단일장비, 구매/판매 가능). **슬롯=5**(강화가능수치): 성공/실패 무관 시도마다 1차감, 성공=레벨+1·실패=레벨유지(슬롯만 날림), 5칸 다쓰면 LOCK. 최종레벨=성공횟수. **5칸 시각화**(어떤 강화권 성공/실패).
- **레벨(+N)과 성능 분리**: +N=성공횟수(간판), 성능=성공한 칸들의 강화권 기여값 합(진짜 스탯). 같은 +5도 성능 5~30(6배차) → 고성능 추격 + 실패작 판매.
- **강화권 3종**: 🟢안정 100%/성능+1 · 🟡정밀 60%/성능+3 · 🔴과부하 30%/성능+6. (30%라 칸당 기대성능 1.0/1.8/1.8 — 밸런스 OK)
- **효과(성능 비례)**: 복권 당첨확률 성능×0.2%p(캡 +8%p) · 출석골드 성능×3G · 광채 성능 1~9실버/10~24골드/25+프리즈매틱+칭호.
- **복권 부스트 = A안(꽝→본전)**: 복권 결과는 긁기 전 확률표에서 확정(긁기는 연출). 엠블럼이 꽝 슬라이스를 +X%p 떼서 **본전**으로 이전(잭팟 인플레X, 손실완화). 회수율~80% 싱크 보호.
- **상점가(제안)**: 베이스 엠블럼 150G · 안정 40 · 정밀 100 · 과부하 250G.
- **비용감**: 안정路 +5 확정 350G(성능5). 올과부하 +5 = ~57만G·1/411(0.3^5, 성능30 프리즈매틱). 정밀주력+과부하혼합이 더 효율적.
- **효과 min~max 표 (5강)**: +1 성능1~6 / +2 2~12 / +3 3~18 / +4 4~24 / +5 5~30. (min=전부안정, max=전부과부하)
- **판매 (✅ 확정 공식 `emblemSellPrice`)**: 베이스150×0.5 + 투입강화권가합×0.35 + 성능²×2. 보편 강화(안정·정밀) 환급률 **~56~63%(들인 돈의 ~60%)**, 과부하도배 42%. 흑자확률 거의0 — 저강화 확정이익은 인플레라 금지(안정 100%면 무한 골드머신), 운좋아 고성능이면 흑자(도박성·OK). 200만회 몬테카를로 검증.

### 4-2. 패스 재편 (확정)
- 🤫 **비밀퀘스트 토큰 → 제거**(S2 UI 게이트 OFF). 잃는것: 패배 LP완화 안전망(수용).
- 🎫 **패스: 전투/지원 → 게임타입별 2종**(둘다 무료): **일반게임 패스**(증바람→강화권·엠블럼·소량골드=성장) + **내전게임 패스**(내전→골드·칭호/코스메틱·소량강화권=경쟁). 역할분리: 내전=경쟁, 일반=성장.
- 각 **10레벨, 레벨당 200p**. 포인트: 일반=증바람1판+10p/승+5p/일일퀘+20~40p · 내전=1판+15p/승+10p/MVP·매너+10p.
- **보상트랙 (✅ 확정 — `PASS_TRACKS`)**:
  - 일반게임: 1안정×2·2골드100·3안정×3·4정밀×1·**5베이스엠블럼×1**·6정밀×2·7골드200·8과부하×1·9정밀×3·10과부하×2+칭호"마법공학 견습".
  - 내전게임: 1골드100·2안정×2·3골드150·4정밀×1·5골드300+안정×3·6골드200·7정밀×2·8골드300·9과부하×1·10골드500+칭호"내전의 지배자".
  - 완주합산: 일반=안정5/정밀6/과부하3+엠블럼1+골드300 · 내전=골드~1550+안정5/정밀3/과부하1. 두 패스 완주해도 과부하 총4장 → 만렙 엠블럼(57만G상당) 여전히 멀어 추격 유지.

### 4-3. 브릿지 확장 (전제)
- **일반 vs 내전 판정**: LCU `/lol-gameflow/v1/session`의 **`gameData.isCustomGame`**(브릿지가 이미 이 엔드포인트 읽음 — 필드 하나 추가). true=내전(기존 매치저장/투표), false=일반(퀘스트 로그/엠블럼 재화). 보조검증=등록팀원 구성. 6/11에 증바람 일반 queueId 확인.
- 브릿지 eog(`/lol-end-of-game/v1/eog-stats-block`)는 **게임종류 무관 양팀 10명 전원** 챔피언·KDA·**증강(PLAYER_AUGMENT_*)**·멀티킬 캡처(이미 작동, `bridge/eogStats`). → **방장 1명 브릿지+같이 증바람 큐 = 함께한 팀원 전원 자동 수집**(전원 설치 불필요, 혼자 게임은 자진신고 폴백).
- 앱 `augmentMap`: 증강id→이름/아이콘/등급(kSilver/kGold/kPrismatic). 못 얻는 것: 실제 칼바람 패스 완료율(계정단위, eog에 없음) — 필요 없음(일반게임 플레이 데이터로 퀘스트화하는 방향).

## 5. ⏭️ 남은 작업 + 미정
- **switchSeason S2 버튼**: 현재 S0/S1만. 6/11 임박 시 추가(누르면 전원 즉시 S2 — 신중). 그 전엔 previewSeason(2)로만.
- **S1 읽기전용 열람 재라우팅**: sField/season1Data가 CURRENT_SEASON 전역 → S2 중 viewSeason=1로 S1 LP랭킹/컬렉션 보려면 읽기 경로가 viewSeason 타게 손봐야.
- **~~엠블럼/패스 구현~~ ✅ 완료 (v2.44.0~1, §4 상단 박스 참조)**. 남은 튜닝: 보상량/일일퀘 항목은 실제 S2 플레이 데이터 보고 조정.
- **일반게임 패스 적립 연결**: 브릿지 `isCustomGame` 분리(§4-3) 완료 후, 일반게임 eog 수신 시 `normalGamePts_s2`에 적립(1판+10·승+5)하는 핸들러 추가. 현재는 `__addNormalPassPts` 디버그 훅만.
- **6/11 확인**: 증바람 일반 queueId, 일반게임 augment가 공개 match-v5에도 오는지(현재 augment는 브릿지 LCU에서만 받음).

## 6. 🔨 대장간(강철심장 강화) 목업 — 다른 컴퓨터 핸드오프
**`대장간-목업.html` 이 새 대장간 디자인의 SOURCE OF TRUTH.** index.html v2.44.8의 인라인 엠블럼 디자인을 이걸로 교체 예정(아직 미포팅). 확정되면 index.html에 포팅.

- **열기**: 3D가 CORS로 `file://` 불가 → `python -m http.server 8765` (aram 폴더) 후 `http://localhost:8765/대장간-목업.html`.
- **구조(확정)**: 좌=**작업대**(`forgeItem` = 올려두면 **장착**되어 효과 발동 + 강화 대상, 장착 슬롯 별도 없음) + 효과(복권 당첨률·출석 골드) · 우=**인벤토리 패널**(장비=강철심장 6칸 / 소비=강화권) · 하단=**상점**(강철심장·강화권 구매). 드래그/더블클릭으로 이동.
- **아이템**: 강철심장 ddragon **3084** → prismatic 도달 시 **거인의 결의 223084**(오른 걸작). 강화권 3종(안정 100%/+1·정밀 60%/+3·과부하 30%/+6) = `assets/forge/anvil.png` + CSS hue-rotate 3색(실제 모루 220008/9/10 대신 커스텀).
- **3D 오른**(three.js 0.160 ESM, `assets/forge/`): `ornn-idle1`+`ornn-idle2`(대기 반복·랜덤 교체) / `ornn-forge`(성공 망치질) / `ornn-fail`(실패 반응). 평소 idle, 강화 시작=항상 forge 망치질(땅·땅·땅·탕 2.2s) → 실패면 끝에 fail. `object-fit:contain`으로 비율보존. **glb 4×~10MB=41MB 커밋됨 → production 포팅 전 경량화 필수(Draco+애니 합쳐 1파일).** (중복 `ornn.glb`·미사용 `ornn.webp`는 .gitignore 유지)
- **사운드**: glb엔 오디오 없음. 현재 합성 `anvilClang`(WebAudio) 임시. 진짜 오른 Forge SFX는 **롤 설치된 PC에서** `Ornn.wad.client` 추출(Obsidian→bnk-extract→vgmstream)해야 함 — CommunityDragon엔 오디오 미러 없음(확인됨).
- **톤**: S2 블랙+골드(#070708 / #f0c060·#ffe39a), 화로빛은 단조 박스 안에만.
- **다음 작업**: 목업 디자인 최종 확정 → index.html 포팅(.gitignore 이미 `assets/forge/*` 화이트리스트 처리) → glb 경량화 → 사운드 결합.
