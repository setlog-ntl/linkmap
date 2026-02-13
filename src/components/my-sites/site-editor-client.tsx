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
  FileText,
  PanelRightClose,
  PanelRightOpen,
  Code,
  Eye,
} from 'lucide-react';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import {
  useDeployFiles,
  useFileContent,
  useUpdateFile,
  useMyDeployments,
} from '@/lib/queries/oneclick';
import { toast } from 'sonner';
import Link from 'next/link';

interface SiteEditorClientProps {
  deployId: string;
}

// HTML 파일인지 확인
function isHtmlFile(path: string | null): boolean {
  if (!path) return false;
  return path.toLowerCase().endsWith('.html') || path.toLowerCase().endsWith('.htm');
}

// CSS 파일인지 확인
function isCssFile(path: string | null): boolean {
  if (!path) return false;
  return path.toLowerCase().endsWith('.css');
}

export function SiteEditorClient({ deployId }: SiteEditorClientProps) {
  const { locale } = useLocaleStore();
  const { data: files, isLoading: filesLoading } = useDeployFiles(deployId);
  const { data: deployments } = useMyDeployments();
  const updateFile = useUpdateFile();

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const previewRef = useRef<HTMLIFrameElement>(null);

  // 모든 파일 내용을 캐시 (CSS 인라인 주입용)
  const [fileCache, setFileCache] = useState<Record<string, string>>({});

  const { data: fileDetail, isLoading: contentLoading } = useFileContent(
    deployId,
    selectedPath
  );

  const deploy = deployments?.find((d) => d.id === deployId);
  const liveUrl = deploy?.pages_url || deploy?.deployment_url;

  // Auto-select first file (index.html 우선)
  useEffect(() => {
    if (files && files.length > 0 && !selectedPath) {
      const indexFile = files.find((f) => f.name.toLowerCase() === 'index.html');
      setSelectedPath(indexFile ? indexFile.path : files[0].path);
    }
  }, [files, selectedPath]);

  // Sync file content to editor + cache
  useEffect(() => {
    if (fileDetail) {
      setEditorContent(fileDetail.content);
      setHasUnsavedChanges(false);
      setFileCache((prev) => ({ ...prev, [fileDetail.path]: fileDetail.content }));
    }
  }, [fileDetail]);

  // 현재 편집 중인 파일 내용을 캐시에 반영
  useEffect(() => {
    if (selectedPath) {
      setFileCache((prev) => ({ ...prev, [selectedPath]: editorContent }));
    }
  }, [editorContent, selectedPath]);

  // 미리보기용 HTML 조합: HTML 파일에 CSS를 인라인 주입
  const previewHtml = useMemo(() => {
    // 현재 HTML 파일 편집 중이면 해당 내용 사용
    const htmlPath = isHtmlFile(selectedPath)
      ? selectedPath
      : files?.find((f) => isHtmlFile(f.path))?.path || null;

    const htmlContent = htmlPath
      ? (htmlPath === selectedPath ? editorContent : (fileCache[htmlPath] || ''))
      : '';

    if (!htmlContent) return '';

    // CSS 파일 내용 수집
    const cssFiles = files?.filter((f) => isCssFile(f.path)) || [];
    const cssContents = cssFiles
      .map((f) => f.path === selectedPath ? editorContent : (fileCache[f.path] || ''))
      .filter(Boolean);

    if (cssContents.length === 0) return htmlContent;

    // <link rel="stylesheet"> 태그를 인라인 <style>로 교체
    const inlineStyle = `<style>\n${cssContents.join('\n')}\n</style>`;

    // </head> 앞에 삽입, 없으면 맨 앞에
    if (htmlContent.includes('</head>')) {
      return htmlContent.replace('</head>', `${inlineStyle}\n</head>`);
    }
    return inlineStyle + '\n' + htmlContent;
  }, [editorContent, selectedPath, files, fileCache]);

  // iframe에 미리보기 반영
  useEffect(() => {
    if (!showPreview || !previewRef.current) return;

    const isEditingHtmlOrCss = isHtmlFile(selectedPath) || isCssFile(selectedPath);

    if (isEditingHtmlOrCss && previewHtml) {
      const doc = previewRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(previewHtml);
        doc.close();
      }
    }
  }, [previewHtml, showPreview, selectedPath]);

  const handleContentChange = useCallback((value: string) => {
    setEditorContent(value);
    setHasUnsavedChanges(true);
  }, []);

  const handleTabSwitch = useCallback(
    (path: string) => {
      if (hasUnsavedChanges) {
        const msg = t(locale, 'editor.unsavedChanges');
        if (!window.confirm(msg)) return;
      }
      setSelectedPath(path);
      setHasUnsavedChanges(false);
    },
    [hasUnsavedChanges, locale]
  );

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

  // 현재 파일이 HTML/CSS인지에 따라 미리보기 모드 결정
  const isLivePreviewable = isHtmlFile(selectedPath) || isCssFile(selectedPath);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* 툴바 */}
      <div className="border-b px-4 py-2 flex items-center justify-between bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/my-sites">
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t(locale, 'editor.backToSites')}
            </Link>
          </Button>
          {deploy && (
            <span className="text-sm font-medium">{deploy.site_name}</span>
          )}
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="text-xs">
              {locale === 'ko' ? '미저장' : 'Unsaved'}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* 미리보기 토글 */}
          <Button
            variant={showPreview ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            title={showPreview
              ? (locale === 'ko' ? '미리보기 숨기기' : 'Hide Preview')
              : (locale === 'ko' ? '미리보기 보기' : 'Show Preview')
            }
          >
            {showPreview ? (
              <>
                <PanelRightClose className="mr-1 h-3 w-3" />
                {locale === 'ko' ? '미리보기' : 'Preview'}
              </>
            ) : (
              <>
                <PanelRightOpen className="mr-1 h-3 w-3" />
                {locale === 'ko' ? '미리보기' : 'Preview'}
              </>
            )}
          </Button>
          {liveUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3 w-3" />
                {locale === 'ko' ? '사이트 열기' : 'Open Site'}
              </a>
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasUnsavedChanges || updateFile.isPending}
          >
            {updateFile.isPending ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                {t(locale, 'editor.saving')}
              </>
            ) : (
              <>
                <Save className="mr-1 h-3 w-3" />
                {t(locale, 'editor.save')}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 메인 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 파일 사이드바 */}
        <div className="w-48 border-r bg-muted/30 overflow-y-auto flex-shrink-0">
          {filesLoading ? (
            <div className="p-3 space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : files && files.length > 0 ? (
            <div className="py-1">
              {files.map((file) => (
                <button
                  key={file.path}
                  onClick={() => handleTabSwitch(file.path)}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted transition-colors ${
                    selectedPath === file.path
                      ? 'bg-muted font-medium text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 text-sm text-muted-foreground">
              {t(locale, 'editor.noFiles')}
            </div>
          )}
        </div>

        {/* 코드 에디터 + 미리보기 분할 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 코드 에디터 */}
          <div className={`flex flex-col overflow-hidden ${showPreview ? 'w-1/2 border-r' : 'w-full'}`}>
            {/* 에디터 탭 헤더 */}
            <div className="border-b px-3 py-1.5 flex items-center gap-2 bg-muted/20 text-xs text-muted-foreground flex-shrink-0">
              <Code className="h-3 w-3" />
              <span>{selectedPath || ''}</span>
            </div>

            {contentLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : selectedPath ? (
              <textarea
                value={editorContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="flex-1 w-full p-4 font-mono text-sm bg-background resize-none focus:outline-none border-0"
                spellCheck={false}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                {t(locale, 'editor.loadingFiles')}
              </div>
            )}
          </div>

          {/* 실시간 미리보기 */}
          {showPreview && (
            <div className="w-1/2 flex flex-col overflow-hidden">
              {/* 미리보기 탭 헤더 */}
              <div className="border-b px-3 py-1.5 flex items-center gap-2 bg-muted/20 text-xs text-muted-foreground flex-shrink-0">
                <Eye className="h-3 w-3" />
                <span>{locale === 'ko' ? '실시간 미리보기' : 'Live Preview'}</span>
                {isLivePreviewable && (
                  <Badge variant="secondary" className="text-[10px] px-1 py-0 ml-auto">
                    LIVE
                  </Badge>
                )}
              </div>

              {isLivePreviewable ? (
                // HTML/CSS → srcdoc 기반 실시간 미리보기
                <iframe
                  ref={previewRef}
                  title="미리보기"
                  className="flex-1 w-full bg-white border-0"
                  sandbox="allow-scripts"
                />
              ) : liveUrl ? (
                // 기타 파일 → 라이브 사이트 iframe
                <iframe
                  src={liveUrl}
                  title="사이트 미리보기"
                  className="flex-1 w-full bg-white border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  {locale === 'ko' ? '미리보기할 수 없는 파일입니다' : 'Cannot preview this file'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 상태 바 */}
      <div className="border-t px-4 py-1.5 flex items-center justify-between text-xs text-muted-foreground bg-muted/30">
        <div className="flex items-center gap-3">
          <span>{selectedPath || ''}</span>
          <span className="text-muted-foreground/60">
            {locale === 'ko' ? 'Ctrl+S로 저장' : 'Ctrl+S to save'}
          </span>
        </div>
        {lastSavedAt && (
          <span>
            {t(locale, 'editor.lastSaved')}:{' '}
            {lastSavedAt.toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US')}
          </span>
        )}
      </div>
    </div>
  );
}
