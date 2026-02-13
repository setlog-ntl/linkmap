/**
 * Homepage template content for one-click deploy.
 * Each template contains the files to be pushed to a new GitHub repo.
 * The setup-templates admin endpoint uses this data to create template repos.
 */

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
// Export all templates
// ──────────────────────────────────────────────
export const homepageTemplates: HomepageTemplateContent[] = [
  {
    slug: 'portfolio-static',
    repoName: 'portfolio-static',
    description: '깔끔한 개인 포트폴리오 - Linkmap으로 생성',
    files: [
      { path: 'index.html', content: portfolioIndex },
      { path: 'style.css', content: portfolioStyle },
    ],
  },
  {
    slug: 'landing-static',
    repoName: 'landing-static',
    description: '비즈니스 랜딩 페이지 - Linkmap으로 생성',
    files: [
      { path: 'index.html', content: landingIndex },
      { path: 'style.css', content: landingStyle },
    ],
  },
  {
    slug: 'resume-static',
    repoName: 'resume-static',
    description: '온라인 이력서 페이지 - Linkmap으로 생성',
    files: [
      { path: 'index.html', content: resumeIndex },
      { path: 'style.css', content: resumeStyle },
    ],
  },
  {
    slug: 'blog-static',
    repoName: 'blog-static',
    description: '심플 블로그 - Linkmap으로 생성',
    files: [
      { path: 'index.html', content: blogIndex },
      { path: 'style.css', content: blogStyle },
    ],
  },
  {
    slug: 'docs-static',
    repoName: 'docs-static',
    description: '기술 문서 사이트 - Linkmap으로 생성',
    files: [
      { path: 'index.html', content: docsIndex },
      { path: 'style.css', content: docsStyle },
    ],
  },
];
