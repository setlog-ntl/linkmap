'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
  RefreshCw,
  FolderOpen,
  X,
  Smartphone,
  Tablet,
  Monitor,
  Circle,
  RotateCw,
  ChevronRight,
  Folder,
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
} from '@/lib/queries/oneclick';
import { toast } from 'sonner';
import Link from 'next/link';
import { ChatTerminal, type CodeBlock } from './chat-terminal';
import { ModulePanel } from './module-panel';
import { getModuleSchema } from '@/data/oneclick/module-schemas';
import type { ModuleConfigState } from '@/lib/module-schema';
import {
  generateFiles,
  buildInitialState,
  parseConfigToState,
  parsePageToEnabledModules,
} from '@/lib/oneclick/code-generator';

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

function formatRelativeTime(date: Date, locale: string): string {
  const diff = Date.now() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return locale === 'ko' ? '방금 전' : 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return locale === 'ko' ? `${minutes}분 전` : `${minutes}m ago`;
  return date.toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
}

type DeployState = 'idle' | 'saving' | 'deploying' | 'deployed';
type MobileTab = 'code' | 'preview';
type PreviewViewport = 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_SIZES: Record<PreviewViewport, { width: string; label: string }> = {
  mobile: { width: '375px', label: '375px' },
  tablet: { width: '768px', label: '768px' },
  desktop: { width: '100%', label: 'Full' },
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
  const [showPreview, setShowPreview] = useState(true);
  const [deployState, setDeployState] = useState<DeployState>('idle');
  const [livePreviewKey, setLivePreviewKey] = useState(0);
  const [showLiveAfterDeploy, setShowLiveAfterDeploy] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('code');
  const [showMobileFiles, setShowMobileFiles] = useState(false);
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
  const [isApplyingModules, setIsApplyingModules] = useState(false);

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
    const configContent = fileCache['src/lib/config.ts'];
    const pageContent = fileCache['src/app/page.tsx'];
    if (configContent) {
      const parsed = parseConfigToState(configContent, moduleSchema);
      if (pageContent) {
        const { enabled, order } = parsePageToEnabledModules(pageContent);
        if (enabled.length > 0) {
          parsed.enabled = enabled;
          parsed.order = order;
        }
      }
      setModuleState(parsed);
      setModuleInitialized(true);
    } else if (files && files.length > 0) {
      // config.ts 아직 캐시에 없으면 기본값으로 초기화
      setModuleState(buildInitialState(moduleSchema));
      setModuleInitialized(true);
    }
  }, [moduleSchema, moduleInitialized, fileCache, files]);

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
  }, [previewHtml, selectedPath, showPreview, mobileTab]);

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
      toast.error(err instanceof Error ? err.message : '저장 실패');
    }
  }, [selectedPath, fileDetail, editorContent, deployId, updateFile, locale]);

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
      toast.info(
        locale === 'ko'
          ? 'GitHub Pages 배포 중... 약 30초 소요됩니다.'
          : 'Deploying to GitHub Pages... ~30 seconds.'
      );

      if (liveUrl) {
        let attempts = 0;
        const maxAttempts = 12;
        const checkInterval = 5000;

        await new Promise<void>((resolve) => {
          const poll = setInterval(async () => {
            attempts++;
            try {
              await fetch(`${liveUrl}?_t=${Date.now()}`, {
                method: 'HEAD',
                mode: 'no-cors',
              });
              if (attempts >= 6) {
                clearInterval(poll);
                resolve();
              }
            } catch {
              // ignore
            }
            if (attempts >= maxAttempts) {
              clearInterval(poll);
              resolve();
            }
          }, checkInterval);
        });
      } else {
        await new Promise((r) => setTimeout(r, 30000));
      }

      setDeployState('deployed');
      setLivePreviewKey((k) => k + 1);
      setShowLiveAfterDeploy(true);

      toast.success(
        locale === 'ko'
          ? '배포 완료! 사이트에 변경사항이 반영되었습니다.'
          : 'Deployed! Changes are now live.'
      );

      setTimeout(() => setDeployState('idle'), 3000);
    } catch (err) {
      setDeployState('idle');
      toast.error(err instanceof Error ? err.message : '배포 실패');
    }
  }, [selectedPath, fileDetail, hasUnsavedChanges, editorContent, deployId, updateFile, locale, liveUrl]);

  // 파일 경로 목록 + SHA 맵 (ChatTerminal에 전달)
  const allFilePaths = useMemo(() => {
    return files?.map((f) => f.path) || [];
  }, [files]);

  const filesShaMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (files) {
      for (const f of files) {
        map[f.path] = f.sha;
      }
    }
    return map;
  }, [files]);

  // AI 코드 적용 + 자동 배포 (원자적 단일 커밋)
  const handleApplyFiles = useCallback(async (blocks: CodeBlock[]) => {
    try {
      setDeployState('saving');

      // 1. 모든 파일을 단일 원자적 커밋으로 저장
      const filesToSave = blocks.map((block) => ({
        path: block.filePath,
        content: block.code,
        sha: block.isNew ? undefined : filesShaMap[block.filePath],
      }));

      const result = await batchApply.mutateAsync({
        deployId,
        files: filesToSave,
      });

      // 현재 편집 중인 파일이 포함되어 있으면 에디터 갱신
      for (const block of blocks) {
        if (block.filePath === selectedPath) {
          setEditorContent(block.code);
          setHasUnsavedChanges(false);
        }
      }

      toast.success(
        locale === 'ko'
          ? `${result.file_count}개 파일 저장 완료 (단일 커밋)`
          : `${result.file_count} file(s) saved (single commit)`
      );

      // 2. 자동 배포 트리거
      setDeployState('deploying');
      toast.info(
        locale === 'ko'
          ? 'GitHub Pages 배포 중... 약 30초 소요됩니다.'
          : 'Deploying to GitHub Pages... ~30 seconds.'
      );

      if (liveUrl) {
        let attempts = 0;
        const maxAttempts = 12;
        const checkInterval = 5000;

        await new Promise<void>((resolve) => {
          const poll = setInterval(async () => {
            attempts++;
            try {
              await fetch(`${liveUrl}?_t=${Date.now()}`, {
                method: 'HEAD',
                mode: 'no-cors',
              });
              if (attempts >= 6) {
                clearInterval(poll);
                resolve();
              }
            } catch {
              // ignore
            }
            if (attempts >= maxAttempts) {
              clearInterval(poll);
              resolve();
            }
          }, checkInterval);
        });
      } else {
        await new Promise((r) => setTimeout(r, 30000));
      }

      setDeployState('deployed');
      setLivePreviewKey((k) => k + 1);
      setShowLiveAfterDeploy(true);

      toast.success(
        locale === 'ko'
          ? '배포 완료! 사이트에 변경사항이 반영되었습니다.'
          : 'Deployed! Changes are now live.'
      );

      setTimeout(() => setDeployState('idle'), 3000);
    } catch (err) {
      setDeployState('idle');
      toast.error(err instanceof Error ? err.message : '적용 실패');
    }
  }, [batchApply, deployId, selectedPath, fileDetail, filesShaMap, liveUrl, locale]);

  // ── 모듈 → 코드 적용 ──
  const handleApplyModules = useCallback(async () => {
    if (!moduleState || !moduleSchema) return;
    try {
      setIsApplyingModules(true);
      const generatedFiles = generateFiles(moduleState, fileCache);

      // 에디터 캐시 업데이트 (현재 열린 파일이면 에디터 내용도 갱신)
      for (const gf of generatedFiles) {
        setFileCache((prev) => ({ ...prev, [gf.path]: gf.content }));
        if (gf.path === selectedPath) {
          setEditorContent(gf.content);
          setHasUnsavedChanges(true);
        }
      }

      // Batch update로 GitHub 커밋
      const filesToSave = generatedFiles.map((gf) => ({
        path: gf.path,
        content: gf.content,
      }));

      const result = await batchApply.mutateAsync({
        deployId,
        files: filesToSave,
      });

      setHasUnsavedChanges(false);
      setLastSavedAt(new Date());

      toast.success(
        locale === 'ko'
          ? `${result.file_count}개 파일이 코드에 적용되었습니다`
          : `${result.file_count} file(s) applied to code`
      );

      // 자동 배포 트리거 (간소화)
      setDeployState('deploying');
      if (liveUrl) {
        let attempts = 0;
        await new Promise<void>((resolve) => {
          const poll = setInterval(async () => {
            attempts++;
            try {
              await fetch(`${liveUrl}?_t=${Date.now()}`, {
                method: 'HEAD',
                mode: 'no-cors',
              });
              if (attempts >= 6) { clearInterval(poll); resolve(); }
            } catch { /* ignore */ }
            if (attempts >= 12) { clearInterval(poll); resolve(); }
          }, 5000);
        });
      } else {
        await new Promise((r) => setTimeout(r, 30000));
      }

      setDeployState('deployed');
      setLivePreviewKey((k) => k + 1);
      setShowLiveAfterDeploy(true);
      toast.success(
        locale === 'ko'
          ? '배포 완료! 사이트에 반영되었습니다.'
          : 'Deployed! Changes are now live.'
      );
      setTimeout(() => setDeployState('idle'), 3000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '적용 실패');
    } finally {
      setIsApplyingModules(false);
    }
  }, [moduleState, moduleSchema, selectedPath, batchApply, deployId, liveUrl, locale, fileCache]);

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
  const isDeploying = deployState === 'saving' || deployState === 'deploying';

  // 배포 버튼 라벨
  const deployButtonContent = (() => {
    switch (deployState) {
      case 'saving':
        return (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="hidden sm:inline ml-1">{locale === 'ko' ? '저장 중...' : 'Saving...'}</span>
          </>
        );
      case 'deploying':
        return (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span className="hidden sm:inline ml-1">{locale === 'ko' ? '배포 중...' : 'Deploying...'}</span>
          </>
        );
      case 'deployed':
        return (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline ml-1">{locale === 'ko' ? '완료!' : 'Done!'}</span>
          </>
        );
      default:
        return (
          <>
            <Rocket className="h-3.5 w-3.5" />
            <span className="hidden sm:inline ml-1">{locale === 'ko' ? '배포' : 'Deploy'}</span>
          </>
        );
    }
  })();

  // 미리보기 렌더링 (데스크탑/모바일 공용)
  // 부모가 block(h-full) 또는 명시적 높이 컨테이너이므로 h-full 사용 (flex-1은 flex 부모 필요)
  const renderPreview = () => {
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
        {locale === 'ko' ? '미리보기할 수 없는 파일입니다' : 'Cannot preview this file'}
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
      <div className="border-b px-3 sm:px-4 h-14 flex items-center justify-between bg-background/95 backdrop-blur-sm gap-3">
        {/* 좌측: 뒤로가기 + 사이트 정보 */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button variant="ghost" size="sm" className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground" asChild>
            <Link href="/my-sites">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">{locale === 'ko' ? '내 사이트' : 'My Sites'}</span>
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

          {/* 데스크탑: 미리보기 토글 */}
          <Button
            variant={showPreview ? 'default' : 'outline'}
            size="sm"
            className="hidden md:inline-flex h-8"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            {locale === 'ko' ? '미리보기' : 'Preview'}
          </Button>

          {/* 사이트 열기 */}
          {liveUrl && (
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <a href={liveUrl} target="_blank" rel="noopener noreferrer" title={locale === 'ko' ? '새 탭에서 열기' : 'Open in new tab'}>
                <ExternalLink className="h-3.5 w-3.5" />
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
              {locale === 'ko' ? '저장' : 'Save'}
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

      {/* ===== 모바일 코드/미리보기 탭 전환 ===== */}
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
          {locale === 'ko' ? '코드' : 'Code'}
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
          {locale === 'ko' ? '미리보기' : 'Preview'}
          {showLiveAfterDeploy && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          )}
        </button>
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
                    {locale === 'ko' ? '파일' : 'Files'}
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

        {/* 데스크탑 파일 사이드바 */}
        <div className="hidden md:flex md:flex-col w-56 border-r bg-muted/20 flex-shrink-0">
          <div className="px-3 py-2.5 border-b flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {locale === 'ko' ? '파일' : 'Files'}
            </span>
            {files && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {files.length}
              </Badge>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {renderFileList()}
          </div>
        </div>

        {/* ===== 데스크탑: 에디터 + 미리보기 가로 분할 ===== */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          {/* 코드 에디터 */}
          <div className={`flex flex-col overflow-hidden ${showPreview ? 'w-1/2 border-r' : 'w-full'}`}>
            <div className="border-b px-3 py-1.5 flex items-center gap-2 bg-muted/20 text-xs text-muted-foreground flex-shrink-0 h-9">
              <Code className="h-3.5 w-3.5" />
              <span className="truncate font-medium">{selectedFileName || ''}</span>
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

          {/* 미리보기 */}
          {showPreview && (
            <div className="w-1/2 flex flex-col overflow-hidden">
              <div className="border-b px-3 py-1.5 flex items-center gap-2 bg-muted/20 text-xs text-muted-foreground flex-shrink-0 h-9">
                <Eye className="h-3.5 w-3.5" />
                <span className="font-medium">{locale === 'ko' ? '미리보기' : 'Preview'}</span>
                {showLiveAfterDeploy ? (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-green-600">
                    {locale === 'ko' ? '배포됨' : 'DEPLOYED'}
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
                  ]).map(({ key, icon: Icon, label }) => (
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
                      <Icon className="h-3 w-3" />
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
                  title={locale === 'ko' ? '새로고침' : 'Refresh'}
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
                    title={locale === 'ko' ? '새 탭에서 열기' : 'Open in new tab'}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              {/* 반응형 뷰포트 래퍼 */}
              <div className={`flex-1 overflow-auto ${previewViewport !== 'desktop' ? 'bg-muted/20 flex justify-center items-start py-6' : ''}`}>
                <div
                  className={previewViewport !== 'desktop'
                    ? 'bg-white shadow-xl rounded-xl overflow-hidden border-2 border-border/50'
                    : 'h-full'
                  }
                  style={previewViewport !== 'desktop' ? {
                    width: VIEWPORT_SIZES[previewViewport].width,
                    height: previewViewport === 'mobile' ? '667px' : '1024px',
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
                <span>{locale === 'ko' ? '미리보기' : 'Preview'}</span>
                {showLiveAfterDeploy ? (
                  <Badge variant="default" className="text-[10px] px-1 py-0 ml-auto bg-green-600">
                    {locale === 'ko' ? '배포됨' : 'DEPLOYED'}
                  </Badge>
                ) : isLivePreviewable ? (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 ml-auto">
                    LIVE
                  </Badge>
                ) : null}
              </div>
              <div className="flex-1 overflow-hidden">
                {renderPreview()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== 모듈 패널 ===== */}
      {moduleSchema && moduleState && (
        <ModulePanel
          schema={moduleSchema}
          state={moduleState}
          onStateChange={setModuleState}
          onApply={handleApplyModules}
          isApplying={isApplyingModules}
          locale={locale}
        />
      )}

      {/* ===== 상태 바 ===== */}
      <div className="border-t px-3 sm:px-4 h-8 flex items-center justify-between text-xs text-muted-foreground bg-muted/30 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-[11px] truncate">{selectedFileName}</span>
          {(() => {
            const langBadge = getLanguageBadge(selectedPath);
            if (!langBadge) return null;
            return (
              <span className={`text-[9px] px-1 py-0 rounded font-mono ${langBadge.color}`}>
                {langBadge.label}
              </span>
            );
          })()}
        </div>
        <span className="text-muted-foreground/50 hidden sm:inline text-[11px]">
          {locale === 'ko' ? 'Ctrl+S 저장 · 배포하여 게시' : 'Ctrl+S save · Deploy to publish'}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {lastSavedAt ? (
            <span className="text-[11px]">
              {locale === 'ko' ? '마지막 저장: ' : 'Last saved: '}
              {formatRelativeTime(lastSavedAt, locale)}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/40">
              {locale === 'ko' ? '저장 기록 없음' : 'Not saved yet'}
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
              {locale === 'ko' ? '저장하지 않은 변경사항이 사라집니다.' : 'Unsaved changes will be lost.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t(locale, 'common.cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmTabSwitch}>
              {locale === 'ko' ? '이동' : 'Leave'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== AI 코드 도우미 (플로팅 위젯) ===== */}
      <ChatTerminal
        fileContent={editorContent}
        filePath={selectedPath}
        allFiles={allFilePaths}
        onApplyCode={(code) => {
          handleContentChange(code);
        }}
        onApplyFiles={handleApplyFiles}
      />
    </div>
  );
}
