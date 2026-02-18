# 암호화 키 설정

Linkmap은 환경변수 값을 AES-256-GCM으로 암호화하여 DB에 저장합니다. 이를 위해 32바이트(256비트) 암호화 키가 필요합니다.

## 1. 키 생성

아래 방법 중 하나를 선택하세요:

### OpenSSL (권장)

```bash
openssl rand -hex 32
```

### Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### PowerShell (Windows)

```powershell
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })
```

출력 예시:

```
a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2
```

## 2. 키 형식

- **길이**: 정확히 64자
- **문자**: 16진수 (`0-9`, `a-f`, `A-F`)
- **검증 정규식**: `/^[0-9a-fA-F]{64}$/`

잘못된 형식의 키를 사용하면 서버 시작 시 아래 에러가 발생합니다:

```
Error: ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes)
```

## 3. 환경변수 설정

`.env.local`에 추가:

```bash
ENCRYPTION_KEY=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2
```

## 4. 주의사항

- **키를 변경하면** 기존에 암호화된 모든 환경변수를 복호화할 수 없습니다. 키 변경 시에는 반드시 기존 데이터를 먼저 복호화한 후 새 키로 재암호화해야 합니다.
- **키를 분실하면** 암호화된 환경변수를 복구할 수 없습니다. 안전한 곳에 백업하세요.
- **환경별로 다른 키**를 사용하세요. 개발/스테이징/프로덕션 각각 별도의 키를 생성합니다.
- **`NEXT_PUBLIC_` 접두사를 붙이지 마세요.** 암호화 키가 클라이언트에 노출됩니다.

## 5. 암호화 동작 방식

```
평문값 → AES-256-GCM 암호화 → iv:authTag:encryptedData (hex) → DB 저장
DB 조회 → iv:authTag:encryptedData → AES-256-GCM 복호화 → 평문값
```

- **IV (Initialization Vector)**: 매번 랜덤 생성 (16바이트)
- **Auth Tag**: 무결성 검증용 (16바이트)
- **저장 형식**: `iv:authTag:encryptedData` (콜론 구분, 모두 hex)

## 코드 참조

| 파일 | 역할 |
|------|------|
| `src/lib/crypto/index.ts:15` | 키 형식 검증 (`getKey()`) |
| `src/lib/crypto/index.ts:22` | `encrypt()` -- 평문 → 암호문 |
| `src/lib/crypto/index.ts:34` | `decrypt()` -- 암호문 → 평문 |
| `src/app/api/env/route.ts` | 환경변수 CRUD 시 encrypt/decrypt 호출 |
