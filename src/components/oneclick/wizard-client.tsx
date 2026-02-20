'use client';

import { useCallback, useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { TemplatePickerStep } from './template-picker-step';
import { DeployStep } from './deploy-step';
import { AuthModal } from './auth-modal';
import { GitHubConnectModal } from './github-connect-modal';
import { useHomepageTemplates } from '@/lib/queries/oneclick';
import { useGitHubConnections } from '@/lib/queries/github-connections';
import { useDeployMachine } from '@/hooks/use-deploy-machine';
import { useLocaleStore } from '@/stores/locale-store';

interface OneclickWizardClientProps {
  isAuthenticated: boolean;
}

export function OneclickWizardClient({ isAuthenticated }: OneclickWizardClientProps) {
  const { locale } = useLocaleStore();
  const { data: templates = [], isLoading: templatesLoading } = useHomepageTemplates('github_pages');

  const {
    state,
    handleDeploy,
    handleGitHubConnected,
    handleRetry,
    deployStatus,
    deployMutation,
    githubAccount,
    githubLoading,
    isGitHubConnected,
  } = useDeployMachine({ isAuthenticated });

  // Load all GitHub connections for account selector
  const { data: accounts = [] } = useGitHubConnections();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Auto-select first account when accounts load (or match preflight account)
  useEffect(() => {
    if (selectedAccountId || accounts.length === 0) return;
    if (githubAccount?.id) {
      setSelectedAccountId(githubAccount.id);
    } else {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, githubAccount, selectedAccountId]);

  // Step 1 → deploy
  const onDeployClick = useCallback((data: { templateId: string; siteName: string; accountId?: string }) => {
    handleDeploy(data.templateId, data.siteName, data.accountId);
  }, [handleDeploy]);

  // Determine what to show
  const isStep1 = state.phase === 'selecting';
  const isStep2 = ['deploying', 'polling', 'success', 'error'].includes(state.phase);
  const showAuthModal = state.phase === 'authenticating';
  const showGitHubModal = state.phase === 'connecting_github';

  // Step labels
  const step1Label = locale === 'ko' ? '선택' : 'Choose';
  const step2Label = locale === 'ko' ? '완료' : 'Done';

  const currentStepIndex = isStep2 ? 1 : 0;

  // Get projectId from state for deploy step
  const projectId =
    state.phase === 'polling' || state.phase === 'success' ? state.projectId :
    state.phase === 'error' ? state.projectId :
    null;

  // Resolve template object for deploy step display
  const templateId =
    state.phase === 'deploying' ? state.template :
    state.phase === 'polling' || state.phase === 'success' ? state.template :
    null;
  const activeTemplate = templateId ? templates.find((t) => t.id === templateId) ?? null : null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="mb-2">
          {locale === 'ko' ? '원클릭 배포' : 'One-Click Deploy'}
        </Badge>
        <h1 className="text-3xl font-bold">
          {locale === 'ko' ? '3분 안에 내 홈페이지 만들기' : 'Create Your Homepage in 3 Minutes'}
        </h1>
        <p className="text-muted-foreground">
          {locale === 'ko'
            ? '템플릿을 고르고 배포 버튼을 누르세요. 그게 전부입니다.'
            : 'Pick a template and hit deploy. That\'s all.'}
        </p>
      </div>

      {/* 2-Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {[step1Label, step2Label].map((label, idx) => (
          <div key={label} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                idx === currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : idx < currentStepIndex
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <span>{label}</span>
            </div>
            {idx < 1 && (
              <div className={`w-8 h-0.5 mx-1 ${idx < currentStepIndex ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Template + site name selection */}
      {isStep1 && (
        <TemplatePickerStep
          templates={templates}
          isLoading={templatesLoading}
          isDeploying={deployMutation.isPending}
          onNext={onDeployClick}
          githubUsername={isGitHubConnected ? githubAccount?.provider_account_id : undefined}
          isGitHubLoading={githubLoading}
          isAuthenticated={isAuthenticated}
          defaultSiteName={state.siteName}
          defaultTemplate={state.template}
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountChange={setSelectedAccountId}
        />
      )}

      {/* Step 2: Deploy progress / success / error */}
      {isStep2 && (
        <DeployStep
          status={deployStatus ?? null}
          isLoading={state.phase === 'deploying' && !deployStatus}
          error={
            state.phase === 'error' ? state.error :
            (deployMutation.error as Error) || null
          }
          projectId={projectId}
          template={activeTemplate}
          onRetry={handleRetry}
        />
      )}

      {/* Auth Modal — overlay (no page navigation) */}
      {showAuthModal && (
        <AuthModal
          open={true}
          onClose={handleRetry}
        />
      )}

      {/* GitHub Connect Modal — overlay (no page navigation) */}
      {showGitHubModal && (
        <GitHubConnectModal
          open={true}
          onClose={handleRetry}
          githubAccount={githubAccount}
          isLoading={githubLoading}
          onConnected={handleGitHubConnected}
        />
      )}
    </div>
  );
}
