'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject, useUpdateProject, useDeleteProject } from '@/lib/queries/projects';
import { Save, Trash2, Users, UserPlus, Shield, Edit, Eye, GitBranch, RefreshCw, History } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useLocaleStore } from '@/stores/locale-store';
import { t } from '@/lib/i18n';
import { useLinkedRepos, useUnlinkRepo } from '@/lib/queries/github';
import { RepoSelector } from '@/components/github/repo-selector';
import { AuditContent } from '@/components/project/audit-content';

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Shield className="h-4 w-4" />,
  editor: <Edit className="h-4 w-4" />,
  viewer: <Eye className="h-4 w-4" />,
};

const roleLabelKeys: Record<string, string> = {
  admin: 'project.teamRoleAdmin',
  editor: 'project.teamRoleEditor',
  viewer: 'project.teamRoleViewer',
};

interface TeamMember {
  id: string;
  role: string;
  joined_at: string;
  user: { email: string; raw_user_meta_data: { name?: string } };
}

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { data: project, isLoading } = useProject(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const { locale } = useLocaleStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [nameInitialized, setNameInitialized] = useState(false);

  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('viewer');
  const [inviting, setInviting] = useState(false);

  if (!nameInitialized && project) {
    setName(project.name);
    setDescription(project.description || '');
    setLinkUrl(project.link_url || '');
    setNameInitialized(true);
  }

  const loadMembers = useCallback(async () => {
    if (!project?.team_id) return;
    try {
      const res = await fetch(`/api/teams/${project.team_id}/members`);
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data.members || []);
      }
    } catch { /* ignore */ }
  }, [project?.team_id]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const handleSave = () => {
    if (!name.trim()) return;
    const trimmedLink = linkUrl.trim() || null;
    if (trimmedLink && !/^https?:\/\/.+/.test(trimmedLink)) {
      toast.error(t(locale, 'project.settingsInvalidUrl'));
      return;
    }
    updateProject.mutate(
      { id: projectId, name: name.trim(), description: description.trim() || null, link_url: trimmedLink },
      {
        onSuccess: () => toast.success(t(locale, 'project.settingsUpdated')),
        onError: () => toast.error(t(locale, 'project.settingsUpdateFailed')),
      }
    );
  };

  const handleDelete = async () => {
    return new Promise<void>((resolve, reject) => {
      deleteProject.mutate(projectId, {
        onSuccess: () => { router.push('/dashboard'); resolve(); },
        onError: () => { toast.error(t(locale, 'project.settingsDeleteFailed')); reject(); },
      });
    });
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !project?.team_id) return;
    setInviting(true);
    try {
      const res = await fetch(`/api/teams/${project.team_id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || t(locale, 'project.teamInviteFailed'));
        return;
      }
      toast.success(`${inviteEmail}${t(locale, 'project.teamInviteSuccess')}`);
      setInviteEmail('');
      loadMembers();
    } catch {
      toast.error(t(locale, 'project.teamInviteFailed'));
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!project?.team_id) return;
    try {
      const res = await fetch(`/api/teams/${project.team_id}/members?member_id=${memberId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || t(locale, 'project.teamRemoveFailed'));
        return;
      }
      toast.success(t(locale, 'project.teamRemoveSuccess'));
      loadMembers();
    } catch {
      toast.error(t(locale, 'project.teamRemoveFailed'));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Project Info */}
      <Card id="project-info">
        <CardHeader>
          <CardTitle>{t(locale, 'project.settingsTitle')}</CardTitle>
          <CardDescription>{t(locale, 'project.settingsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">{t(locale, 'project.settingsName')}</Label>
            <Input id="project-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">{t(locale, 'project.settingsDescription')}</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-link">{t(locale, 'project.linkUrl')}</Label>
            <Input
              id="project-link"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <Button onClick={handleSave} disabled={updateProject.isPending || !name.trim()}>
            <Save className="mr-2 h-4 w-4" />
            {updateProject.isPending ? t(locale, 'project.settingsSaving') : t(locale, 'project.settingsSave')}
          </Button>
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card id="team">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>{t(locale, 'project.teamTitle')}</CardTitle>
          </div>
          <CardDescription>{t(locale, 'project.teamDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {project?.team_id ? (
            <>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder={t(locale, 'project.teamEmailPlaceholder')}
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t(locale, 'project.teamRoleAdmin')}</SelectItem>
                      <SelectItem value="editor">{t(locale, 'project.teamRoleEditor')}</SelectItem>
                      <SelectItem value="viewer">{t(locale, 'project.teamRoleViewer')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleInvite} disabled={inviting || !inviteEmail}>
                    <UserPlus className="h-4 w-4 mr-1" />
                    {t(locale, 'project.teamInvite')}
                  </Button>
                </div>
              </div>

              {teamMembers.length > 0 ? (
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          {member.user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {member.user?.raw_user_meta_data?.name || member.user?.email}
                          </p>
                          <p className="text-xs text-muted-foreground">{member.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          {roleIcons[member.role]}
                          {t(locale, roleLabelKeys[member.role] || 'project.teamRoleViewer')}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t(locale, 'project.teamEmpty')}</p>
                  <p className="text-xs">{t(locale, 'project.teamEmptyDesc')}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t(locale, 'project.teamPersonal')}</p>
              <p className="text-xs">{t(locale, 'project.teamPersonalDesc')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GitHub Integration */}
      <GitHubSettingsCard projectId={projectId} />

      {/* Change History (Audit Log) */}
      <Card id="audit">
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <CardTitle>{t(locale, 'project.changeHistory')}</CardTitle>
          </div>
          <CardDescription>{t(locale, 'project.auditDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <AuditContent projectId={projectId} />
        </CardContent>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <Card id="danger" className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">{t(locale, 'project.dangerZone')}</CardTitle>
          <CardDescription>{t(locale, 'project.dangerDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ConfirmDialog
            trigger={
              <Button variant="destructive" disabled={deleteProject.isPending}>
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteProject.isPending ? t(locale, 'common.deleting') : t(locale, 'project.deleteProject')}
              </Button>
            }
            title={t(locale, 'common.deleteConfirmTitle')}
            description={t(locale, 'project.dangerDesc')}
            confirmLabel={t(locale, 'common.delete')}
            cancelLabel={t(locale, 'common.cancel')}
            variant="destructive"
            onConfirm={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- GitHub Settings ----------

function GitHubSettingsCard({ projectId }: { projectId: string }) {
  const { locale } = useLocaleStore();
  const { data: linkedRepos = [], isLoading } = useLinkedRepos(projectId);
  const unlinkRepo = useUnlinkRepo(projectId);

  return (
    <Card id="github">
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          <CardTitle>{t(locale, 'project.githubTitle')}</CardTitle>
        </div>
        <CardDescription>{t(locale, 'project.githubDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-16" />
        ) : linkedRepos.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t(locale, 'project.githubEmpty')}</p>
            <p className="text-xs mb-3">{t(locale, 'project.githubEmptyDesc')}</p>
            <RepoSelector projectId={projectId} />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {linkedRepos.map((repo) => (
                <div key={repo.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <GitBranch className="h-3.5 w-3.5" />
                      {repo.repo_full_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {repo.auto_sync_enabled && (
                        <Badge variant="secondary" className="text-[10px]">
                          <RefreshCw className="h-2.5 w-2.5 mr-1" />
                          {t(locale, 'project.githubAutoSync')}
                        </Badge>
                      )}
                      {repo.last_synced_at && (
                        <span className="text-[10px] text-muted-foreground">
                          {t(locale, 'project.githubLastSync')}: {new Date(repo.last_synced_at).toLocaleString(locale === 'ko' ? 'ko-KR' : 'en-US')}
                        </span>
                      )}
                    </div>
                  </div>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={unlinkRepo.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    }
                    title={t(locale, 'common.unlinkConfirmTitle')}
                    description={`${repo.repo_full_name} ${t(locale, 'project.githubUnlinkConfirm')}`}
                    confirmLabel={t(locale, 'common.delete')}
                    cancelLabel={t(locale, 'common.cancel')}
                    variant="destructive"
                    onConfirm={() => {
                      return new Promise<void>((resolve, reject) => {
                        unlinkRepo.mutate(repo.id, {
                          onSuccess: () => { toast.success(t(locale, 'project.githubUnlinked')); resolve(); },
                          onError: () => { toast.error(t(locale, 'project.githubUnlinkFailed')); reject(); },
                        });
                      });
                    }}
                  />
                </div>
              ))}
            </div>
            <RepoSelector projectId={projectId} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
