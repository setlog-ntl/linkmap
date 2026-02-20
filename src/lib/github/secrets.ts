import { githubFetch } from './client';

export interface GitHubSecret {
  name: string;
  created_at: string;
  updated_at: string;
}

export interface GitHubPublicKey {
  key_id: string;
  key: string;
}

export async function listRepoSecrets(
  token: string,
  owner: string,
  repo: string
): Promise<{ total_count: number; secrets: GitHubSecret[] }> {
  return githubFetch(`/repos/${owner}/${repo}/actions/secrets`, { token });
}

export async function getRepoPublicKey(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubPublicKey> {
  return githubFetch(`/repos/${owner}/${repo}/actions/secrets/public-key`, { token });
}

export async function createOrUpdateSecret(
  token: string,
  owner: string,
  repo: string,
  secretName: string,
  encryptedValue: string,
  keyId: string
): Promise<void> {
  await githubFetch(`/repos/${owner}/${repo}/actions/secrets/${secretName}`, {
    token,
    method: 'PUT',
    body: {
      encrypted_value: encryptedValue,
      key_id: keyId,
    },
  });
}

export async function deleteSecret(
  token: string,
  owner: string,
  repo: string,
  secretName: string
): Promise<void> {
  await githubFetch(`/repos/${owner}/${repo}/actions/secrets/${secretName}`, {
    token,
    method: 'DELETE',
  });
}
