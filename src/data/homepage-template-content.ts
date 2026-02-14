/**
 * Homepage template content for one-click deploy.
 * Each template contains the files to be pushed to a new GitHub repo.
 * The setup-templates admin endpoint uses this data to create template repos.
 */

import { devShowcaseTemplate } from './dev-showcase-template';

export interface TemplateFile {
  path: string;
  content: string;
}

export interface HomepageTemplateContent {
  slug: string;
  repoName: string;
  description: string;
  files: TemplateFile[];
}

// ──────────────────────────────────────────────
// 1. Portfolio Static
// ──────────────────────────────────────────────
const portfolioIndex = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>내 포트폴리오</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="hero">
    <div class="container">
      <div class="avatar">
        <div class="avatar-placeholder">홍</div>
      </div>
      <h1>홍길동</h1>
      <p class="subtitle">프론트엔드 개발자</p>
      <p class="bio">깔끔하고 반응형인 웹 경험을 만듭니다.</p>
      <div class="social-links">
        <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:hello@example.com">이메일</a>
      </div>
    </div>
  </header>

  <main class="container">
    <section class="section" id="skills">
      <h2>기술 스택</h2>
      <div class="tags">
        <span class="tag">HTML / CSS</span>
        <span class="tag">JavaScript</span>
        <span class="tag">TypeScript</span>
        <span class="tag">React</span>
        <span class="tag">Next.js</span>
        <span class="tag">Node.js</span>
      </div>
    </section>

    <section class="section" id="projects">
      <h2>프로젝트</h2>
      <div class="grid">
        <div class="card">
          <h3>프로젝트 알파</h3>
          <p>React와 Tailwind CSS로 만든 반응형 대시보드입니다.</p>
          <a href="#" class="link">보기 &rarr;</a>
        </div>
        <div class="card">
          <h3>프로젝트 베타</h3>
          <p>Node.js와 PostgreSQL 기반 REST API 서비스입니다.</p>
          <a href="#" class="link">보기 &rarr;</a>
        </div>
        <div class="card">
          <h3>프로젝트 감마</h3>
          <p>모바일 퍼스트 이커머스 랜딩 페이지입니다.</p>
          <a href="#" class="link">보기 &rarr;</a>
        </div>
      </div>
    </section>

    <section class="section" id="contact">
      <h2>연락처</h2>
      <p>언제든지 <a href="mailto:hello@example.com">hello@example.com</a>으로 연락주세요.</p>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2026 내 포트폴리오. Linkmap으로 제작.</p>
    </div>
  </footer>
</body>
</html>`;

const portfolioStyle = `/* Portfolio Template */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--primary:#2563eb;--bg:#f8fafc;--surface:#fff;--text:#1e293b;--muted:#64748b;--border:#e2e8f0;--radius:12px}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
.container{max-width:800px;margin:0 auto;padding:0 1.5rem}
.hero{text-align:center;padding:4rem 0 3rem;background:linear-gradient(135deg,#eff6ff,#f8fafc)}
.avatar-placeholder{width:96px;height:96px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:700;margin:0 auto 1.5rem}
h1{font-size:2rem;margin-bottom:.25rem}
.subtitle{color:var(--primary);font-weight:600;margin-bottom:.5rem}
.bio{color:var(--muted);max-width:400px;margin:0 auto 1.5rem}
.social-links{display:flex;gap:1rem;justify-content:center}
.social-links a{color:var(--primary);text-decoration:none;font-weight:500;padding:.5rem 1rem;border:1px solid var(--border);border-radius:var(--radius);transition:all .2s}
.social-links a:hover{background:var(--primary);color:#fff}
.section{padding:3rem 0}
.section h2{font-size:1.5rem;margin-bottom:1.5rem;padding-bottom:.5rem;border-bottom:2px solid var(--border)}
.tags{display:flex;flex-wrap:wrap;gap:.5rem}
.tag{background:var(--surface);border:1px solid var(--border);padding:.375rem .75rem;border-radius:20px;font-size:.875rem;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1.25rem}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:1.5rem;transition:box-shadow .2s}
.card:hover{box-shadow:0 4px 12px rgba(0,0,0,.08)}
.card h3{margin-bottom:.5rem}
.card p{color:var(--muted);font-size:.9rem;margin-bottom:.75rem}
.link{color:var(--primary);text-decoration:none;font-weight:500}
footer{text-align:center;padding:2rem 0;color:var(--muted);font-size:.875rem;border-top:1px solid var(--border);margin-top:2rem}
@media(max-width:600px){h1{font-size:1.5rem}.grid{grid-template-columns:1fr}}`;

// ──────────────────────────────────────────────
// 2. Landing Page Static
// ──────────────────────────────────────────────
const landingIndex = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>내 랜딩 페이지</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <nav class="navbar">
    <div class="container nav-inner">
      <a href="#" class="logo">MyBrand</a>
      <div class="nav-links">
        <a href="#features">주요 기능</a>
        <a href="#pricing">요금제</a>
        <a href="#cta" class="btn btn-sm">시작하기</a>
      </div>
    </div>
  </nav>

  <header class="hero">
    <div class="container">
      <h1>무언가<br/><span class="highlight">멋진 것</span>을 만들어 보세요</h1>
      <p class="hero-desc">다음 프로젝트를 시작하는 가장 쉬운 방법. 빠르고, 안정적이고, 아름답습니다.</p>
      <div class="hero-actions">
        <a href="#cta" class="btn btn-primary">무료로 시작</a>
        <a href="#features" class="btn btn-outline">더 알아보기</a>
      </div>
    </div>
  </header>

  <section class="section" id="features">
    <div class="container">
      <h2 class="section-title">주요 기능</h2>
      <div class="grid-3">
        <div class="feature-card">
          <div class="icon">&#9889;</div>
          <h3>번개처럼 빠른 속도</h3>
          <p>불필요한 요소 없이 속도에 최적화되었습니다.</p>
        </div>
        <div class="feature-card">
          <div class="icon">&#128274;</div>
          <h3>안전한 보안</h3>
          <p>엔터프라이즈급 보안이 내장되어 있습니다.</p>
        </div>
        <div class="feature-card">
          <div class="icon">&#128640;</div>
          <h3>간편한 배포</h3>
          <p>원클릭으로 어떤 플랫폼에든 배포할 수 있습니다.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt" id="pricing">
    <div class="container">
      <h2 class="section-title">요금제</h2>
      <div class="grid-3">
        <div class="price-card">
          <h3>무료</h3>
          <div class="price">₩0<span>/월</span></div>
          <ul><li>프로젝트 1개</li><li>기본 지원</li><li>커뮤니티 접근</li></ul>
          <a href="#" class="btn btn-outline">시작하기</a>
        </div>
        <div class="price-card featured">
          <h3>Pro</h3>
          <div class="price">₩19,000<span>/월</span></div>
          <ul><li>프로젝트 10개</li><li>우선 지원</li><li>고급 기능</li></ul>
          <a href="#" class="btn btn-primary">시작하기</a>
        </div>
        <div class="price-card">
          <h3>Team</h3>
          <div class="price">₩49,000<span>/월</span></div>
          <ul><li>무제한 프로젝트</li><li>팀 관리</li><li>커스텀 연동</li></ul>
          <a href="#" class="btn btn-outline">문의하기</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="cta">
    <div class="container cta-box">
      <h2>시작할 준비가 되셨나요?</h2>
      <p>수천 명의 사용자가 MyBrand와 함께 만들고 있습니다.</p>
      <a href="#" class="btn btn-primary btn-lg">지금 무료로 시작하기</a>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; 2026 MyBrand. Linkmap으로 제작.</p>
    </div>
  </footer>
</body>
</html>`;

const landingStyle = `/* Landing Page Template */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--primary:#7c3aed;--primary-dark:#6d28d9;--bg:#fafafa;--surface:#fff;--text:#1a1a2e;--muted:#6b7280;--border:#e5e7eb;--radius:12px}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
.container{max-width:1080px;margin:0 auto;padding:0 1.5rem}
.navbar{position:sticky;top:0;background:rgba(255,255,255,.9);backdrop-filter:blur(8px);border-bottom:1px solid var(--border);z-index:10;padding:.75rem 0}
.nav-inner{display:flex;align-items:center;justify-content:space-between}
.logo{font-size:1.25rem;font-weight:800;color:var(--primary);text-decoration:none}
.nav-links{display:flex;gap:1.5rem;align-items:center}
.nav-links a{text-decoration:none;color:var(--text);font-weight:500;font-size:.9rem}
.btn{display:inline-block;padding:.625rem 1.25rem;border-radius:var(--radius);text-decoration:none;font-weight:600;font-size:.9rem;transition:all .2s;border:2px solid transparent}
.btn-sm{padding:.375rem .875rem;font-size:.8rem}
.btn-lg{padding:.875rem 2rem;font-size:1rem}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover{background:var(--primary-dark)}
.btn-outline{border-color:var(--primary);color:var(--primary)}
.btn-outline:hover{background:var(--primary);color:#fff}
.hero{text-align:center;padding:5rem 0 4rem}
.hero h1{font-size:3rem;line-height:1.2;margin-bottom:1rem}
.highlight{color:var(--primary)}
.hero-desc{color:var(--muted);font-size:1.125rem;max-width:500px;margin:0 auto 2rem}
.hero-actions{display:flex;gap:1rem;justify-content:center}
.section{padding:4rem 0}
.section-alt{background:var(--surface)}
.section-title{text-align:center;font-size:2rem;margin-bottom:2.5rem}
.grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}
.feature-card{text-align:center;padding:2rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface)}
.feature-card .icon{font-size:2rem;margin-bottom:.75rem}
.feature-card h3{margin-bottom:.5rem}
.feature-card p{color:var(--muted);font-size:.9rem}
.price-card{text-align:center;padding:2rem;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg)}
.price-card.featured{border-color:var(--primary);box-shadow:0 4px 20px rgba(124,58,237,.15);background:var(--bg);position:relative}
.price-card h3{margin-bottom:.5rem}
.price{font-size:2.5rem;font-weight:800;margin-bottom:1rem}
.price span{font-size:1rem;font-weight:400;color:var(--muted)}
.price-card ul{list-style:none;margin-bottom:1.5rem;text-align:left;padding:0 1rem}
.price-card li{padding:.375rem 0;border-bottom:1px solid var(--border);font-size:.9rem}
.price-card li:last-child{border:none}
.cta-box{text-align:center;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;padding:3rem;border-radius:var(--radius)}
.cta-box p{opacity:.85;margin:.75rem 0 1.5rem}
.cta-box .btn-primary{background:#fff;color:var(--primary)}
footer{text-align:center;padding:2rem 0;color:var(--muted);font-size:.875rem;border-top:1px solid var(--border)}
@media(max-width:640px){.hero h1{font-size:2rem}.hero-actions{flex-direction:column;align-items:center}.nav-links a:not(.btn){display:none}}`;

// ──────────────────────────────────────────────
// 3. Resume Static
// ──────────────────────────────────────────────
const resumeIndex = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>온라인 이력서</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="page">
    <aside class="sidebar">
      <div class="profile">
        <div class="avatar">홍</div>
        <h1>홍길동</h1>
        <p class="title">소프트웨어 엔지니어</p>
      </div>
      <section>
        <h2>연락처</h2>
        <ul class="contact-list">
          <li>hello@example.com</li>
          <li>서울, 대한민국</li>
          <li>github.com/username</li>
        </ul>
      </section>
      <section>
        <h2>기술 스택</h2>
        <div class="skill-bars">
          <div class="skill"><span>JavaScript</span><div class="bar"><div class="fill" style="width:90%"></div></div></div>
          <div class="skill"><span>TypeScript</span><div class="bar"><div class="fill" style="width:85%"></div></div></div>
          <div class="skill"><span>React</span><div class="bar"><div class="fill" style="width:88%"></div></div></div>
          <div class="skill"><span>Node.js</span><div class="bar"><div class="fill" style="width:80%"></div></div></div>
          <div class="skill"><span>Python</span><div class="bar"><div class="fill" style="width:70%"></div></div></div>
        </div>
      </section>
      <section>
        <h2>언어</h2>
        <ul class="contact-list">
          <li>한국어 (원어민)</li>
          <li>영어 (유창)</li>
        </ul>
      </section>
    </aside>

    <main class="content">
      <section>
        <h2>소개</h2>
        <p>5년 이상의 경험을 가진 열정적인 소프트웨어 엔지니어입니다. 깔끔하고, 빠르며, 사용자 친화적인 웹 애플리케이션을 만드는 데 집중하고 있습니다.</p>
      </section>
      <section>
        <h2>경력</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="period">2023 &ndash; 현재</div>
            <h3>시니어 프론트엔드 개발자</h3>
            <p class="company">테크 코프</p>
            <ul>
              <li>레거시 앱을 React + TypeScript로 마이그레이션 주도</li>
              <li>페이지 로드 시간 40% 개선</li>
              <li>주니어 개발자 3명 멘토링</li>
            </ul>
          </div>
          <div class="timeline-item">
            <div class="period">2021 &ndash; 2023</div>
            <h3>프론트엔드 개발자</h3>
            <p class="company">스타트업 주식회사</p>
            <ul>
              <li>고객 대시보드를 처음부터 개발</li>
              <li>GitHub Actions로 CI/CD 파이프라인 구축</li>
            </ul>
          </div>
          <div class="timeline-item">
            <div class="period">2019 &ndash; 2021</div>
            <h3>주니어 개발자</h3>
            <p class="company">웹 에이전시</p>
            <ul>
              <li>20개 이상의 클라이언트 웹사이트 개발</li>
              <li>반응형 디자인 표준 도입</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2>학력</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="period">2015 &ndash; 2019</div>
            <h3>컴퓨터공학 학사</h3>
            <p class="company">서울대학교</p>
          </div>
        </div>
      </section>
    </main>
  </div>

  <footer>
    <p>&copy; 2026 온라인 이력서. Linkmap으로 제작.</p>
  </footer>
</body>
</html>`;

const resumeStyle = `/* Resume Template */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--primary:#0f766e;--primary-light:#ccfbf1;--bg:#f1f5f9;--surface:#fff;--text:#1e293b;--muted:#64748b;--border:#e2e8f0;--sidebar:#0f172a;--sidebar-text:#e2e8f0}
body{font-family:'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
.page{display:flex;max-width:960px;margin:2rem auto;background:var(--surface);border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.sidebar{width:280px;background:var(--sidebar);color:var(--sidebar-text);padding:2rem;flex-shrink:0}
.profile{text-align:center;margin-bottom:2rem;padding-bottom:1.5rem;border-bottom:1px solid rgba(255,255,255,.1)}
.avatar{width:80px;height:80px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;margin:0 auto 1rem}
.sidebar h1{font-size:1.25rem;margin-bottom:.25rem}
.sidebar .title{color:var(--primary-light);font-size:.9rem}
.sidebar section{margin-bottom:1.5rem}
.sidebar h2{font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--primary-light);margin-bottom:.75rem}
.contact-list{list-style:none}
.contact-list li{font-size:.85rem;padding:.25rem 0;opacity:.85}
.skill-bars{display:flex;flex-direction:column;gap:.5rem}
.skill span{font-size:.8rem;display:block;margin-bottom:.25rem}
.bar{height:6px;background:rgba(255,255,255,.15);border-radius:3px;overflow:hidden}
.fill{height:100%;background:var(--primary);border-radius:3px}
.content{flex:1;padding:2rem}
.content section{margin-bottom:2rem}
.content h2{font-size:1.125rem;color:var(--primary);margin-bottom:1rem;padding-bottom:.5rem;border-bottom:2px solid var(--border)}
.content p{color:var(--muted);font-size:.9rem}
.timeline{display:flex;flex-direction:column;gap:1.25rem}
.timeline-item{padding-left:1rem;border-left:2px solid var(--border)}
.period{font-size:.75rem;color:var(--primary);font-weight:600;margin-bottom:.25rem}
.timeline-item h3{font-size:1rem;margin-bottom:.125rem}
.company{color:var(--muted);font-size:.85rem;margin-bottom:.5rem}
.timeline-item ul{list-style:disc;padding-left:1.25rem}
.timeline-item li{font-size:.85rem;color:var(--muted);margin-bottom:.25rem}
footer{text-align:center;padding:1.5rem;color:var(--muted);font-size:.8rem}
@media(max-width:700px){.page{flex-direction:column}.sidebar{width:100%}}`;

// ──────────────────────────────────────────────
// 4. Blog Static
// ──────────────────────────────────────────────
const blogIndex = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>내 블로그</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <nav class="navbar">
    <div class="container nav-inner">
      <a href="#" class="logo">내블로그</a>
      <div class="nav-links">
        <a href="#">홈</a>
        <a href="#">소개</a>
        <a href="#">아카이브</a>
      </div>
    </div>
  </nav>

  <header class="hero">
    <div class="container">
      <h1>내 블로그에 오신 것을 환영합니다</h1>
      <p>개발, 디자인, 기술에 대한 생각을 공유합니다.</p>
    </div>
  </header>

  <main class="container">
    <div class="posts">
      <article class="post-card">
        <div class="post-meta">
          <time>2026-02-10</time>
          <span class="tag">개발</span>
        </div>
        <h2><a href="#">2026년 TypeScript 시작 가이드</a></h2>
        <p>TypeScript는 현대 웹 개발의 표준이 되었습니다. 시작하기 위해 알아야 할 모든 것을 정리했습니다...</p>
        <a href="#" class="read-more">더 읽기 &rarr;</a>
      </article>

      <article class="post-card">
        <div class="post-meta">
          <time>2026-02-05</time>
          <span class="tag">디자인</span>
        </div>
        <h2><a href="#">개발자를 위한 미니멀 디자인 원칙</a></h2>
        <p>아름다운 인터페이스를 만들기 위해 디자이너일 필요는 없습니다. 차이를 만드는 핵심 원칙을 알아보세요...</p>
        <a href="#" class="read-more">더 읽기 &rarr;</a>
      </article>

      <article class="post-card">
        <div class="post-meta">
          <time>2026-01-28</time>
          <span class="tag">도구</span>
        </div>
        <h2><a href="#">2026년 내가 애용하는 개발자 도구들</a></h2>
        <p>매일 생산성을 높여주는 도구 모음을 엄선했습니다. 코드 에디터부터 배포 플랫폼까지...</p>
        <a href="#" class="read-more">더 읽기 &rarr;</a>
      </article>

      <article class="post-card">
        <div class="post-meta">
          <time>2026-01-20</time>
          <span class="tag">커리어</span>
        </div>
        <h2><a href="#">소프트웨어 엔지니어 5년차가 배운 것들</a></h2>
        <p>업계에서 5년을 보내며 배운 것들을 돌아봅니다. 실수, 성과, 그리고 그 사이의 모든 것...</p>
        <a href="#" class="read-more">더 읽기 &rarr;</a>
      </article>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2026 내 블로그. Linkmap으로 제작.</p>
    </div>
  </footer>
</body>
</html>`;

const blogStyle = `/* Blog Template */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--primary:#dc2626;--bg:#fafaf9;--surface:#fff;--text:#1c1917;--muted:#78716c;--border:#e7e5e4;--radius:12px}
body{font-family:Georgia,'Times New Roman',serif;background:var(--bg);color:var(--text);line-height:1.8}
.container{max-width:720px;margin:0 auto;padding:0 1.5rem}
.navbar{border-bottom:1px solid var(--border);padding:.75rem 0}
.nav-inner{display:flex;align-items:center;justify-content:space-between}
.logo{font-size:1.25rem;font-weight:800;color:var(--text);text-decoration:none;font-family:-apple-system,sans-serif}
.nav-links{display:flex;gap:1.25rem}
.nav-links a{text-decoration:none;color:var(--muted);font-size:.9rem;font-family:-apple-system,sans-serif}
.nav-links a:hover{color:var(--text)}
.hero{padding:3rem 0 2rem;border-bottom:1px solid var(--border)}
.hero h1{font-size:2rem;margin-bottom:.5rem}
.hero p{color:var(--muted);font-size:1.05rem}
.posts{padding:1rem 0}
.post-card{padding:2rem 0;border-bottom:1px solid var(--border)}
.post-card:last-child{border:none}
.post-meta{display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem;font-family:-apple-system,sans-serif}
.post-meta time{font-size:.8rem;color:var(--muted)}
.post-meta .tag{font-size:.7rem;background:var(--primary);color:#fff;padding:.125rem .5rem;border-radius:4px;font-weight:600}
.post-card h2{font-size:1.375rem;margin-bottom:.5rem}
.post-card h2 a{color:var(--text);text-decoration:none}
.post-card h2 a:hover{color:var(--primary)}
.post-card p{color:var(--muted);font-size:.95rem}
.read-more{display:inline-block;margin-top:.75rem;color:var(--primary);text-decoration:none;font-size:.9rem;font-weight:600;font-family:-apple-system,sans-serif}
footer{text-align:center;padding:2rem 0;color:var(--muted);font-size:.8rem;border-top:1px solid var(--border);margin-top:1rem;font-family:-apple-system,sans-serif}
@media(max-width:600px){.hero h1{font-size:1.5rem}}`;

// ──────────────────────────────────────────────
// 5. Docs Static
// ──────────────────────────────────────────────
const docsIndex = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>문서</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <nav class="topbar">
    <div class="topbar-inner">
      <a href="#" class="logo">MyDocs</a>
      <div class="nav-links">
        <a href="#">가이드</a>
        <a href="#">API</a>
        <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
  </nav>

  <div class="layout">
    <aside class="sidebar">
      <h3>시작하기</h3>
      <ul>
        <li><a href="#" class="active">소개</a></li>
        <li><a href="#">설치</a></li>
        <li><a href="#">빠른 시작</a></li>
      </ul>
      <h3>가이드</h3>
      <ul>
        <li><a href="#">설정</a></li>
        <li><a href="#">인증</a></li>
        <li><a href="#">배포</a></li>
      </ul>
      <h3>API 레퍼런스</h3>
      <ul>
        <li><a href="#">REST API</a></li>
        <li><a href="#">웹훅</a></li>
        <li><a href="#">SDK</a></li>
      </ul>
    </aside>

    <main class="doc-content">
      <div class="breadcrumb">시작하기 &rsaquo; 소개</div>

      <h1>소개</h1>
      <p class="lead">문서에 오신 것을 환영합니다. 이 가이드를 통해 빠르게 시작할 수 있습니다.</p>

      <h2>MyProject란?</h2>
      <p>MyProject는 워크플로를 단순화하는 현대적인 개발 도구입니다. 깔끔한 API, 간편한 설정, 기존 도구와의 원활한 통합을 제공합니다.</p>

      <h2>주요 기능</h2>
      <ul>
        <li><strong>간편한 설정</strong> &ndash; 5분 안에 시작할 수 있습니다</li>
        <li><strong>타입 안전</strong> &ndash; TypeScript를 기본으로 완벽 지원합니다</li>
        <li><strong>확장 가능</strong> &ndash; 플러그인 시스템으로 커스텀 기능을 추가합니다</li>
        <li><strong>풍부한 문서</strong> &ndash; 포괄적인 가이드와 예제를 제공합니다</li>
      </ul>

      <h2>빠른 예제</h2>
      <div class="code-block">
        <pre><code>// 설치
npm install myproject

// 초기화
import { init } from 'myproject';

const app = init({
  apiKey: 'your-api-key',
  environment: 'production',
});

// 사용하기
const result = await app.run();
console.log(result);</code></pre>
      </div>

      <h2>다음 단계</h2>
      <p>개요를 확인했으니, 다음으로 진행해 보세요:</p>
      <div class="next-links">
        <a href="#" class="next-card">
          <strong>설치 가이드</strong>
          <span>개발 환경을 설정합니다</span>
        </a>
        <a href="#" class="next-card">
          <strong>빠른 시작</strong>
          <span>몇 분 만에 첫 프로젝트를 만들어 보세요</span>
        </a>
      </div>

      <div class="page-nav">
        <div></div>
        <a href="#" class="nav-next">설치 &rarr;</a>
      </div>
    </main>
  </div>

  <footer>
    <p>&copy; 2026 MyDocs. Linkmap으로 제작.</p>
  </footer>
</body>
</html>`;

const docsStyle = `/* Documentation Template */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--primary:#2563eb;--primary-light:#dbeafe;--bg:#fff;--surface:#f8fafc;--text:#1e293b;--muted:#64748b;--border:#e2e8f0;--sidebar-w:240px;--topbar-h:56px}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.7}
.topbar{position:fixed;top:0;left:0;right:0;height:var(--topbar-h);background:var(--bg);border-bottom:1px solid var(--border);z-index:20;display:flex;align-items:center}
.topbar-inner{width:100%;max-width:1200px;margin:0 auto;padding:0 1.5rem;display:flex;align-items:center;justify-content:space-between}
.logo{font-weight:800;font-size:1.125rem;color:var(--primary);text-decoration:none}
.nav-links{display:flex;gap:1.25rem}
.nav-links a{text-decoration:none;color:var(--muted);font-size:.875rem;font-weight:500}
.nav-links a:hover{color:var(--primary)}
.layout{display:flex;margin-top:var(--topbar-h);min-height:calc(100vh - var(--topbar-h))}
.sidebar{position:fixed;top:var(--topbar-h);left:0;bottom:0;width:var(--sidebar-w);padding:1.5rem;overflow-y:auto;border-right:1px solid var(--border);background:var(--surface)}
.sidebar h3{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:1.25rem 0 .5rem}
.sidebar h3:first-child{margin-top:0}
.sidebar ul{list-style:none}
.sidebar li{margin-bottom:.125rem}
.sidebar a{display:block;padding:.375rem .75rem;border-radius:6px;text-decoration:none;color:var(--text);font-size:.875rem;transition:background .15s}
.sidebar a:hover{background:var(--primary-light)}
.sidebar a.active{background:var(--primary);color:#fff}
.doc-content{margin-left:var(--sidebar-w);padding:2rem 3rem;max-width:780px;flex:1}
.breadcrumb{font-size:.8rem;color:var(--muted);margin-bottom:1.5rem}
.doc-content h1{font-size:2rem;margin-bottom:.75rem}
.lead{font-size:1.1rem;color:var(--muted);margin-bottom:2rem}
.doc-content h2{font-size:1.25rem;margin:2rem 0 .75rem;padding-top:1rem;border-top:1px solid var(--border)}
.doc-content h2:first-of-type{border:none;padding-top:0}
.doc-content p{margin-bottom:1rem;color:var(--text)}
.doc-content ul{padding-left:1.5rem;margin-bottom:1rem}
.doc-content li{margin-bottom:.375rem}
.code-block{background:#1e293b;color:#e2e8f0;border-radius:8px;padding:1.25rem;overflow-x:auto;margin-bottom:1.5rem}
.code-block pre{margin:0}
.code-block code{font-family:'Fira Code',Consolas,monospace;font-size:.85rem;line-height:1.6}
.next-links{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1.5rem 0}
.next-card{display:block;padding:1rem;border:1px solid var(--border);border-radius:8px;text-decoration:none;color:var(--text);transition:border-color .2s}
.next-card:hover{border-color:var(--primary)}
.next-card strong{display:block;color:var(--primary);margin-bottom:.25rem}
.next-card span{font-size:.85rem;color:var(--muted)}
.page-nav{display:flex;justify-content:space-between;margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--border)}
.nav-next{color:var(--primary);text-decoration:none;font-weight:600}
footer{margin-left:var(--sidebar-w);text-align:center;padding:2rem;color:var(--muted);font-size:.8rem;border-top:1px solid var(--border)}
@media(max-width:768px){.sidebar{display:none}.doc-content{margin-left:0;padding:1.5rem}footer{margin-left:0}.next-links{grid-template-columns:1fr}}`;

// ──────────────────────────────────────────────
// GitHub Actions Workflow (shared by MVP templates)
// ──────────────────────────────────────────────
const deployWorkflow = `name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_REPO_NAME: \${{ github.event.repository.name }}
          NEXT_PUBLIC_BASE_URL: https://\${{ github.repository_owner }}.github.io/\${{ github.event.repository.name }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
      - id: deployment
        uses: actions/deploy-pages@v4
`;

const staticDeployWorkflow = `name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
`;

// ──────────────────────────────────────────────
// Shared config files for MVP templates
// ──────────────────────────────────────────────
const sharedTsConfig = `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;

const sharedPostcssConfig = `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

export default config;`;

const sharedNextConfig = `import type { NextConfig } from 'next';

const repoName = process.env.NEXT_PUBLIC_REPO_NAME || '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: repoName ? \`/\${repoName}\` : '',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;`;

// ──────────────────────────────────────────────
// 6. Link-in-Bio Pro (MVP)
// ──────────────────────────────────────────────
const linkInBioPackageJson = `{
  "name": "link-in-bio-pro",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-themes": "^0.4.4",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.5.0"
  }
}`;

const linkInBioOgRoute = `import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';
import { getTheme } from '@/lib/themes';

export const dynamic = 'force-static';

export async function GET() {
  const theme = getTheme(siteConfig.theme);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: \`linear-gradient(135deg, \${theme.backgroundFrom}, \${theme.primary}, \${theme.backgroundTo})\`,
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: theme.primary,
            color: '#fff',
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          {siteConfig.siteName.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, color: theme.text }}>
          {siteConfig.siteName}
        </div>
        <div
          style={{
            fontSize: 24,
            color: theme.textMuted,
            marginTop: 12,
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          {siteConfig.bio}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}`;

const linkInBioGlobalsCss = `@import "tailwindcss";

@theme {
  --font-sans: 'Pretendard Variable', 'Inter', ui-sans-serif, system-ui, sans-serif;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 15s ease infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-gradient {
    animation: none;
  }
}`;

const linkInBioLayout = `import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { siteConfig } from '@/lib/config';
import { LocaleProvider } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: siteConfig.siteName,
  description: siteConfig.bio,
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.bio,
    type: 'website',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.siteName,
    description: siteConfig.bio,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: siteConfig.siteName,
              description: siteConfig.bio,
              ...(siteConfig.avatarUrl ? { image: siteConfig.avatarUrl } : {}),
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}`;

const linkInBioPage = `import { siteConfig } from '@/lib/config';
import { getTheme } from '@/lib/themes';
import { ProfileSection } from '@/components/profile-section';
import { LinkList } from '@/components/link-list';
import { SocialBar } from '@/components/social-bar';
import { ContentEmbed } from '@/components/content-embed';
import { Footer } from '@/components/footer';

export default function Home() {
  const theme = getTheme(siteConfig.theme);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 animate-gradient"
      style={{
        background: \`linear-gradient(135deg, \${theme.backgroundFrom}, \${theme.primary}, \${theme.backgroundTo})\`,
        backgroundSize: '200% 200%',
      }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 py-12">
        <ProfileSection config={siteConfig} theme={theme} />
        <LinkList links={siteConfig.links} theme={theme} />
        {siteConfig.socials.length > 0 && (
          <SocialBar socials={siteConfig.socials} theme={theme} />
        )}
        {siteConfig.youtubeUrl && (
          <ContentEmbed youtubeUrl={siteConfig.youtubeUrl} />
        )}
        <Footer theme={theme} />
      </div>
    </main>
  );
}`;

const linkInBioContentEmbed = `'use client';

interface Props {
  youtubeUrl: string;
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|watch\\?.+&v=))([^&?\\s]+)/
  );
  return match ? match[1] : null;
}

export function ContentEmbed({ youtubeUrl }: Props) {
  const videoId = extractYoutubeId(youtubeUrl);
  if (!videoId) return null;

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={\`https://www.youtube-nocookie.com/embed/\${videoId}\`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-xl"
        />
      </div>
    </div>
  );
}`;

const linkInBioFooter = `import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';
import type { ThemePreset } from '@/lib/themes';

interface Props {
  theme: ThemePreset;
}

export function Footer({ theme }: Props) {
  return (
    <footer
      className="flex items-center gap-2 pt-8 text-xs"
      style={{ color: theme.textMuted }}
    >
      <span>
        Powered by{' '}
        <a
          href="https://linkmap.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
        >
          Linkmap
        </a>
      </span>
      <LanguageToggle theme={theme} />
      <ThemeToggle />
    </footer>
  );
}`;

const linkInBioLanguageToggle = `'use client';

import { useLocale } from '@/lib/i18n';
import { Globe } from 'lucide-react';
import type { ThemePreset } from '@/lib/themes';

interface Props {
  theme: ThemePreset;
}

export function LanguageToggle({ theme }: Props) {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')}
      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80"
      style={{ color: theme.textMuted }}
      aria-label={locale === 'ko' ? 'Switch to English' : '한국어로 전환'}
    >
      <Globe className="w-3.5 h-3.5" />
      {locale === 'ko' ? 'EN' : '한국어'}
    </button>
  );
}`;

const linkInBioLinkList = `'use client';

import {
  Youtube,
  PenLine,
  Briefcase,
  ShoppingBag,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import type { LinkItem } from '@/lib/config';
import type { ThemePreset } from '@/lib/themes';
import { useLocale } from '@/lib/i18n';

const iconMap: Record<string, LucideIcon> = {
  youtube: Youtube,
  'pen-line': PenLine,
  briefcase: Briefcase,
  'shopping-bag': ShoppingBag,
};

interface Props {
  links: LinkItem[];
  theme: ThemePreset;
}

export function LinkList({ links, theme }: Props) {
  const { locale } = useLocale();

  return (
    <div className="w-full flex flex-col gap-3">
      {links.map((link, i) => {
        const Icon = iconMap[link.icon || ''] || ExternalLink;
        const title = locale === 'en' && link.titleEn ? link.titleEn : link.title;
        return (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3.5 rounded-xl backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: theme.cardBg,
              border: \`1px solid \${theme.cardBorder}\`,
              color: theme.text,
            }}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-sm sm:text-base font-medium flex-1">
              {title}
            </span>
            <ExternalLink className="w-4 h-4 opacity-40 shrink-0" />
          </a>
        );
      })}
    </div>
  );
}`;

const linkInBioProfileSection = `'use client';

import type { SiteConfig } from '@/lib/config';
import type { ThemePreset } from '@/lib/themes';
import { useLocale } from '@/lib/i18n';

interface Props {
  config: SiteConfig;
  theme: ThemePreset;
}

export function ProfileSection({ config, theme }: Props) {
  const { locale } = useLocale();
  const name = locale === 'en' && config.siteNameEn ? config.siteNameEn : config.siteName;
  const bio = locale === 'en' && config.bioEn ? config.bioEn : config.bio;

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      {config.avatarUrl ? (
        <img
          src={config.avatarUrl}
          alt={name}
          width={96}
          height={96}
          className="w-24 h-24 rounded-full object-cover ring-2 ring-white/30"
        />
      ) : (
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold ring-2 ring-white/30"
          style={{ backgroundColor: theme.primary, color: '#fff' }}
          aria-label={name}
        >
          {initials}
        </div>
      )}
      <h1 className="text-2xl font-bold" style={{ color: theme.text }}>
        {name}
      </h1>
      <p className="text-base max-w-xs" style={{ color: theme.textMuted }}>
        {bio}
      </p>
    </div>
  );
}`;

const linkInBioSocialBar = `'use client';

import {
  Instagram,
  Youtube,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  Globe,
  type LucideIcon,
} from 'lucide-react';
import type { SocialItem } from '@/lib/config';
import type { ThemePreset } from '@/lib/themes';

const socialIcons: Record<string, LucideIcon> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
};

interface Props {
  socials: SocialItem[];
  theme: ThemePreset;
}

export function SocialBar({ socials, theme }: Props) {
  return (
    <div className="flex items-center gap-4">
      {socials.map((social, i) => {
        const Icon = socialIcons[social.platform] || Globe;
        return (
          <a
            key={i}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.platform}
            className="transition-colors duration-200 hover:opacity-100 opacity-70"
            style={{ color: theme.text }}
          >
            <Icon className="w-5 h-5" />
          </a>
        );
      })}
    </div>
  );
}`;

const linkInBioThemeToggle = `'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { useLocale } from '@/lib/i18n';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-1.5 rounded-full transition-colors duration-200 hover:bg-white/10"
      aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}`;

const linkInBioConfig = `export interface LinkItem {
  title: string;
  titleEn?: string;
  url: string;
  icon?: string;
}

export interface SocialItem {
  platform: string;
  url: string;
}

const DEMO_LINKS: LinkItem[] = [
  { title: '내 유튜브 채널', titleEn: 'My YouTube Channel', url: 'https://youtube.com', icon: 'youtube' },
  { title: '블로그 구경하기', titleEn: 'Visit My Blog', url: 'https://blog.example.com', icon: 'pen-line' },
  { title: '포트폴리오', titleEn: 'Portfolio', url: 'https://portfolio.example.com', icon: 'briefcase' },
  { title: '할인 이벤트 바로가기', titleEn: 'Special Offers', url: 'https://shop.example.com', icon: 'shopping-bag' },
];

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || '내 링크 페이지',
  siteNameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'My Link Page',
  bio: process.env.NEXT_PUBLIC_BIO || '안녕하세요! 여기서 저의 모든 링크를 확인하세요.',
  bioEn: process.env.NEXT_PUBLIC_BIO_EN || 'Hello! Check out all my links here.',
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || null,
  theme: process.env.NEXT_PUBLIC_THEME || 'gradient',
  links: parseJSON<LinkItem[]>(process.env.NEXT_PUBLIC_LINKS, DEMO_LINKS),
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, []),
  youtubeUrl: process.env.NEXT_PUBLIC_YOUTUBE_URL || null,
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;`;

const linkInBioI18n = `'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

export type Locale = 'ko' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  ko: {
    'theme.light': '라이트 모드로 전환',
    'theme.dark': '다크 모드로 전환',
    'footer.powered': 'Powered by',
  },
  en: {
    'theme.light': 'Switch to light mode',
    'theme.dark': 'Switch to dark mode',
    'footer.powered': 'Powered by',
  },
};

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'ko',
  setLocale: () => {},
  t: (k) => k,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ko');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved === 'ko' || saved === 'en') {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('locale', l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: string) => translations[locale]?.[key] ?? key,
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}`;

const linkInBioThemes = `export interface ThemePreset {
  name: string;
  label: string;
  backgroundFrom: string;
  backgroundTo: string;
  primary: string;
  text: string;
  textMuted: string;
  cardBg: string;
  cardBorder: string;
}

export const themes: Record<string, ThemePreset> = {
  gradient: { name: 'gradient', label: 'Gradient', backgroundFrom: '#8b5cf6', backgroundTo: '#f97316', primary: '#ec4899', text: '#ffffff', textMuted: 'rgba(255,255,255,0.8)', cardBg: 'rgba(255,255,255,0.15)', cardBorder: 'rgba(255,255,255,0.25)' },
  neon: { name: 'neon', label: 'Neon', backgroundFrom: '#0f172a', backgroundTo: '#1e293b', primary: '#22d3ee', text: '#f0f9ff', textMuted: 'rgba(240,249,255,0.7)', cardBg: 'rgba(34,211,238,0.08)', cardBorder: 'rgba(34,211,238,0.25)' },
  minimal: { name: 'minimal', label: 'Minimal', backgroundFrom: '#ffffff', backgroundTo: '#f3f4f6', primary: '#1f2937', text: '#111827', textMuted: '#6b7280', cardBg: 'rgba(0,0,0,0.04)', cardBorder: 'rgba(0,0,0,0.08)' },
  pastel: { name: 'pastel', label: 'Pastel', backgroundFrom: '#fce7f3', backgroundTo: '#dbeafe', primary: '#f472b6', text: '#1f2937', textMuted: '#6b7280', cardBg: 'rgba(255,255,255,0.6)', cardBorder: 'rgba(244,114,182,0.2)' },
  dark: { name: 'dark', label: 'Dark', backgroundFrom: '#0f172a', backgroundTo: '#1e1b4b', primary: '#a78bfa', text: '#f5f3ff', textMuted: 'rgba(245,243,255,0.7)', cardBg: 'rgba(167,139,250,0.08)', cardBorder: 'rgba(167,139,250,0.2)' },
  ocean: { name: 'ocean', label: 'Ocean', backgroundFrom: '#164e63', backgroundTo: '#0c4a6e', primary: '#06b6d4', text: '#ecfeff', textMuted: 'rgba(236,254,255,0.7)', cardBg: 'rgba(6,182,212,0.1)', cardBorder: 'rgba(6,182,212,0.25)' },
  sunset: { name: 'sunset', label: 'Sunset', backgroundFrom: '#7c2d12', backgroundTo: '#78350f', primary: '#f59e0b', text: '#fffbeb', textMuted: 'rgba(255,251,235,0.7)', cardBg: 'rgba(245,158,11,0.1)', cardBorder: 'rgba(245,158,11,0.25)' },
  forest: { name: 'forest', label: 'Forest', backgroundFrom: '#14532d', backgroundTo: '#1a2e05', primary: '#22c55e', text: '#f0fdf4', textMuted: 'rgba(240,253,244,0.7)', cardBg: 'rgba(34,197,94,0.1)', cardBorder: 'rgba(34,197,94,0.25)' },
  candy: { name: 'candy', label: 'Candy', backgroundFrom: '#fdf2f8', backgroundTo: '#fce7f3', primary: '#f472b6', text: '#831843', textMuted: '#9d174d', cardBg: 'rgba(244,114,182,0.08)', cardBorder: 'rgba(244,114,182,0.2)' },
  monochrome: { name: 'monochrome', label: 'Monochrome', backgroundFrom: '#111827', backgroundTo: '#1f2937', primary: '#6b7280', text: '#f9fafb', textMuted: 'rgba(249,250,251,0.6)', cardBg: 'rgba(107,114,128,0.1)', cardBorder: 'rgba(107,114,128,0.2)' },
};

export function getTheme(name: string): ThemePreset {
  return themes[name] || themes.gradient;
}`;

// Due to bundle size, digital-namecard and dev-showcase are loaded
// from separate constant files below.

// ──────────────────────────────────────────────
// 7. Digital Namecard (MVP)
// ──────────────────────────────────────────────
const namecardPackageJson = `{
  "name": "digital-namecard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-themes": "^0.4.4",
    "lucide-react": "^0.468.0",
    "qrcode.react": "^4.2.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/postcss": "^4.0.0",
    "postcss": "^8.5.0"
  }
}`;

const namecardOgRoute = `import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-static';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', fontFamily: 'sans-serif' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: siteConfig.accentColor }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 100, height: 100, borderRadius: '50%', backgroundColor: siteConfig.accentColor, color: '#fff', fontSize: 40, fontWeight: 700, marginBottom: 20 }}>
          {siteConfig.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ fontSize: 48, fontWeight: 700, color: '#111827' }}>{siteConfig.name}</div>
        <div style={{ fontSize: 28, color: '#6b7280', marginTop: 8 }}>{siteConfig.title}</div>
        {siteConfig.company && (<div style={{ fontSize: 22, color: '#9ca3af', marginTop: 4 }}>{siteConfig.company}</div>)}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}`;

const namecardGlobalsCss = `@import "tailwindcss";

@theme {
  --font-sans: 'Pretendard Variable', 'Inter', ui-sans-serif, system-ui, sans-serif;
}

@media print {
  body { background: white !important; margin: 0; padding: 0; }
  .print-card { width: 90mm; height: 55mm; box-shadow: none !important; border-radius: 0 !important; margin: 0 auto; overflow: hidden; }
  .print-hide { display: none !important; }
}`;

const namecardLayout = `import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { siteConfig } from '@/lib/config';
import { LocaleProvider } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: \`\${siteConfig.name} - 디지털 명함\`,
  description: \`\${siteConfig.name} | \${siteConfig.title}\`,
  openGraph: { title: \`\${siteConfig.name} - 디지털 명함\`, description: \`\${siteConfig.name} | \${siteConfig.title}\`, type: 'website', images: ['/api/og'] },
  twitter: { card: 'summary_large_image', title: \`\${siteConfig.name} - 디지털 명함\`, description: \`\${siteConfig.name} | \${siteConfig.title}\` },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: siteConfig.name, jobTitle: siteConfig.title, ...(siteConfig.company ? { worksFor: { '@type': 'Organization', name: siteConfig.company } } : {}), ...(siteConfig.email ? { email: siteConfig.email } : {}), ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}), ...(siteConfig.website ? { url: siteConfig.website } : {}) }) }} />
      </head>
      <body className="antialiased bg-gray-50 dark:bg-gray-900">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}`;

const namecardPage = `import { siteConfig } from '@/lib/config';
import { ProfileCard } from '@/components/profile-card';
import { ContactInfo } from '@/components/contact-info';
import { SocialLinks } from '@/components/social-links';
import { QrCode } from '@/components/qr-code';
import { SaveContactButton } from '@/components/save-contact-button';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="print-card rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800">
          <div className="h-2" style={{ background: \`linear-gradient(90deg, \${siteConfig.accentColor}, \${siteConfig.accentColor}dd)\` }} />
          <div className="p-6 space-y-5">
            <ProfileCard config={siteConfig} />
            <ContactInfo config={siteConfig} />
            {siteConfig.socials.length > 0 && <SocialLinks socials={siteConfig.socials} accentColor={siteConfig.accentColor} />}
            <QrCode config={siteConfig} />
            <SaveContactButton config={siteConfig} />
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}`;

const namecardContactInfo = `'use client';

import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props { config: SiteConfig; }

export function ContactInfo({ config }: Props) {
  const { t, locale } = useLocale();
  const address = locale === 'en' && config.addressEn ? config.addressEn : config.address;
  const items = [
    config.phone ? { icon: Phone, label: config.phone, href: \`tel:\${config.phone.replace(/[^+\\d]/g, '')}\`, ariaLabel: t('contact.call') } : null,
    config.email ? { icon: Mail, label: config.email, href: \`mailto:\${config.email}\`, ariaLabel: t('contact.email') } : null,
    address ? { icon: MapPin, label: address, href: \`https://maps.google.com/?q=\${encodeURIComponent(address)}\`, ariaLabel: t('contact.map') } : null,
    config.website ? { icon: Globe, label: config.website.replace(/^https?:\\/\\//, ''), href: config.website, ariaLabel: t('contact.website') } : null,
  ].filter(Boolean) as Array<{ icon: typeof Phone; label: string; href: string; ariaLabel: string }>;
  if (items.length === 0) return null;
  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <a key={i} href={item.href} target={item.icon === Globe || item.icon === MapPin ? '_blank' : undefined} rel={item.icon === Globe || item.icon === MapPin ? 'noopener noreferrer' : undefined} aria-label={item.ariaLabel} className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
          <span className="text-sm truncate">{item.label}</span>
        </a>
      ))}
    </div>
  );
}`;

const namecardFooter = `import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';

export function Footer() {
  return (
    <footer className="print-hide flex items-center justify-center gap-2 text-gray-400 text-xs mt-8 pb-4">
      <span>Powered by{' '}<a href="https://linkmap.vercel.app" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300">Linkmap</a></span>
      <LanguageToggle />
      <ThemeToggle />
    </footer>
  );
}`;

const namecardLanguageToggle = `'use client';

import { useLocale } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <button onClick={() => setLocale(locale === 'ko' ? 'en' : 'ko')} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-label={locale === 'ko' ? 'Switch to English' : '한국어로 전환'}>
      <Globe className="w-3.5 h-3.5" />{locale === 'ko' ? 'EN' : '한국어'}
    </button>
  );
}`;

const namecardProfileCard = `'use client';

import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props { config: SiteConfig; }

export function ProfileCard({ config }: Props) {
  const { locale } = useLocale();
  const name = locale === 'en' && config.nameEn ? config.nameEn : config.name;
  const title = locale === 'en' && config.titleEn ? config.titleEn : config.title;
  const company = locale === 'en' && config.companyEn ? config.companyEn : config.company;
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="flex flex-col items-center text-center gap-2">
      {config.avatarUrl ? (<img src={config.avatarUrl} alt={name} width={80} height={80} className="w-20 h-20 rounded-full object-cover" />) : (<div className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: config.accentColor }} aria-label={name}>{initials}</div>)}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{name}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">{title}</p>
      {company && <p className="text-base text-gray-500">{company}</p>}
    </div>
  );
}`;

const namecardQrCode = `'use client';

import { QRCodeSVG } from 'qrcode.react';
import { generateVCard } from '@/lib/vcard';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props { config: SiteConfig; }

export function QrCode({ config }: Props) {
  const { t } = useLocale();
  const vcard = generateVCard({ name: config.name, title: config.title, company: config.company, email: config.email, phone: config.phone, address: config.address, website: config.website });
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="p-3 bg-white rounded-xl"><QRCodeSVG value={vcard} size={160} level="M" bgColor="#ffffff" fgColor="#111827" /></div>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">{t('qr.hint')}</p>
    </div>
  );
}`;

const namecardSaveContactButton = `'use client';

import { Download } from 'lucide-react';
import { generateVCard } from '@/lib/vcard';
import type { SiteConfig } from '@/lib/config';
import { useLocale } from '@/lib/i18n';

interface Props { config: SiteConfig; }

export function SaveContactButton({ config }: Props) {
  const { t } = useLocale();
  const handleSave = () => {
    const vcard = generateVCard({ name: config.name, title: config.title, company: config.company, email: config.email, phone: config.phone, address: config.address, website: config.website });
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = \`\${config.name}.vcf\`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <button onClick={handleSave} className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-90 active:opacity-80" style={{ backgroundColor: config.accentColor }}>
      <Download className="w-4 h-4" />{t('save.contact')}
    </button>
  );
}`;

const namecardSocialLinks = `'use client';

import { Linkedin, Twitter, Instagram, Github, Facebook, Globe, type LucideIcon } from 'lucide-react';
import type { SocialItem } from '@/lib/config';

const socialIcons: Record<string, LucideIcon> = { linkedin: Linkedin, twitter: Twitter, instagram: Instagram, github: Github, facebook: Facebook };

interface Props { socials: SocialItem[]; accentColor: string; }

export function SocialLinks({ socials, accentColor }: Props) {
  return (
    <div className="flex items-center justify-center gap-4">
      {socials.map((social, i) => {
        const Icon = socialIcons[social.platform] || Globe;
        return (<a key={i} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform} className="p-2 rounded-full text-gray-500 dark:text-gray-400 transition-all duration-200 hover:scale-110" style={{ '--tw-ring-color': accentColor } as React.CSSProperties}><Icon className="w-5 h-5" /></a>);
      })}
    </div>
  );
}`;

const namecardThemeToggle = `'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { useLocale } from '@/lib/i18n';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!mounted) return <div className="w-8 h-8" />;
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-1.5 rounded-full transition-colors duration-200 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}>
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}`;

const namecardConfig = `export interface SocialItem { platform: string; url: string; }

function parseJSON<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || '홍길동',
  nameEn: process.env.NEXT_PUBLIC_SITE_NAME_EN || 'Gildong Hong',
  title: process.env.NEXT_PUBLIC_TITLE || '프리랜서 개발자',
  titleEn: process.env.NEXT_PUBLIC_TITLE_EN || 'Freelance Developer',
  company: process.env.NEXT_PUBLIC_COMPANY || null,
  companyEn: process.env.NEXT_PUBLIC_COMPANY_EN || null,
  email: process.env.NEXT_PUBLIC_EMAIL || 'hello@example.com',
  phone: process.env.NEXT_PUBLIC_PHONE || '010-1234-5678',
  address: process.env.NEXT_PUBLIC_ADDRESS || null,
  addressEn: process.env.NEXT_PUBLIC_ADDRESS_EN || null,
  website: process.env.NEXT_PUBLIC_WEBSITE || null,
  socials: parseJSON<SocialItem[]>(process.env.NEXT_PUBLIC_SOCIALS, []),
  avatarUrl: process.env.NEXT_PUBLIC_AVATAR_URL || null,
  accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || '#3b82f6',
  gaId: process.env.NEXT_PUBLIC_GA_ID || null,
};

export type SiteConfig = typeof siteConfig;`;

const namecardI18n = `'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type Locale = 'ko' | 'en';

const translations: Record<Locale, Record<string, string>> = {
  ko: { 'contact.call': '전화하기', 'contact.email': '이메일 보내기', 'contact.map': '지도에서 보기', 'contact.website': '웹사이트 방문', 'qr.hint': 'QR 코드를 스캔하면 연락처가 저장됩니다', 'save.contact': '연락처에 저장', 'theme.light': '라이트 모드로 전환', 'theme.dark': '다크 모드로 전환', 'footer.powered': 'Powered by' },
  en: { 'contact.call': 'Call', 'contact.email': 'Send email', 'contact.map': 'View on map', 'contact.website': 'Visit website', 'qr.hint': 'Scan QR code to save contact', 'save.contact': 'Save Contact', 'theme.light': 'Switch to light mode', 'theme.dark': 'Switch to dark mode', 'footer.powered': 'Powered by' },
};

interface LocaleContextValue { locale: Locale; setLocale: (l: Locale) => void; t: (key: string) => string; }

const LocaleContext = createContext<LocaleContextValue>({ locale: 'ko', setLocale: () => {}, t: (k) => k });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ko');
  useEffect(() => { const saved = localStorage.getItem('locale') as Locale | null; if (saved === 'ko' || saved === 'en') { setLocaleState(saved); document.documentElement.lang = saved; } }, []);
  const setLocale = useCallback((l: Locale) => { setLocaleState(l); localStorage.setItem('locale', l); document.documentElement.lang = l; }, []);
  const t = useCallback((key: string) => translations[locale]?.[key] ?? key, [locale]);
  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocale() { return useContext(LocaleContext); }`;

const namecardVcard = `interface VCardData { name: string; title?: string | null; company?: string | null; email?: string | null; phone?: string | null; address?: string | null; website?: string | null; }

export function generateVCard(data: VCardData): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0', \`FN:\${data.name}\`, \`N:\${data.name};;;;\`];
  if (data.title) lines.push(\`TITLE:\${data.title}\`);
  if (data.company) lines.push(\`ORG:\${data.company}\`);
  if (data.email) lines.push(\`EMAIL;TYPE=INTERNET:\${data.email}\`);
  if (data.phone) lines.push(\`TEL;TYPE=CELL:\${data.phone}\`);
  if (data.address) lines.push(\`ADR;TYPE=WORK:;;\${data.address};;;;\`);
  if (data.website) lines.push(\`URL:\${data.website}\`);
  lines.push('END:VCARD');
  return lines.join('\\r\\n');
}

export function generateVCardDataUrl(data: VCardData): string { return generateVCard(data); }`;

// ──────────────────────────────────────────────
// Export all templates
// ──────────────────────────────────────────────
export const homepageTemplates: HomepageTemplateContent[] = [
  {
    slug: 'portfolio-static',
    repoName: 'portfolio-static',
    description: '깔끔한 개인 포트폴리오 - Linkmap으로 생성',
    files: [
      { path: '.github/workflows/deploy.yml', content: staticDeployWorkflow },
      { path: 'index.html', content: portfolioIndex },
      { path: 'style.css', content: portfolioStyle },
    ],
  },
  {
    slug: 'landing-static',
    repoName: 'landing-static',
    description: '비즈니스 랜딩 페이지 - Linkmap으로 생성',
    files: [
      { path: '.github/workflows/deploy.yml', content: staticDeployWorkflow },
      { path: 'index.html', content: landingIndex },
      { path: 'style.css', content: landingStyle },
    ],
  },
  {
    slug: 'resume-static',
    repoName: 'resume-static',
    description: '온라인 이력서 페이지 - Linkmap으로 생성',
    files: [
      { path: '.github/workflows/deploy.yml', content: staticDeployWorkflow },
      { path: 'index.html', content: resumeIndex },
      { path: 'style.css', content: resumeStyle },
    ],
  },
  {
    slug: 'blog-static',
    repoName: 'blog-static',
    description: '심플 블로그 - Linkmap으로 생성',
    files: [
      { path: '.github/workflows/deploy.yml', content: staticDeployWorkflow },
      { path: 'index.html', content: blogIndex },
      { path: 'style.css', content: blogStyle },
    ],
  },
  {
    slug: 'docs-static',
    repoName: 'docs-static',
    description: '기술 문서 사이트 - Linkmap으로 생성',
    files: [
      { path: '.github/workflows/deploy.yml', content: staticDeployWorkflow },
      { path: 'index.html', content: docsIndex },
      { path: 'style.css', content: docsStyle },
    ],
  },
  // ── MVP 3종 (Next.js + GitHub Actions) ──
  {
    slug: 'link-in-bio-pro',
    repoName: 'link-in-bio-pro',
    description: '링크인바이오 페이지 - Linkmap으로 생성',
    files: [
      { path: '.github/workflows/deploy.yml', content: deployWorkflow },
      { path: 'package.json', content: linkInBioPackageJson },
      { path: 'tsconfig.json', content: sharedTsConfig },
      { path: 'postcss.config.mjs', content: sharedPostcssConfig },
      { path: 'next.config.ts', content: sharedNextConfig },
      { path: 'src/app/api/og/route.tsx', content: linkInBioOgRoute },
      { path: 'src/app/globals.css', content: linkInBioGlobalsCss },
      { path: 'src/app/layout.tsx', content: linkInBioLayout },
      { path: 'src/app/page.tsx', content: linkInBioPage },
      { path: 'src/components/content-embed.tsx', content: linkInBioContentEmbed },
      { path: 'src/components/footer.tsx', content: linkInBioFooter },
      { path: 'src/components/language-toggle.tsx', content: linkInBioLanguageToggle },
      { path: 'src/components/link-list.tsx', content: linkInBioLinkList },
      { path: 'src/components/profile-section.tsx', content: linkInBioProfileSection },
      { path: 'src/components/social-bar.tsx', content: linkInBioSocialBar },
      { path: 'src/components/theme-toggle.tsx', content: linkInBioThemeToggle },
      { path: 'src/lib/config.ts', content: linkInBioConfig },
      { path: 'src/lib/i18n.tsx', content: linkInBioI18n },
      { path: 'src/lib/themes.ts', content: linkInBioThemes },
    ],
  },
  {
    slug: 'digital-namecard',
    repoName: 'digital-namecard',
    description: '디지털 명함 - Linkmap으로 생성',
    files: [
      { path: '.github/workflows/deploy.yml', content: deployWorkflow },
      { path: 'package.json', content: namecardPackageJson },
      { path: 'tsconfig.json', content: sharedTsConfig },
      { path: 'postcss.config.mjs', content: sharedPostcssConfig },
      { path: 'next.config.ts', content: sharedNextConfig },
      { path: 'src/app/api/og/route.tsx', content: namecardOgRoute },
      { path: 'src/app/globals.css', content: namecardGlobalsCss },
      { path: 'src/app/layout.tsx', content: namecardLayout },
      { path: 'src/app/page.tsx', content: namecardPage },
      { path: 'src/components/contact-info.tsx', content: namecardContactInfo },
      { path: 'src/components/footer.tsx', content: namecardFooter },
      { path: 'src/components/language-toggle.tsx', content: namecardLanguageToggle },
      { path: 'src/components/profile-card.tsx', content: namecardProfileCard },
      { path: 'src/components/qr-code.tsx', content: namecardQrCode },
      { path: 'src/components/save-contact-button.tsx', content: namecardSaveContactButton },
      { path: 'src/components/social-links.tsx', content: namecardSocialLinks },
      { path: 'src/components/theme-toggle.tsx', content: namecardThemeToggle },
      { path: 'src/lib/config.ts', content: namecardConfig },
      { path: 'src/lib/i18n.tsx', content: namecardI18n },
      { path: 'src/lib/vcard.ts', content: namecardVcard },
    ],
  },
  devShowcaseTemplate,
];
