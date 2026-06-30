import type {
  EnvironmentVariable,
  ServiceCredential,
  SecureNote,
  VaultItem,
} from '@/types';
import { secureNoteCategoryLabels } from '@/lib/constants/secure-note';

const purposeLabels: Record<string, string> = {
  admin: '관리자',
  demo: '데모',
  deploy: '배포',
  monitoring: '모니터링',
  api: 'API',
  other: '기타',
};

/** 환경변수·비밀키·보안메모를 단일 표시 모델(VaultItem[])로 병합한다. */
export function toVaultItems(
  envVars: EnvironmentVariable[],
  credentials: ServiceCredential[],
  notes: SecureNote[],
): VaultItem[] {
  const items: VaultItem[] = [];

  for (const e of envVars) {
    items.push({
      key: `env:${e.id}`,
      kind: 'env',
      id: e.id,
      serviceId: e.service_id,
      title: e.key_name,
      subtitle: null,
      environment: e.environment,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
      raw: e,
    });
  }

  for (const c of credentials) {
    items.push({
      key: `credential:${c.id}`,
      kind: 'credential',
      id: c.id,
      serviceId: c.service_id,
      title: c.label,
      subtitle: purposeLabels[c.purpose] ?? c.purpose,
      environment: c.environment,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      raw: c,
    });
  }

  for (const n of notes) {
    items.push({
      key: `note:${n.id}`,
      kind: 'note',
      id: n.id,
      serviceId: n.service_id,
      title: n.title,
      subtitle: secureNoteCategoryLabels[n.category],
      environment: n.environment,
      createdAt: n.created_at,
      updatedAt: n.updated_at,
      raw: n,
    });
  }

  return items;
}

export interface VaultGroupData {
  serviceId: string | null;
  serviceName: string;
  items: VaultItem[];
  counts: { env: number; credential: number; note: number };
}

/** VaultItem[]를 서비스별로 그룹핑한다. 미연결 그룹은 항상 마지막. */
export function groupByService(
  items: VaultItem[],
  serviceNameMap: Map<string, string>,
): VaultGroupData[] {
  const buckets = new Map<string, VaultItem[]>();
  for (const it of items) {
    const k = it.serviceId ?? '__none__';
    const list = buckets.get(k);
    if (list) list.push(it);
    else buckets.set(k, [it]);
  }

  const groups: VaultGroupData[] = [];
  for (const [k, list] of buckets) {
    const serviceId = k === '__none__' ? null : k;
    const counts = { env: 0, credential: 0, note: 0 };
    for (const it of list) counts[it.kind] += 1;
    groups.push({
      serviceId,
      serviceName: serviceId ? serviceNameMap.get(serviceId) ?? serviceId : '미연결',
      items: list,
      counts,
    });
  }

  groups.sort((a, b) => {
    if (a.serviceId === null) return 1;
    if (b.serviceId === null) return -1;
    return a.serviceName.localeCompare(b.serviceName);
  });

  return groups;
}
