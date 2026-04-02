'use client';

import { useRef, useState } from 'react';
import {
  Paperclip,
  Upload,
  Trash2,
  FileText,
  Image,
  FileSpreadsheet,
  ExternalLink,
  Loader2,
  Link as LinkIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  useCostAttachments,
  useUploadCostAttachment,
  useDeleteCostAttachment,
  useAddCostLink,
} from '@/lib/queries/costs';
import { ALLOWED_ATTACHMENT_MIME_TYPES, MAX_ATTACHMENT_SIZE, ATTACHMENT_TYPES } from '@/lib/validations/cost';
import { cn } from '@/lib/utils';
import type { AttachmentType } from '@/types/dashboard';

interface CostAttachmentsPanelProps {
  projectId: string;
  projectServiceId: string;
  serviceName: string;
}

const ATTACHMENT_TYPE_LABELS: Record<AttachmentType, string> = {
  invoice: '인보이스',
  receipt: '영수증',
  contract: '계약서',
  screenshot: '스크린샷',
  other: '기타',
};

const ATTACHMENT_TYPE_COLORS: Record<AttachmentType, string> = {
  invoice: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  receipt: 'bg-green-500/10 text-green-600 border-green-500/20',
  contract: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  screenshot: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  other: 'bg-muted text-muted-foreground',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileType: string | null) {
  if (!fileType) return <LinkIcon className="h-4 w-4 text-brand-blue" />;
  if (fileType.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />;
  if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType === 'text/csv') {
    return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
  }
  return <FileText className="h-4 w-4 text-muted-foreground" />;
}

export function CostAttachmentsPanel({
  projectId,
  projectServiceId,
  serviceName,
}: CostAttachmentsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedType, setSelectedType] = useState<AttachmentType>('other');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'file' | 'link'>('file');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');

  const { data: attachments = [], isLoading } = useCostAttachments(projectId, projectServiceId);
  const upload = useUploadCostAttachment(projectId);
  const remove = useDeleteCostAttachment(projectId);
  const addLink = useAddCostLink(projectId);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > MAX_ATTACHMENT_SIZE) {
      toast.error('파일 크기는 10MB를 초과할 수 없습니다');
      return;
    }
    const allowed: readonly string[] = ALLOWED_ATTACHMENT_MIME_TYPES;
    if (!allowed.includes(file.type)) {
      toast.error('PDF, 이미지(PNG/JPG/WEBP), CSV, Excel 파일만 첨부 가능합니다');
      return;
    }

    upload.mutate(
      { projectServiceId, file, attachmentType: selectedType },
      {
        onSuccess: () => toast.success(`${file.name} 업로드 완료`),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleLinkSave = () => {
    if (!linkUrl.trim()) {
      toast.error('URL을 입력하세요');
      return;
    }

    addLink.mutate(
      {
        projectServiceId,
        link_url: linkUrl.trim(),
        link_title: linkTitle.trim() || undefined,
        attachment_type: selectedType,
      },
      {
        onSuccess: () => {
          toast.success('링크가 저장되었습니다');
          setLinkUrl('');
          setLinkTitle('');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleDelete = async (attachmentId: string, fileName: string) => {
    setDeletingId(attachmentId);
    remove.mutate(
      { projectServiceId, attachmentId },
      {
        onSuccess: () => toast.success(`${fileName} 삭제 완료`),
        onError: (err) => toast.error(err.message),
        onSettled: () => setDeletingId(null),
      }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">첨부 파일</span>
          {attachments.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {attachments.length}
            </Badge>
          )}
        </div>

        {/* 파일 / 링크 탭 토글 */}
        <div className="flex items-center rounded-md border border-border overflow-hidden text-xs">
          <button
            onClick={() => setActiveTab('file')}
            className={cn(
              'px-2.5 py-1 transition-colors',
              activeTab === 'file'
                ? 'bg-muted text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            파일
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={cn(
              'px-2.5 py-1 transition-colors',
              activeTab === 'link'
                ? 'bg-muted text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            링크
          </button>
        </div>
      </div>

      {/* 파일 유형 선택 */}
      <div className="flex flex-wrap gap-1.5">
        {ATTACHMENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={cn(
              'px-2 py-0.5 rounded text-xs border transition-colors',
              selectedType === type
                ? ATTACHMENT_TYPE_COLORS[type]
                : 'border-border text-muted-foreground hover:border-muted-foreground/50'
            )}
          >
            {ATTACHMENT_TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      {activeTab === 'file' ? (
        /* 드래그앤드롭 업로드 영역 */
        <div
          className={cn(
            'relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer',
            isDragging
              ? 'border-brand-blue bg-brand-blue/5'
              : 'border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/30'
          )}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={ALLOWED_ATTACHMENT_MIME_TYPES.join(',')}
            onChange={(e) => handleFiles(e.target.files)}
          />
          {upload.isPending ? (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              업로드 중...
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                클릭하거나 파일을 드래그하세요
              </p>
              <p className="text-[11px] text-muted-foreground/60">
                PDF · 이미지 · CSV · Excel · 최대 10MB
              </p>
            </div>
          )}
        </div>
      ) : (
        /* 링크 입력 폼 */
        <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/20">
          <div className="space-y-1.5">
            <Input
              placeholder="https://example.com/invoice"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLinkSave()}
              className="h-8 text-xs"
            />
            <Input
              placeholder="링크 제목 (선택)"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLinkSave()}
              className="h-8 text-xs"
            />
          </div>
          <Button
            size="sm"
            className="w-full h-7 text-xs"
            onClick={handleLinkSave}
            disabled={addLink.isPending || !linkUrl.trim()}
          >
            {addLink.isPending ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                저장 중...
              </>
            ) : (
              <>
                <LinkIcon className="h-3 w-3 mr-1" />
                링크 저장
              </>
            )}
          </Button>
        </div>
      )}

      {/* 첨부 파일 목록 */}
      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          불러오는 중...
        </div>
      ) : attachments.length > 0 ? (
        <ul className="space-y-1.5">
          {attachments.map((att) => {
            const isLink = !att.storagePath;
            const linkHostname = (() => {
              if (!att.linkUrl) return '';
              try { return new URL(att.linkUrl).hostname; } catch { return att.linkUrl.slice(0, 60); }
            })();
            return (
              <li
                key={att.id}
                className={cn(
                  'flex items-center gap-2 p-2 rounded-md transition-colors group',
                  isLink && att.linkUrl
                    ? 'bg-brand-blue/5 hover:bg-brand-blue/10 cursor-pointer border border-brand-blue/15'
                    : 'bg-muted/40 hover:bg-muted/60'
                )}
                onClick={() => {
                  if (isLink && att.linkUrl) window.open(att.linkUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                {getFileIcon(att.fileType)}

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">
                    {att.fileName}
                    {isLink && att.linkUrl && (
                      <ExternalLink className="inline h-3 w-3 ml-1 text-brand-blue/60 align-middle" />
                    )}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {isLink ? linkHostname : att.fileSize != null ? formatFileSize(att.fileSize) : '-'}
                    {' · '}
                    {new Date(att.createdAt).toLocaleDateString('ko-KR')}
                    {att.notes && ` · ${att.notes}`}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={cn('text-[10px] shrink-0', ATTACHMENT_TYPE_COLORS[att.attachmentType])}
                >
                  {ATTACHMENT_TYPE_LABELS[att.attachmentType]}
                </Badge>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!isLink && att.signedUrl && (
                    <a
                      href={att.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="열기"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); handleDelete(att.id, att.fileName); }}
                    disabled={deletingId === att.id}
                    title="삭제"
                  >
                    {deletingId === att.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-1">
          {serviceName}의 인보이스·영수증을 첨부하면 여기서 확인할 수 있습니다
        </p>
      )}
    </div>
  );
}
