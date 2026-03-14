'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScanSearch, Loader2, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAnalyzeKeys, useApplyAnalysis } from '@/lib/queries/analyze';
import type { AnalysisResultItem, ApplyEntry } from '@/lib/queries/analyze';
import type { Environment } from '@/types';

interface SmartKeyAnalyzerDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'input' | 'review' | 'done';

const confidenceBadgeClass: Record<string, string> = {
  high: 'bg-green-500/10 text-green-700 border-green-300 dark:text-green-400',
  medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-300 dark:text-yellow-400',
  low: 'bg-orange-500/10 text-orange-700 border-orange-300 dark:text-orange-400',
};

const confidenceLabel: Record<string, string> = {
  high: '높음',
  medium: '보통',
  low: '낮음',
};

export function SmartKeyAnalyzerDialog({
  projectId,
  open,
  onOpenChange,
}: SmartKeyAnalyzerDialogProps) {
  const [step, setStep] = useState<Step>('input');
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<AnalysisResultItem[]>([]);
  const [excluded, setExcluded] = useState<Set<number>>(new Set());
  const [editedKeyNames, setEditedKeyNames] = useState<Record<number, string>>({});
  const [selectedServices, setSelectedServices] = useState<Record<number, string | null>>({});
  const [environment, setEnvironment] = useState<Environment>('development');
  const [applyResult, setApplyResult] = useState<{
    created: number;
    updated: number;
    services_added: number;
    auto_connections: number;
  } | null>(null);

  const analyzeKeys = useAnalyzeKeys(projectId);
  const applyAnalysis = useApplyAnalysis(projectId);

  const isSingleValue = useMemo(() => {
    const trimmed = inputText.trim();
    return trimmed.length > 0 && !trimmed.includes('\n') && !trimmed.includes('=');
  }, [inputText]);

  const handleAnalyze = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    try {
      const input = isSingleValue
        ? { value: trimmed }
        : { content: trimmed };

      const response = await analyzeKeys.mutateAsync(input);
      setResults(response.results);
      setExcluded(new Set());
      setEditedKeyNames({});
      setSelectedServices({});

      // Pre-set selected services from best_match
      const services: Record<number, string | null> = {};
      response.results.forEach((r, i) => {
        services[i] = r.best_match?.serviceId ?? null;
      });
      setSelectedServices(services);

      setStep('review');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '분석 실패');
    }
  };

  const handleApply = async () => {
    const entries: ApplyEntry[] = [];
    for (let i = 0; i < results.length; i++) {
      if (excluded.has(i)) continue;
      const r = results[i];
      entries.push({
        key_name: editedKeyNames[i] || r.key_name,
        value: inputText.trim().includes('=')
          ? extractValueFromContent(inputText, r.key_name)
          : inputText.trim(),
        service_id: selectedServices[i] ?? null,
        environment,
        is_secret: true,
      });
    }

    if (entries.length === 0) {
      toast.error('적용할 항목이 없습니다');
      return;
    }

    try {
      const result = await applyAnalysis.mutateAsync(entries);
      setApplyResult(result);
      setStep('done');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '적용 실패');
    }
  };

  const handleClose = () => {
    setStep('input');
    setInputText('');
    setResults([]);
    setExcluded(new Set());
    setEditedKeyNames({});
    setSelectedServices({});
    setApplyResult(null);
    onOpenChange(false);
  };

  const activeCount = results.length - excluded.size;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanSearch className="h-5 w-5 text-brand-blue" />
            비밀키 자동 분석
          </DialogTitle>
          <DialogDescription>
            API 키를 붙여넣으면 서비스를 자동 감지합니다
          </DialogDescription>
        </DialogHeader>

        {step === 'input' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>API 키 또는 .env 내용</Label>
              <Textarea
                placeholder={`단일 키:\nsk-proj-abc123...\n\n또는 .env 형식:\nOPENAI_API_KEY=sk-proj-abc123\nSTRIPE_SECRET_KEY=sk_test_xyz...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {isSingleValue ? '단일 키 값으로 분석합니다' : '.env 형식으로 분석합니다'}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>취소</Button>
              <Button
                onClick={handleAnalyze}
                disabled={!inputText.trim() || analyzeKeys.isPending}
              >
                {analyzeKeys.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                분석하기
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>총 {results.length}개 항목</span>
              <span>매칭 {results.filter((r) => r.best_match).length}개</span>
              {results.some((r) => r.already_exists) && (
                <Badge variant="outline" className="text-yellow-600">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  기존 {results.filter((r) => r.already_exists).length}개 덮어쓰기
                </Badge>
              )}
            </div>

            {/* Results Table */}
            <div className="space-y-3 max-h-[40vh] overflow-y-auto">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-3 border rounded-lg space-y-2 ${
                    excluded.has(idx) ? 'opacity-40' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={!excluded.has(idx)}
                      onCheckedChange={(checked) => {
                        setExcluded((prev) => {
                          const next = new Set(prev);
                          if (checked) next.delete(idx);
                          else next.add(idx);
                          return next;
                        });
                      }}
                    />
                    <Input
                      value={editedKeyNames[idx] ?? result.key_name}
                      onChange={(e) => setEditedKeyNames((prev) => ({
                        ...prev,
                        [idx]: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
                      }))}
                      className="font-mono text-sm h-8 flex-1"
                    />
                    <span className="text-xs text-muted-foreground font-mono shrink-0">
                      {result.value_preview}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pl-8">
                    {result.analysis.length > 1 ? (
                      <Select
                        value={selectedServices[idx] ?? '__none__'}
                        onValueChange={(val) => setSelectedServices((prev) => ({
                          ...prev,
                          [idx]: val === '__none__' ? null : val,
                        }))}
                      >
                        <SelectTrigger className="h-7 text-xs w-48">
                          <SelectValue placeholder="서비스 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">미연결</SelectItem>
                          {result.analysis.map((a) => (
                            <SelectItem key={a.serviceId} value={a.serviceId}>
                              {a.serviceName}
                              <Badge variant="outline" className={`ml-2 text-[10px] ${confidenceBadgeClass[a.confidence]}`}>
                                {confidenceLabel[a.confidence]}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : result.best_match ? (
                      <Badge variant="outline" className={confidenceBadgeClass[result.best_match.confidence]}>
                        {result.best_match.serviceName} · {confidenceLabel[result.best_match.confidence]}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">서비스 미감지</span>
                    )}
                    {result.already_exists && (
                      <Badge variant="outline" className="text-yellow-600 text-[10px]">
                        기존 값 덮어쓰기
                      </Badge>
                    )}
                    {result.best_match && !result.service_already_registered && (
                      <Badge variant="outline" className="text-blue-600 text-[10px]">
                        + 서비스 등록
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Environment Select */}
            <div className="flex items-center gap-3">
              <Label className="shrink-0">환경</Label>
              <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">개발</SelectItem>
                  <SelectItem value="staging">스테이징</SelectItem>
                  <SelectItem value="production">프로덕션</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('input')}>이전</Button>
              <Button
                onClick={handleApply}
                disabled={activeCount === 0 || applyAnalysis.isPending}
              >
                {applyAnalysis.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {activeCount}개 적용하기
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 'done' && applyResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-6">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">적용 완료</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                {applyResult.created > 0 && <p>환경변수 {applyResult.created}개 생성</p>}
                {applyResult.updated > 0 && <p>환경변수 {applyResult.updated}개 업데이트</p>}
                {applyResult.services_added > 0 && <p>서비스 {applyResult.services_added}개 추가 등록</p>}
                {applyResult.auto_connections > 0 && <p>연결 {applyResult.auto_connections}개 자동 생성</p>}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>닫기</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * .env content에서 특정 key의 value를 추출
 */
function extractValueFromContent(content: string, keyName: string): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const eqIdx = trimmed.indexOf('=');
    const key = trimmed.substring(0, eqIdx).trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    if (key === keyName) {
      let value = trimmed.substring(eqIdx + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      return value;
    }
  }
  return '';
}
