'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Badge } from '@/components/ui/badge';

const serverRoles = [
  {
    emoji: '📂',
    name: '웹 서버',
    subtitle: 'Web Server',
    desc: 'HTML, CSS, 이미지 등 파일을 사용자 브라우저에 전송합니다. Apache, Nginx가 대표적입니다.',
    analogy: '우체국 — 편지(파일)를 받는 사람(브라우저)에게 배달',
  },
  {
    emoji: '🗄️',
    name: 'DB 서버',
    subtitle: 'Database Server',
    desc: '데이터를 저장하고, 검색·수정 요청에 응답합니다. PostgreSQL, MySQL, MongoDB 등이 있습니다.',
    analogy: '도서관 — 책(데이터)을 보관하고 요청 시 찾아줌',
  },
  {
    emoji: '⚙️',
    name: '앱 서버',
    subtitle: 'Application Server',
    desc: '비즈니스 로직(계산, 인증, 결제 등)을 실행합니다. Node.js, Python, Java가 여기서 돌아갑니다.',
    analogy: '공장 — 원재료(입력)를 받아 제품(결과)을 만들어냄',
  },
];

const serverTypes = [
  {
    emoji: '🖥️',
    name: '물리 서버',
    subtitle: 'Bare Metal',
    desc: '실제 하드웨어 컴퓨터를 통째로 사용합니다. 성능이 좋지만 비싸고 관리가 어렵습니다.',
    level: '상급',
    levelColor: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
  },
  {
    emoji: '📦',
    name: '가상 서버 (VPS)',
    subtitle: 'Virtual Private Server',
    desc: '하나의 물리 서버를 여러 개로 나눠 쓰는 방식입니다. 저렴하면서도 독립된 환경을 제공합니다.',
    level: '중급',
    levelColor: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
  },
  {
    emoji: '☁️',
    name: '서버리스',
    subtitle: 'Serverless',
    desc: '서버 관리가 전혀 필요 없습니다. 코드를 올리면 요청이 올 때만 실행되고, 나머지 시간에는 비용이 0원입니다.',
    level: '초급 OK',
    levelColor: 'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300',
  },
];

export function WhatIsServerSection() {
  return (
    <section id="what-is-server" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">서버란 무엇인가?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          서버는 본질적으로 <strong className="text-foreground">항상 켜져 있는 컴퓨터</strong>입니다.
          여러분의 노트북과 같은 컴퓨터이지만, 24시간 365일 꺼지지 않고 다른 사람들의 요청에 응답합니다.
        </p>
      </ScrollReveal>

      {/* 실생활 비유 */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-2xl mb-10">
          <div className="rounded-xl border bg-card shadow-sm p-5">
            <h3 className="font-semibold mb-4 text-sm">💡 실생활 비유로 이해하기</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏪</span>
                <div>
                  <div className="font-medium">편의점 (= 서버)</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    24시간 영업. 누구나 언제든 와서
                    물건(데이터)을 살 수 있습니다.
                    직원이 항상 대기하고 있죠.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏠</span>
                <div>
                  <div className="font-medium">개인 냉장고 (= 내 컴퓨터)</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    내가 집에 있을 때만 꺼내 먹을 수 있습니다.
                    외출하면 아무도 접근 불가.
                    나만 쓰는 용도.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 서버의 역할 3가지 */}
      <ScrollReveal delay={0.15}>
        <h3 className="text-lg font-semibold mb-4">서버의 역할 3가지</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {serverRoles.map((role) => (
            <div key={role.name} className="rounded-xl border bg-card shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{role.emoji}</span>
                <div>
                  <div className="font-bold text-sm">{role.name}</div>
                  <div className="text-[10px] text-muted-foreground">{role.subtitle}</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{role.desc}</p>
              <div className="text-[11px] px-3 py-1.5 rounded-lg bg-muted/60">
                <span className="text-muted-foreground">비유: </span>
                <span className="font-medium text-foreground">{role.analogy}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 물리 서버 vs 가상 서버 vs 서버리스 */}
      <ScrollReveal delay={0.2}>
        <h3 className="text-lg font-semibold mb-4">서버의 종류 (간단 소개)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serverTypes.map((type) => (
            <div key={type.name} className="rounded-xl border bg-card shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{type.emoji}</span>
                  <div>
                    <div className="font-bold text-sm">{type.name}</div>
                    <div className="text-[10px] text-muted-foreground">{type.subtitle}</div>
                  </div>
                </div>
                <Badge variant="secondary" className={`text-[10px] shrink-0 ${type.levelColor}`}>
                  {type.level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{type.desc}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
