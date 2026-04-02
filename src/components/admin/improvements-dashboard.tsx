'use client';

import { useState } from 'react';
import {
  Shield, Users, Megaphone, ListChecks, AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type TabKey = 'competition' | 'community' | 'marketing' | 'actions';

interface TabConfig {
  key: TabKey;
  label: string;
  icon: React.ElementType;
  description: string;
}

const TABS: TabConfig[] = [
  { key: 'competition', label: '경쟁 환경', icon: Shield, description: '유사 서비스 분석 및 진입장벽' },
  { key: 'community', label: '커뮤니티 전략', icon: Users, description: '초보자 온라인 커뮤니티 운영' },
  { key: 'marketing', label: '마케팅 방향', icon: Megaphone, description: '핵심 메시지 및 실행 전략' },
  { key: 'actions', label: '액션 아이템', icon: ListChecks, description: '우선순위별 실행 항목' },
];

interface ActionItem {
  id: number;
  title: string;
  priority: 'P1' | 'P2';
  note: string;
  status: 'pending' | 'in-progress' | 'done';
}

const ACTION_ITEMS: ActionItem[] = [
  { id: 1, title: '글로벌 경쟁사 상세 벤치마킹 (Doppler, Vault 등)', priority: 'P1', note: '차별화 포인트 도출', status: 'pending' },
  { id: 2, title: '커뮤니티 MVP 설계', priority: 'P1', note: '배포 자랑하기 + 피드백 루프', status: 'pending' },
  { id: 3, title: '초보자 행동 데이터 수집 파이프라인', priority: 'P1', note: '에러 패턴, 이탈 구간 분석', status: 'pending' },
  { id: 4, title: '템플릿 마켓플레이스 설계', priority: 'P2', note: 'UGC 생태계 구축', status: 'pending' },
  { id: 5, title: '마케팅 콘텐츠 제작', priority: 'P2', note: '1인 개발자 성공 스토리', status: 'pending' },
];

export default function ImprovementsDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('competition');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">개선사항 관리</h1>
        <p className="text-muted-foreground mt-1">
          투자자/멘토 피드백 기반 서비스 개선 방향 (관리자 전용)
        </p>
      </div>

      {/* Summary Card */}
      <Card className="border-brand-blue/20 bg-brand-blue/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium">핵심 피드백 요약</p>
              <p className="text-sm text-muted-foreground">
                서비스 디테일과 온보딩, 수익 구조 모두 우수. 단, AI 도구(Claude Code 등)로 1~2주 내 동일 서비스 구현이 가능하므로
                <span className="font-semibold text-foreground"> 기능 카피로는 따라올 수 없는 경쟁력</span> 확보가 핵심 과제.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-blue text-white'
                  : 'bg-card border hover:bg-muted'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'competition' && <CompetitionTab />}
      {activeTab === 'community' && <CommunityTab />}
      {activeTab === 'marketing' && <MarketingTab />}
      {activeTab === 'actions' && <ActionsTab items={ACTION_ITEMS} />}
    </div>
  );
}

/* ────────────────────── Tab Components ────────────────────── */

function CompetitionTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">글로벌 경쟁사</CardTitle>
          <CardDescription>유사 서비스 분석 (상세 벤치마킹 필요)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <CompetitorRow name="Doppler" description="시크릿 관리 SaaS" />
          <CompetitorRow name="HashiCorp Vault" description="인프라 시크릿 관리" />
          <p className="text-xs text-muted-foreground pt-2">
            * 추후 상세 벤치마킹을 통해 차별화 포인트 도출 필요
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">핵심 리스크</CardTitle>
          <CardDescription>낮은 진입장벽</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-destructive/10 p-3 space-y-2">
            <p className="text-sm font-medium text-destructive">AI 도구로 1~2주 내 동일 서비스 구현 가능</p>
            <p className="text-sm text-muted-foreground">
              서비스 공개 후 카피캣 출현 가능성 높음. 기능 자체만으로는 방어 어려움.
            </p>
          </div>
          <div className="rounded-lg bg-brand-green/10 p-3 space-y-2">
            <p className="text-sm font-medium text-brand-green">솔루션: 데이터 기반 경쟁력</p>
            <p className="text-sm text-muted-foreground">
              초보자 행동 데이터(에러 패턴, 이탈 구간)를 독점 확보하여 AI 고도화 →
              단순 기능 카피로는 따라올 수 없는 경쟁력 구축
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CommunityTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">초보자 개발자 온라인 커뮤니티</CardTitle>
          <CardDescription>
            진입장벽 강화의 핵심 — 초보자 행동 데이터 독점 확보
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            커뮤니티를 통해 수집하는 데이터를 AI 고도화에 활용하면,
            <span className="font-semibold text-foreground"> 세상에서 초보자의 마음을 가장 잘 읽는 AI 도구</span>가 될 수 있음.
          </p>

          {/* Data Collection Table */}
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">수집 데이터</th>
                  <th className="text-left p-3 font-medium">활용 방안</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3">어떤 템플릿에서 오류가 많이 나는가?</td>
                  <td className="p-3 text-muted-foreground">템플릿 품질 개선, 자동 에러 해결 AI</td>
                </tr>
                <tr>
                  <td className="p-3">어떤 환경변수 설정을 어려워하는가?</td>
                  <td className="p-3 text-muted-foreground">가이드 자동 생성, 원클릭 설정 고도화</td>
                </tr>
                <tr>
                  <td className="p-3">가장 많이 막히는 구간</td>
                  <td className="p-3 text-muted-foreground">AI 코파일럿 정확도 향상</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">배포 자랑하기 (Deploy Showcase)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              초보자들은 자신이 만든 결과물을 자랑하고 싶어 함
            </p>
            <ul className="text-sm space-y-1.5 list-disc list-inside text-muted-foreground">
              <li>{'"LinkmapHero로 3분 만에 만든 홈페이지"를 커뮤니티에 공유'}</li>
              <li>서로 피드백을 주고받는 문화 조성</li>
              <li>공유 → 유입 → 가입의 바이럴 루프</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">템플릿 생태계</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Notion 템플릿 커뮤니티와 유사한 모델
            </p>
            <ul className="text-sm space-y-1.5 list-disc list-inside text-muted-foreground">
              <li>숙련된 유저가 초보자를 위한 Linkmap 전용 템플릿 제작</li>
              <li>템플릿 제작자는 명성(reputation)을 얻는 구조</li>
              <li>UGC 기반 콘텐츠 → 플랫폼 락인 효과</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MarketingTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">핵심 메시지</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border p-4 space-y-2">
            <p className="text-lg font-semibold text-brand-blue">
              {'"AI와 함께 11일 만에 서비스를 뽑아내는 새로운 개발 방식"'}
            </p>
          </div>
          <div className="rounded-lg border p-4 space-y-2">
            <p className="text-lg font-semibold text-brand-green">
              {'"코딩 몰라도 서비스 사장이 될 수 있다"'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">실행 전략</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">1인 개발자 성공 사례 노출</h4>
            <p className="text-sm text-muted-foreground">
              사업소개서의 실제 데이터(매출, 유저 수 등)를 지속적으로 노출하여 유저 유입 유도
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">선순환 구조</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <Badge variant="outline">유저 유입</Badge>
              <ChevronRight className="h-3 w-3" />
              <Badge variant="outline">커뮤니티 활성화</Badge>
              <ChevronRight className="h-3 w-3" />
              <Badge variant="outline">데이터 확보</Badge>
              <ChevronRight className="h-3 w-3" />
              <Badge variant="outline">AI 고도화</Badge>
              <ChevronRight className="h-3 w-3" />
              <Badge variant="outline">유저 유입</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActionsTab({ items }: { items: ActionItem[] }) {
  const priorityColor = (p: string) =>
    p === 'P1' ? 'bg-red-500/10 text-red-600 border-red-500/20' : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';

  const statusLabel = (s: string) => {
    if (s === 'done') return { text: '완료', color: 'bg-green-500/10 text-green-600' };
    if (s === 'in-progress') return { text: '진행 중', color: 'bg-blue-500/10 text-blue-600' };
    return { text: '대기', color: 'bg-muted text-muted-foreground' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">액션 아이템</CardTitle>
        <CardDescription>우선순위별 실행 항목</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => {
            const status = statusLabel(item.status);
            return (
              <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <Badge variant="outline" className={priorityColor(item.priority)}>
                  {item.priority}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                </div>
                <Badge variant="outline" className={status.color}>
                  {status.text}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ────────────────────── Helpers ────────────────────── */

function CompetitorRow({ name, description }: { name: string; description: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg border">
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Badge variant="outline" className="text-xs">벤치마킹 필요</Badge>
    </div>
  );
}
