'use client';

import { useReducer, useCallback, useEffect } from 'react';
import { useDeployToGitHubPages, useDeployStatus } from '@/lib/queries/oneclick';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

// ── State Types ──

interface SelectingState {
  phase: 'selecting';
  template: string | null;
  siteName: string;
}

interface AuthenticatingState {
  phase: 'authenticating';
  template: string;
  siteName: string;
}

interface ConnectingGithubState {
  phase: 'connecting_github';
  template: string;
  siteName: string;
}

interface DeployingState {
  phase: 'deploying';
  template: string;
  siteName: string;
}

interface PollingState {
  phase: 'polling';
  deployId: string;
  projectId: string;
  template: string;
}

interface SuccessState {
  phase: 'success';
  deployId: string;
  projectId: string;
  template: string;
}

interface ErrorState {
  phase: 'error';
  error: Error;
  canRetry: boolean;
  deployId: string | null;
  projectId: string | null;
}

export type DeployState =
  | SelectingState
  | AuthenticatingState
  | ConnectingGithubState
  | DeployingState
  | PollingState
  | SuccessState
  | ErrorState;

// ── Actions ──

type DeployAction =
  | { type: 'SELECT_TEMPLATE'; template: string }
  | { type: 'SET_SITE_NAME'; siteName: string }
  | { type: 'REQUEST_DEPLOY'; template: string; siteName: string }
  | { type: 'NEEDS_AUTH'; template: string; siteName: string }
  | { type: 'NEEDS_GITHUB'; template: string; siteName: string }
  | { type: 'AUTH_COMPLETE' }
  | { type: 'GITHUB_CONNECTED' }
  | { type: 'START_DEPLOY'; template: string; siteName: string }
  | { type: 'DEPLOY_SUCCESS'; deployId: string; projectId: string; template: string }
  | { type: 'DEPLOY_READY' }
  | { type: 'DEPLOY_ERROR'; error: Error; deployId?: string; projectId?: string }
  | { type: 'RETRY' };

function deployReducer(state: DeployState, action: DeployAction): DeployState {
  switch (action.type) {
    case 'SELECT_TEMPLATE':
      if (state.phase === 'selecting') {
        return { ...state, template: action.template };
      }
      return state;

    case 'SET_SITE_NAME':
      if (state.phase === 'selecting') {
        return { ...state, siteName: action.siteName };
      }
      return state;

    case 'NEEDS_AUTH':
      return {
        phase: 'authenticating',
        template: action.template,
        siteName: action.siteName,
      };

    case 'NEEDS_GITHUB':
      return {
        phase: 'connecting_github',
        template: action.template,
        siteName: action.siteName,
      };

    case 'AUTH_COMPLETE':
      if (state.phase === 'authenticating') {
        return {
          phase: 'connecting_github',
          template: state.template,
          siteName: state.siteName,
        };
      }
      return state;

    case 'GITHUB_CONNECTED':
      if (state.phase === 'connecting_github') {
        return {
          phase: 'deploying',
          template: state.template,
          siteName: state.siteName,
        };
      }
      return state;

    case 'START_DEPLOY':
      return {
        phase: 'deploying',
        template: action.template,
        siteName: action.siteName,
      };

    case 'DEPLOY_SUCCESS':
      return {
        phase: 'polling',
        deployId: action.deployId,
        projectId: action.projectId,
        template: action.template,
      };

    case 'DEPLOY_READY':
      if (state.phase === 'polling') {
        return {
          phase: 'success',
          deployId: state.deployId,
          projectId: state.projectId,
          template: state.template,
        };
      }
      return state;

    case 'DEPLOY_ERROR':
      return {
        phase: 'error',
        error: action.error,
        canRetry: true,
        deployId: action.deployId ?? null,
        projectId: action.projectId ?? null,
      };

    case 'RETRY':
      return { phase: 'selecting', template: null, siteName: '' };

    default:
      return state;
  }
}

// ── Pending Deploy (localStorage) ──

const PENDING_KEY = 'linkmap-pending-deploy';
const PENDING_TTL = 10 * 60 * 1000;

function savePendingDeploy(data: { template: string; siteName: string; accountId?: string }) {
  localStorage.setItem(PENDING_KEY, JSON.stringify({ ...data, savedAt: Date.now() }));
}

function loadPendingDeploy(): { template: string; siteName: string; accountId?: string } | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt > PENDING_TTL) {
      localStorage.removeItem(PENDING_KEY);
      return null;
    }
    return {
      template: parsed.template || parsed.templateId,
      siteName: parsed.siteName,
      ...(parsed.accountId ? { accountId: parsed.accountId } : {}),
    };
  } catch {
    localStorage.removeItem(PENDING_KEY);
    return null;
  }
}

function clearPendingDeploy() {
  localStorage.removeItem(PENDING_KEY);
  try { sessionStorage.removeItem(PENDING_KEY); } catch { /* ignore */ }
}

// ── Random Site Name Generator ──

function generateSiteName(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `my-site-${suffix}`;
}

// ── Hook ──

interface UseDeployMachineOptions {
  isAuthenticated: boolean;
}

export function useDeployMachine({ isAuthenticated }: UseDeployMachineOptions) {
  const [state, dispatch] = useReducer(deployReducer, {
    phase: 'selecting',
    template: null,
    siteName: generateSiteName(),
  });

  const deployMutation = useDeployToGitHubPages();

  // Preflight check: GitHub connection + quota
  const { data: preflightData, isLoading: githubLoading } = useQuery({
    queryKey: ['oneclick-preflight'],
    queryFn: async () => {
      const res = await fetch('/api/oneclick/preflight');
      if (!res.ok) return null;
      return res.json();
    },
    enabled: isAuthenticated,
  });

  const githubAccount = preflightData?.github?.account ?? null;
  const isGitHubConnected = preflightData?.github?.connected === true;

  // Deploy status polling — active in polling phase, cached data retained in success phase
  const deployId = (state.phase === 'polling' || state.phase === 'success') ? state.deployId : null;
  const { data: deployStatus, error: statusError } = useDeployStatus(
    deployId,
    state.phase === 'polling'
  );

  // Watch for deploy completion
  useEffect(() => {
    if (state.phase !== 'polling') return;

    if (deployStatus?.deploy_status === 'ready') {
      dispatch({ type: 'DEPLOY_READY' });
    } else if (deployStatus?.deploy_status === 'error' || deployStatus?.deploy_status === 'timeout') {
      dispatch({
        type: 'DEPLOY_ERROR',
        error: new Error(deployStatus.deploy_error || '배포 중 오류가 발생했습니다'),
        deployId: state.deployId,
        projectId: state.projectId,
      });
    }
  }, [state.phase, deployStatus, state]);

  // Watch for status polling errors
  useEffect(() => {
    if (statusError && state.phase === 'polling') {
      dispatch({
        type: 'DEPLOY_ERROR',
        error: statusError instanceof Error ? statusError : new Error('상태 확인 실패'),
        deployId: state.deployId,
        projectId: state.projectId,
      });
    }
  }, [statusError, state]);

  // Restore pending deploy after OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth_success') === 'github') {
      const saved = loadPendingDeploy();
      if (saved) {
        dispatch({ type: 'NEEDS_GITHUB', template: saved.template, siteName: saved.siteName });
        clearPendingDeploy();
      }
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Execute deploy API call
  const executeDeploy = useCallback(async (template: string, siteName: string, accountId?: string) => {
    dispatch({ type: 'START_DEPLOY', template, siteName });
    try {
      const result = await deployMutation.mutateAsync({
        template_id: template,
        site_name: siteName,
        ...(accountId ? { github_service_account_id: accountId } : {}),
      });
      dispatch({
        type: 'DEPLOY_SUCCESS',
        deployId: result.deploy_id,
        projectId: result.project_id,
        template,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('배포 중 오류가 발생했습니다');
      toast.error(error.message);
      dispatch({ type: 'DEPLOY_ERROR', error });
    }
  }, [deployMutation]);

  // Main deploy handler — determines what to do based on auth/GitHub state
  const handleDeploy = useCallback(async (template: string, siteName: string, accountId?: string) => {
    if (!isAuthenticated) {
      savePendingDeploy({ template, siteName, accountId });
      dispatch({ type: 'NEEDS_AUTH', template, siteName });
      return;
    }

    if (!isGitHubConnected) {
      savePendingDeploy({ template, siteName, accountId });
      dispatch({ type: 'NEEDS_GITHUB', template, siteName });
      return;
    }

    await executeDeploy(template, siteName, accountId);
  }, [isAuthenticated, isGitHubConnected, executeDeploy]);

  // After GitHub connected — auto-deploy if we have pending data
  const handleGitHubConnected = useCallback(async () => {
    if (state.phase === 'connecting_github') {
      dispatch({ type: 'GITHUB_CONNECTED' });
      await executeDeploy(state.template, state.siteName);
    }
  }, [state, executeDeploy]);

  const handleRetry = useCallback(() => {
    deployMutation.reset();
    dispatch({ type: 'RETRY' });
  }, [deployMutation]);

  return {
    state,
    dispatch,
    handleDeploy,
    handleGitHubConnected,
    handleRetry,
    deployStatus,
    deployMutation,
    githubAccount,
    githubLoading,
    isGitHubConnected,
  };
}
