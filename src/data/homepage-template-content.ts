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
  <title>My Portfolio</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="hero">
    <div class="container">
      <div class="avatar">
        <div class="avatar-placeholder">P</div>
      </div>
      <h1>Hong Gildong</h1>
      <p class="subtitle">Frontend Developer</p>
      <p class="bio">I build clean, responsive web experiences.</p>
      <div class="social-links">
        <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:hello@example.com">Email</a>
      </div>
    </div>
  </header>

  <main class="container">
    <section class="section" id="skills">
      <h2>Skills</h2>
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
      <h2>Projects</h2>
      <div class="grid">
        <div class="card">
          <h3>Project Alpha</h3>
          <p>A responsive dashboard built with React and Tailwind CSS.</p>
          <a href="#" class="link">View &rarr;</a>
        </div>
        <div class="card">
          <h3>Project Beta</h3>
          <p>REST API service with Node.js and PostgreSQL.</p>
          <a href="#" class="link">View &rarr;</a>
        </div>
        <div class="card">
          <h3>Project Gamma</h3>
          <p>Mobile-first e-commerce landing page.</p>
          <a href="#" class="link">View &rarr;</a>
        </div>
      </div>
    </section>

    <section class="section" id="contact">
      <h2>Contact</h2>
      <p>Feel free to reach out at <a href="mailto:hello@example.com">hello@example.com</a></p>
    </section>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2026 My Portfolio. Built with Linkmap.</p>
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
  <title>My Landing Page</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <nav class="navbar">
    <div class="container nav-inner">
      <a href="#" class="logo">MyBrand</a>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#cta" class="btn btn-sm">Get Started</a>
      </div>
    </div>
  </nav>

  <header class="hero">
    <div class="container">
      <h1>Build Something<br/><span class="highlight">Amazing</span></h1>
      <p class="hero-desc">The simplest way to launch your next project. Fast, reliable, and beautiful.</p>
      <div class="hero-actions">
        <a href="#cta" class="btn btn-primary">Start Free</a>
        <a href="#features" class="btn btn-outline">Learn More</a>
      </div>
    </div>
  </header>

  <section class="section" id="features">
    <div class="container">
      <h2 class="section-title">Features</h2>
      <div class="grid-3">
        <div class="feature-card">
          <div class="icon">&#9889;</div>
          <h3>Lightning Fast</h3>
          <p>Optimized for speed with zero bloat.</p>
        </div>
        <div class="feature-card">
          <div class="icon">&#128274;</div>
          <h3>Secure</h3>
          <p>Enterprise-grade security built in.</p>
        </div>
        <div class="feature-card">
          <div class="icon">&#128640;</div>
          <h3>Easy Deploy</h3>
          <p>One-click deploy to any platform.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt" id="pricing">
    <div class="container">
      <h2 class="section-title">Pricing</h2>
      <div class="grid-3">
        <div class="price-card">
          <h3>Free</h3>
          <div class="price">$0<span>/mo</span></div>
          <ul><li>1 Project</li><li>Basic Support</li><li>Community Access</li></ul>
          <a href="#" class="btn btn-outline">Get Started</a>
        </div>
        <div class="price-card featured">
          <h3>Pro</h3>
          <div class="price">$19<span>/mo</span></div>
          <ul><li>10 Projects</li><li>Priority Support</li><li>Advanced Features</li></ul>
          <a href="#" class="btn btn-primary">Get Started</a>
        </div>
        <div class="price-card">
          <h3>Team</h3>
          <div class="price">$49<span>/mo</span></div>
          <ul><li>Unlimited Projects</li><li>Team Management</li><li>Custom Integrations</li></ul>
          <a href="#" class="btn btn-outline">Contact Us</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="cta">
    <div class="container cta-box">
      <h2>Ready to get started?</h2>
      <p>Join thousands of users building with MyBrand.</p>
      <a href="#" class="btn btn-primary btn-lg">Start Free Today</a>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; 2026 MyBrand. Built with Linkmap.</p>
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
  <title>Online Resume</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="page">
    <aside class="sidebar">
      <div class="profile">
        <div class="avatar">H</div>
        <h1>Hong Gildong</h1>
        <p class="title">Software Engineer</p>
      </div>
      <section>
        <h2>Contact</h2>
        <ul class="contact-list">
          <li>hello@example.com</li>
          <li>Seoul, South Korea</li>
          <li>github.com/username</li>
        </ul>
      </section>
      <section>
        <h2>Skills</h2>
        <div class="skill-bars">
          <div class="skill"><span>JavaScript</span><div class="bar"><div class="fill" style="width:90%"></div></div></div>
          <div class="skill"><span>TypeScript</span><div class="bar"><div class="fill" style="width:85%"></div></div></div>
          <div class="skill"><span>React</span><div class="bar"><div class="fill" style="width:88%"></div></div></div>
          <div class="skill"><span>Node.js</span><div class="bar"><div class="fill" style="width:80%"></div></div></div>
          <div class="skill"><span>Python</span><div class="bar"><div class="fill" style="width:70%"></div></div></div>
        </div>
      </section>
      <section>
        <h2>Languages</h2>
        <ul class="contact-list">
          <li>Korean (Native)</li>
          <li>English (Fluent)</li>
        </ul>
      </section>
    </aside>

    <main class="content">
      <section>
        <h2>About</h2>
        <p>Passionate software engineer with 5+ years of experience building modern web applications. Focused on creating clean, performant, and user-friendly products.</p>
      </section>
      <section>
        <h2>Experience</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="period">2023 &ndash; Present</div>
            <h3>Senior Frontend Developer</h3>
            <p class="company">Tech Corp</p>
            <ul>
              <li>Led migration of legacy app to React + TypeScript</li>
              <li>Improved page load time by 40%</li>
              <li>Mentored 3 junior developers</li>
            </ul>
          </div>
          <div class="timeline-item">
            <div class="period">2021 &ndash; 2023</div>
            <h3>Frontend Developer</h3>
            <p class="company">Startup Inc</p>
            <ul>
              <li>Built customer dashboard from scratch</li>
              <li>Implemented CI/CD pipeline with GitHub Actions</li>
            </ul>
          </div>
          <div class="timeline-item">
            <div class="period">2019 &ndash; 2021</div>
            <h3>Junior Developer</h3>
            <p class="company">Web Agency</p>
            <ul>
              <li>Developed 20+ client websites</li>
              <li>Introduced responsive design standards</li>
            </ul>
          </div>
        </div>
      </section>
      <section>
        <h2>Education</h2>
        <div class="timeline">
          <div class="timeline-item">
            <div class="period">2015 &ndash; 2019</div>
            <h3>B.S. Computer Science</h3>
            <p class="company">Seoul National University</p>
          </div>
        </div>
      </section>
    </main>
  </div>

  <footer>
    <p>&copy; 2026 Online Resume. Built with Linkmap.</p>
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
  <title>My Blog</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <nav class="navbar">
    <div class="container nav-inner">
      <a href="#" class="logo">MyBlog</a>
      <div class="nav-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Archive</a>
      </div>
    </div>
  </nav>

  <header class="hero">
    <div class="container">
      <h1>Welcome to MyBlog</h1>
      <p>Thoughts on development, design, and technology.</p>
    </div>
  </header>

  <main class="container">
    <div class="posts">
      <article class="post-card">
        <div class="post-meta">
          <time>2026-02-10</time>
          <span class="tag">Development</span>
        </div>
        <h2><a href="#">Getting Started with TypeScript in 2026</a></h2>
        <p>TypeScript has become the standard for modern web development. Here's everything you need to know to get started...</p>
        <a href="#" class="read-more">Read more &rarr;</a>
      </article>

      <article class="post-card">
        <div class="post-meta">
          <time>2026-02-05</time>
          <span class="tag">Design</span>
        </div>
        <h2><a href="#">Minimal Design Principles for Developers</a></h2>
        <p>You don't need to be a designer to create beautiful interfaces. Learn the key principles that make a difference...</p>
        <a href="#" class="read-more">Read more &rarr;</a>
      </article>

      <article class="post-card">
        <div class="post-meta">
          <time>2026-01-28</time>
          <span class="tag">Tools</span>
        </div>
        <h2><a href="#">My Favorite Developer Tools in 2026</a></h2>
        <p>A curated list of tools that boost my productivity every day. From code editors to deployment platforms...</p>
        <a href="#" class="read-more">Read more &rarr;</a>
      </article>

      <article class="post-card">
        <div class="post-meta">
          <time>2026-01-20</time>
          <span class="tag">Career</span>
        </div>
        <h2><a href="#">Lessons from 5 Years of Software Engineering</a></h2>
        <p>Reflecting on what I've learned after half a decade in the industry. Mistakes, wins, and everything in between...</p>
        <a href="#" class="read-more">Read more &rarr;</a>
      </article>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>&copy; 2026 MyBlog. Built with Linkmap.</p>
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
  <title>Documentation</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <nav class="topbar">
    <div class="topbar-inner">
      <a href="#" class="logo">MyDocs</a>
      <div class="nav-links">
        <a href="#">Guide</a>
        <a href="#">API</a>
        <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
  </nav>

  <div class="layout">
    <aside class="sidebar">
      <h3>Getting Started</h3>
      <ul>
        <li><a href="#" class="active">Introduction</a></li>
        <li><a href="#">Installation</a></li>
        <li><a href="#">Quick Start</a></li>
      </ul>
      <h3>Guides</h3>
      <ul>
        <li><a href="#">Configuration</a></li>
        <li><a href="#">Authentication</a></li>
        <li><a href="#">Deployment</a></li>
      </ul>
      <h3>API Reference</h3>
      <ul>
        <li><a href="#">REST API</a></li>
        <li><a href="#">Webhooks</a></li>
        <li><a href="#">SDK</a></li>
      </ul>
    </aside>

    <main class="doc-content">
      <div class="breadcrumb">Getting Started &rsaquo; Introduction</div>

      <h1>Introduction</h1>
      <p class="lead">Welcome to the documentation. This guide will help you get up and running quickly.</p>

      <h2>What is MyProject?</h2>
      <p>MyProject is a modern development tool that simplifies your workflow. It provides a clean API, easy configuration, and seamless integration with your existing tools.</p>

      <h2>Key Features</h2>
      <ul>
        <li><strong>Simple Setup</strong> &ndash; Get started in under 5 minutes</li>
        <li><strong>Type Safe</strong> &ndash; Full TypeScript support out of the box</li>
        <li><strong>Extensible</strong> &ndash; Plugin system for custom functionality</li>
        <li><strong>Well Documented</strong> &ndash; Comprehensive guides and examples</li>
      </ul>

      <h2>Quick Example</h2>
      <div class="code-block">
        <pre><code>// Install
npm install myproject

// Initialize
import { init } from 'myproject';

const app = init({
  apiKey: 'your-api-key',
  environment: 'production',
});

// Use it
const result = await app.run();
console.log(result);</code></pre>
      </div>

      <h2>Next Steps</h2>
      <p>Now that you have an overview, continue with:</p>
      <div class="next-links">
        <a href="#" class="next-card">
          <strong>Installation Guide</strong>
          <span>Set up your development environment</span>
        </a>
        <a href="#" class="next-card">
          <strong>Quick Start</strong>
          <span>Build your first project in minutes</span>
        </a>
      </div>

      <div class="page-nav">
        <div></div>
        <a href="#" class="nav-next">Installation &rarr;</a>
      </div>
    </main>
  </div>

  <footer>
    <p>&copy; 2026 MyDocs. Built with Linkmap.</p>
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
    description: 'Clean personal portfolio - Generated by Linkmap',
    files: [
      { path: 'index.html', content: portfolioIndex },
      { path: 'style.css', content: portfolioStyle },
    ],
  },
  {
    slug: 'landing-static',
    repoName: 'landing-static',
    description: 'Business landing page - Generated by Linkmap',
    files: [
      { path: 'index.html', content: landingIndex },
      { path: 'style.css', content: landingStyle },
    ],
  },
  {
    slug: 'resume-static',
    repoName: 'resume-static',
    description: 'Professional resume page - Generated by Linkmap',
    files: [
      { path: 'index.html', content: resumeIndex },
      { path: 'style.css', content: resumeStyle },
    ],
  },
  {
    slug: 'blog-static',
    repoName: 'blog-static',
    description: 'Simple blog - Generated by Linkmap',
    files: [
      { path: 'index.html', content: blogIndex },
      { path: 'style.css', content: blogStyle },
    ],
  },
  {
    slug: 'docs-static',
    repoName: 'docs-static',
    description: 'Technical documentation site - Generated by Linkmap',
    files: [
      { path: 'index.html', content: docsIndex },
      { path: 'style.css', content: docsStyle },
    ],
  },
];
