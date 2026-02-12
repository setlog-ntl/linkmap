'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useConnectServiceAccount } from '@/lib/queries/service-accounts';
import type { ApiKeyFieldConfig } from '@/types';

interface ApiKeyConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  serviceId: string;
  serviceName: string;
  fields: ApiKeyFieldConfig[];
}

export function ApiKeyConnectDialog({
  open,
  onOpenChange,
  projectId,
  serviceId,
  serviceName,
  fields,
}: ApiKeyConnectDialogProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const connectMutation = useConnectServiceAccount(projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const missingFields = fields
      .filter((f) => f.is_required && !values[f.name]?.trim())
      .map((f) => f.label_ko);

    if (missingFields.length > 0) {
      toast.error(`필수 필드를 입력해주세요: ${missingFields.join(', ')}`);
      return;
    }

    // Filter out empty optional fields
    const apiKeys: Record<string, string> = {};
    for (const field of fields) {
      const val = values[field.name]?.trim();
      if (val) apiKeys[field.name] = val;
    }

    connectMutation.mutate(
      {
        project_id: projectId,
        service_id: serviceId,
        api_keys: apiKeys,
      },
      {
        onSuccess: () => {
          toast.success(`${serviceName} 계정이 연결되었습니다`);
          setValues({});
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const toggleShow = (fieldName: string) => {
    setShowValues((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{serviceName} API Key 연결</DialogTitle>
          <DialogDescription>
            API 키를 입력하여 {serviceName} 계정을 연결합니다. 키는 암호화되어 안전하게 저장됩니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={field.name} className="text-sm">
                  {field.label_ko}
                  {field.is_required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {field.help_url && (
                  <a
                    href={field.help_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                  >
                    키 발급
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="relative">
                <Input
                  id={field.name}
                  type={showValues[field.name] ? 'text' : 'password'}
                  placeholder={field.placeholder}
                  value={values[field.name] || ''}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  className="pr-10 font-mono text-xs"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => toggleShow(field.name)}
                >
                  {showValues[field.name] ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          ))}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={connectMutation.isPending}>
              {connectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  연결 중...
                </>
              ) : (
                '연결'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
