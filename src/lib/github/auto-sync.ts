/**
 * Auto-sync: push env vars to GitHub Secrets when auto_sync_enabled repos exist.
 * Called asynchronously (non-blocking) after env var CUD operations.
 */
import { createAdminClient } from '@/lib/supabase/admin';
import { decrypt } from '@/lib/crypto';
import { getRepoPublicKey, createOrUpdateSecret, deleteSecret } from './api';
import { encryptSecretForGitHub } from './nacl-encrypt';
import { mapEnvVarToSecretName } from './auto-map';
import { logAudit } from '@/lib/audit';

export interface AutoSyncResult {
  repo: string;
  syncedCount: number;
  deletedCount: number;
  failedSecrets: Array<{ key_name: string; error: string }>;
  status: 'success' | 'partial' | 'failed';
}

export async function triggerAutoSync(
  projectId: string,
  environment: string,
  userId: string,
  options?: { deletedKeys?: string[] }
): Promise<AutoSyncResult[]> {
  const supabase = createAdminClient();
  const results: AutoSyncResult[] = [];
  const deletedKeys = options?.deletedKeys ?? [];

  // Find repos with auto_sync_enabled matching this environment
  const { data: repos } = await supabase
    .from('project_github_repos')
    .select('*, service_accounts:service_account_id(encrypted_access_token)')
    .eq('project_id', projectId)
    .eq('auto_sync_enabled', true)
    .eq('sync_environment', environment);

  if (!repos || repos.length === 0) return results;

  // Get all active env vars for this project+environment
  const { data: envVars } = await supabase
    .from('environment_variables')
    .select('id, key_name, encrypted_value')
    .eq('project_id', projectId)
    .eq('environment', environment)
    .is('deleted_at', null);

  // Even if no env vars, we may still need to delete secrets
  if ((!envVars || envVars.length === 0) && deletedKeys.length === 0) return results;

  for (const repo of repos) {
    const result: AutoSyncResult = {
      repo: repo.repo_full_name,
      syncedCount: 0,
      deletedCount: 0,
      failedSecrets: [],
      status: 'success',
    };

    try {
      const tokenRecord = repo.service_accounts as { id?: string; encrypted_access_token: string } | null;
      if (!tokenRecord) continue;

      let token: string;
      try {
        token = decrypt(tokenRecord.encrypted_access_token);
      } catch {
        console.error(`Auto-sync: token decryption failed for repo ${repo.repo_full_name} (key rotated?)`);
        result.status = 'failed';
        result.failedSecrets.push({ key_name: '*', error: '토큰 복호화 실패' });
        results.push(result);
        continue;
      }

      // Delete secrets for deleted env var keys
      for (const key of deletedKeys) {
        const secretName = mapEnvVarToSecretName(key);
        try {
          await deleteSecret(token, repo.owner, repo.repo_name, secretName);
          result.deletedCount++;
        } catch (err) {
          // 404 is expected if the secret doesn't exist in GitHub
          const is404 = err instanceof Error && err.message.includes('404');
          if (!is404) {
            const errorMsg = err instanceof Error ? err.message : '알 수 없는 오류';
            console.error(
              `Auto-sync: failed to delete secret "${key}" from ${repo.repo_full_name}:`,
              errorMsg
            );
            result.failedSecrets.push({ key_name: key, error: `삭제 실패: ${errorMsg}` });
          }
        }
      }

      // Push remaining env vars
      if (envVars && envVars.length > 0) {
        const publicKey = await getRepoPublicKey(token, repo.owner, repo.repo_name);

        for (const ev of envVars) {
          try {
            const secretName = mapEnvVarToSecretName(ev.key_name);
            const plainValue = decrypt(ev.encrypted_value);
            const naclEncrypted = encryptSecretForGitHub(plainValue, publicKey.key);
            await createOrUpdateSecret(token, repo.owner, repo.repo_name, secretName, naclEncrypted, publicKey.key_id);
            result.syncedCount++;
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : '알 수 없는 오류';
            // Retry once on failure
            try {
              const secretName = mapEnvVarToSecretName(ev.key_name);
              const plainValue = decrypt(ev.encrypted_value);
              const naclEncrypted = encryptSecretForGitHub(plainValue, publicKey.key);
              await createOrUpdateSecret(token, repo.owner, repo.repo_name, secretName, naclEncrypted, publicKey.key_id);
              result.syncedCount++;
            } catch (retryErr) {
              const retryMsg = retryErr instanceof Error ? retryErr.message : errorMsg;
              console.error(
                `Auto-sync: failed to sync secret "${ev.key_name}" to ${repo.repo_full_name} (after retry):`,
                retryMsg
              );
              result.failedSecrets.push({ key_name: ev.key_name, error: retryMsg });
            }
          }
        }
      }

      // Determine overall status
      const totalOps = (envVars?.length ?? 0) + deletedKeys.length;
      if (result.failedSecrets.length === 0) {
        result.status = 'success';
      } else if (result.failedSecrets.length < totalOps) {
        result.status = 'partial';
      } else {
        result.status = 'failed';
      }

      // Update sync status on repo record
      const now = new Date().toISOString();
      await supabase
        .from('project_github_repos')
        .update({
          last_synced_at: now,
          last_sync_status: result.status,
          last_sync_error: result.failedSecrets.length > 0
            ? result.failedSecrets.map(f => `${f.key_name}: ${f.error}`).join('; ')
            : null,
          updated_at: now,
        })
        .eq('id', repo.id);

      await logAudit(userId, {
        action: 'github.auto_sync',
        resourceType: 'project_github_repo',
        resourceId: repo.id,
        details: {
          repo: repo.repo_full_name,
          environment,
          synced_count: result.syncedCount,
          deleted_count: result.deletedCount,
          total: totalOps,
          ...(result.failedSecrets.length > 0 && { failed_secrets: result.failedSecrets }),
        },
      });

      results.push(result);
    } catch (err) {
      console.error(`Auto-sync failed for ${repo.repo_full_name}:`, err);
      result.status = 'failed';
      result.failedSecrets.push({
        key_name: '*',
        error: err instanceof Error ? err.message : '알 수 없는 오류',
      });
      results.push(result);
    }
  }

  return results;
}
