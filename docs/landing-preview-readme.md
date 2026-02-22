# 랜딩 페이지 코드·미리보기

## 1. 랜딩 페이지 **코드만** 보고 싶을 때

프로젝트 루트에서:

```bash
# 콘솔에 랜딩 관련 파일 경로만 출력
node scripts/export-landing-code.js

# 파일 목록을 docs/landing-files.txt 에 저장
node scripts/export-landing-code.js --list

# 랜딩 관련 소스를 docs/landing-code-snapshot/ 에 복사 (코드만 따로 볼 때)
node scripts/export-landing-code.js --copy
```

- `--list`: `docs/landing-files.txt` 에 경로 목록 저장
- `--copy`: `docs/landing-code-snapshot/` 에 해당 파일들 복사 (README.md 포함)

## 2. **겉모습·기능 구조**만 확인하고 싶을 때

브라우저에서 아래 HTML 파일을 열면, 현재 랜딩과 비슷한 레이아웃과 섹션 구성을 정적 페이지로 볼 수 있습니다.

- **파일**: `docs/landing-preview.html`
- **방법**: 파일 탐색기에서 더블클릭하거나, 브라우저 주소창에 `file:///.../docs/landing-preview.html` 입력

포함된 섹션: 헤더, 히어로, 스탯, 핵심 기능, 4단계 소개, 가격, 최종 CTA, 푸터.  
실제 서비스의 React/인증/데이터는 없고, 디자인과 구조만 참고용으로 재현한 단일 HTML입니다.
