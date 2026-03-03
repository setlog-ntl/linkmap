-- Restore actual plan quota limits for Free/Pro/Team tiers
-- Reverts the 999999 values set in migration 043

-- Free tier: 프로젝트 3, 환경변수 20/project, 서비스 10/project, 배포 3, 팀원 0
UPDATE plan_quotas SET
  max_projects = 3,
  max_env_vars_per_project = 20,
  max_services_per_project = 10,
  max_homepage_deploys = 3
WHERE plan = 'free';

-- Pro tier: 프로젝트 20, 환경변수 100/project, 서비스 50/project, 배포 10, 팀원 0
UPDATE plan_quotas SET
  max_projects = 20,
  max_env_vars_per_project = 100,
  max_services_per_project = 50,
  max_homepage_deploys = 10
WHERE plan = 'pro';

-- Team tier: 프로젝트 100, 환경변수 500/project, 서비스 100/project, 배포 50, 팀원 25
UPDATE plan_quotas SET
  max_projects = 100,
  max_env_vars_per_project = 500,
  max_services_per_project = 100,
  max_homepage_deploys = 50
WHERE plan = 'team';
