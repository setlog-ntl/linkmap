'use client';

import { useLinkedRepos } from '@/lib/queries/github';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GitBranch } from 'lucide-react';

interface GitHubConnectionInfoProps {
  projectId: string;
  compact?: boolean;
}

export function GitHubConnectionInfo({ projectId, compact }: GitHubConnectionInfoProps) {
  const { data: linkedRepos = [] } = useLinkedRepos(projectId);

  if (linkedRepos.length === 0) {
    return (
      <span className="text-[10px] text-muted-foreground">
        연결된 레포 없음
      </span>
    );
  }

  // Group repos by service_account
  const accountMap = new Map<string, {
    login: string;
    avatarUrl: string;
    displayName: string | null;
    repos: string[];
  }>();

  for (const repo of linkedRepos) {
    const sa = repo.service_account;
    const accountKey = sa?.id || 'unknown';
    if (!accountMap.has(accountKey)) {
      const meta = (sa?.oauth_metadata || {}) as Record<string, string>;
      accountMap.set(accountKey, {
        login: meta.login || sa?.display_name || 'unknown',
        avatarUrl: meta.avatar_url || '',
        displayName: sa?.display_name || null,
        repos: [],
      });
    }
    accountMap.get(accountKey)!.repos.push(repo.repo_full_name);
  }

  if (compact) {
    const accounts = Array.from(accountMap.values());
    return (
      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
        {accounts.map((acc, i) => (
          <span key={i} className="flex items-center gap-1">
            <Avatar className="h-3.5 w-3.5">
              <AvatarImage src={acc.avatarUrl} />
              <AvatarFallback className="text-[7px]">{acc.login.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            @{acc.login}
          </span>
        ))}
        <span className="opacity-50">·</span>
        <GitBranch className="h-3 w-3" />
        {linkedRepos.length}
      </div>
    );
  }

  // Full display
  return (
    <div className="space-y-2">
      {Array.from(accountMap.entries()).map(([key, acc]) => (
        <div key={key} className="space-y-1">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={acc.avatarUrl} />
              <AvatarFallback className="text-[9px]">{acc.login.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">@{acc.login}</span>
            {acc.displayName && acc.displayName !== acc.login && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{acc.displayName}</Badge>
            )}
          </div>
          <div className="pl-7 space-y-0.5">
            {acc.repos.map((repoName) => (
              <div key={repoName} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <GitBranch className="h-3 w-3" />
                {repoName}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
