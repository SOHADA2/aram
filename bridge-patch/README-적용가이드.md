# 🔧 브릿지 v1.1.31 적용 가이드 (다른 컴퓨터에서 진행)

> codespace 토큰이 `aram` 리포 전용이라 `aram-bridge`에 push가 막혀서,
> 변경 내용을 patch로 저장해뒀습니다. **aram-bridge 리포가 있는 컴퓨터**에서 아래대로 진행하세요.

## 무엇을 고쳤나
**롤 클라이언트 재시작 시 브릿지가 재연결을 못 하고 멈추던 버그**를 수정했습니다.

### 버그 원인
1. 롤 켜짐 → lockfile(port A) → 브릿지 연결 (`_connected=true`)
2. 롤 **비정상 종료** → lockfile이 안 지워지고 남음
3. 롤 재시작 → lockfile이 **새 port B**로 덮어써짐
4. 브릿지: `_connected`가 이미 `true` → **새 port B를 무시** → 죽은 port A로 헛요청 (멈춤)

### 수정 (index.js의 `LockfileConnector`)
- `_poll`에서 **lockfile port 변경 감지** → 바뀌면 disconnect 후 새 port로 재연결
- **LCU 응답 연속 4회 실패 시 `forceReset()`** → stale lockfile 상태도 강제 복구

---

## 적용 방법 (택1)

### 방법 A. patch 파일 적용 (권장)
`aram-bridge` 폴더에서:
```bash
cd C:\Users\so\aram-bridge
git apply C:\경로\bridge-v1.1.31.patch
# 또는 git am < bridge-v1.1.31.patch  (커밋 메시지까지 포함)
```
> patch 파일: `aram/_bridge_patch/bridge-v1.1.31.patch` (aram 리포 git pull로 받으면 있음)

### 방법 B. 수동 적용 (index.js 3곳)
1. **constructor** — `_curPort` 추가:
   ```js
   constructor() { super(); this._connected = false; this._timer = null; this._curPort = null; }
   ```

2. **_poll()** — port 변경 감지 (기존 `if (port && password && !this._connected)` 블록 교체):
   ```js
   if (port && password) {
     if (this._connected && this._curPort !== port) {
       this._connected = false; this._curPort = null;
       this.emit('disconnect');
     }
     if (!this._connected) {
       this._connected = true; this._curPort = port;
       this.emit('connect', { username: 'riot', password, port, protocol: protocol || 'https' });
     }
   }
   ```
   그리고 맨 아래 disconnect 줄에 `_curPort = null` 추가:
   ```js
   if (this._connected) { this._connected = false; this._curPort = null; this.emit('disconnect'); }
   ```

3. **class 닫기 전** `forceReset()` 메서드 추가:
   ```js
   forceReset() {
     if (this._connected) {
       this._connected = false; this._curPort = null;
       this.emit('disconnect');
     }
   }
   ```

4. **poll()** — 실패 카운트 + 강제 재연결:
   ```js
   let _pollFailCount = 0;  // poll 함수 위에
   async function poll() {
     if (!baseUrl) return;
     try {
       const phase = await lcu('/lol-gameflow/v1/gameflow-phase');
       _pollFailCount = 0;  // 성공 시 리셋
       ...기존 로직...
     } catch (_) {
       _pollFailCount++;
       if (_pollFailCount >= 4) {
         _pollFailCount = 0;
         log('⚠️ LCU 응답 없음(연속) — 연결 재설정 시도');
         connector.forceReset();
       }
     }
   }
   ```

5. **package.json** version → `1.1.31`

---

## 빌드 & 릴리즈 (Windows에서)
```powershell
cd C:\Users\so\aram-bridge
node node_modules\pkg\lib-es5\bin.js . --targets node18-win-x64 --output dist/aram-bridge-v1.1.31.exe

# ZIP (exe + VBS 런처)
Compress-Archive -Path dist/aram-bridge-v1.1.31.exe, "이 파일을 실행해 주세요.vbs" -DestinationPath dist/aram-bridge-v1.1.31.zip

# GitHub 릴리즈
gh release create v1.1.31 dist/aram-bridge-v1.1.31.zip dist/aram-bridge-v1.1.31.exe --repo SOHADA2/aram-bridge --title "v1.1.31 — 롤 재시작 시 재연결 실패 수정"
```

웹사이트 다운로드 링크는 GitHub API로 최신 릴리즈를 자동 감지하므로, 릴리즈만 올리면 됩니다.

---

## 적용 완료 후
이 `_bridge_patch/` 폴더는 삭제해도 됩니다 (임시 전달용).
