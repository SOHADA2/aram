# 무작위 총력전 아수라장 내전 (ARAM Custom Team Builder)

## 프로젝트 개요
- 롤 칼바람 내전 팀짜기 **단일 HTML 웹앱** (`index.html`) + 상세 업데이트 노트 `changelog.js`(v2.45.659~ 분리)
- Firebase Realtime Database로 실시간 데이터 동기화
- GitHub Pages 배포: https://sohada2.github.io/aram/
- 저장소: https://github.com/SOHADA2/aram
- **현재 버전: v2.45.660** (2026-10-27) · 🌌 시즌2 라이브 중(2026-06-10~) · 인형뽑기 claw BUILD 172 · 브릿지 v1.1.38 · 오버레이 v0.1.55 · 📅투데이 내전 v0.1.0
- **📅 투데이 내전(2026-10-27·사장님)**: 오버레이 발전 방향 = 하루 안에 끝나는 인스턴트 내전 앱. 기존 오버레이(사이트 프로그램 버전)는 **그대로 두고** 별도 앱 `SOHADA2/today-naejeon`(public·로컬 `Desktop/today-naejeon`) 신설 — 별로면 되돌아갈 수 있게. **사이트 데이터와 완전 분리(쓰기는 Firebase `today/`만, 사이트 노드는 읽기만)**. 사이트 최하단에 「📅 투데이 내전 다운로드」(`today-dl-link`·`showOverlayInstallGuide('today')` 재사용) 추가(v660). 상세=그 리포 CLAUDE.md.
- **방향(2026-10-22·사장님)**: 룬테라 전쟁 제거(v658) → **시즌2 내전 되살리기**. 내전 활동 6월 53판 → 7월 16 → 8월 14 → 9월 7판 · 9/23 이후 0.
- **v659 정리(2026-10-25)**: 상세 CHANGELOG를 `changelog.js`로 분리(모달에서 「전체 변경 내역」을 펼칠 때만 로드·index.html 3.2MB→2.6MB) · 호출 안 되는 함수 32개·옛 2D 인형뽑기(`CLAW_ENABLED`)·보류된 2종 포인트 패스(`PASS_TRACKS`/`doClaimPass`)·끝난 S1 복권 환불/출석 복구 코드(`fixRelayBaseOnly`·`autoRefundLotteryOvercharge`·`refundLotteryOvercharge`·`checkLotteryRefund` 계열·`migrateGoldBonusToLegacy`)·결혼 이벤트 UI 제거 · 룬테라 잔여 에셋(`assets/{rts,hex,town,castle,survival,food,graveyard,ui}`·`vendor/three`)·`_p3*`·`scripts/`·중복 `forge-mockup.html`·미사용 `bgm.mp3/tick.mp3/complete.mp3`·`setup-firebase-config.html` 삭제 · 이 문서를 분할(아래 문서 지도).
  - ⚠️ 결혼 이벤트는 **UI만 제거**. `calcWeddingGold`(받은 축하 메시지×100G)는 결혼자 골드 계산에 계속 쓰이므로 데이터 구독과 함께 **유지**.

## 📚 문서 지도 (이 파일은 핵심만 · 상세는 docs/)
| 파일 | 내용 | 언제 보나 |
|---|---|---|
| `CLAUDE.md` (이 파일) | 현재 상태 · 작업 규칙 · 기능 맵 · 열린 이슈 · 현행 레퍼런스 | 매 세션 |
| `docs/HISTORY.md` | 세션 작업 이력(v2.38~v2.45.658) + 옛 「현재 버전」 누적 단락 | 특정 기능의 과거 경위가 필요할 때 grep |
| `docs/FEATURES.md` | 인형 투기장 · 3D 인형뽑기 · 가챠 시너지 설계 상세(수치·코드맵) | 그 기능을 고칠 때 |
| `docs/ARCHIVE-runewar.md` | 룬테라 전쟁(삭제됨) 전 기록 | 되살릴 때만 |
| `docs/ARCHIVE-S0S1.md` | S0 MMR·업적·매칭퀘스트·S1 패스 카탈로그·Riot API 계획 등 옛 시스템 | S0/S1 기록 열람 코드를 손볼 때 |
| `SEASON2.md` | 시즌2 기획 원문(엠블럼·패스 수치) | 강철심장/엠블럼 수치 조정 시 |

## ⚠️ 작업 규칙 (모든 컴퓨터 공통)
- **세션 시작 시 `git pull` 먼저** — 여러 PC·원격 세션에서 main에 직접 푸시한다. 메모리는 기기-로컬이라 **이 파일이 유일한 크로스-머신 기준**.
- **상시 지시(2026-07-03·사장님)**: ①작업 완료+검증 통과 시 **묻지 말고 바로 배포**(main 직접, 원격 세션이면 main+작업브랜치) ②배포 후 **Actions 성공 확인**(Pages가 간헐적으로 `syncing_files`서 "Deployment failed, try again later" — GitHub측 오류, `gh run rerun <id>`) ③라이브 `APP_VERSION` curl 확인 ④응답에 버전 명시.
- **버전**: `index.html`의 `const APP_VERSION` 올리고, `changelog.js` 맨 위에 항목 추가(아래 업데이트 노트 정책).
- **검증**: index.html 인라인 module 스크립트 파싱(`node --check` 또는 acorn) + 가능하면 헤드리스 브라우저로 로드해 `pageerror` 0 확인. 이 파일은 CRLF 작업트리(`core.autocrlf=true`) — 스크립트로 치환할 때 `\n` 패턴이 `\r`를 남기지 않게 주의.
- `.gitignore`는 `*` + 화이트리스트 — 새 파일은 `!파일명` 추가(또는 `git add -f`).
- `.github/workflows/pages-rebuild.yml` **삭제 금지** — Pages 클래식 자동 트리거가 멈출 때 빌드를 대신 요청한다.

## 🗺️ 기능 맵 (S2 라이브 기준 · 2026-10-25)
- **메인 탭 6개**: ⚔️팀구성 · 📋기록 · 🏆랭킹(내전/🗡️투기장 토글) · 🛒상점 · 🃏가챠 · 🎫패스
- **팀구성**: 일반/이벤트/막고라(5인+·라이브 어드민) 매치 · EOG 투표(MVP/SVP/매너왕) → 정산창 · 홈 대시보드(LP·전투준비[강철심장/시너지]·단짝·패스 카드)
- **상점**: 스크래치 복권 Hub(실버·골드·프리즘·🖤블랙+블랙 팟) · 🤖자동 로봇 · 🗑️쓰레기통 뒤지기/유미 파견 · 🔨대장간(강철심장 강화·오른 3D)
- **가챠**: 뽑기 ×1/×10 · 컬렉션(파편/2성/3성)+합성·재조합·시너지 · 유미 도감/교장 유미 · 🕹️**아케이드**(프리즘 18종 완성 해금): 3D 인형뽑기(`claw.html` iframe) · 🗡️인형 투기장(인형 7종 완성자·배틀/강화/스킨) · 단짝 광장(베타)
- **패스**: S2 퀘스트 패스 LV25(`S2_PASS_QUESTS`·`renderS2Pass`) + 플레이어 레벨(`PLV_XP`·`claimPlayerLevels`)
- **상단 코너**: 명예의전당 · 일정 · 출석(협력 빙고/릴레이·오늘의 운세·오늘의 롤 퀴즈) · 우편함 · 📻라디오(BGM 9곡) · 브릿지 연결바
- **S1 전용(S2에선 숨김·기록 열람용 코드 유지)**: 비밀 퀘스트 토큰, S1 전투/지원 패스
- **외부 프로그램**: `aram-bridge`(LCU 경기 자동 수집) · `aram-overlay`(인게임 오버레이 Electron) · `today-naejeon`(투데이 내전·하루 인스턴트 내전 앱·today/ 분리) — 각 리포 CLAUDE.md

## 🔴 열린 이슈 / 다음 할 일 (2026-10-25 정리)
- 🔐 **(2026-11-07 적용) Firebase(`aramchaos-ca022`) 규칙 1단계 = 통째로 지우기·덮어쓰기 막기** — 기준 파일 **`database.rules.json`**(적용 = today-naejeon 리포 `node tools/gapi.cjs PUT …/.settings/rules.json "$(cat database.rules.json)"` · 사장님 firebase 로그인) · 시험 **`node tools/rules-test.cjs`**(인증 없이 30건: 각 노드 아래 시험 칸 쓰기·지우기 허용 + 시험 전용 `_rt` 칸에서 통째 지우기·덮어쓰기 막힘 · 끝나면 `_rt`는 관리자 도구로 지움) · 사이트 25초 띄워 권한 거부 0 · 다시 점검(같은 날): 통째 덮어쓰기 줄이 모두 내용 있는 값인지(세션·정산·빙고 초기화·오버레이 세션) · 변수 경로(세션 투표·시즌 마일스톤) · 묶음 통째 덮어쓰기 허용(크럼블 release 모양) 확인. 내용: 읽기 누구나(그대로) · **루트 쓰기 금지** · 목록(gold·players·matches·normal_matches·magolla_matches·mailbox·availability·accountSession·config·bridge·plaza) = 한 칸씩만 · 묶음(session·lastSettlement·season2_bingo·wedding2026·party) = 덮어쓰기 O 통째 삭제 X · plaza_props(광장 소품 · 다 빼고 저장 = 빈 값) 자유 · season1/2/3 하위(players·milestones·blackPot…) = 통째 삭제 X · lobby(배너) 자유 · crumble(release 덮어쓰기만 · diag·profiles 한 칸씩) · runewar·today 읽기 전용. 쓰는 곳 조사 = 사이트 index.html(ref·루트 update 7곳)·claw.html · aram-overlay(gold·session·lobby·accountSession·normal_matches) · aram-bridge(bridge/*·normal_matches) · crumble-bot(crumble/release·diag·profiles) · aram-overwolf는 안 씀. ⚠️ **새 최상위 칸에 쓰는 기능을 만들면 규칙에도 추가**(없으면 조용히 거절) · 되돌리기 = 규칙을 `{".read": true, ".write": true}`로. ⏭️ 2단계 = 로그인(인증)+콘솔 함수 정리(아래 보안 항목). ✅ 옛 투데이 내전 `today/` 삭제 완료(2026-11-07 · 사장님 콘솔 · 백업 = 집 PC 문서	oday-naejeon-backupold-site-db-today-2026-11-07.json).
- 🔴 **보안(사장님 결정 대기·가장 큼)**: Firebase 규칙이 사실상 공개(로그인 없이 read, 익명 인증으로 write/delete 가능) + 계정 비밀번호 없음(이름 매칭) + 콘솔에서 실데이터를 바꾸는 함수가 노출됨. 대표: `sendMail({gold,target:'all'})`(전원 골드 우편)·`switchSeason(n)`(확인창만)·`__s2dbg.gold(n)`·`__plvXpAdd`/`__plvLevelUp`(실제 레벨 보상)·`gachaTestGrant`·`buddyMatch(true)`+`buddyClaim`·`__normalSeed`·`__bingoReset`·`arenaSeedTest`/`arenaCoinTest`·`claw3dGrant`·`grantYuumi`·`deleteMail`·`mgReverseSettle`·`mgForceCancel`. `liveMode`는 localStorage 값 하나라 가드가 안 됨. 1차=콘솔 함수 삭제/`?dev` 뒤로, 근본=Auth+보안 규칙(기존 계정 방식 변경 필요).
- 🗡️ 투기장: 엔드게임(+20 이후) 코인 인플레 → 지속 sink 필요 · 방어자 코인 절대값 update가 공격 트랜잭션을 덮을 수 있음(down-leak) · 전투화면 「누가 내 캐릭터」 구분(v401 되돌림) · 상대 풀 소규모
- 🎟 복권 해골감소 인플레 미해결 · 🧠 오늘의 롤 퀴즈 30문제가 상한(꾸준한 출석자는 소진 가능 → 새 문제 필요) · 🎓 교장 유미 고효율(~5배) 일일 상한 검토
- 🕹️ `claw.html` ↔ `인형뽑기-물리-목업.html` 미러 불일치(claw.html이 기준) · 메인 헥스필드 상시 최적화 미적용 · 단짝 광장 베타 후속(2인 동시접속·진입점)
- 🔌 진행 중 게임 배너 참가자 명단 = 브릿지 v1.1.38(Live Client Data API)에서 수정 — 실사용 확인 필요
- 🧪 실기 미검증 누적: 자동로봇 · 블랙팟 소급(420→280) · 인형뽑기 물리/치명타 · 오버레이 · 단짝 3D · 빙고
- 🧑‍⚖️ 사장님 판단: Firebase `runewar/` 데이터 보존 여부 · 애긔반달곰 룬테라 프리미엄 10,000G 결제 환불 여부
- 🧹 v659에서 남긴 정리 후보: `SCRATCH_LOTTERY_TESTMODE=false` 분기(~60줄)·중복 CSS(`@keyframes pulse`/`tcRowIn`·`.tc-name`·`.team-card`·`.sli-right`)·중첩 미사용 함수(`_sndScratch`·`_drawWinThread`)·`rumble.glb`=`rumble_full.glb` 동일 파일(동적 `_full.glb` 로드라 코드 수정 필요)·S0 분기(`CURRENT_SEASON < 1`)·`seedGoldForAllPlayers` S0 마이그레이션 분기·`autoCompensateRelayV1`(플래그에 시즌 접미사 없음·확인 필요)

---

# 📖 현행 레퍼런스

## 기술 스택
- **순수 HTML/CSS/JS** (프레임워크·빌드 없음, 앱=index.html 1개 + changelog.js)
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

/config/currentSeason            // 현재 시즌 번호 (0/1/2 · 현재 2) — season2/ 노드는 seasonNode()로 접근
/config/riotApiKey               // Riot API Key (24h 갱신)
/config/liveOwner                // 라이브 모드 단일 소유권 (v2.31.20~)
  deviceId, label, startedAt, heartbeatAt

/season1/players/{normName}      // 시즌 1 전용 LP·티어 상태
  tier: 'unranked'|'bronze'|...|'challenger'
  lp: number
  placementGames, placementWins, placementDone
  promoActive, promoWins, promoLosses, promoGamesPlayed
```

## 탭 구성
→ 위 「🗺️ 기능 맵」 참조 (S2 기준 6탭: 팀구성·기록·랭킹·상점·가챠·패스). S0 시절 5번째 탭은 🏅업적이었고, S1부터 같은 자리가 🎫패스(`renderAchievementsOrPass` 라우터).

## 매치 타입
- **일반 매치**: 티어 반영, 3:3 / 4:4 / 5:5, 밸런스 or 랜덤
- **이벤트 매치**: 티어 미반영, 인원 자유 (1팀/2팀 개별 설정), 저장 안 됨, 인원 많은 팀에서 핸디캡 담당자 랜덤 선정

## 골드 & 아이템 시스템
- 경기 결과에 따라 골드 자동 지급: 승리 **+15G**, 패배 **+5G**
- **출석 체크**: 하루 1회, **+30G** 지급 (패스/업적 탭 상단 카드 — 완료 시 카드 자동 숨김, 다음 날 재표시)
  - Firebase `/gold/{key}.attendanceHistory` 배열에 `{ date, gold, ts }` 이벤트 기록 (v2.34.x~)
    - 구버전 `goldBonus` → `goldBonusLegacy` 로 마이그레이션 완료 (마이그레이션 함수는 v2.45.659에서 제거)
  - `/gold/{key}.lastAttendance` (YYYY-MM-DD) 로 당일 중복 방지
  - 날짜 기준: **로컬 시간** (`getLocalDateKey()`)
- **골드 계산 통합 함수**: `calcPlayerGoldEarned(name, data)` — 경기 + goldBonusLegacy + 출석(attendanceHistory) + 업적 + 패스 + 복권 합산
  - `getMyGold()` = `calcPlayerGoldEarned(myName, myData) - goldSpent`
  - **주의**: `calcGoldFromMatches(name)` 만 쓰면 출석·업적·패스·복권 누락 → 반드시 `calcPlayerGoldEarned` 사용
- 기존 경기 기록 기반 소급 계산 자동 적용 (`retroApplied`)


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
2. **`CHANGELOG`** = **`changelog.js`** (v2.45.659~ 별도 파일·`export default [...]`·모달 하단 `▸ 전체 변경 내역`을 펼칠 때 `window._loadFullChangelog`가 동적 import) (상세 개발 로그) — 버전별 모든 변경(버그수정·UI 미세조정·내부 리팩터 포함). 기존처럼 자유롭게 누적.
- **새 작업 배포 시 규칙**:
  - 자잘한 수정/개선 → `changelog.js` 맨 위에 버전 항목 추가 (지금까지처럼). `CHANGELOG_MAJOR`엔 **넣지 않는다**.
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
> - **패스**: 2종 포인트 패스(`PASS_TRACKS`·`doClaimPass` 등)는 보류 끝에 **v2.45.659에서 코드 제거**. 현재 S2 패스 = 내전 전용 **퀘스트 패스**(`S2_PASS_QUESTS`·`renderS2Pass`·`claimS2PassLevel`). 비밀퀘 토큰 S2 OFF.
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

### ⏭️ 남은 작업 (2026-10-25 갱신)
- switchSeason S2 버튼·S2 오픈·6/11 queueId 확인 = 완료/시기 지남. 일반게임 포인트 패스 적립 = 패스 제거로 불필요.
- S1 읽기전용 열람 재라우팅(sField/season1Data가 CURRENT_SEASON 전역) = 미확인 — S1 명예의전당으로 대체됐을 수 있음.

## LCU 브릿지 (aram-bridge)
- 리포: https://github.com/SOHADA2/aram-bridge (로컬: `C:\Users\so\aram-bridge` 또는 `C:\Users\sbs_n\Desktop\aram-bridge`)
- 현재 버전: **v1.1.38**(진행 중 참가자 명단 = Live Client Data API) · 이전: v1.1.35 (종료 버튼 cleanup로 웹앱 "연결중" 즉시 해제 · inGame배너 v1.1.34 · 일반게임분리 v1.1.33 · 진행자표시 v1.1.32)
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
