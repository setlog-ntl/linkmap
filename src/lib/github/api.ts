/**
 * GitHub API — barrel re-export from domain submodules.
 * All existing imports from '@/lib/github/api' continue to work.
 */
export { githubFetch, GitHubApiError } from './client';
export type { GitHubRequestOptions } from './client';

export { listUserRepos, getRepo, createRepo, deleteRepo, updateRepoSettings } from './repos';
export type { GitHubRepo } from './repos';

export { listRepoSecrets, getRepoPublicKey, createOrUpdateSecret, deleteSecret } from './secrets';
export type { GitHubSecret, GitHubPublicKey } from './secrets';

export { enableGitHubPages, enableGitHubPagesWithActions, getGitHubPagesStatus, triggerWorkflowDispatch, getLatestWorkflowRun } from './pages';
export type { GitHubPagesResult, WorkflowRun } from './pages';

export { listRepoContents, getFileContent, createOrUpdateFileContent } from './content';
export type { GitHubContentItem, GitHubFileContentResponse, GitHubFileContentResult } from './content';

export { createBlob, createTree, createCommit, createRef, getRef, updateRef, pushFilesAtomically, getGitTreeRecursive } from './git-data';

export { forkRepo, generateFromTemplate } from './forks';
export type { GitHubForkResult, GitHubGenerateResult } from './forks';
