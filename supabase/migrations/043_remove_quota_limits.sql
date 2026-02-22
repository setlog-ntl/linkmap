-- Remove all quota limits (will be re-introduced after Stripe integration)
UPDATE plan_quotas SET
  max_projects = 999999,
  max_env_vars_per_project = 999999,
  max_services_per_project = 999999,
  max_homepage_deploys = 999999
WHERE plan = 'free';
