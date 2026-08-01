'use client';

import { useReducer, useCallback, useEffect } from 'react';
import { useDeployToGitHubPages, useDeployUpload, useDeployRepo, useDeployStatus } from '@/lib/queries/oneclick';
import type { PreparedFile } from '@/lib/oneclick/client-upload';
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
  /** 재시도 시 폼 복원용 — 직전 입력 보존 (없으면 null/'' — 2026-06-12 E2E B-5) */
  template: string | null;
  siteName: string;
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
        // 직전 단계(deploying/polling 등)의 입력을 보존해 재시도 시 폼 복원
        template: 'template' in state ? state.template : null,
        siteName: 'siteName' in state ? state.siteName : '',
      };

    case 'RETRY':
      if (state.phase === 'error') {
        return { phase: 'selecting', template: state.template, siteName: state.siteName };
      }
      return { phase: 'selecting', template: null, siteName: '' };

    default:
      return state;
  }
}

/**
 * 업로드 트랙의 소스 표식. 상태의 `template`은 템플릿 메타 조회 키로만 쓰이므로,
 * 어떤 템플릿 id와도 겹치지 않는 이 값을 넣으면 조회 결과가 null이 되어
 * 진행/성공 화면이 템플릿 없는 배포로 자연스럽게 렌더된다.
 */
export const UPLOAD_SOURCE = 'upload';
export const IMPORT_SOURCE = 'import';

/** 템플릿 id(UUID)와 겹치지 않는 소스 표식들 — 템플릿 조회 시 null로 떨어진다 */
export const NON_TEMPLATE_SOURCES: readonly string[] = [UPLOAD_SOURCE, IMPORT_SOURCE];

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

// ── Hook ──

interface UseDeployMachineOptions {
  isAuthenticated: boolean;
}

export function useDeployMachine({ isAuthenticated }: UseDeployMachineOptions) {
  const [state, dispatch] = useReducer(deployReducer, {
    phase: 'selecting',
    template: null,
    siteName: '',
  });

  const deployMutation = useDeployToGitHubPages();
  const uploadMutation = useDeployUpload();
  const repoMutation = useDeployRepo();

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
      // 서버에서 레포명 충돌로 다른 이름이 지정된 경우 알림
      if (result.site_name && result.site_name !== siteName) {
        toast.info(`레포 이름이 '${result.site_name}'(으)로 자동 변경되었습니다.`);
      }
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

  /**
   * 내 파일 업로드 배포 (트랙 A).
   *
   * 파일 payload는 localStorage(pending-deploy)에 담을 수 없어 OAuth 왕복을 견디지 못한다.
   * 그래서 이 트랙은 인증·GitHub 연결이 끝난 뒤에만 입력 화면에 들어오도록 UI가 게이팅하고,
   * 여기서는 준비된 파일을 그대로 배포한다. (템플릿 트랙의 "선입력 후인증" 순서를 역전)
   */
  const handleUploadDeploy = useCallback(async (
    files: PreparedFile[],
    siteName: string,
    accountId?: string,
  ) => {
    // 파일을 다 보낸 뒤 401을 받으면 준비한 파일이 통째로 날아간다 — 보내기 전에 확인한다
    if (!isAuthenticated || !isGitHubConnected) {
      toast.error('로그인과 GitHub 연결을 먼저 확인해주세요.');
      return;
    }

    dispatch({ type: 'START_DEPLOY', template: UPLOAD_SOURCE, siteName });
    try {
      const result = await uploadMutation.mutateAsync({
        site_name: siteName,
        files: files.map((f) => ({ path: f.path, content: f.content, encoding: f.encoding })),
        ...(accountId ? { github_service_account_id: accountId } : {}),
      });
      if (result.site_name && result.site_name !== siteName) {
        toast.info(`주소가 '${result.site_name}'(으)로 자동 변경되었습니다.`);
      }
      if (result.skipped_files && result.skipped_files.length > 0) {
        toast.info(`${result.skipped_files.length}개 파일은 배포에 포함되지 않았습니다.`);
      }
      dispatch({
        type: 'DEPLOY_SUCCESS',
        deployId: result.deploy_id,
        projectId: result.project_id,
        template: UPLOAD_SOURCE,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('배포 중 오류가 발생했습니다');
      toast.error(error.message);
      dispatch({ type: 'DEPLOY_ERROR', error });
    }
  }, [uploadMutation, isAuthenticated, isGitHubConnected]);

  /**
   * 내 GitHub repo 연결 배포 (트랙 B).
   * 업로드 트랙과 마찬가지로 인증·연결이 끝난 뒤에만 진입한다.
   */
  const handleRepoDeploy = useCallback(async (
    input: { owner: string; repo: string; publishDir: string; linkOnly: boolean },
    accountId?: string,
  ) => {
    if (!isAuthenticated || !isGitHubConnected) {
      toast.error('로그인과 GitHub 연결을 먼저 확인해주세요.');
      return;
    }

    dispatch({ type: 'START_DEPLOY', template: IMPORT_SOURCE, siteName: input.repo });
    try {
      const result = await repoMutation.mutateAsync({
        owner: input.owner,
        repo: input.repo,
        publish_dir: input.publishDir,
        link_only: input.linkOnly,
        ...(accountId ? { github_service_account_id: accountId } : {}),
      });
      dispatch({
        type: 'DEPLOY_SUCCESS',
        deployId: result.deploy_id,
        projectId: result.project_id,
        template: IMPORT_SOURCE,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('배포 중 오류가 발생했습니다');
      toast.error(error.message);
      dispatch({ type: 'DEPLOY_ERROR', error });
    }
  }, [repoMutation, isAuthenticated, isGitHubConnected]);

  const handleRetry = useCallback(() => {
    deployMutation.reset();
    uploadMutation.reset();
    repoMutation.reset();
    dispatch({ type: 'RETRY' });
  }, [deployMutation, uploadMutation, repoMutation]);

  return {
    state,
    dispatch,
    handleDeploy,
    handleUploadDeploy,
    handleRepoDeploy,
    handleGitHubConnected,
    handleRetry,
    deployStatus,
    deployMutation,
    uploadMutation,
    repoMutation,
    githubAccount,
    githubLoading,
    isGitHubConnected,
  };
}
