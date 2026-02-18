'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react';
import { useAddEnvVar } from '@/lib/queries/env-vars';
import { useRunHealthCheck } from '@/lib/queries/health-checks';
import { SetupArchitecturePreview } from './setup-architecture-preview';
import { SetupLiveLogs } from './setup-live-logs';
import type { Service, ProjectService, Environment, HealthCheck } from '@/types';

interface SetupWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  projectService: ProjectService;
  projectId: string;
}

type Step = 'credentials' | 'config' | 'review';
const steps: Step[] = ['credentials', 'config', 'review'];
const stepLabels: Record<Step, string> = {
  credentials: '인증값 입력',
  config: '설정 확인',
  review: '검증 및 완료',
};

export function SetupWizard({ open, onOpenChange, service, projectService, projectId }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('credentials');
  const [selectedEnv, setSelectedEnv] = useState<Environment>('development');
  const [envValues, setEnvValues] = useState<Record<string, string>>({});
  const [verifyResult, setVerifyResult] = useState<HealthCheck | null>(null);
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState<boolean | null>(null);

  const addEnvVar = useAddEnvVar(projectId);
  const runHealthCheck = useRunHealthCheck();

  const requiredVars = service.required_env_vars || [];
  const stepIndex = steps.indexOf(currentStep);
  const progressPercent = ((stepIndex + 1) / steps.length) * 100;

  const goNext = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) setCurrentStep(steps[nextIndex]);
  };

  const goBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) setCurrentStep(steps[prevIndex]);
  };

  const handleSaveAndVerify = async () => {
    setSaving(true);
    setVerifySuccess(null);
    try {
      // Save all env vars
      for (const varTemplate of requiredVars) {
        const value = envValues[varTemplate.name] || '';
        if (value.trim()) {
          await addEnvVar.mutateAsync({
            key_name: varTemplate.name,
            value,
            environment: selectedEnv,
            is_secret: !varTemplate.public,
            description: varTemplate.description_ko || varTemplate.description,
          });
        }
      }
      setSaving(false);
      setVerifying(true);

      // Run health check
      const result = await runHealthCheck.mutateAsync({
        project_service_id: projectService.id,
        environment: selectedEnv,
      });
      setVerifyResult(result);
      setVerifySuccess(result.status === 'healthy');
    } catch {
      setVerifySuccess(false);
    } finally {
      setSaving(false);
      setVerifying(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('credentials');
    setSelectedEnv('development');
    setEnvValues({});
    setVerifyResult(null);
    setVerifySuccess(null);
    onOpenChange(false);
  };

  const hasFilledValues = requiredVars.some((v) => envValues[v.name]?.trim());

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {service.name} 연결 설정
          </DialogTitle>
          <Progress value={progressPercent} className="mt-2" />
          <div className="flex gap-1 mt-1">
            {steps.map((step, i) => (
              <Badge
                key={step}
                variant={i <= stepIndex ? 'default' : 'outline'}
                className="text-[10px]"
              >
                {stepLabels[step]}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <div className="min-h-[240px]">
          {/* Step 1: Credentials (combines Info + Environment + Credentials) */}
          {currentStep === 'credentials' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {service.description_ko || service.description}
              </p>
              {service.docs_url && (
                <a
                  href={service.docs_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  공식 문서 보기
                </a>
              )}

              <div className="space-y-2">
                <Label>환경 선택</Label>
                <Select value={selectedEnv} onValueChange={(v) => setSelectedEnv(v as Environment)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">개발 (Development)</SelectItem>
                    <SelectItem value="staging">스테이징 (Staging)</SelectItem>
                    <SelectItem value="production">프로덕션 (Production)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {requiredVars.map((v) => (
                  <div key={v.name} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs font-mono">{v.name}</Label>
                      <Badge variant={v.public ? 'secondary' : 'destructive'} className="text-[10px]">
                        {v.public ? '공개' : '비밀'}
                      </Badge>
                    </div>
                    <Input
                      type={v.public ? 'text' : 'password'}
                      placeholder={v.description_ko || v.description}
                      value={envValues[v.name] || ''}
                      onChange={(e) => setEnvValues((prev) => ({ ...prev, [v.name]: e.target.value }))}
                      className="font-mono text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Config (Architecture preview) */}
          {currentStep === 'config' && (
            <div className="space-y-4">
              <SetupArchitecturePreview
                serviceName={service.name}
                requiredVars={requiredVars}
              />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">설정 요약</h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">환경</span>
                    <span className="font-medium">{selectedEnv === 'development' ? '개발' : selectedEnv === 'staging' ? '스테이징' : '프로덕션'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">입력된 변수</span>
                    <span className="font-medium">{requiredVars.filter((v) => envValues[v.name]?.trim()).length} / {requiredVars.length}</span>
                  </div>
                  {requiredVars.map((v) => (
                    <div key={v.name} className="flex justify-between text-xs">
                      <code className="font-mono text-muted-foreground">{v.name}</code>
                      <span className={envValues[v.name]?.trim() ? 'text-green-600' : 'text-yellow-600'}>
                        {envValues[v.name]?.trim() ? '입력됨' : '미입력'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review (Verify + Done) */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              {verifySuccess === null && !saving && !verifying ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    저장 및 검증 버튼을 눌러 설정을 완료하세요.
                  </p>
                </div>
              ) : verifySuccess !== null ? (
                <div className="flex flex-col items-center justify-center py-4">
                  {verifySuccess ? (
                    <>
                      <CheckCircle2 className="h-12 w-12 text-green-600 mb-4" />
                      <h3 className="text-lg font-semibold mb-1">연결 성공!</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        {service.name} 서비스가 정상적으로 연결되었습니다.
                        {verifyResult?.response_time_ms && ` (${verifyResult.response_time_ms}ms)`}
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-12 w-12 text-yellow-600 mb-4" />
                      <h3 className="text-lg font-semibold mb-1">설정 완료</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        환경변수가 저장되었습니다.
                        {verifyResult?.message && (
                          <span className="block mt-1 text-xs">{verifyResult.message}</span>
                        )}
                      </p>
                    </>
                  )}
                </div>
              ) : null}

              {/* Live Logs */}
              <SetupLiveLogs
                saving={saving}
                verifying={verifying}
                verifySuccess={verifySuccess}
                envVarCount={requiredVars.filter((v) => envValues[v.name]?.trim()).length}
                serviceName={service.name}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          {verifySuccess !== null ? (
            <Button onClick={handleClose} className="w-full">
              완료
            </Button>
          ) : (
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={stepIndex === 0 || saving || verifying}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                이전
              </Button>
              {currentStep === 'review' ? (
                <Button
                  onClick={handleSaveAndVerify}
                  disabled={!hasFilledValues || saving || verifying}
                >
                  {saving || verifying ? '처리 중...' : '저장 및 검증'}
                </Button>
              ) : (
                <Button onClick={goNext} disabled={currentStep === 'credentials' && !hasFilledValues}>
                  다음
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
