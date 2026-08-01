'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileUp, FolderUp, Loader2, Rocket } from 'lucide-react';
import { toast } from 'sonner';
import {
  prepareUpload,
  UploadPrepareError,
  type PreparedUpload,
} from '@/lib/oneclick/client-upload';

interface UploadSourceStepProps {
  githubUsername?: string;
  existingSiteNames: string[];
  isDeploying: boolean;
  onBack: () => void;
  onDeploy: (upload: PreparedUpload, siteName: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

const siteNameRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;

/** 드롭된 폴더 엔트리를 재귀 순회해 File 목록으로 펼친다 (webkitRelativePath를 직접 채운다) */
async function collectEntries(entries: FileSystemEntry[], depth = 0): Promise<File[]> {
  if (depth > 8) return [];
  const out: File[] = [];

  for (const entry of entries) {
    if (entry.isFile) {
      const file = await new Promise<File | null>((resolve) => {
        (entry as FileSystemFileEntry).file(resolve, () => resolve(null));
      });
      if (file) {
        // fullPath는 '/'로 시작한다 — prepareFileList가 쓰는 상대 경로 형태로 맞춘다
        Object.defineProperty(file, 'webkitRelativePath', {
          value: entry.fullPath.replace(/^\//, ''),
        });
        out.push(file);
      }
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      const children = await new Promise<FileSystemEntry[]>((resolve) => {
        reader.readEntries(resolve, () => resolve([]));
      });
      out.push(...(await collectEntries(children, depth + 1)));
    }
  }
  return out;
}

export function UploadSourceStep({
  githubUsername,
  existingSiteNames,
  isDeploying,
  onBack,
  onDeploy,
}: UploadSourceStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [pickedFiles, setPickedFiles] = useState<File[] | null>(null);
  const [upload, setUpload] = useState<PreparedUpload | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [siteName, setSiteName] = useState('');

  const prepare = useCallback(async (files: File[], preferredIndex?: string) => {
    setIsPreparing(true);
    try {
      const result = await prepareUpload(files, preferredIndex);
      setPickedFiles(files);
      setUpload(result);
      if (!result.hasIndex && result.htmlCandidates.length === 0) {
        toast.error("웹페이지 파일(html)이 없어요. AI에게 'HTML 파일로 저장해줘'라고 요청해보세요.");
      }
      if (result.skipped.length > 0) {
        toast.info(`${result.skipped.length}개 파일은 제외했어요.`);
      }
    } catch (err) {
      setUpload(null);
      setPickedFiles(null);
      toast.error(
        err instanceof UploadPrepareError ? err.message : '파일을 읽는 중 오류가 발생했습니다.',
      );
    } finally {
      setIsPreparing(false);
    }
  }, []);

  /**
   * 폴더 드롭은 dataTransfer.files에 담기지 않는다 — webkitGetAsEntry로 순회해야 한다.
   * 폴더를 권하는 UI인데 드롭만 실패하면 원인을 알 수 없으므로 여기서 처리한다.
   */
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const items = Array.from(e.dataTransfer.items ?? []);
    const entries = items
      .map((item) => (item.kind === 'file' ? item.webkitGetAsEntry?.() ?? null : null))
      .filter((entry): entry is FileSystemEntry => entry !== null);

    if (entries.some((entry) => entry.isDirectory)) {
      setIsPreparing(true);
      try {
        const collected = await collectEntries(entries);
        if (collected.length > 0) await prepare(collected);
        else toast.error('폴더 안에서 파일을 찾지 못했습니다.');
      } catch {
        toast.error('폴더를 읽는 중 오류가 발생했습니다.');
      } finally {
        setIsPreparing(false);
      }
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) void prepare(files);
  }, [prepare]);

  const nameError = useMemo(() => {
    if (!siteName) return null;
    if (siteName.length < 2) return '주소는 2자 이상이어야 해요';
    if (!siteNameRegex.test(siteName)) return '영문 소문자·숫자·하이픈만 쓸 수 있어요';
    if (existingSiteNames.includes(siteName)) return '이미 사용 중인 주소예요';
    return null;
  }, [siteName, existingSiteNames]);

  const needsIndexChoice = (upload?.htmlCandidates.length ?? 0) > 0;
  // hasIndex가 false면 첫 화면이 없어 서버가 거절한다 — 여기서 미리 막는다
  const isReady = !!upload && upload.hasIndex;
  const canDeploy = isReady && !!siteName && !nameError && !isDeploying;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        템플릿 고르기로 돌아가기
      </button>

      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold">내가 만든 파일 올리기</h2>
        <p className="text-sm text-muted-foreground">
          AI가 만들어준 HTML 파일이나 압축(ZIP) 파일을 그대로 올리면 인터넷에 공개돼요.
        </p>
      </div>

      {/* 파일 선택 영역 */}
      <Card
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed p-8 text-center transition-colors ${
          isDragging ? 'border-brand-blue bg-brand-blue/5' : 'border-muted-foreground/25'
        }`}
      >
        {isPreparing ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">파일을 읽는 중...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <FileUp className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">여기로 파일을 끌어다 놓으세요</p>
              <p className="text-xs text-muted-foreground">
                HTML 파일 1개, 또는 사이트 전체가 담긴 ZIP·폴더
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <FileUp className="h-4 w-4 mr-1.5" />
                파일 고르기
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => folderInputRef.current?.click()}>
                <FolderUp className="h-4 w-4 mr-1.5" />
                폴더 고르기
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".html,.htm,.zip,.css,.js,.json,.png,.jpg,.jpeg,.webp,.gif,.svg,.ico,.woff,.woff2,.ttf,.otf,.md,.txt,.pdf,.mp4,.webm,.mp3"
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) void prepare(files);
            e.target.value = '';
          }}
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          // @ts-expect-error — 폴더 선택은 표준 속성이 아니라 React 타입에 없다
          webkitdirectory=""
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length > 0) void prepare(files);
            e.target.value = '';
          }}
        />
      </Card>

      {/* 첫 화면 선택 — index.html이 없고 후보가 여럿일 때만 */}
      {upload && needsIndexChoice && (
        <Card className="p-4 space-y-3">
          <div>
            <p className="text-sm font-medium">첫 화면으로 보여줄 파일을 골라주세요</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              방문자가 주소로 접속했을 때 가장 먼저 보게 될 페이지예요.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {upload.htmlCandidates.map((candidate) => (
              <Button
                key={candidate}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => pickedFiles && void prepare(pickedFiles, candidate)}
              >
                {candidate}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* 요약 카드 */}
      {isReady && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium">올릴 파일 {upload.files.length}개</p>
            <Badge variant="secondary">{formatBytes(upload.totalBytes)}</Badge>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
            {upload.files.slice(0, 12).map((f) => (
              <li key={f.path} className="flex items-center justify-between gap-3">
                <span className="truncate font-mono">{f.path}</span>
                {f.path === 'index.html' && (
                  <span className="shrink-0 text-brand-blue">첫 화면</span>
                )}
              </li>
            ))}
            {upload.files.length > 12 && <li>… 외 {upload.files.length - 12}개</li>}
          </ul>
        </Card>
      )}

      {/* 주소 입력 */}
      {isReady && (
        <div className="space-y-2">
          <Label htmlFor="upload-site-name">사이트 주소</Label>
          <Input
            id="upload-site-name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            placeholder="my-site"
            maxLength={100}
          />
          {nameError ? (
            <p className="text-xs text-destructive">{nameError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {githubUsername && siteName
                ? `https://${githubUsername}.github.io/${siteName}`
                : '영문 소문자·숫자·하이픈으로 지어주세요'}
            </p>
          )}
        </div>
      )}

      <Button
        type="button"
        className="w-full"
        disabled={!canDeploy}
        onClick={() => upload && onDeploy(upload, siteName)}
      >
        {isDeploying ? (
          <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />배포 중...</>
        ) : (
          <><Rocket className="h-4 w-4 mr-1.5" />내 사이트 만들기</>
        )}
      </Button>
    </div>
  );
}
