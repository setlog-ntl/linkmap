# Red Team Report: {TARGET}

**Date**: {YYYY-MM-DD}
**Target**: {기능/메뉴/모듈명}
**Scope**: {검토 범위 — 파일 경로, API 엔드포인트 등}
**Reviewer**: Red Team Agent

---

## Executive Summary
> 1-3문장으로 전체 평가 요약. 가장 심각한 문제를 강조.

**Overall Risk Level**: {CRITICAL / HIGH / MEDIUM / LOW}
**Total Findings**: P0: {n} | P1: {n} | P2: {n} | P3: {n}

---

## Findings

### [P0] {Finding Title}
- **Category**: Security | Reliability | Data Integrity | UX | Performance | Maintainability
- **Location**: `{file_path}:{line_number}`
- **Description**: 문제의 구체적 설명
- **Attack Vector / Scenario**: 이 문제가 어떻게 악용/발생할 수 있는지
- **Impact**: 문제 발생 시 영향 범위와 심각도
- **Evidence**: 문제가 되는 코드 스니펫 또는 로직
```typescript
// 문제가 되는 코드
```
- **Recommendation**: 구체적 수정 방안
```typescript
// 개선된 코드 (가능한 경우)
```

### [P1] {Finding Title}
- **Category**:
- **Location**:
- **Description**:
- **Attack Vector / Scenario**:
- **Impact**:
- **Evidence**:
- **Recommendation**:

<!-- 반복 -->

---

## Improvement Roadmap

### Immediate (1-2일)
- [ ] P0 항목 수정

### Short-term (1주)
- [ ] P1 항목 수정

### Medium-term (2-4주)
- [ ] P2 항목 수정

### Nice-to-have
- [ ] P3 항목 개선

---

## Reviewed Files
| File | Lines | Issues Found |
|------|-------|-------------|
| | | |

---

## Methodology
- Static code analysis (코드 직접 읽기)
- Pattern matching against OWASP Top 10
- CLAUDE.md 규칙 준수 여부 확인
- Edge case / boundary condition 검토
- Error path exhaustive walkthrough
