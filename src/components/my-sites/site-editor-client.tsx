'use client';

import { useState, useCallback, useEffect, useRef, useMemo, useReducer } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  ExternalLink,
  Loader2,
  FileCode2,
  FileType,
  FileJson,
  FileImage,
  File,
  Code,
  Eye,
  Rocket,
  CheckCircle2,
  FolderOpen,
  X,
  Smartphone,
  Tablet,
  Monitor,
  Circle,
  RotateCw,
  ChevronRight,
  Folder,
  Blocks,
  Github,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import {
  useDeployFiles,
  useFileContent,
  useUpdateFile,
  useBatchApplyFiles,
  useMyDeployments,
  useDeployStatus,
  useSaveDraft,
  useDeleteDraft,
} from '@/lib/queries/oneclick';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queries/keys';
import { toast } from 'sonner';
import Link from 'next/link';
import { ModulePanel } from './module-panel';
import {
  ModuleDeployDialog,
  deployDialogReducer,
  initialDeployDialogState,
  type DiffStats,
} from './module-deploy-dialog';
import { getModuleSchema } from '@/data/oneclick/module-schemas';
import type { ModuleConfigState } from '@/lib/module-schema';
import {
  generateFiles,
  buildInitialState,
  parseConfigToState,
  parsePageToEnabledModules,
} from '@/lib/oneclick/code-generator';
import { generatePreviewHtml } from '@/lib/oneclick/preview';

interface SiteEditorClientProps {
  deployId: string;
}

function isHtmlFile(path: string | null): boolean {
  if (!path) return false;
  return path.toLowerCase().endsWith('.html') || path.toLowerCase().endsWith('.htm');
}

function isCssFile(path: string | null): boolean {
  if (!path) return false;
  return path.toLowerCase().endsWith('.css');
}

function isTsxFile(path: string | null): boolean {
  if (!path) return false;
  const l = path.toLowerCase();
  return l.endsWith('.tsx') || l.endsWith('.jsx');
}

function isJsFile(path: string | null): boolean {
  if (!path) return false;
  const l = path.toLowerCase();
  return l.endsWith('.js') || l.endsWith('.ts') || l.endsWith('.mjs') || l.endsWith('.tsx') || l.endsWith('.jsx');
}

function isJsonFile(path: string | null): boolean {
  if (!path) return false;
  return path.toLowerCase().endsWith('.json');
}

function isImageFile(path: string | null): boolean {
  if (!path) return false;
  const l = path.toLowerCase();
  return l.endsWith('.png') || l.endsWith('.jpg') || l.endsWith('.jpeg') || l.endsWith('.gif') || l.endsWith('.svg') || l.endsWith('.webp');
}

function getFileIcon(path: string) {
  if (isHtmlFile(path)) return FileCode2;
  if (isCssFile(path)) return FileType;
  if (isTsxFile(path)) return FileCode2;
  if (isJsFile(path)) return FileJson;
  if (isJsonFile(path)) return FileJson;
  if (isImageFile(path)) return FileImage;
  return File;
}

function getFileColor(path: string): string {
  if (isHtmlFile(path)) return 'text-orange-400';
  if (isCssFile(path)) return 'text-blue-400';
  if (isTsxFile(path)) return 'text-sky-400';
  if (isJsFile(path)) return 'text-yellow-400';
  if (isJsonFile(path)) return 'text-green-400';
  return 'text-muted-foreground';
}

function getLanguageBadge(path: string | null): { label: string; color: string } | null {
  if (!path) return null;
  if (isHtmlFile(path)) return { label: 'HTML', color: 'bg-orange-500/20 text-orange-400' };
  if (isCssFile(path)) return { label: 'CSS', color: 'bg-blue-500/20 text-blue-400' };
  if (isTsxFile(path)) return { label: 'TSX', color: 'bg-sky-500/20 text-sky-400' };
  if (isJsFile(path)) return { label: 'JS', color: 'bg-yellow-500/20 text-yellow-400' };
  if (isJsonFile(path)) return { label: 'JSON', color: 'bg-green-500/20 text-green-400' };
  return null;
}

// 파일 트리 구조 헬퍼
interface FileTreeNode {
  name: string;
  path: string; // full path for files, dir path for dirs
  type: 'file' | 'dir';
  children?: FileTreeNode[];
  // file-specific fields
  sha?: string;
  size?: number;
}

function buildFileTree(files: { name: string; path: string; sha: string; size: number }[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      if (isFile) {
        current.push({
          name: part,
          path: file.path,
          type: 'file',
          sha: file.sha,
          size: file.size,
        });
      } else {
        let dir = current.find((n) => n.type === 'dir' && n.name === part);
        if (!dir) {
          dir = { name: part, path: parts.slice(0, i + 1).join('/'), type: 'dir', children: [] };
          current.push(dir);
        }
        current = dir.children!;
      }
    }
  }

  // Sort: dirs first, then files, alphabetically
  const sortTree = (nodes: FileTreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    for (const node of nodes) {
      if (node.children) sortTree(node.children);
    }
  };
  sortTree(root);
  return root;
}

/** 두 텍스트 간 라인 단위 diff 통계 계산 */
function computeDiffStats(
  oldContent: string | undefined,
  newContent: string
): { added: number; removed: number } {
  if (!oldContent) return { added: newContent.split('\n').length, removed: 0 };
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');
  const oldSet = new Set(oldLines);
  const newSet = new Set(newLines);
  let added = 0;
  let removed = 0;
  for (const line of newLines) {
    if (!oldSet.has(line)) added++;
  }
  for (const line of oldLines) {
    if (!newSet.has(line)) removed++;
  }
  return { added, removed };
}

function formatRelativeTime(date: Date, locale: string): string {
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return t(locale as 'ko' | 'en', 'editor.justNow');
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}${t(locale as 'ko' | 'en', 'editor.minutesAgo')}`;
  return date.toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
}

type DeployState = 'idle' | 'saving' | 'deploying' | 'deployed';
type RightPanel = 'preview' | 'modules' | null;
type MobileTab = 'code' | 'preview' | 'modules';
type PreviewViewport = 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_SIZES: Record<PreviewViewport, { width: string; height: string; label: string }> = {
  mobile: { width: '390px', height: '844px', label: '390px' },
  tablet: { width: '820px', height: '1180px', label: '820px' },
  desktop: { width: '100%', height: '100%', label: 'Full' },
};

export function SiteEditorClient({ deployId }: SiteEditorClientProps) {
  const { locale } = useLocaleStore();
  const { data: files, isLoading: filesLoading } = useDeployFiles(deployId);
  const { data: deployments } = useMyDeployments();
  const updateFile = useUpdateFile();
  const batchApply = useBatchApplyFiles();

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [rightPanel, setRightPanel] = useState<RightPanel>('preview');
  const [deployState, setDeployState] = useState<DeployState>('idle');
  const [livePreviewKey, setLivePreviewKey] = useState(0);
  const [showLiveAfterDeploy, setShowLiveAfterDeploy] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('code');
  const [showMobileFiles, setShowMobileFiles] = useState(false);
  const [showFileSidebar, setShowFileSidebar] = useState(true);
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>('desktop');
  const previewRef = useRef<HTMLIFrameElement>(null);
  const liveIframeRef = useRef<HTMLIFrameElement>(null);

  const [fileCache, setFileCache] = useState<Record<string, string>>({});

  const { data: fileDetail, isLoading: contentLoading } = useFileContent(
    deployId,
    selectedPath
  );

  const deploy = deployments?.find((d) => d.id === deployId);
  const liveUrl = deploy?.pages_url || deploy?.deployment_url;

  // ── 모듈 에디터 상태 ──
  const templateSlug = deploy?.homepage_templates?.slug ?? null;
  const moduleSchema = useMemo(
    () => (templateSlug ? getModuleSchema(templateSlug) : null),
    [templateSlug]
  );
  const [moduleState, setModuleState] = useState<ModuleConfigState | null>(null);
  const [moduleInitialized, setModuleInitialized] = useState(false);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const handleImagePreview = useCallback((path: string, dataUrl: string) => {
    setImageMap((prev) => ({ ...prev, [path]: dataUrl }));
  }, []);
  const [dialogState, dispatchDialog] = useReducer(deployDialogReducer, initialDeployDialogState);
  const isApplyingModules = dialogState.overallStatus === 'running' && dialogState.mode === 'apply-only';
  const isDeployingModules = dialogState.overallStatus === 'running' && dialogState.mode === 'apply-and-deploy';
  const saveDraft = useSaveDraft();
  const deleteDraft = useDeleteDraft();
  const [showDraftRestore, setShowDraftRestore] = useState(false);
  const pendingDraftRef = useRef<ModuleConfigState | null>(null);
  const moduleStateInitialRef = useRef<ModuleConfigState | null>(null);

  // ── 배포 대기 상태 (useDeployStatus 연동) ──
  type DeployOrigin = 'direct' | 'module-deploy' | null;
  const [awaitingDeploy, setAwaitingDeploy] = useState(false);
  const [deployOrigin, setDeployOrigin] = useState<DeployOrigin>(null);
  const pendingDiffStatsRef = useRef<DiffStats | null>(null);
  const deployStartedAtRef = useRef<number>(0);
  const seenBuildingRef = useRef(false);
  const queryClient = useQueryClient();

  const { data: deployStatusData } = useDeployStatus(deployId, awaitingDeploy);

  // ── 배포 상태 감지 (useDeployStatus 폴링 결과 처리) ──
  // Grace period: 커밋 후 DB가 'building'으로 업데이트되기 전에
  // 이전 배포의 stale 'ready'가 캐시에서 반환될 수 있음 → 무시
  const DEPLOY_GRACE_MS = 10_000;

  // Grace period 만료 안전장치: grace period + 1초 후에도
  // building을 못 봤으면 seenBuildingRef를 강제 설정하여
  // 다음 ready에서 정상 완료 처리되도록 함
  useEffect(() => {
    if (!awaitingDeploy) return;
    const timer = setTimeout(() => {
      if (!seenBuildingRef.current) {
        seenBuildingRef.current = true;
      }
    }, DEPLOY_GRACE_MS + 1000);
    return () => clearTimeout(timer);
  }, [awaitingDeploy]);

  useEffect(() => {
    if (!awaitingDeploy || !deployStatusData) return;
    const status = deployStatusData.deploy_status;

    // 빌드 진행 상태를 한 번이라도 확인하면 flag 설정
    if (status === 'building' || status === 'creating' || status === 'pending') {
      seenBuildingRef.current = true;
    }

    if (status === 'ready') {
      // 아직 빌드 진행 상태를 본 적 없고, grace period 내라면
      // → 이전 배포의 stale 'ready' → 캐시 제거로 재폴링 유도
      if (!seenBuildingRef.current && Date.now() - deployStartedAtRef.current < DEPLOY_GRACE_MS) {
        // 1.5초 후 캐시 제거 → data=undefined → refetchInterval이 1000ms로 재시작
        // 즉시 제거하면 렌더링 루프 위험
        setTimeout(() => {
          if (awaitingDeploy && !seenBuildingRef.current) {
            queryClient.removeQueries({ queryKey: queryKeys.oneclick.status(deployId) });
          }
        }, 1500);
        return;
      }

      setLivePreviewKey((k) => k + 1);
      setShowLiveAfterDeploy(true);
      setDeployState('deployed');
      // 모듈 배포 완료 시 우측 패널을 미리보기로 자동 전환
      if (deployOrigin === 'module-deploy') {
        setRightPanel('preview');
      }
      toast.success(t(locale, 'editor.deployed'), {
        description: '실제 사이트 반영까지 1~3분 정도 걸릴 수 있어요',
      });
      setTimeout(() => setDeployState('idle'), 3000);
      cleanup();
    } else if (status === 'error' || status === 'timeout') {
      const msg = status === 'timeout'
        ? '배포 시간이 초과되었습니다. 재배포를 시도해주세요.'
        : deployStatusData.deploy_error || 'GitHub Actions 빌드 실패';
      toast.error(msg, {
        duration: 10000,
        action: {
          label: '재배포',
          onClick: () => handleRetryDeploy(),
        },
      });
      setDeployState('idle');
      cleanup();
    }
    // 'building', 'creating', 'pending' 상태는 계속 대기

    function cleanup() {
      setAwaitingDeploy(false);
      setDeployOrigin(null);
      pendingDiffStatsRef.current = null;
      seenBuildingRef.current = false;
    }
  }, [awaitingDeploy, deployStatusData, deployOrigin, locale, deployId, queryClient]);

  // config.ts 사전 fetch (모듈 초기화용 — selectedPath와 별도로 fetch)
  const { data: configFileForInit, isError: configInitError } = useFileContent(
    moduleSchema && !moduleInitialized ? deployId : null,
    moduleSchema && !moduleInitialized ? 'src/lib/config.ts' : null
  );
  const { data: pageFileForInit } = useFileContent(
    moduleSchema && !moduleInitialized ? deployId : null,
    moduleSchema && !moduleInitialized ? 'src/app/page.tsx' : null
  );

  // 자동 파일 선택 (우선순위: src/app/page.tsx → src/lib/config.ts → index.html → 첫 번째 파일)
  useEffect(() => {
    if (files && files.length > 0 && !selectedPath) {
      const pageTsx = files.find((f) => f.path === 'src/app/page.tsx');
      const configTs = files.find((f) => f.path === 'src/lib/config.ts');
      const indexHtml = files.find((f) => f.name.toLowerCase() === 'index.html');
      setSelectedPath(
        pageTsx?.path || configTs?.path || indexHtml?.path || files[0].path
      );
    }
  }, [files, selectedPath]);

  // 파일 내용 동기화
  useEffect(() => {
    if (fileDetail) {
      setEditorContent(fileDetail.content);
      setHasUnsavedChanges(false);
      setFileCache((prev) => ({ ...prev, [fileDetail.path]: fileDetail.content }));
    }
  }, [fileDetail]);

  useEffect(() => {
    if (selectedPath) {
      setFileCache((prev) => ({ ...prev, [selectedPath]: editorContent }));
    }
  }, [editorContent, selectedPath]);

  // ── 모듈 상태 초기화 (config.ts 파싱) ──
  useEffect(() => {
    if (!moduleSchema || moduleInitialized) return;

    // 사전 fetch된 config.ts 우선, fileCache fallback
    const configContent = configFileForInit?.content ?? fileCache['src/lib/config.ts'];
    const pageContent = pageFileForInit?.content ?? fileCache['src/app/page.tsx'];

    if (configContent) {
      const parsed = parseConfigToState(configContent, moduleSchema);
      if (pageContent) {
        const { enabled, order } = parsePageToEnabledModules(pageContent, templateSlug ?? undefined);
        if (enabled.length > 0) {
          parsed.enabled = enabled;
          parsed.order = order;
        }
      }
      // config.ts, page.tsx를 fileCache에도 동기화
      if (configFileForInit?.content) {
        setFileCache((prev) => ({ ...prev, 'src/lib/config.ts': configFileForInit.content }));
      }
      if (pageFileForInit?.content) {
        setFileCache((prev) => ({ ...prev, 'src/app/page.tsx': pageFileForInit.content }));
      }
      setModuleState(parsed);
      setModuleInitialized(true);
    }
    // config.ts fetch 실패(신규 배포 등) → 기본값으로 초기화
    if (configInitError) {
      setModuleState(buildInitialState(moduleSchema));
      setModuleInitialized(true);
    }
    // config.ts를 아직 못 가져왔으면 대기
  }, [moduleSchema, moduleInitialized, fileCache, configFileForInit, pageFileForInit, configInitError, templateSlug]);

  // ── 초안 복원 체크 ──
  useEffect(() => {
    if (!moduleInitialized || !deployId) return;
    // initial state 저장 (dirty 비교용)
    if (moduleState) {
      moduleStateInitialRef.current = moduleState;
    }
    // 서버에서 초안 확인
    fetch(`/api/oneclick/deployments/${deployId}/draft`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.moduleDraft?.state) {
          pendingDraftRef.current = data.moduleDraft.state as ModuleConfigState;
          setShowDraftRestore(true);
        }
      })
      .catch(() => { /* 초안 없음 */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleInitialized, deployId]);

  // ── 모듈 상태 디바운스 자동 저장 (3초) ──
  useEffect(() => {
    if (!moduleState || !moduleInitialized || !deployId) return;
    // 초기 상태와 동일하면 저장 스킵
    if (moduleStateInitialRef.current && JSON.stringify(moduleState) === JSON.stringify(moduleStateInitialRef.current)) return;

    const timer = setTimeout(() => {
      saveDraft.mutate({ deployId, state: moduleState as unknown as Record<string, unknown> });
    }, 3000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleState, moduleInitialized, deployId]);

  // 미리보기 HTML 조합
  const previewHtml = useMemo(() => {
    const htmlPath = isHtmlFile(selectedPath)
      ? selectedPath
      : files?.find((f) => isHtmlFile(f.path))?.path || null;

    const htmlContent = htmlPath
      ? (htmlPath === selectedPath ? editorContent : (fileCache[htmlPath] || ''))
      : '';

    if (!htmlContent) return '';

    const baseTag = liveUrl ? `<base href="${liveUrl}/" target="_blank">` : '';

    const cssFiles = files?.filter((f) => isCssFile(f.path)) || [];
    const cssContents = cssFiles
      .map((f) => f.path === selectedPath ? editorContent : (fileCache[f.path] || ''))
      .filter(Boolean);

    const inlineStyle = cssContents.length > 0
      ? `<style data-linkmap-preview>\n${cssContents.join('\n')}\n</style>`
      : '';

    const injected = [baseTag, inlineStyle].filter(Boolean).join('\n');

    if (htmlContent.includes('<head>')) {
      return htmlContent.replace('<head>', `<head>\n${injected}`);
    }
    if (htmlContent.includes('</head>')) {
      return htmlContent.replace('</head>', `${injected}\n</head>`);
    }
    return injected + '\n' + htmlContent;
  }, [editorContent, selectedPath, files, fileCache, liveUrl]);

  // 모듈 실시간 프리뷰 HTML
  const modulePreviewHtml = useMemo(() => {
    if (!moduleState || !templateSlug) return null;
    return generatePreviewHtml(moduleState, templateSlug, liveUrl || '', imageMap);
  }, [moduleState, templateSlug, liveUrl, imageMap]);

  // iframe 미리보기 반영
  useEffect(() => {
    if (!previewRef.current) return;
    const isEditingHtmlOrCss = isHtmlFile(selectedPath) || isCssFile(selectedPath);
    if (isEditingHtmlOrCss && previewHtml) {
      const doc = previewRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(previewHtml);
        doc.close();
      }
    }
  }, [previewHtml, selectedPath, rightPanel, mobileTab]);

  const handleContentChange = useCallback((value: string) => {
    setEditorContent(value);
    setHasUnsavedChanges(true);
    if (showLiveAfterDeploy) setShowLiveAfterDeploy(false);
  }, [showLiveAfterDeploy]);

  const [pendingTabPath, setPendingTabPath] = useState<string | null>(null);

  const handleTabSwitch = useCallback(
    (path: string) => {
      if (hasUnsavedChanges) {
        setPendingTabPath(path);
        return;
      }
      setSelectedPath(path);
      setHasUnsavedChanges(false);
      setShowMobileFiles(false);
    },
    [hasUnsavedChanges]
  );

  const confirmTabSwitch = useCallback(() => {
    if (pendingTabPath) {
      setSelectedPath(pendingTabPath);
      setHasUnsavedChanges(false);
      setShowMobileFiles(false);
      setPendingTabPath(null);
    }
  }, [pendingTabPath]);

  // 저장
  const handleSave = useCallback(async () => {
    if (!selectedPath || !fileDetail) return;
    if (contentLoading) {
      toast.info('파일 동기화 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    try {
      const result = await updateFile.mutateAsync({
        deployId,
        path: selectedPath,
        content: editorContent,
        sha: fileDetail.sha,
      });
      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());
      fileDetail.sha = result.sha;
      toast.success(t(locale, 'editor.saved'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t(locale, 'editor.saveFailed'));
    }
  }, [selectedPath, fileDetail, editorContent, deployId, updateFile, locale, contentLoading]);

  // 배포
  const handleDeploy = useCallback(async () => {
    if (!selectedPath || !fileDetail) return;

    try {
      setDeployState('saving');
      if (hasUnsavedChanges) {
        const result = await updateFile.mutateAsync({
          deployId,
          path: selectedPath,
          content: editorContent,
          sha: fileDetail.sha,
        });
        setHasUnsavedChanges(false);
        setLastSavedAt(new Date());
        fileDetail.sha = result.sha;
      }

      setDeployState('deploying');
      toast.info(t(locale, 'editor.deploying'));
      // 캐시 초기화 + useDeployStatus 폴링으로 위임
      queryClient.removeQueries({ queryKey: queryKeys.oneclick.status(deployId) });
      deployStartedAtRef.current = Date.now();
      seenBuildingRef.current = false;
      setDeployOrigin('direct');
      setAwaitingDeploy(true);
    } catch (err) {
      setDeployState('idle');
      toast.error(err instanceof Error ? err.message : t(locale, 'editor.deployFailed'));
    }
  }, [selectedPath, fileDetail, hasUnsavedChanges, editorContent, deployId, updateFile, locale, queryClient]);


  // ── 모듈 → 코드에 적용 (공통 로직) ──
  const applyModuleChanges = useCallback(async (options?: { deploy?: boolean }) => {
    if (!moduleState || !moduleSchema) return;
    dispatchDialog({ type: 'START', mode: 'apply-only' });

    try {
      // Step 1: 코드 생성
      const generatedFiles = generateFiles(moduleState, fileCache, templateSlug ?? undefined);

      // 실제 변경된 파일만 필터링 (동일 내용 제외)
      const changedFiles = generatedFiles.filter(
        (gf) => fileCache[gf.path] !== gf.content
      );

      let totalAdded = 0;
      let totalRemoved = 0;
      for (const gf of changedFiles) {
        const stats = computeDiffStats(fileCache[gf.path], gf.content);
        totalAdded += stats.added;
        totalRemoved += stats.removed;
      }

      // 로컬 캐시 + 에디터 즉시 반영 (커밋 여부와 무관)
      for (const gf of generatedFiles) {
        setFileCache((prev) => ({ ...prev, [gf.path]: gf.content }));
        if (gf.path === selectedPath) {
          setEditorContent(gf.content);
        }
      }

      dispatchDialog({ type: 'ADVANCE_STEP', stepId: 'generate' });

      // Step 2: GitHub 커밋 (변경된 파일이 있을 때만)
      if (changedFiles.length > 0) {
        const filesToSave = changedFiles.map((gf) => ({
          path: gf.path,
          content: gf.content,
        }));

        try {
          await batchApply.mutateAsync({
            deployId,
            files: filesToSave,
          });
        } catch (err) {
          if (err instanceof Error && (err.message.includes('409') || err.message.includes('conflict'))) {
            queryClient.invalidateQueries({ queryKey: queryKeys.oneclick.files(deployId) });
            throw new Error('파일 충돌이 발생했습니다. 잠시 후 다시 시도해주세요.');
          }
          throw err;
        }
      } else if (!options?.deploy) {
        // 변경 없고 배포도 아님 → 알림
        toast.info('변경된 내용이 없습니다');
      }

      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());

      dispatchDialog({
        type: 'COMPLETE',
        diffStats: { fileCount: changedFiles.length, added: totalAdded, removed: totalRemoved },
      });

      // 저장 완료 → 미리보기는 항상 즉시 반영 (modulePreviewHtml이 moduleState 기반)
      setShowLiveAfterDeploy(false);

      if (options?.deploy) {
        // 변경 파일이 없어도 배포 트리거 (이전 저장 코드로 재빌드)
        if (changedFiles.length === 0) {
          // 이미 커밋된 코드로 GitHub Pages 재빌드 트리거
          try {
            await fetch(`/api/oneclick/deployments/${deployId}/redeploy`, { method: 'POST' });
          } catch {
            // 재배포 API 실패 시 fallback: 빈 커밋으로라도 Actions 트리거
            await batchApply.mutateAsync({
              deployId,
              files: generatedFiles.map((gf) => ({ path: gf.path, content: gf.content })),
            });
          }
        }
        // 배포 추적 시작
        queryClient.removeQueries({ queryKey: queryKeys.oneclick.status(deployId) });
        deployStartedAtRef.current = Date.now();
        seenBuildingRef.current = false;
        setDeployState('deploying');
        setDeployOrigin('module-deploy');
        setAwaitingDeploy(true);
      }
    } catch (err) {
      dispatchDialog({
        type: 'ERROR',
        message: err instanceof Error ? err.message : t(locale, 'editor.applyFailed'),
      });
    }
  }, [moduleState, moduleSchema, selectedPath, batchApply, deployId, liveUrl, fileCache, templateSlug, locale, queryClient]);

  // ── 모듈 → 코드에 적용 (다이얼로그 통합) ──
  const handleApplyModulesToCode = useCallback(async () => {
    await applyModuleChanges();
  }, [applyModuleChanges]);

  // ── 모듈 → 코드 적용 + 배포 (다이얼로그 통합) ──
  const handleApplyModulesAndDeploy = useCallback(async () => {
    await applyModuleChanges({ deploy: true });
  }, [applyModuleChanges]);

  // ── 배포 리트라이 (상태 초기화 포함) ──
  const handleRetryDeploy = useCallback(() => {
    setAwaitingDeploy(false);
    setDeployOrigin(null);
    pendingDiffStatsRef.current = null;
    seenBuildingRef.current = false;
    handleApplyModulesAndDeploy();
  }, [handleApplyModulesAndDeploy]);

  // ── 빌드 진행 서브 라벨 (module-deploy 다이얼로그용) ──
  const buildSubLabel = useMemo(() => {
    if (!awaitingDeploy || !deployStatusData) return undefined;
    const ps = deployStatusData.pages_status;
    if (ps === 'enabling') return 'GitHub Pages 설정 중...';
    if (ps === 'building' || deployStatusData.deploy_status === 'building') return 'GitHub Actions 빌드 중...';
    return undefined;
  }, [awaitingDeploy, deployStatusData]);

  const actionsUrl = deploy?.forked_repo_url ? `${deploy.forked_repo_url}/actions` : null;

  // Ctrl+S 단축키
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges) handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [hasUnsavedChanges, handleSave]);

  // 페이지 이탈 경고
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  const isLivePreviewable = isHtmlFile(selectedPath) || isCssFile(selectedPath);
  const isDeploying = deployState === 'saving' || deployState === 'deploying' || awaitingDeploy;

  // GitHub Actions 빌드 상태 라벨
  const buildStatusLabel = useMemo(() => {
    if (!awaitingDeploy || !deployStatusData) return null;
    const ds = deployStatusData.deploy_status;
    const ps = deployStatusData.pages_status;
    if (ps === 'enabling') return 'Pages 설정 중...';
    if (ds === 'building' || ps === 'building') return 'Actions 빌드 중...';
    if (ds === 'creating') return '저장소 준비 중...';
    if (ds === 'pending') return '빌드 대기 중...';
    return '배포 진행 중...';
  }, [awaitingDeploy, deployStatusData]);

  // 배포 버튼 라벨
  const deployButtonContent = (() => {
    switch (deployState) {
      case 'saving':
        return (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="hidden sm:inline ml-1">{t(locale, 'editor.stateSaving')}</span>
          </>
        );
      case 'deploying':
        return (
          <>
            <span className="relative">
              <Github className="h-3.5 w-3.5 animate-github-wiggle" />
              <span className="absolute -top-0.5 -right-0.5 h-1 w-1 rounded-full bg-amber-400 animate-pulse" />
            </span>
            <span className="hidden sm:inline ml-1">{buildStatusLabel || t(locale, 'editor.stateDeploying')}</span>
          </>
        );
      case 'deployed':
        return (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline ml-1">{t(locale, 'editor.stateDone')}</span>
          </>
        );
      default:
        return (
          <>
            <Rocket className="h-3.5 w-3.5" />
            <span className="hidden sm:inline ml-1">{t(locale, 'editor.stateDeploy')}</span>
          </>
        );
    }
  })();

  // 빌드 진행 배너 (미리보기 하단에 표시 — 미리보기 콘텐츠는 가리지 않음)
  const renderBuildOverlay = () => {
    if (!awaitingDeploy) return null;
    return (
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm border-t px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="relative shrink-0">
            <Github className="h-5 w-5 text-primary animate-github-wiggle" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
              {buildStatusLabel || '배포 진행 중...'}
              <span className="flex gap-[2px]">
                <span className="h-[3px] w-[3px] rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-[3px] w-[3px] rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-[3px] w-[3px] rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              미리보기는 저장된 내용을 표시 중 · 배포 완료 시 실제 사이트에 반영
            </p>
          </div>
        </div>
      </div>
    );
  };

  // 미리보기 렌더링 (데스크탑/모바일 공용)
  // 부모가 block(h-full) 또는 명시적 높이 컨테이너이므로 h-full 사용 (flex-1은 flex 부모 필요)
  const renderPreview = () => {
    // 모듈 편집 중 또는 저장 후: 실시간 HTML 미리보기 (배포 전이므로 라이브 URL보다 우선)
    if ((rightPanel === 'modules' || !showLiveAfterDeploy) && modulePreviewHtml) {
      return (
        <iframe
          srcDoc={modulePreviewHtml}
          title="실시간 미리보기"
          className="h-full w-full bg-white border-0"
          sandbox="allow-scripts"
        />
      );
    }
    if (showLiveAfterDeploy && liveUrl) {
      return (
        <iframe
          ref={liveIframeRef}
          key={`live-${livePreviewKey}`}
          src={`${liveUrl}?_t=${livePreviewKey}`}
          title="사이트 미리보기"
          className="h-full w-full bg-white border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }
    if (isLivePreviewable) {
      return (
        <iframe
          ref={previewRef}
          title="미리보기"
          className="h-full w-full bg-white border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }
    if (liveUrl) {
      return (
        <iframe
          ref={liveIframeRef}
          key={`fallback-${livePreviewKey}`}
          src={`${liveUrl}?_t=${livePreviewKey}`}
          title="사이트 미리보기"
          className="h-full w-full bg-white border-0"
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
        {t(locale, 'editor.cannotPreview')}
      </div>
    );
  };

  // 라인 넘버 계산
  const lineCount = useMemo(() => {
    return editorContent.split('\n').length;
  }, [editorContent]);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const lineNumberRef = useRef<HTMLDivElement>(null);

  // 에디터 스크롤 동기화
  const handleEditorScroll = useCallback(() => {
    if (editorRef.current && lineNumberRef.current) {
      lineNumberRef.current.scrollTop = editorRef.current.scrollTop;
    }
  }, []);

  // 에디터 렌더링 (데스크탑/모바일 공용)
  const renderEditor = () => {
    if (contentLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (selectedPath) {
      return (
        <div className="flex-1 flex overflow-hidden">
          {/* 라인 넘버 거터 */}
          <div
            ref={lineNumberRef}
            className="flex-shrink-0 overflow-hidden select-none bg-muted/30 border-r text-right py-3 sm:py-4"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div
                key={i}
                className="px-3 text-xs leading-[1.625rem] text-muted-foreground/50 font-mono"
              >
                {i + 1}
              </div>
            ))}
          </div>
          {/* 코드 에디터 */}
          <textarea
            ref={editorRef}
            value={editorContent}
            onChange={(e) => handleContentChange(e.target.value)}
            onScroll={handleEditorScroll}
            className="flex-1 w-full py-3 sm:py-4 px-3 sm:px-4 font-mono text-xs sm:text-sm bg-background resize-none focus:outline-none border-0 leading-[1.625rem]"
            spellCheck={false}
          />
        </div>
      );
    }
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        {t(locale, 'editor.loadingFiles')}
      </div>
    );
  };

  // 파일 트리 빌드
  const fileTree = useMemo(() => {
    if (!files || files.length === 0) return [];
    return buildFileTree(files);
  }, [files]);

  // 디렉토리 접기/펼치기 상태 (src/app, src/components 등 기본 펼침)
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['src', 'src/app', 'src/components', 'src/lib']));

  const toggleDir = useCallback((dirPath: string) => {
    setExpandedDirs((prev) => {
      const next = new Set(prev);
      if (next.has(dirPath)) next.delete(dirPath);
      else next.add(dirPath);
      return next;
    });
  }, []);

  // 트리 노드 렌더링 (재귀)
  const renderTreeNode = useCallback((node: FileTreeNode, depth: number) => {
    if (node.type === 'dir') {
      const isExpanded = expandedDirs.has(node.path);
      return (
        <div key={node.path}>
          <button
            onClick={() => toggleDir(node.path)}
            className="w-full text-left py-1 text-[13px] flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            <Folder className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate">{node.name}</span>
          </button>
          {isExpanded && node.children?.map((child) => renderTreeNode(child, depth + 1))}
        </div>
      );
    }

    const Icon = getFileIcon(node.path);
    const isSelected = selectedPath === node.path;
    const isModified = isSelected && hasUnsavedChanges;

    return (
      <button
        key={node.path}
        onClick={() => handleTabSwitch(node.path)}
        className={`w-full text-left py-1.5 text-[13px] flex items-center gap-2 rounded-md transition-colors ${
          isSelected
            ? 'bg-accent font-semibold text-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${getFileColor(node.path)}`} />
        <span className="truncate flex-1">{node.name}</span>
        {isModified && (
          <Circle className="h-2 w-2 shrink-0 fill-amber-400 text-amber-400 mr-1" />
        )}
      </button>
    );
  }, [selectedPath, hasUnsavedChanges, expandedDirs, toggleDir, handleTabSwitch]);

  // 파일 리스트 렌더링 (사이드바/오버레이 공용)
  const renderFileList = () => {
    if (filesLoading) {
      return (
        <div className="p-3 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-7 w-full rounded-md" />
          ))}
        </div>
      );
    }
    if (fileTree.length > 0) {
      return (
        <div className="py-1.5 px-1">
          {fileTree.map((node) => renderTreeNode(node, 0))}
        </div>
      );
    }
    return (
      <div className="p-4 text-sm text-muted-foreground text-center">
        {t(locale, 'editor.noFiles')}
      </div>
    );
  };

  const selectedFileName = selectedPath?.split('/').pop() || '';

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* ===== 툴바 ===== */}
      <div className="border-b px-4 sm:px-5 h-12 flex items-center justify-between bg-background/95 backdrop-blur-sm gap-3 shrink-0">
        {/* 좌측: 뒤로가기 + 사이트 정보 */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button variant="ghost" size="sm" className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground" asChild>
            <Link href="/my-sites" prefetch={false}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">{t(locale, 'editor.backToSites')}</span>
            </Link>
          </Button>
          <div className="h-5 w-px bg-border hidden sm:block" />
          {deploy && (
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold truncate max-w-[140px] sm:max-w-[220px]">
                  {deploy.site_name}
                </span>
                <Circle className={`h-2 w-2 shrink-0 ${hasUnsavedChanges ? 'fill-amber-400 text-amber-400' : 'fill-green-400 text-green-400'}`} />
              </div>
              {liveUrl && (
                <p className="text-[10px] text-muted-foreground truncate max-w-[200px] hidden sm:block">
                  {liveUrl.replace('https://', '')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 우측: 액션 버튼 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 모바일: 파일 목록 토글 */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => setShowMobileFiles(!showMobileFiles)}
          >
            <FolderOpen className="h-3.5 w-3.5" />
          </Button>

          {/* 데스크탑: 코드/모듈 세그먼트 토글 (미리보기는 항상 동반) */}
          <div className="hidden md:flex items-center border rounded-lg p-0.5 bg-muted/50 h-8">
            <button
              onClick={() => setRightPanel(rightPanel === 'preview' ? null : 'preview')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                rightPanel === 'preview' || (rightPanel && rightPanel !== 'modules')
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              코드
            </button>
            {moduleSchema && (
              <button
                onClick={() => setRightPanel(rightPanel === 'modules' ? 'preview' : 'modules')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  rightPanel === 'modules'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Blocks className="h-3.5 w-3.5" />
                모듈
              </button>
            )}
          </div>

          {/* 사이트 열기 */}
          {liveUrl && (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <a href={liveUrl} target="_blank" rel="noopener noreferrer" title={t(locale, 'editor.openNewTab')}>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}

          {/* GitHub 레포 */}
          {deploy?.forked_repo_url && (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <a href={deploy.forked_repo_url} target="_blank" rel="noopener noreferrer" title={t(locale, 'mySites.githubRepo')}>
                <Github className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}

          {/* 저장 */}
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || updateFile.isPending || isDeploying}
            title={t(locale, 'editor.save')}
          >
            {updateFile.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline text-xs">
              {t(locale, 'editor.save')}
            </span>
            <kbd className="hidden lg:inline-flex h-5 items-center rounded border bg-muted px-1 text-[10px] text-muted-foreground ml-1">
              {navigator?.platform?.includes('Mac') ? '⌘S' : 'Ctrl+S'}
            </kbd>
          </Button>

          {/* 배포 */}
          <Button
            size="sm"
            className={`h-8 px-3 sm:px-4 gap-1.5 font-medium ${
              deployState === 'deployed'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
            onClick={handleDeploy}
            disabled={isDeploying || (!hasUnsavedChanges && deployState === 'idle' && !lastSavedAt)}
          >
            {deployButtonContent}
          </Button>
        </div>
      </div>

      {/* ===== 모바일 코드/미리보기/모듈 탭 전환 ===== */}
      <div className="md:hidden border-b flex bg-muted/30">
        <button
          onClick={() => setMobileTab('code')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
            mobileTab === 'code'
              ? 'text-foreground border-b-2 border-primary bg-background'
              : 'text-muted-foreground'
          }`}
        >
          <Code className="h-3 w-3" />
          {t(locale, 'editor.code')}
          {selectedFileName && (
            <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">
              ({selectedFileName})
            </span>
          )}
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
            mobileTab === 'preview'
              ? 'text-foreground border-b-2 border-primary bg-background'
              : 'text-muted-foreground'
          }`}
        >
          <Eye className="h-3 w-3" />
          {t(locale, 'editor.preview')}
          {awaitingDeploy ? (
            <Github className="h-3 w-3 text-amber-500 animate-github-wiggle" />
          ) : showLiveAfterDeploy ? (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          ) : null}
        </button>
        {moduleSchema && (
          <button
            onClick={() => setMobileTab('modules')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              mobileTab === 'modules'
                ? 'text-foreground border-b-2 border-primary bg-background'
                : 'text-muted-foreground'
            }`}
          >
            <Blocks className="h-3 w-3" />
            모듈
          </button>
        )}
      </div>

      {/* ===== 메인 영역 ===== */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 모바일 파일 오버레이 */}
        {showMobileFiles && (
          <div className="absolute inset-0 z-30 md:hidden flex">
            <div className="w-72 bg-background border-r overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between px-3 py-2.5 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t(locale, 'editor.files')}
                  </span>
                  {files && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {files.length}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShowMobileFiles(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {renderFileList()}
            </div>
            <div
              className="flex-1 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowMobileFiles(false)}
            />
          </div>
        )}

        {/* 데스크탑 파일 사이드바 (접기/펼치기) */}
        <div className={`hidden md:flex md:flex-col border-r bg-muted/20 flex-shrink-0 transition-[width] duration-200 ${showFileSidebar ? 'w-56 lg:w-60' : 'w-10'}`}>
          <div className="px-2.5 py-2 border-b flex items-center justify-between gap-1 h-9">
            {showFileSidebar ? (
              <>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                  {t(locale, 'editor.files')}
                </span>
                <div className="flex items-center gap-1">
                  {files && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {files.length}
                    </Badge>
                  )}
                  <button
                    onClick={() => setShowFileSidebar(false)}
                    className="h-5 w-5 flex items-center justify-center rounded hover:bg-muted transition-colors"
                    title="파일 목록 접기"
                  >
                    <ChevronRight className="h-3 w-3 rotate-180" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowFileSidebar(true)}
                className="h-5 w-5 mx-auto flex items-center justify-center rounded hover:bg-muted transition-colors"
                title="파일 목록 펼치기"
              >
                <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
          {showFileSidebar && (
            <div className="flex-1 overflow-y-auto">
              {renderFileList()}
            </div>
          )}
        </div>

        {/* ===== 데스크탑: 에디터/모듈 + 미리보기 나란히 분할 ===== */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          {/* 좌측: 모듈 패널 (모듈 모드) OR 코드 에디터 */}
          {rightPanel === 'modules' && moduleSchema && moduleState ? (
            <div className="w-[420px] flex-shrink-0 flex flex-col overflow-hidden border-r bg-background">
              <ModulePanel
                schema={moduleSchema}
                state={moduleState}
                onStateChange={setModuleState}
                onSaveOnly={handleApplyModulesToCode}
                onSaveAndDeploy={handleApplyModulesAndDeploy}
                isApplying={isApplyingModules}
                isDeploying={isDeployingModules || isDeploying}
                locale={locale}
                deployId={deployId}
                onImagePreview={handleImagePreview}
              />
            </div>
          ) : (
          <div className={`flex flex-col overflow-hidden ${rightPanel ? 'w-1/2 min-w-[400px] border-r' : 'w-full'}`}>
            <div className="border-b px-3.5 py-1.5 flex items-center gap-2 bg-muted/30 text-xs text-muted-foreground flex-shrink-0 h-9">
              <Code className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span className="truncate font-semibold text-foreground/80">{selectedFileName || ''}</span>
              {(() => {
                const langBadge = getLanguageBadge(selectedPath);
                if (!langBadge) return null;
                return (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${langBadge.color}`}>
                    {langBadge.label}
                  </span>
                );
              })()}
              {hasUnsavedChanges && (
                <Circle className="h-1.5 w-1.5 fill-amber-400 text-amber-400 ml-1" />
              )}
            </div>
            {renderEditor()}
          </div>
          )}

          {/* 우측: 미리보기 (모듈/코드 모드 모두에서 항상 표시) */}
          {rightPanel && (
            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* 미리보기 헤더 */}
              <div className="border-b px-3.5 py-1.5 flex items-center gap-2 bg-muted/30 text-xs text-muted-foreground flex-shrink-0 h-9">
                <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="font-semibold text-foreground/80">{t(locale, 'editor.preview')}</span>
                {awaitingDeploy ? (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1 bg-amber-500/20 text-amber-500">
                    <Github className="h-2.5 w-2.5 animate-github-wiggle" />
                    배포 중
                  </Badge>
                ) : showLiveAfterDeploy ? (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-green-600">
                    {t(locale, 'editor.deployedBadge')}
                  </Badge>
                ) : modulePreviewHtml ? (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                    <Eye className="h-2.5 w-2.5" />
                    실시간 미리보기
                  </Badge>
                ) : isLivePreviewable ? (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    LIVE
                  </Badge>
                ) : null}
                {/* 반응형 뷰포트 토글 */}
                <div className="flex items-center gap-0.5 ml-auto border rounded-full p-0.5 bg-muted/50">
                  {([
                    { key: 'mobile' as PreviewViewport, icon: Smartphone, label: '375px' },
                    { key: 'tablet' as PreviewViewport, icon: Tablet, label: '768px' },
                    { key: 'desktop' as PreviewViewport, icon: Monitor, label: 'Full' },
                  ]).map(({ key, icon: VpIcon, label }) => (
                    <button
                      key={key}
                      onClick={() => setPreviewViewport(key)}
                      className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
                        previewViewport === key
                          ? 'bg-background text-foreground shadow-sm font-medium'
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                      title={label}
                    >
                      <VpIcon className="h-3 w-3" />
                      {previewViewport === key && (
                        <span className="text-[10px]">{label}</span>
                      )}
                    </button>
                  ))}
                </div>
                {/* 새로고침 */}
                <button
                  onClick={() => {
                    setLivePreviewKey((k) => k + 1);
                    if (previewRef.current && previewHtml) {
                      const doc = previewRef.current.contentDocument;
                      if (doc) { doc.open(); doc.write(previewHtml); doc.close(); }
                    }
                  }}
                  className="p-1 rounded-md hover:bg-muted transition-colors"
                  title={t(locale, 'editor.refresh')}
                >
                  <RotateCw className="h-3 w-3" />
                </button>
                {/* 새 탭에서 열기 */}
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                    title={t(locale, 'editor.openNewTab')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              {/* 미리보기 본문 */}
              <div className={`flex-1 overflow-auto relative ${previewViewport !== 'desktop' ? 'bg-muted/30 flex justify-center items-start p-4' : ''}`}>
                {renderBuildOverlay()}
                <div
                  className={previewViewport !== 'desktop'
                    ? 'bg-white shadow-2xl rounded-lg overflow-hidden ring-1 ring-border/40'
                    : 'h-full'
                  }
                  style={previewViewport !== 'desktop' ? {
                    width: VIEWPORT_SIZES[previewViewport].width,
                    height: VIEWPORT_SIZES[previewViewport].height,
                    maxHeight: 'calc(100vh - 10rem)',
                  } : undefined}
                >
                  {renderPreview()}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ===== 모바일: 탭 전환 방식 ===== */}
        <div className="flex md:hidden flex-1 flex-col overflow-hidden">
          {/* 코드 탭 */}
          {mobileTab === 'code' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              {renderEditor()}
            </div>
          )}

          {/* 미리보기 탭 */}
          {mobileTab === 'preview' && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="px-3 py-1.5 flex items-center gap-2 bg-muted/20 text-xs text-muted-foreground border-b flex-shrink-0">
                <Eye className="h-3 w-3" />
                <span>{t(locale, 'editor.preview')}</span>
                {awaitingDeploy ? (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 gap-1 ml-auto bg-amber-500/20 text-amber-500">
                    <Github className="h-2.5 w-2.5 animate-github-wiggle" />
                    {buildStatusLabel || '빌드 중...'}
                  </Badge>
                ) : showLiveAfterDeploy ? (
                  <Badge variant="default" className="text-[10px] px-1 py-0 ml-auto bg-green-600">
                    {t(locale, 'editor.deployedBadge')}
                  </Badge>
                ) : isLivePreviewable ? (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 ml-auto">
                    LIVE
                  </Badge>
                ) : null}
              </div>
              <div className="flex-1 overflow-hidden relative">
                {renderBuildOverlay()}
                {renderPreview()}
              </div>
            </div>
          )}

          {/* 모듈 탭 */}
          {mobileTab === 'modules' && moduleSchema && moduleState && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <ModulePanel
                schema={moduleSchema}
                state={moduleState}
                onStateChange={setModuleState}
                onSaveOnly={handleApplyModulesToCode}
                onSaveAndDeploy={handleApplyModulesAndDeploy}
                isApplying={isApplyingModules}
                isDeploying={isDeployingModules || isDeploying}
                locale={locale}
                deployId={deployId}
                onImagePreview={handleImagePreview}
              />
            </div>
          )}
        </div>
      </div>

      {/* ===== 상태 바 ===== */}
      <div className="border-t px-4 sm:px-5 h-7 flex items-center justify-between text-[11px] text-muted-foreground bg-muted/20 gap-4 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono truncate">{selectedFileName}</span>
          {(() => {
            const langBadge = getLanguageBadge(selectedPath);
            if (!langBadge) return null;
            return (
              <span className={`text-[9px] px-1 py-0 rounded font-mono ${langBadge.color}`}>
                {langBadge.label}
              </span>
            );
          })()}
          {lineCount > 0 && (
            <span className="text-muted-foreground/40 font-mono">{lineCount}L</span>
          )}
        </div>
        {awaitingDeploy ? (
          <span className="hidden sm:flex items-center gap-1.5 text-amber-500">
            <Github className="h-3 w-3 animate-github-wiggle" />
            {buildStatusLabel || '배포 진행 중...'}
          </span>
        ) : (
          <span className="text-muted-foreground/40 hidden sm:inline">
            {t(locale, 'editor.statusBarHint')}
          </span>
        )}
        <div className="flex items-center gap-2 shrink-0">
          {lastSavedAt ? (
            <span>
              {t(locale, 'editor.lastSavedAt')}
              {formatRelativeTime(lastSavedAt, locale)}
            </span>
          ) : (
            <span className="text-muted-foreground/40">
              {t(locale, 'editor.notSavedYet')}
            </span>
          )}
        </div>
      </div>

      {/* ===== 미저장 변경 경고 다이얼로그 ===== */}
      <AlertDialog open={!!pendingTabPath} onOpenChange={(open) => { if (!open) setPendingTabPath(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t(locale, 'editor.unsavedChanges')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(locale, 'editor.unsavedWillLost')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t(locale, 'common.cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmTabSwitch}>
              {t(locale, 'editor.leave')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== 초안 복원 다이얼로그 ===== */}
      <AlertDialog open={showDraftRestore} onOpenChange={(open) => { if (!open) setShowDraftRestore(false); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이전 편집 초안이 있습니다</AlertDialogTitle>
            <AlertDialogDescription>
              저장하지 않은 편집 내용이 남아있습니다. 복원하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDraftRestore(false);
              pendingDraftRef.current = null;
              deleteDraft.mutate(deployId);
            }}>
              삭제
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (pendingDraftRef.current) {
                setModuleState(pendingDraftRef.current);
                setRightPanel('modules');
              }
              setShowDraftRestore(false);
              pendingDraftRef.current = null;
              deleteDraft.mutate(deployId);
            }}>
              복원
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== 모듈 배포 진행 다이얼로그 ===== */}
      <ModuleDeployDialog
        state={dialogState}
        dispatch={dispatchDialog}
        locale={locale}
        liveUrl={liveUrl}
        onRetry={
          dialogState.mode === 'apply-only'
            ? handleApplyModulesToCode
            : handleRetryDeploy
        }
        buildSubLabel={buildSubLabel}
        actionsUrl={actionsUrl}
      />

    </div>
  );
}
