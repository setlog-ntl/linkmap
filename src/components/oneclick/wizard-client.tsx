'use client';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, Globe, GitBranch, Rocket, Pencil } from 'lucide-react';
import { TemplatePickerStep } from './template-picker-step';
import { ModuleEditorStep } from './module-editor-step';
import { DeployStep } from './deploy-step';
import { DeploySuccess } from './deploy-success';
import { AuthModal } from './auth-modal';
import { GitHubConnectModal } from './github-connect-modal';
import { useHomepageTemplates, useMyDeployments } from '@/lib/queries/oneclick';
import { useGitHubConnections } from '@/lib/queries/github-connections';
import { useDeployMachine } from '@/hooks/use-deploy-machine';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import type { ModuleConfigState } from '@/lib/module-schema';

interface OneclickWizardClientProps {
  isAuthenticated: boolean;
}

export function OneclickWizardClient({ isAuthenticated }: OneclickWizardClientProps) {
  const { locale } = useLocaleStore();
  const searchParams = useSearchParams();
  const { data: templates = [], isLoading: templatesLoading } = useHomepageTemplates('github_pages');
  const { data: existingDeploys = [] } = useMyDeployments();
  const existingSiteNames = useMemo(
    () => existingDeploys.map((d) => d.site_name),
    [existingDeploys]
  );

  // Resolve ?template=<slug> query param to template id
  const templateSlugFromUrl = searchParams.get('template');
  const defaultTemplateFromUrl = useMemo(() => {
    if (!templateSlugFromUrl || templates.length === 0) return null;
    return templates.find((t) => t.slug === templateSlugFromUrl)?.id ?? null;
  }, [templateSlugFromUrl, templates]);

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

  // ── 편집 단계 상태 (로컬) ──
  const [editingTemplate, setEditingTemplate] = useState<{
    templateId: string;
    siteName: string;
    accountId?: string;
  } | null>(null);

  // Auto-select first account when accounts load (or match preflight account)
  useEffect(() => {
    if (selectedAccountId || accounts.length === 0) return;
    if (githubAccount?.id) {
      setSelectedAccountId(githubAccount.id);
    } else {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, githubAccount, selectedAccountId]);

  // Step 1 → 편집 단계로 전환
  const onProceedToEdit = useCallback((data: { templateId: string; siteName: string; accountId?: string }) => {
    setEditingTemplate(data);
  }, []);

  // 편집 단계에서 배포 실행
  const onDeployFromEditor = useCallback((_configState: ModuleConfigState) => {
    if (!editingTemplate) return;
    // TODO: configState를 서버로 전달 (현재는 기본값 배포)
    handleDeploy(editingTemplate.templateId, editingTemplate.siteName, editingTemplate.accountId);
    setEditingTemplate(null);
  }, [editingTemplate, handleDeploy]);

  // 편집 단계에서 이전으로
  const onBackFromEditor = useCallback(() => {
    setEditingTemplate(null);
  }, []);

  // Determine what to show
  const isEditing = editingTemplate !== null && state.phase === 'selecting';
  const isStep1 = state.phase === 'selecting' && !isEditing;
  const isStep2 = ['deploying', 'polling', 'error'].includes(state.phase);
  const isStep3 = state.phase === 'success';
  const showAuthModal = state.phase === 'authenticating';
  const showGitHubModal = state.phase === 'connecting_github';

  // Step labels (4-step flow)
  const stepLabels = [
    t(locale, 'wizard.step1'),
    '편집',
    t(locale, 'wizard.step2'),
    t(locale, 'wizard.step3'),
  ];

  const currentStepIndex = isStep3 ? 3 : isStep2 ? 2 : isEditing ? 1 : 0;

  // Get projectId from state for deploy success
  const projectId =
    state.phase === 'polling' || state.phase === 'success' ? state.projectId :
    state.phase === 'error' ? state.projectId :
    null;

  // Resolve template object for deploy step display
  const templateId =
    state.phase === 'deploying' ? state.template :
    state.phase === 'polling' || state.phase === 'success' ? state.template :
    null;
  const activeTemplate = templateId ? templates.find((tmpl) => tmpl.id === templateId) ?? null : null;
  const editingTemplateObj = editingTemplate
    ? templates.find((tmpl) => tmpl.id === editingTemplate.templateId) ?? null
    : null;

  // Reset editing when deploy machine resets
  useEffect(() => {
    if (state.phase !== 'selecting') {
      setEditingTemplate(null);
    }
  }, [state.phase]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="mb-2">
          {t(locale, 'wizard.badge')}
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold">
          {t(locale, 'wizard.title')}
        </h1>
        <p className="text-muted-foreground">
          {t(locale, 'wizard.subtitle')}
        </p>
      </div>

      {/* Beginner Guide */}
      {isStep1 && (
        <Collapsible>
          <CollapsibleTrigger className="group flex items-center gap-1.5 mx-auto text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <span>배포가 처음이신가요?</span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-3 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground space-y-3">
              <p className="font-medium text-foreground">
                배포(Deploy)란?
              </p>
              <p>
                내 컴퓨터에서만 보이던 웹사이트를 인터넷에 공개해서,
                누구나 주소(URL)로 접속할 수 있게 만드는 과정이에요.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="flex items-start gap-2">
                  <Rocket className="h-4 w-4 mt-0.5 text-brand-blue shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-xs">1. 템플릿 선택</p>
                    <p className="text-xs">원하는 디자인을 골라요</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Pencil className="h-4 w-4 mt-0.5 text-brand-blue shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-xs">2. 편집</p>
                    <p className="text-xs">내 정보를 입력해요</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <GitBranch className="h-4 w-4 mt-0.5 text-brand-blue shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-xs">3. GitHub 연결</p>
                    <p className="text-xs">코드 저장소가 자동 생성돼요</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Globe className="h-4 w-4 mt-0.5 text-brand-blue shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-xs">4. 자동 배포</p>
                    <p className="text-xs">몇 분이면 내 사이트 완성!</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground/80 pt-1">
                GitHub Pages를 통해 무료로 호스팅되며, 별도 서버 비용이 없어요.
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* 4-Step Indicator */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {stepLabels.map((label, idx) => (
          <div key={idx} className="flex items-center">
            <div
              className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-medium transition-colors ${
                idx === currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : idx < currentStepIndex
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-background/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                {idx + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {idx < stepLabels.length - 1 && (
              <div className={`w-3 sm:w-6 h-0.5 mx-0.5 ${idx < currentStepIndex ? 'bg-primary' : 'bg-muted'}`} />
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
          onNext={onProceedToEdit}
          githubUsername={isGitHubConnected ? githubAccount?.provider_account_id : undefined}
          isGitHubLoading={githubLoading}
          isAuthenticated={isAuthenticated}
          defaultSiteName={state.siteName}
          defaultTemplate={defaultTemplateFromUrl ?? state.template}
          accounts={accounts}
          selectedAccountId={selectedAccountId}
          onAccountChange={setSelectedAccountId}
          existingSiteNames={existingSiteNames}
        />
      )}

      {/* Step 2: Module Editor */}
      {isEditing && editingTemplateObj && (
        <ModuleEditorStep
          template={editingTemplateObj}
          isDeploying={deployMutation.isPending}
          onDeploy={onDeployFromEditor}
          onBack={onBackFromEditor}
        />
      )}

      {/* Step 3: Deploy progress / error */}
      {isStep2 && (
        <DeployStep
          status={deployStatus ?? null}
          isLoading={state.phase === 'deploying' && !deployStatus}
          error={
            state.phase === 'error' ? state.error :
            (deployMutation.error as Error) || null
          }
          template={activeTemplate}
          onRetry={handleRetry}
        />
      )}

      {/* Step 4: Success */}
      {isStep3 && deployStatus && (
        <DeploySuccess status={deployStatus} projectId={projectId} template={activeTemplate} />
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
