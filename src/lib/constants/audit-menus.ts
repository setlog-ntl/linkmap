/**
 * 감사 로그 action 코드 → 실제 화면 메뉴명 사전
 *
 * 관리자 사용자 대시보드에서 `oneclick.deploy_pages` 같은 원시 코드 대신
 * 사용자가 실제로 보는 메뉴 이름("원클릭 배포")으로 활동을 읽기 위한 매핑이다.
 * 메뉴명은 사이드바(app-sidebar)·설정 내비(settings-nav)·i18n ko.json 라벨과 동일하게 유지한다.
 */

export interface AuditActionMeta {
  /** 사용자가 실제로 보는 메뉴 이름 */
  menu: string;
  /** 그 메뉴에서 수행한 동작 */
  label: string;
}

/** 사전에도 prefix에도 없는 action의 메뉴명 */
export const UNKNOWN_MENU = '기타';

export const AUDIT_ACTION_MAP: Record<string, AuditActionMeta> = {
  // 프로젝트
  'project.create': { menu: '프로젝트', label: '프로젝트 생성' },
  'project.update': { menu: '프로젝트', label: '프로젝트 수정' },
  'project.delete': { menu: '프로젝트', label: '프로젝트 삭제' },
  'project.restore': { menu: '프로젝트', label: '프로젝트 복원' },
  'project.permanently_delete': { menu: '프로젝트', label: '프로젝트 영구 삭제' },
  'project.set_icon': { menu: '프로젝트', label: '아이콘 변경' },
  'project.set_main_service': { menu: '프로젝트', label: '대표 서비스 지정' },
  'project.share_toggle': { menu: '프로젝트', label: '공유 링크 전환' },
  'project.toggle_favorite': { menu: '프로젝트', label: '즐겨찾기 전환' },

  // 서비스 목록
  'custom_service.create': { menu: '서비스 목록', label: '직접 만든 서비스 추가' },
  'custom_service.update': { menu: '서비스 목록', label: '직접 만든 서비스 수정' },
  'custom_service.delete': { menu: '서비스 목록', label: '직접 만든 서비스 삭제' },
  'custom_service.migrate': { menu: '서비스 목록', label: '직접 만든 서비스 전환' },

  // 연결 지도
  'zone_layout.upsert': { menu: '연결 지도', label: '영역 배치 저장' },
  'layer_override.upsert': { menu: '연결 지도', label: '레이어 설정 저장' },

  // 연결 관리
  'connection.create': { menu: '연결 관리', label: '연결 추가' },
  'connection.update': { menu: '연결 관리', label: '연결 수정' },
  'connection.delete': { menu: '연결 관리', label: '연결 삭제' },
  'connection.restore': { menu: '연결 관리', label: '연결 복원' },
  'connection.permanently_delete': { menu: '연결 관리', label: '연결 영구 삭제' },
  'connection.verify': { menu: '연결 관리', label: '연결 확인' },
  'connection.auto_create': { menu: '연결 관리', label: '연결 자동 생성' },

  // 비밀 키 (환경변수)
  'env_var.create': { menu: '비밀 키', label: '환경변수 추가' },
  'env_var.update': { menu: '비밀 키', label: '환경변수 수정' },
  'env_var.delete': { menu: '비밀 키', label: '환경변수 삭제' },
  'env_var.restore': { menu: '비밀 키', label: '환경변수 복원' },
  'env_var.permanently_delete': { menu: '비밀 키', label: '환경변수 영구 삭제' },
  'env_var.decrypt': { menu: '비밀 키', label: '환경변수 값 확인' },
  'env_var.bulk_create': { menu: '비밀 키', label: '환경변수 일괄 추가' },
  'env_var.bulk_decrypt': { menu: '비밀 키', label: '환경변수 일괄 확인' },
  'env_var.download': { menu: '비밀 키', label: '.env 내려받기' },
  'env_var.raw_read': { menu: '비밀 키', label: '원문 편집기 열기' },
  'env_var.raw_update': { menu: '비밀 키', label: '원문 편집 저장' },
  'env_var.conflict_scan': { menu: '비밀 키', label: '충돌 검사' },
  'env_var.conflict_resolve': { menu: '비밀 키', label: '충돌 해결' },
  'env_var.sync_services': { menu: '비밀 키', label: '서비스 동기화' },

  // 자격 증명
  'credential.create': { menu: '자격 증명', label: '비밀키 추가' },
  'credential.update': { menu: '자격 증명', label: '비밀키 수정' },
  'credential.delete': { menu: '자격 증명', label: '비밀키 삭제' },
  'credential.decrypt': { menu: '자격 증명', label: '비밀키 값 확인' },
  'credential.export': { menu: '자격 증명', label: '비밀키 내보내기' },
  'credential.bulk_update': { menu: '자격 증명', label: '비밀키 일괄 수정' },
  'credential.bulk_delete': { menu: '자격 증명', label: '비밀키 일괄 삭제' },

  // 보안 메모
  'secure_note.create': { menu: '보안 메모', label: '메모 작성' },
  'secure_note.update': { menu: '보안 메모', label: '메모 수정' },
  'secure_note.delete': { menu: '보안 메모', label: '메모 삭제' },
  'secure_note.decrypt': { menu: '보안 메모', label: '메모 열람' },

  // 비용
  'project.budget_update': { menu: '비용', label: '예산 설정' },
  'service_cost.update': { menu: '비용', label: '비용 입력' },
  'service_cost.api_key_save': { menu: '비용', label: '비용 API 키 저장' },
  'service_cost.usage_sync': { menu: '비용', label: '사용량 동기화' },
  'cost_attachment.upload': { menu: '비용', label: '증빙 업로드' },
  'cost_attachment.link_add': { menu: '비용', label: '증빙 링크 추가' },
  'cost_attachment.delete': { menu: '비용', label: '증빙 삭제' },

  // 상태 모니터링
  'service.health_check': { menu: '상태 모니터링', label: '상태 점검 실행' },

  // 원클릭 배포
  'oneclick.deploy_pages': { menu: '원클릭 배포', label: 'GitHub Pages 배포' },
  'oneclick.deploy_repo': { menu: '원클릭 배포', label: '저장소 생성' },
  'oneclick.deploy_upload': { menu: '원클릭 배포', label: '배포 파일 업로드' },
  'oneclick.deploy_success': { menu: '원클릭 배포', label: '배포 성공' },
  'oneclick.deploy_error': { menu: '원클릭 배포', label: '배포 실패' },
  'oneclick.services_linked': { menu: '원클릭 배포', label: '서비스 연결' },

  // 내 사이트
  'oneclick.redeploy': { menu: '내 사이트', label: '재배포' },
  'oneclick.file_edit': { menu: '내 사이트', label: '파일 수정' },
  'oneclick.file_create': { menu: '내 사이트', label: '파일 추가' },
  'oneclick.batch_update': { menu: '내 사이트', label: '내용 일괄 저장' },
  'oneclick.image_upload': { menu: '내 사이트', label: '이미지 업로드' },
  'oneclick.deploy_rename': { menu: '내 사이트', label: '사이트 이름 변경' },
  'oneclick.deploy_delete': { menu: '내 사이트', label: '사이트 삭제' },

  // AI 어시스턴트
  'ai.chat': { menu: 'AI 어시스턴트', label: 'AI 채팅' },
  'ai.command': { menu: 'AI 어시스턴트', label: 'AI 명령 실행' },
  'ai.stack_recommend': { menu: 'AI 어시스턴트', label: '스택 추천' },
  'ai.env_doctor': { menu: 'AI 어시스턴트', label: '환경변수 진단' },
  'ai.compare_services': { menu: 'AI 어시스턴트', label: '서비스 비교' },
  'ai.cost_report': { menu: 'AI 어시스턴트', label: '비용 리포트' },
  'ai.map_narrate': { menu: 'AI 어시스턴트', label: '연결 지도 해설' },
  'ai.module_quick_edit': { menu: 'AI 어시스턴트', label: '사이트 문구 빠른 수정' },
  'ai.module_inline_polish': { menu: 'AI 어시스턴트', label: '사이트 문구 다듬기' },

  // GitHub 연결
  'github.repo_link': { menu: 'GitHub 연결', label: '저장소 연결' },
  'github.repo_unlink': { menu: 'GitHub 연결', label: '저장소 연결 해제' },
  'github.secrets_push': { menu: 'GitHub 연결', label: '시크릿 등록' },
  'github.auto_sync': { menu: 'GitHub 연결', label: '자동 동기화' },
  'github_connection.add': { menu: 'GitHub 연결', label: '계정 추가' },
  'github_connection.rename': { menu: 'GitHub 연결', label: '계정 별칭 변경' },
  'github_connection.toggle_status': { menu: 'GitHub 연결', label: '계정 사용 전환' },
  'github_connection.disconnect': { menu: 'GitHub 연결', label: '계정 연결 해제' },
  'github_connection.delete': { menu: 'GitHub 연결', label: '계정 삭제' },

  // 연결된 서비스 계정
  'service_account.connect_oauth': { menu: '연결된 서비스 계정', label: 'OAuth 계정 연결' },
  'service_account.connect_api_key': { menu: '연결된 서비스 계정', label: 'API 키 연결' },
  'service_account.verify': { menu: '연결된 서비스 계정', label: '계정 확인' },
  'service_account.toggle_status': { menu: '연결된 서비스 계정', label: '계정 사용 전환' },
  'service_account.disconnect': { menu: '연결된 서비스 계정', label: '계정 연결 해제' },
  'service_account.oauth_callback_rejected': { menu: '연결된 서비스 계정', label: 'OAuth 연결 거부' },

  // 구독 및 결제
  'payment.checkout_initiated': { menu: '구독 및 결제', label: '결제 시작' },
  'payment.checkout_complete': { menu: '구독 및 결제', label: '결제 완료' },
  'payment.order_created': { menu: '구독 및 결제', label: '주문 생성' },
  'payment.invoice_failed': { menu: '구독 및 결제', label: '결제 실패' },
  'payment.portal_access': { menu: '구독 및 결제', label: '결제 포털 열기' },
  'payment.refund_requested': { menu: '구독 및 결제', label: '환불 요청' },
  'payment.refund_completed': { menu: '구독 및 결제', label: '환불 완료' },
  'payment.subscription_updated': { menu: '구독 및 결제', label: '구독 변경' },
  'payment.subscription_cancel_requested': { menu: '구독 및 결제', label: '구독 해지 요청' },
  'payment.subscription_canceled': { menu: '구독 및 결제', label: '구독 해지' },

  // 내 계정
  'profile.update': { menu: '내 계정', label: '프로필 수정' },
  'account.delete': { menu: '내 계정', label: '회원 탈퇴' },
  'mfa.enable': { menu: '내 계정', label: '2단계 인증 사용' },
  'mfa.disable': { menu: '내 계정', label: '2단계 인증 해제' },
  'mfa.verify': { menu: '내 계정', label: '2단계 인증 확인' },
  'mfa.recovery_used': { menu: '내 계정', label: '복구 코드 사용' },

  // 개발자 도구
  'api_token.create': { menu: '개발자 도구', label: 'API 토큰 발급' },
  'api_token.delete': { menu: '개발자 도구', label: 'API 토큰 삭제' },
  'mcp.detect': { menu: '개발자 도구', label: 'MCP 서비스 감지' },
  'mcp.sync_services': { menu: '개발자 도구', label: 'MCP 서비스 동기화' },

  // 팀 관리
  'team_member.add': { menu: '팀 관리', label: '팀원 초대' },
  'team_member.remove': { menu: '팀 관리', label: '팀원 제외' },

  // 피드백
  'feedback.create': { menu: '피드백', label: '요청 등록' },
  'feedback.update': { menu: '피드백', label: '요청 수정' },
  'feedback.delete': { menu: '피드백', label: '요청 삭제' },
  'feedback.comment_create': { menu: '피드백', label: '댓글 작성' },
  'feedback.admin_update': { menu: '피드백', label: '관리자 상태 변경' },

  // 쇼케이스
  'showcase.admin_remove': { menu: '쇼케이스', label: '노출 해제' },

  // 휴지통
  'trash.empty': { menu: '휴지통', label: '휴지통 비우기' },

  // 관리자
  'admin.setup_templates': { menu: '관리자', label: '템플릿 초기 설정' },
  'admin.indexnow_submit': { menu: '관리자', label: 'IndexNow 색인 요청' },
  'admin.usage_stats_view': { menu: '관리자', label: '기능 통계 조회' },
  'admin.users_stats_view': { menu: '관리자', label: '사용자 통계 조회' },
  'admin.user_detail_view': { menu: '관리자', label: '사용자 상세 조회' },
  'admin.visitors_stats_view': { menu: '관리자', label: '방문자 통계 조회' },
  'admin.ai_config_update': { menu: '관리자', label: 'AI 설정 변경' },
  'admin.ai_provider_update': { menu: '관리자', label: 'AI 공급자 변경' },
  'admin.ai_guardrails_update': { menu: '관리자', label: 'AI 가드레일 변경' },
  'admin.ai_playground_test': { menu: '관리자', label: 'AI 플레이그라운드 테스트' },
  'admin.ai_persona_create': { menu: '관리자', label: 'AI 페르소나 추가' },
  'admin.ai_persona_update': { menu: '관리자', label: 'AI 페르소나 수정' },
  'admin.ai_persona_delete': { menu: '관리자', label: 'AI 페르소나 삭제' },
  'admin.ai_template_create': { menu: '관리자', label: 'AI 템플릿 추가' },
  'admin.ai_template_update': { menu: '관리자', label: 'AI 템플릿 수정' },
  'admin.ai_template_delete': { menu: '관리자', label: 'AI 템플릿 삭제' },
  'admin.ai_feature_persona_update': { menu: '관리자', label: 'AI 기능 페르소나 변경' },
  'admin.ai_feature_preset_apply': { menu: '관리자', label: 'AI 기능 프리셋 적용' },
  'admin.ai_feature_qna_create': { menu: '관리자', label: 'AI 기능 Q&A 추가' },
  'admin.ai_feature_qna_update': { menu: '관리자', label: 'AI 기능 Q&A 수정' },
  'admin.ai_feature_qna_delete': { menu: '관리자', label: 'AI 기능 Q&A 삭제' },

  // 알림 메일
  'email.welcome': { menu: '알림 메일', label: '가입 환영 메일' },
  'email.health_alert': { menu: '알림 메일', label: '상태 이상 알림 메일' },
  'email.subscription_change': { menu: '알림 메일', label: '구독 변경 안내 메일' },
  'email.team_invite': { menu: '알림 메일', label: '팀 초대 메일' },
  'email.send_failed': { menu: '알림 메일', label: '메일 발송 실패' },
};

/**
 * action prefix → 메뉴 폴백.
 * 사전에 아직 등록되지 않은 신규 action도 메뉴 이름만은 맞게 묶이도록 한다.
 */
const MENU_BY_PREFIX: Record<string, string> = {
  project: '프로젝트',
  custom_service: '서비스 목록',
  zone_layout: '연결 지도',
  layer_override: '연결 지도',
  connection: '연결 관리',
  env_var: '비밀 키',
  credential: '자격 증명',
  secure_note: '보안 메모',
  service_cost: '비용',
  cost_attachment: '비용',
  service: '상태 모니터링',
  oneclick: '원클릭 배포',
  ai: 'AI 어시스턴트',
  github: 'GitHub 연결',
  github_connection: 'GitHub 연결',
  service_account: '연결된 서비스 계정',
  payment: '구독 및 결제',
  profile: '내 계정',
  account: '내 계정',
  mfa: '내 계정',
  api_token: '개발자 도구',
  mcp: '개발자 도구',
  team_member: '팀 관리',
  feedback: '피드백',
  showcase: '쇼케이스',
  trash: '휴지통',
  admin: '관리자',
  email: '알림 메일',
};

export function getAuditActionMeta(action: string): AuditActionMeta {
  const known = AUDIT_ACTION_MAP[action];
  if (known) return known;

  const prefix = action.split('.')[0];
  return { menu: MENU_BY_PREFIX[prefix] ?? UNKNOWN_MENU, label: action };
}

/** action이 속한 메뉴 이름 */
export function getAuditMenuName(action: string): string {
  return getAuditActionMeta(action).menu;
}

/** action의 동작 이름 */
export function getAuditActionLabel(action: string): string {
  return getAuditActionMeta(action).label;
}
