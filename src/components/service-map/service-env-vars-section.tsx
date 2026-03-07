'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  useAddEnvVar,
  useUpdateEnvVar,
  useDeleteEnvVar,
  useDecryptEnvVar,
} from '@/lib/queries/env-vars';
import {
  Key,
  Plus,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { parseEnvLine, parseEnvContent } from '@/lib/utils/parse-env';
import type { EnvironmentVariable, EnvVarTemplate, Environment } from '@/types';

interface ServiceEnvVarsSectionProps {
  projectId: string;
  serviceId: string;
  requiredEnvVars: EnvVarTemplate[];
  envVars: EnvironmentVariable[];
}

const environments: { value: Environment; label: string }[] = [
  { value: 'development', label: '개발' },
  { value: 'staging', label: '스테이징' },
  { value: 'production', label: '프로덕션' },
];

export function ServiceEnvVarsSection({
  projectId,
  serviceId,
  requiredEnvVars,
  envVars,
}: ServiceEnvVarsSectionProps) {
  const [activeEnv, setActiveEnv] = useState<Environment>('development');
  const [addingKey, setAddingKey] = useState<string | null>(null);
  const [addingCustom, setAddingCustom] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValue, setFormValue] = useState('');
  const [formKey, setFormKey] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [decryptedValues, setDecryptedValues] = useState<Record<string, string>>({});
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [rawEditorMode, setRawEditorMode] = useState(false);
  const [rawEditorText, setRawEditorText] = useState('');
  const [dismissedKeys, setDismissedKeys] = useState<Set<string>>(new Set());
  const [showOptional, setShowOptional] = useState(false);

  // M2: Clear decrypted values on unmount
  useEffect(() => {
    return () => {
      setDecryptedValues({});
    };
  }, []);

  // Reset pendingDeleteId after timeout
  useEffect(() => {
    if (!pendingDeleteId) return;
    const timer = setTimeout(() => setPendingDeleteId(null), 3000);
    return () => clearTimeout(timer);
  }, [pendingDeleteId]);

  const addEnvVar = useAddEnvVar(projectId);
  const updateEnvVar = useUpdateEnvVar(projectId);
  const deleteEnvVar = useDeleteEnvVar(projectId);
  const decryptEnvVar = useDecryptEnvVar();

  // Filter env vars for this service + environment
  const filteredVars = envVars.filter(
    (ev) => ev.service_id === serviceId && ev.environment === activeEnv
  );

  // Split required vs optional templates
  const mandatoryVars = requiredEnvVars.filter((t) => !t.optional);
  const optionalVars = requiredEnvVars.filter((t) => t.optional);

  // Count configured across all environments for this service
  const allServiceVars = envVars.filter((ev) => ev.service_id === serviceId);
  const uniqueKeys = new Set(allServiceVars.map((ev) => ev.key_name));
  const configuredCount = uniqueKeys.size;
  const totalRequired = mandatoryVars.length;

  // Map key_name to env var for current environment
  const varByKey = new Map<string, EnvironmentVariable>();
  filteredVars.forEach((ev) => varByKey.set(ev.key_name, ev));

  // Additional vars (not in template)
  const templateKeyNames = new Set(requiredEnvVars.map((t) => t.name));
  const additionalVars = filteredVars.filter((ev) => !templateKeyNames.has(ev.key_name));

  const handleAdd = (keyName: string, isSecret: boolean, description?: string) => {
    addEnvVar.mutate(
      {
        key_name: keyName,
        value: formValue,
        environment: activeEnv,
        is_secret: isSecret,
        description: description || null,
        service_id: serviceId,
      },
      {
        onSuccess: () => {
          setAddingKey(null);
          setAddingCustom(false);
          setFormValue('');
          setFormKey('');
          setFormDescription('');
        },
        onError: () => {
          toast.error('환경변수 추가에 실패했습니다');
        },
      }
    );
  };

  const handleUpdate = (id: string) => {
    updateEnvVar.mutate(
      { id, value: formValue },
      {
        onSuccess: () => {
          setEditingId(null);
          setFormValue('');
          // Clear decrypted cache for this var
          setDecryptedValues((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        },
        onError: () => {
          toast.error('환경변수 수정에 실패했습니다');
        },
      }
    );
  };

  const handleDelete = useCallback((id: string) => {
    if (pendingDeleteId === id) {
      // Confirmed — perform actual delete
      deleteEnvVar.mutate(id, {
        onSuccess: () => {
          setPendingDeleteId(null);
        },
        onError: () => {
          toast.error('환경변수 삭제에 실패했습니다');
          setPendingDeleteId(null);
        },
      });
    } else {
      // First click — request confirmation
      setPendingDeleteId(id);
    }
  }, [pendingDeleteId, deleteEnvVar]);

  const handleDecrypt = (id: string) => {
    if (decryptedValues[id]) {
      // Toggle off
      setDecryptedValues((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    decryptEnvVar.mutate(id, {
      onSuccess: (value) => {
        setDecryptedValues((prev) => ({ ...prev, [id]: value }));
      },
      onError: () => {
        toast.error('복호화에 실패했습니다');
      },
    });
  };

  const handleBulkSave = async () => {
    const parsed = parseEnvContent(rawEditorText);
    if (parsed.length === 0) {
      toast.error('유효한 변수가 없습니다');
      return;
    }
    try {
      await Promise.all(
        parsed.map(({ key, value }) => {
          const existing = varByKey.get(key);
          if (existing) {
            return updateEnvVar.mutateAsync({ id: existing.id, value });
          }
          return addEnvVar.mutateAsync({
            key_name: key,
            value,
            environment: activeEnv,
            is_secret: true,
            description: null,
            service_id: serviceId,
          });
        })
      );
      toast.success(`${parsed.length}개 변수가 저장되었습니다`);
      setRawEditorMode(false);
      setRawEditorText('');
    } catch {
      toast.error('일부 변수 저장에 실패했습니다');
    }
  };

  const maskValue = (encrypted: string) => {
    return '••••' + encrypted.slice(-4);
  };

  const renderEnvVarRow = (ev: EnvironmentVariable) => {
    const isEditing = editingId === ev.id;
    const decrypted = decryptedValues[ev.id];

    if (isEditing) {
      return (
        <div key={ev.id} className="flex items-center gap-1.5 py-1.5">
          <span className="text-xs font-mono truncate flex-1 min-w-0">{ev.key_name}</span>
          <Input
            className="h-7 text-xs w-[120px]"
            placeholder="새 값"
            type="password"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleUpdate(ev.id)}
            disabled={!formValue || updateEnvVar.isPending}
          >
            {updateEnvVar.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3 text-green-600" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              setEditingId(null);
              setFormValue('');
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      );
    }

    return (
      <div key={ev.id} className="flex items-center gap-1.5 py-1.5 group">
        <span className="text-xs font-mono truncate min-w-0 flex-1">{ev.key_name}</span>
        <span className="text-xs text-muted-foreground font-mono truncate max-w-[80px]">
          {decrypted || maskValue(ev.encrypted_value)}
        </span>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => handleDecrypt(ev.id)}
            disabled={decryptEnvVar.isPending}
            title={decrypted ? '숨기기' : '복호화'}
          >
            {decrypted ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => {
              setEditingId(ev.id);
              setFormValue('');
            }}
            title="수정"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-5 w-5 text-destructive ${pendingDeleteId === ev.id ? 'bg-destructive/10' : ''}`}
            onClick={() => handleDelete(ev.id)}
            disabled={deleteEnvVar.isPending}
            title={pendingDeleteId === ev.id ? '삭제 확인' : '삭제'}
          >
            {pendingDeleteId === ev.id ? (
              <Check className="h-3 w-3" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderAddForm = (keyName: string, isSecret: boolean, description?: string) => (
    <div className="flex items-center gap-1.5 py-1.5">
      <span className="text-xs font-mono truncate flex-1 min-w-0">{keyName}</span>
      <Input
        className="h-7 text-xs w-[120px]"
        placeholder="값 입력"
        type={isSecret ? 'password' : 'text'}
        value={formValue}
        onChange={(e) => setFormValue(e.target.value)}
        autoFocus
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => handleAdd(keyName, isSecret, description)}
        disabled={!formValue || addEnvVar.isPending}
      >
        {addEnvVar.isPending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Check className="h-3 w-3 text-green-600" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => {
          setAddingKey(null);
          setFormValue('');
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium flex items-center gap-1.5">
          <Key className="h-3.5 w-3.5" />
          환경변수
          {totalRequired > 0 && (
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 ml-1">
              {configuredCount}/{totalRequired}
            </Badge>
          )}
        </h4>
        <div className="flex gap-1">
          <Button
            variant={rawEditorMode ? 'default' : 'ghost'}
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              setRawEditorMode((v) => !v);
              setRawEditorText('');
              setAddingCustom(false);
              setAddingKey(null);
              setEditingId(null);
              setFormValue('');
              setFormKey('');
            }}
            title="일괄 편집"
          >
            <FileText className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-xs px-2"
            onClick={() => {
              setAddingCustom(true);
              setRawEditorMode(false);
              setFormKey('');
              setFormValue('');
              setFormDescription('');
            }}
          >
            <Plus className="h-3 w-3 mr-1" />
            추가
          </Button>
        </div>
      </div>

      {/* Environment tabs */}
      <div className="flex gap-1 mb-3">
        {environments.map((env) => (
          <button
            key={env.value}
            onClick={() => {
              setActiveEnv(env.value);
              setAddingKey(null);
              setAddingCustom(false);
              setEditingId(null);
              setFormValue('');
              setFormKey('');
            }}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
              activeEnv === env.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {env.label}
          </button>
        ))}
      </div>

      {/* RAW Editor */}
      {rawEditorMode && (
        <div className="space-y-2 mb-3">
          <textarea
            className="w-full h-48 text-xs font-mono rounded-md border bg-muted/40 p-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
            placeholder={`.env 형식으로 붙여넣기\nKEY=VALUE\nAPI_KEY=your_key`}
            value={rawEditorText}
            onChange={(e) => setRawEditorText(e.target.value)}
            autoFocus
          />
          <div className="flex gap-1.5">
            <Button
              size="sm"
              className="h-6 text-xs"
              onClick={handleBulkSave}
              disabled={!rawEditorText.trim() || addEnvVar.isPending || updateEnvVar.isPending}
            >
              {(addEnvVar.isPending || updateEnvVar.isPending) ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Check className="h-3 w-3 mr-1" />
              )}
              저장
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => {
                setRawEditorMode(false);
                setRawEditorText('');
              }}
            >
              취소
            </Button>
          </div>
        </div>
      )}

      {/* Required env vars (mandatory — from catalog template) */}
      {!rawEditorMode && mandatoryVars.length > 0 && (
        <div className="space-y-0.5">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
            필수
          </p>
          {mandatoryVars.map((template) => {
            const existing = varByKey.get(template.name);

            if (existing) {
              return renderEnvVarRow(existing);
            }

            if (addingKey === template.name) {
              return (
                <div key={template.name}>
                  {renderAddForm(template.name, !template.public, template.description_ko || template.description)}
                </div>
              );
            }

            return (
              <div key={template.name} className="flex items-center gap-1.5 py-1.5">
                <span className="text-xs font-mono truncate flex-1 min-w-0 text-muted-foreground">
                  {template.name}
                </span>
                <Badge variant="outline" className="text-[10px] h-4 px-1 text-muted-foreground">
                  미설정
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => {
                    setAddingKey(template.name);
                    setFormValue('');
                  }}
                  title="추가"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Optional env vars (from catalog template) */}
      {!rawEditorMode && optionalVars.length > 0 && (() => {
        const configuredOptional = optionalVars.filter((t) => varByKey.has(t.name));
        const unconfiguredOptional = optionalVars.filter((t) => !varByKey.has(t.name) && !dismissedKeys.has(t.name));
        const visibleCount = configuredOptional.length + unconfiguredOptional.length;
        const hasDismissed = dismissedKeys.size > 0;

        if (visibleCount === 0 && !hasDismissed) return null;

        return (
          <>
            {mandatoryVars.length > 0 && <Separator className="my-2" />}
            <div className="space-y-0.5">
              <button
                onClick={() => setShowOptional((v) => !v)}
                className="flex items-center gap-1 w-full text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1 hover:text-foreground transition-colors"
              >
                <ChevronDown className={`h-3 w-3 transition-transform ${showOptional ? '' : '-rotate-90'}`} />
                선택 ({configuredOptional.length}/{optionalVars.length})
                {hasDismissed && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDismissedKeys(new Set());
                    }}
                    title="숨긴 항목 되돌리기"
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                  </Button>
                )}
              </button>
              {showOptional && (
                <>
                  {/* Configured optional vars */}
                  {configuredOptional.map((template) => {
                    const existing = varByKey.get(template.name)!;
                    return renderEnvVarRow(existing);
                  })}
                  {/* Unconfigured optional vars (not dismissed) */}
                  {unconfiguredOptional.map((template) => {
                    if (addingKey === template.name) {
                      return (
                        <div key={template.name}>
                          {renderAddForm(template.name, !template.public, template.description_ko || template.description)}
                        </div>
                      );
                    }

                    return (
                      <div key={template.name} className="flex items-center gap-1.5 py-1.5 group">
                        <span className="text-xs font-mono truncate flex-1 min-w-0 text-muted-foreground/60">
                          {template.name}
                        </span>
                        <Badge variant="outline" className="text-[10px] h-4 px-1 text-muted-foreground/50">
                          선택
                        </Badge>
                        <div className="flex gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => {
                              setAddingKey(template.name);
                              setFormValue('');
                            }}
                            title="추가"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground"
                            onClick={() => setDismissedKeys((prev) => new Set([...prev, template.name]))}
                            title="목록에서 숨기기"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </>
        );
      })()}

      {/* Additional env vars (user-added, not in template) */}
      {!rawEditorMode && additionalVars.length > 0 && (
        <>
          {requiredEnvVars.length > 0 && <Separator className="my-2" />}
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
              추가 변수
            </p>
            {additionalVars.map((ev) => renderEnvVarRow(ev))}
          </div>
        </>
      )}

      {/* Custom add form */}
      {!rawEditorMode && addingCustom && (
        <>
          <Separator className="my-2" />
          <div className="space-y-1.5">
            <Input
              className="h-7 text-xs"
              placeholder="KEY_NAME"
              value={formKey}
              onChange={(e) => setFormKey(e.target.value.toUpperCase())}
              onPaste={(e) => {
                const text = e.clipboardData.getData('text');
                const parsed = parseEnvLine(text);
                if (parsed) {
                  e.preventDefault();
                  setFormKey(parsed.key);
                  setFormValue(parsed.value);
                }
              }}
              autoFocus
            />
            <Input
              className="h-7 text-xs"
              placeholder="값 입력"
              type="password"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              onPaste={(e) => {
                const text = e.clipboardData.getData('text').trim();
                const unquoted = (text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))
                  ? text.slice(1, -1)
                  : text;
                if (unquoted !== text) {
                  e.preventDefault();
                  setFormValue(unquoted);
                }
              }}
            />
            <div className="flex gap-1.5">
              <Button
                size="sm"
                className="h-6 text-xs"
                onClick={() => handleAdd(formKey, true)}
                disabled={!formKey || !formValue || addEnvVar.isPending}
              >
                {addEnvVar.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Check className="h-3 w-3 mr-1" />
                )}
                저장
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => {
                  setAddingCustom(false);
                  setFormKey('');
                  setFormValue('');
                }}
              >
                취소
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!rawEditorMode && requiredEnvVars.length === 0 && filteredVars.length === 0 && !addingCustom && (
        <p className="text-xs text-muted-foreground py-2">
          등록된 환경변수가 없습니다
        </p>
      )}

      {/* Config status summary */}
      {!rawEditorMode && requiredEnvVars.length > 0 && (
        (() => {
          const mandatoryConfigured = mandatoryVars.filter((t) => varByKey.has(t.name));
          const mandatoryMissing = mandatoryVars.filter((t) => !varByKey.has(t.name));
          const optionalConfigured = optionalVars.filter((t) => varByKey.has(t.name));
          const allMandatoryDone = mandatoryMissing.length === 0;

          return (
            <>
              <Separator className="my-2" />
              <div className={`rounded-md px-2.5 py-2 text-xs space-y-1 ${
                allMandatoryDone
                  ? 'bg-green-500/5 border border-green-500/20'
                  : 'bg-amber-500/5 border border-amber-500/20'
              }`}>
                <div className="flex items-center gap-1.5 font-medium">
                  {allMandatoryDone ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      <span className="text-green-700 dark:text-green-400">필수 설정 완료</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-amber-700 dark:text-amber-400">
                        필수 {mandatoryMissing.length}개 미설정
                      </span>
                    </>
                  )}
                </div>
                <div className="flex gap-3 text-muted-foreground">
                  <span>필수 {mandatoryConfigured.length}/{mandatoryVars.length}</span>
                  {optionalVars.length > 0 && (
                    <span>선택 {optionalConfigured.length}/{optionalVars.length}</span>
                  )}
                  {additionalVars.length > 0 && (
                    <span>추가 {additionalVars.length}</span>
                  )}
                </div>
                {!allMandatoryDone && (
                  <div className="text-muted-foreground/80 pt-0.5">
                    {mandatoryMissing.map((t) => t.name).join(', ')}
                  </div>
                )}
              </div>
            </>
          );
        })()
      )}
    </div>
  );
}
