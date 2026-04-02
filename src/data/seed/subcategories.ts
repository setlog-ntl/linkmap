import type { ServiceCategory } from '@/types';

export interface SubcategorySeed {
  id: string;
  category: ServiceCategory;
  name: string;
  name_ko: string;
  description: string;
  description_ko: string;
}

export const subcategories: SubcategorySeed[] = [
  // --- auth ---
  { id: 'oauth', category: 'auth', name: 'OAuth Provider', name_ko: 'OAuth 제공자', description: 'Social login and OAuth services', description_ko: '소셜 로그인 및 OAuth 서비스' },
  { id: 'auth_platform', category: 'auth', name: 'Auth Platform', name_ko: '인증 플랫폼', description: 'Full authentication platforms', description_ko: '완전한 인증 플랫폼' },
  { id: 'identity', category: 'auth', name: 'Identity Management', name_ko: '아이덴티티 관리', description: 'Identity and access management', description_ko: 'ID 및 접근 관리' },

  // --- database ---
  { id: 'postgres', category: 'database', name: 'PostgreSQL', name_ko: 'PostgreSQL', description: 'Postgres-based database services', description_ko: 'Postgres 기반 데이터베이스 서비스' },
  { id: 'mysql', category: 'database', name: 'MySQL', name_ko: 'MySQL', description: 'MySQL-compatible database services', description_ko: 'MySQL 호환 데이터베이스 서비스' },
  { id: 'nosql', category: 'database', name: 'NoSQL', name_ko: 'NoSQL', description: 'NoSQL and document databases', description_ko: 'NoSQL 및 문서 데이터베이스' },
  { id: 'realtime_db', category: 'database', name: 'Realtime Database', name_ko: '실시간 데이터베이스', description: 'Realtime sync databases', description_ko: '실시간 동기화 데이터베이스' },

  // --- deploy ---
  { id: 'jamstack', category: 'deploy', name: 'JAMstack Hosting', name_ko: 'JAMstack 호스팅', description: 'JAMstack and static site hosting', description_ko: 'JAMstack 및 정적 사이트 호스팅' },
  { id: 'container', category: 'deploy', name: 'Container Hosting', name_ko: '컨테이너 호스팅', description: 'Container and Docker hosting', description_ko: '컨테이너 및 Docker 호스팅' },
  { id: 'container-hosting', category: 'deploy', name: 'Container Hosting', name_ko: '컨테이너 호스팅', description: 'Container and Docker hosting', description_ko: '컨테이너 및 Docker 호스팅' },
  { id: 'cloud-hosting', category: 'deploy', name: 'Cloud Hosting', name_ko: '클라우드 호스팅', description: 'Cloud hosting platforms', description_ko: '클라우드 호스팅 플랫폼' },
  { id: 'paas', category: 'deploy', name: 'PaaS', name_ko: 'PaaS', description: 'Platform as a Service', description_ko: 'Platform as a Service' },

  // --- email ---
  { id: 'transactional_email', category: 'email', name: 'Transactional Email', name_ko: '트랜잭션 이메일', description: 'Transactional email delivery', description_ko: '트랜잭션 이메일 전송' },
  { id: 'marketing_email', category: 'email', name: 'Marketing Email', name_ko: '마케팅 이메일', description: 'Marketing email campaigns', description_ko: '마케팅 이메일 캠페인' },

  // --- payment ---
  { id: 'payment_gateway', category: 'payment', name: 'Payment Gateway', name_ko: '결제 게이트웨이', description: 'Payment processing gateways', description_ko: '결제 처리 게이트웨이' },
  { id: 'subscription', category: 'payment', name: 'Subscription Billing', name_ko: '구독 결제', description: 'Subscription and recurring billing', description_ko: '구독 및 반복 결제' },

  // --- storage ---
  { id: 'object_storage', category: 'storage', name: 'Object Storage', name_ko: '오브젝트 스토리지', description: 'Object/blob storage services', description_ko: '오브젝트/Blob 스토리지 서비스' },
  { id: 'file_upload', category: 'storage', name: 'File Upload', name_ko: '파일 업로드', description: 'File upload and management', description_ko: '파일 업로드 및 관리' },

  // --- monitoring ---
  { id: 'error_tracking', category: 'monitoring', name: 'Error Tracking', name_ko: '에러 추적', description: 'Error and exception tracking', description_ko: '에러 및 예외 추적' },
  { id: 'apm', category: 'monitoring', name: 'APM', name_ko: 'APM', description: 'Application performance monitoring', description_ko: '애플리케이션 성능 모니터링' },
  { id: 'monitoring-apm', category: 'monitoring', name: 'Monitoring & APM', name_ko: '모니터링 & APM', description: 'Full-stack monitoring and APM', description_ko: '풀스택 모니터링 및 APM' },
  { id: 'product_analytics', category: 'monitoring', name: 'Product Analytics', name_ko: '제품 분석', description: 'Product analytics and user behavior', description_ko: '제품 분석 및 사용자 행동 추적' },
  { id: 'product-analytics', category: 'monitoring', name: 'Product Analytics', name_ko: '제품 분석', description: 'Product analytics and user behavior', description_ko: '제품 분석 및 사용자 행동 추적' },

  // --- ai ---
  { id: 'llm', category: 'ai', name: 'LLM', name_ko: 'LLM', description: 'Large language model APIs', description_ko: '대규모 언어 모델 API' },
  { id: 'vision', category: 'ai', name: 'Vision', name_ko: '비전', description: 'Image and vision AI services', description_ko: '이미지 및 비전 AI 서비스' },
  { id: 'voice', category: 'ai', name: 'Voice', name_ko: '음성', description: 'Speech synthesis and recognition', description_ko: '음성 합성 및 인식' },
  { id: 'code_assistant', category: 'ai', name: 'Code Assistant', name_ko: '코드 어시스턴트', description: 'AI-powered coding assistants', description_ko: 'AI 기반 코딩 어시스턴트' },
  { id: 'multimodal_ai', category: 'ai', name: 'Multimodal AI', name_ko: '멀티모달 AI', description: 'Multimodal AI models for text, image, audio', description_ko: '텍스트, 이미지, 오디오 멀티모달 AI 모델' },
  { id: 'llm-inference', category: 'ai', name: 'LLM Inference', name_ko: 'LLM 추론', description: 'Fast LLM inference services', description_ko: '빠른 LLM 추론 서비스' },
  { id: 'voice-synthesis', category: 'ai', name: 'Voice Synthesis', name_ko: '음성 합성', description: 'AI voice synthesis and cloning', description_ko: 'AI 음성 합성 및 복제' },
  { id: 'image_generation', category: 'ai', name: 'Image Generation', name_ko: '이미지 생성', description: 'AI image generation services', description_ko: 'AI 이미지 생성 서비스' },
  { id: 'video_generation', category: 'ai', name: 'Video Generation', name_ko: '비디오 생성', description: 'AI video generation services', description_ko: 'AI 비디오 생성 서비스' },
  { id: 'speech_to_text', category: 'ai', name: 'Speech to Text', name_ko: '음성 인식', description: 'AI speech recognition services', description_ko: 'AI 음성 인식 서비스' },
  { id: 'ai_agent', category: 'ai', name: 'AI Agent Framework', name_ko: 'AI 에이전트', description: 'AI agent and orchestration frameworks', description_ko: 'AI 에이전트 및 오케스트레이션 프레임워크' },
  { id: 'vector_db', category: 'ai', name: 'Vector Database', name_ko: '벡터 데이터베이스', description: 'Vector databases for AI embeddings', description_ko: 'AI 임베딩을 위한 벡터 데이터베이스' },
  { id: 'mlops', category: 'ai', name: 'MLOps', name_ko: 'MLOps', description: 'ML operations and infrastructure', description_ko: 'ML 운영 및 인프라' },
  { id: 'ai_search', category: 'ai', name: 'AI Search', name_ko: 'AI 검색', description: 'AI-powered search and answer engines', description_ko: 'AI 기반 검색 및 답변 엔진' },

  // --- cdn ---
  { id: 'cdn_general', category: 'cdn', name: 'General CDN', name_ko: '범용 CDN', description: 'Content delivery networks', description_ko: '콘텐츠 전송 네트워크' },
  { id: 'edge_compute', category: 'cdn', name: 'Edge Compute', name_ko: '엣지 컴퓨팅', description: 'Edge computing platforms', description_ko: '엣지 컴퓨팅 플랫폼' },
  { id: 'cdn-security', category: 'cdn', name: 'CDN & Security', name_ko: 'CDN & 보안', description: 'CDN with security features', description_ko: '보안 기능이 포함된 CDN' },

  // --- cicd ---
  { id: 'ci', category: 'cicd', name: 'CI', name_ko: 'CI', description: 'Continuous integration services', description_ko: '지속적 통합 서비스' },
  { id: 'cd', category: 'cicd', name: 'CD', name_ko: 'CD', description: 'Continuous deployment services', description_ko: '지속적 배포 서비스' },
  { id: 'version_control', category: 'cicd', name: 'Version Control', name_ko: '버전 관리', description: 'Source code hosting and version control', description_ko: '소스 코드 호스팅 및 버전 관리' },
  { id: 'ci-cd', category: 'cicd', name: 'CI/CD', name_ko: 'CI/CD', description: 'Continuous integration and deployment', description_ko: '지속적 통합 및 배포' },

  // --- testing ---
  { id: 'e2e_testing', category: 'testing', name: 'E2E Testing', name_ko: 'E2E 테스팅', description: 'End-to-end testing frameworks', description_ko: '엔드 투 엔드 테스팅 프레임워크' },
  { id: 'e2e-testing', category: 'testing', name: 'E2E Testing', name_ko: 'E2E 테스팅', description: 'End-to-end testing frameworks', description_ko: '엔드 투 엔드 테스팅 프레임워크' },
  { id: 'unit_testing', category: 'testing', name: 'Unit Testing', name_ko: '단위 테스팅', description: 'Unit and integration testing', description_ko: '단위 및 통합 테스팅' },

  // --- sms ---
  { id: 'sms_api', category: 'sms', name: 'SMS API', name_ko: 'SMS API', description: 'SMS messaging APIs', description_ko: 'SMS 메시징 API' },
  { id: 'sms-voice', category: 'sms', name: 'SMS & Voice', name_ko: 'SMS & 음성', description: 'SMS and voice communication APIs', description_ko: 'SMS 및 음성 커뮤니케이션 API' },

  // --- push ---
  { id: 'push_notification', category: 'push', name: 'Push Notification', name_ko: '푸시 알림', description: 'Push notification services', description_ko: '푸시 알림 서비스' },
  { id: 'push-notification', category: 'push', name: 'Push Notification', name_ko: '푸시 알림', description: 'Push notification services', description_ko: '푸시 알림 서비스' },
  { id: 'in_app_messaging', category: 'push', name: 'In-App Messaging', name_ko: '인앱 메시징', description: 'In-app messaging and modals', description_ko: '인앱 메시징 및 모달' },

  // --- chat ---
  { id: 'chat_api', category: 'chat', name: 'Chat API', name_ko: '채팅 API', description: 'Chat and messaging APIs', description_ko: '채팅 및 메시징 API' },
  { id: 'realtime-messaging', category: 'chat', name: 'Realtime Messaging', name_ko: '실시간 메시징', description: 'Realtime messaging and channels', description_ko: '실시간 메시징 및 채널' },
  { id: 'team-messaging', category: 'chat', name: 'Team Messaging', name_ko: '팀 메시징', description: 'Team messaging platform APIs', description_ko: '팀 메시징 플랫폼 API' },
  { id: 'community-platform', category: 'chat', name: 'Community Platform', name_ko: '커뮤니티 플랫폼', description: 'Community and social platform APIs', description_ko: '커뮤니티 및 소셜 플랫폼 API' },
  { id: 'bot_platform', category: 'chat', name: 'Bot Platform', name_ko: '봇 플랫폼', description: 'Chatbot and bot platforms', description_ko: '챗봇 및 봇 플랫폼' },

  // --- search ---
  { id: 'full_text_search', category: 'search', name: 'Full-text Search', name_ko: '전문 검색', description: 'Full-text search engines', description_ko: '전문 검색 엔진' },
  { id: 'vector_search', category: 'search', name: 'Vector Search', name_ko: '벡터 검색', description: 'Vector/semantic search', description_ko: '벡터/시맨틱 검색' },
  { id: 'search-discovery', category: 'search', name: 'Search & Discovery', name_ko: '검색 & 디스커버리', description: 'Search and discovery APIs', description_ko: '검색 및 디스커버리 API' },
  { id: 'search-engine', category: 'search', name: 'Search Engine', name_ko: '검색 엔진', description: 'Self-hosted search engines', description_ko: '자체 호스팅 검색 엔진' },

  // --- cms ---
  { id: 'headless_cms', category: 'cms', name: 'Headless CMS', name_ko: '헤드리스 CMS', description: 'Headless content management systems', description_ko: '헤드리스 콘텐츠 관리 시스템' },
  { id: 'headless-cms', category: 'cms', name: 'Headless CMS', name_ko: '헤드리스 CMS', description: 'Headless content management systems', description_ko: '헤드리스 콘텐츠 관리 시스템' },
  { id: 'self_hosted_cms', category: 'cms', name: 'Self-hosted CMS', name_ko: '자체 호스팅 CMS', description: 'Self-hosted content management', description_ko: '자체 호스팅 콘텐츠 관리' },

  // --- analytics ---
  { id: 'web_analytics', category: 'analytics', name: 'Web Analytics', name_ko: '웹 분석', description: 'Website analytics and tracking', description_ko: '웹사이트 분석 및 추적' },
  { id: 'web-analytics', category: 'analytics', name: 'Web Analytics', name_ko: '웹 분석', description: 'Website analytics and tracking', description_ko: '웹사이트 분석 및 추적' },
  { id: 'product_analytics_v2', category: 'analytics', name: 'Product Analytics', name_ko: '제품 분석', description: 'Product usage analytics', description_ko: '제품 사용 분석' },
  { id: 'privacy-analytics', category: 'analytics', name: 'Privacy Analytics', name_ko: '프라이버시 분석', description: 'Privacy-focused web analytics', description_ko: '프라이버시 중심 웹 분석' },

  // --- cache ---
  { id: 'redis', category: 'cache', name: 'Redis', name_ko: 'Redis', description: 'Redis and key-value caching', description_ko: 'Redis 및 키-값 캐싱' },
  { id: 'kv_store', category: 'cache', name: 'KV Store', name_ko: 'KV 스토어', description: 'Key-value stores', description_ko: '키-값 스토어' },
  { id: 'cache-store', category: 'cache', name: 'Cache Store', name_ko: '캐시 스토어', description: 'Serverless cache and KV stores', description_ko: '서버리스 캐시 및 KV 스토어' },

  // --- logging ---
  { id: 'log_management', category: 'logging', name: 'Log Management', name_ko: '로그 관리', description: 'Log aggregation and management', description_ko: '로그 집계 및 관리' },
  { id: 'session_replay', category: 'logging', name: 'Session Replay', name_ko: '세션 리플레이', description: 'Session replay and recording', description_ko: '세션 리플레이 및 녹화' },
  { id: 'session-replay', category: 'logging', name: 'Session Replay', name_ko: '세션 리플레이', description: 'Session replay and recording', description_ko: '세션 리플레이 및 녹화' },

  // --- feature_flags ---
  { id: 'feature_management', category: 'feature_flags', name: 'Feature Management', name_ko: '기능 관리', description: 'Feature flags and rollouts', description_ko: '기능 플래그 및 롤아웃' },
  { id: 'feature-management', category: 'feature_flags', name: 'Feature Management', name_ko: '기능 관리', description: 'Feature flags and rollouts', description_ko: '기능 플래그 및 롤아웃' },

  // --- queue ---
  { id: 'message_queue', category: 'queue', name: 'Message Queue', name_ko: '메시지 큐', description: 'Message queue services', description_ko: '메시지 큐 서비스' },
  { id: 'event_streaming', category: 'queue', name: 'Event Streaming', name_ko: '이벤트 스트리밍', description: 'Event streaming platforms', description_ko: '이벤트 스트리밍 플랫폼' },
  { id: 'job-queue', category: 'queue', name: 'Job Queue', name_ko: '잡 큐', description: 'Job queue and task processing', description_ko: '잡 큐 및 작업 처리' },

  // --- scheduling ---
  { id: 'cron_jobs', category: 'scheduling', name: 'Cron Jobs', name_ko: '크론 잡', description: 'Scheduled task and cron services', description_ko: '예약 작업 및 크론 서비스' },
  { id: 'background_jobs', category: 'scheduling', name: 'Background Jobs', name_ko: '백그라운드 잡', description: 'Background job processing', description_ko: '백그라운드 작업 처리' },
  { id: 'background-jobs', category: 'scheduling', name: 'Background Jobs', name_ko: '백그라운드 잡', description: 'Background job processing', description_ko: '백그라운드 작업 처리' },
  { id: 'event-driven-functions', category: 'scheduling', name: 'Event-driven Functions', name_ko: '이벤트 기반 함수', description: 'Event-driven serverless functions', description_ko: '이벤트 기반 서버리스 함수' },

  // --- ecommerce ---
  { id: 'ecommerce_platform', category: 'ecommerce', name: 'E-commerce Platform', name_ko: '이커머스 플랫폼', description: 'E-commerce platforms and APIs', description_ko: '이커머스 플랫폼 및 API' },
  { id: 'ecommerce-platform', category: 'ecommerce', name: 'E-commerce Platform', name_ko: '이커머스 플랫폼', description: 'E-commerce platforms and APIs', description_ko: '이커머스 플랫폼 및 API' },

  // --- media ---
  { id: 'image_video', category: 'media', name: 'Image & Video', name_ko: '이미지 & 영상', description: 'Image and video processing', description_ko: '이미지 및 영상 처리' },
  { id: 'maps-location', category: 'media', name: 'Maps & Location', name_ko: '지도 & 위치', description: 'Maps, geocoding, and location services', description_ko: '지도, 지오코딩 및 위치 서비스' },
  { id: 'ai_creative', category: 'media', name: 'AI Creative Generation', name_ko: 'AI 크리에이티브 생성', description: 'AI-powered ad image and video generation for marketing', description_ko: 'AI 기반 광고 이미지·영상 자동 생성 서비스' },

  // --- domain ---
  { id: 'domain_registrar', category: 'domain', name: 'Domain Registrar', name_ko: '도메인 등록', description: 'Domain registration and DNS management', description_ko: '도메인 등록 및 DNS 관리' },
  { id: 'domain_hosting', category: 'domain', name: 'Domain & Hosting', name_ko: '도메인 & 호스팅', description: 'Domain registration with web hosting', description_ko: '웹 호스팅 포함 도메인 등록 서비스' },

  // --- advertising ---
  { id: 'display_ads', category: 'advertising', name: 'Display Ads', name_ko: '디스플레이 광고', description: 'Banner and display advertising networks', description_ko: '배너 및 디스플레이 광고 네트워크' },
  { id: 'native_ads', category: 'advertising', name: 'Native Ads', name_ko: '네이티브 광고', description: 'Native and content recommendation ads', description_ko: '네이티브 및 콘텐츠 추천 광고' },
  { id: 'header_bidding', category: 'advertising', name: 'Header Bidding', name_ko: '헤더 비딩', description: 'Programmatic header bidding and ad serving', description_ko: '프로그래매틱 헤더 비딩 및 광고 서버' },
  { id: 'retargeting', category: 'advertising', name: 'Retargeting', name_ko: '리타겟팅', description: 'Retargeting and performance advertising', description_ko: '리타겟팅 및 퍼포먼스 광고' },

  // --- ai (추가) ---
  { id: 'vibe_coding', category: 'ai', name: 'Vibe Coding Platform', name_ko: '바이브 코딩 플랫폼', description: 'AI-powered app builders for non-coders', description_ko: 'AI 기반 앱 빌더 (비개발자용 풀스택 생성)' },
  { id: 'llm_router', category: 'ai', name: 'LLM Router', name_ko: 'LLM 라우터', description: 'Multi-LLM routing and gateway services', description_ko: '멀티 LLM 라우팅 및 게이트웨이' },
  { id: 'ai_framework', category: 'ai', name: 'AI Framework', name_ko: 'AI 프레임워크', description: 'AI application development SDKs and frameworks', description_ko: 'AI 앱 개발 SDK 및 프레임워크' },
  { id: 'model_hub', category: 'ai', name: 'Model Hub', name_ko: '모델 허브', description: 'ML model hosting, sharing, and inference platforms', description_ko: 'ML 모델 호스팅·공유·추론 플랫폼' },

  // --- database (추가) ---
  { id: 'edge_db', category: 'database', name: 'Edge Database', name_ko: '에지 데이터베이스', description: 'Edge-native distributed databases', description_ko: '에지 네이티브 분산 데이터베이스' },
  { id: 'reactive_backend', category: 'database', name: 'Reactive Backend', name_ko: '리액티브 백엔드', description: 'Realtime reactive backend platforms with built-in DB', description_ko: '실시간 리액티브 백엔드 플랫폼 (DB 내장)' },
  { id: 'orm', category: 'database', name: 'ORM', name_ko: 'ORM', description: 'Object-relational mapping tools for databases', description_ko: '데이터베이스 ORM 도구' },

  // --- deploy (추가) ---
  { id: 'selfhost_paas', category: 'deploy', name: 'Self-hosted PaaS', name_ko: '셀프호스트 PaaS', description: 'Open-source self-hosted deployment platforms', description_ko: '오픈소스 셀프호스트 배포 플랫폼' },

  // --- auth (추가) ---
  { id: 'enterprise_sso', category: 'auth', name: 'Enterprise SSO', name_ko: '엔터프라이즈 SSO', description: 'Enterprise SSO, SAML, and directory sync', description_ko: '엔터프라이즈 SSO, SAML, 디렉터리 동기화' },

  // --- push (추가) ---
  { id: 'notification_infra', category: 'push', name: 'Notification Infrastructure', name_ko: '알림 인프라', description: 'Multi-channel notification orchestration (email, SMS, push, in-app)', description_ko: '멀티채널 알림 오케스트레이션 (이메일, SMS, 푸시, 인앱)' },

  // --- cms (추가) ---
  { id: 'git_cms', category: 'cms', name: 'Git-based CMS', name_ko: 'Git 기반 CMS', description: 'Git-backed content management systems', description_ko: 'Git 저장소 기반 콘텐츠 관리 시스템' },

  // --- payment (추가) ---
  { id: 'subscription_mor', category: 'payment', name: 'MoR Billing', name_ko: 'MoR 결제', description: 'Merchant of Record billing with tax automation', description_ko: '세금 자동 처리 포함 판매대행(MoR) 결제' },

  // --- sns ---
  { id: 'social-media', category: 'sns', name: 'Social Media', name_ko: '소셜 미디어', description: 'Social media platform APIs', description_ko: '소셜 미디어 플랫폼 API' },
  { id: 'video-platform', category: 'sns', name: 'Video Platform', name_ko: '영상 플랫폼', description: 'Video sharing platform APIs', description_ko: '영상 공유 플랫폼 API' },
  { id: 'professional-sns', category: 'sns', name: 'Professional SNS', name_ko: '비즈니스 SNS', description: 'Professional networking platform APIs', description_ko: '비즈니스 네트워킹 플랫폼 API' },
];
