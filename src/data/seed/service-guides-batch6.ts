import type { ServiceGuideSeed } from './service-guides';

// ---------------------------------------------------------------------------
// Service ID constants (Batch 6 - Domain Registrars)
// ---------------------------------------------------------------------------
const S = {
  namecheap:      '10000000-0000-4000-a000-000000000091',
  cloudflare_reg: '10000000-0000-4000-a000-000000000092',
  godaddy:        '10000000-0000-4000-a000-000000000093',
  gabia:          '10000000-0000-4000-a000-000000000094',
  hosting_kr:     '10000000-0000-4000-a000-000000000095',
  dotname:        '10000000-0000-4000-a000-000000000096',
};

export const serviceGuidesBatch6: ServiceGuideSeed[] = [
  // -------------------------------------------------------------------------
  // 1. Namecheap
  // -------------------------------------------------------------------------
  {
    service_id: S.namecheap,
    quick_start: 'Namecheap에서 도메인을 구매하고 DNS 레코드를 설정하여 Vercel, Cloudflare 등 배포 서비스와 연결할 수 있습니다. API를 통해 DNS 레코드를 프로그래밍 방식으로 관리할 수도 있습니다.',
    quick_start_en: 'Purchase a domain on Namecheap and configure DNS records to connect with Vercel, Cloudflare, and other deployment services. You can also manage DNS records programmatically via the Namecheap API.',
    setup_steps: [
      {
        step: 1,
        title: 'Purchase a domain',
        title_ko: '도메인 구매',
        description: 'Search for your desired domain on namecheap.com and complete the purchase. Free WHOIS privacy protection is included.',
        description_ko: 'namecheap.com에서 원하는 도메인을 검색하고 구매를 완료합니다. 무료 WHOIS 프라이버시 보호가 포함됩니다.',
        code_snippet: `# 도메인 검색 후 장바구니에 담고 결제 완료
# 결제 완료 후 Dashboard > Domain List에서 도메인 확인 가능`,
      },
      {
        step: 2,
        title: 'Configure DNS records',
        title_ko: 'DNS 레코드 설정',
        description: 'Go to Domain List → Manage → Advanced DNS to add A, CNAME, or TXT records for your domain.',
        description_ko: 'Domain List → Manage → Advanced DNS로 이동하여 A, CNAME, TXT 레코드를 추가합니다.',
        code_snippet: `# Vercel 배포 시 DNS 설정 예시
# Type: A,     Host: @,   Value: 76.76.21.21 (Vercel IP)
# Type: CNAME, Host: www, Value: cname.vercel-dns.com`,
      },
      {
        step: 3,
        title: 'Enable API access',
        title_ko: 'API 접근 활성화',
        description: 'Go to Profile → Tools → Namecheap API Access to enable the API and whitelist your IP address.',
        description_ko: 'Profile → Tools → Namecheap API Access에서 API를 활성화하고 IP 주소를 화이트리스트에 추가합니다.',
        code_snippet: `# Profile → Tools → Namecheap API Access
# 1. Enable API Access 토글 활성화
# 2. Whitelisted IPs에 서버 IP 추가 (최대 20개)
# 3. API Key 복사 후 환경변수에 저장

# .env
NAMECHEAP_API_USER=your_username
NAMECHEAP_API_KEY=your_api_key
NAMECHEAP_CLIENT_IP=your_server_ip`,
      },
      {
        step: 4,
        title: 'Manage DNS via API',
        title_ko: 'API로 DNS 관리',
        description: 'Use the Namecheap REST API to get and set DNS host records programmatically.',
        description_ko: 'Namecheap REST API로 DNS 호스트 레코드를 프로그래밍 방식으로 조회하고 설정합니다.',
        code_snippet: `// DNS 호스트 레코드 조회
const params = new URLSearchParams({
  ApiUser: process.env.NAMECHEAP_API_USER!,
  ApiKey: process.env.NAMECHEAP_API_KEY!,
  UserName: process.env.NAMECHEAP_API_USER!,
  Command: 'namecheap.domains.dns.getHosts',
  ClientIp: process.env.NAMECHEAP_CLIENT_IP!,
  SLD: 'example',   // 도메인 이름 (TLD 제외)
  TLD: 'com',        // TLD
});

const res = await fetch(
  \`https://api.namecheap.com/xml.response?\${params}\`
);
const xml = await res.text();`,
      },
    ],
    code_examples: {
      typescript: `// Namecheap API - DNS 레코드 설정 (TypeScript)
// setHosts는 기존 레코드를 전체 덮어쓰므로,
// 먼저 getHosts로 조회한 후 기존 레코드를 포함해서 전송해야 합니다.

const BASE_URL = 'https://api.namecheap.com/xml.response';

interface NamecheapConfig {
  apiUser: string;
  apiKey: string;
  clientIp: string;
}

async function setDnsHosts(
  config: NamecheapConfig,
  sld: string,
  tld: string,
  hosts: Array<{ HostName: string; RecordType: string; Address: string; TTL?: number }>
): Promise<string> {
  const params = new URLSearchParams({
    ApiUser: config.apiUser,
    ApiKey: config.apiKey,
    UserName: config.apiUser,
    Command: 'namecheap.domains.dns.setHosts',
    ClientIp: config.clientIp,
    SLD: sld,
    TLD: tld,
  });

  // 각 호스트 레코드를 인덱스 1부터 추가
  hosts.forEach((host, i) => {
    const idx = i + 1;
    params.set(\`HostName\${idx}\`, host.HostName);
    params.set(\`RecordType\${idx}\`, host.RecordType);
    params.set(\`Address\${idx}\`, host.Address);
    params.set(\`TTL\${idx}\`, String(host.TTL ?? 1800));
  });

  const res = await fetch(BASE_URL, {
    method: 'POST',
    body: params,
  });
  return res.text();
}

// 사용 예시: Vercel 배포를 위한 DNS 설정
const config: NamecheapConfig = {
  apiUser: process.env.NAMECHEAP_API_USER!,
  apiKey: process.env.NAMECHEAP_API_KEY!,
  clientIp: process.env.NAMECHEAP_CLIENT_IP!,
};

await setDnsHosts(config, 'mydomain', 'com', [
  { HostName: '@',   RecordType: 'A',     Address: '76.76.21.21' },
  { HostName: 'www', RecordType: 'CNAME', Address: 'cname.vercel-dns.com' },
]);`,
    },
    common_pitfalls: [
      {
        title: 'setHosts overwrites all records',
        title_ko: 'setHosts는 전체 레코드를 덮어씀',
        problem: 'Calling setHosts without including existing records will delete them all.',
        solution: 'Always call getHosts first to retrieve current records, then include them in the setHosts call along with your new records.',
        code: `// 올바른 패턴: 기존 레코드 조회 후 병합하여 설정
const existing = await getHosts(config, 'mydomain', 'com');
const merged = [...existing, { HostName: 'api', RecordType: 'CNAME', Address: 'cname.vercel-dns.com' }];
await setDnsHosts(config, 'mydomain', 'com', merged);`,
      },
      {
        title: 'IP whitelist required for API',
        title_ko: 'API 사용 시 IP 화이트리스트 필수',
        problem: 'API calls fail with "IP address is not whitelisted" error when the server IP is not added.',
        solution: 'Add your server\'s public IP to the whitelist in Profile → Tools → Namecheap API Access. For dynamic IPs, use a static IP service or Namecheap sandbox environment for testing.',
      },
      {
        title: 'DNS propagation delay',
        title_ko: 'DNS 전파 지연',
        problem: 'After updating DNS records, changes may not be visible immediately.',
        solution: 'DNS propagation can take up to 48 hours. Use dnschecker.org to verify propagation status across global servers. Set lower TTL values (e.g., 300s) before making changes.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Add an A record pointing to 76.76.21.21 and a CNAME for www pointing to cname.vercel-dns.com. Alternatively, delegate DNS management entirely to Vercel by changing nameservers.',
        tip_ko: 'A 레코드를 76.76.21.21로, www CNAME을 cname.vercel-dns.com으로 설정합니다. 또는 네임서버를 Vercel DNS로 변경하여 DNS 관리를 위임할 수 있습니다.',
        code: `# Namecheap Advanced DNS 설정 (Vercel 연동)
# Type    | Host | Value                  | TTL
# A       | @    | 76.76.21.21            | Automatic
# CNAME   | www  | cname.vercel-dns.com   | Automatic`,
      },
      {
        with_service_slug: 'cloudflare',
        tip: 'Change nameservers in Namecheap to Cloudflare\'s assigned nameservers (e.g., ns1.cloudflare.com) to delegate all DNS management to Cloudflare. This enables Cloudflare CDN, DDoS protection, and SSL.',
        tip_ko: 'Namecheap에서 네임서버를 Cloudflare에서 할당한 네임서버(예: ns1.cloudflare.com)로 변경하면 모든 DNS 관리를 Cloudflare에 위임할 수 있습니다. Cloudflare CDN, DDoS 방어, SSL이 자동으로 활성화됩니다.',
        code: `# Namecheap Domain List → Manage → Nameservers
# 'Namecheap BasicDNS' → 'Custom DNS' 선택 후
# Cloudflare 대시보드에서 발급된 네임서버 2개 입력
# 예: iris.ns.cloudflare.com / kirk.ns.cloudflare.com`,
      },
      {
        with_service_slug: 'netlify',
        tip: 'Point your Namecheap domain to Netlify by adding a CNAME record for www pointing to your Netlify subdomain, and an A record for the apex domain using Netlify\'s load balancer IP (75.2.60.5).',
        tip_ko: 'www CNAME을 Netlify 서브도메인으로, 루트 도메인 A 레코드를 75.2.60.5(Netlify 로드밸런서)로 설정하여 도메인을 Netlify와 연결합니다.',
        code: `# Type    | Host | Value                       | TTL
# A       | @    | 75.2.60.5                   | Automatic
# CNAME   | www  | your-site.netlify.app       | Automatic`,
      },
    ],
    pros: [
      { text: 'Very competitive pricing for .com domains (~$8-9/year)', text_ko: '.com 도메인 경쟁력 있는 가격 (~$8-9/년)' },
      { text: 'Free WHOIS privacy protection included', text_ko: '무료 WHOIS 프라이버시 보호 기본 제공' },
      { text: 'Full-featured REST API for DNS automation', text_ko: 'DNS 자동화를 위한 완전한 REST API 제공' },
      { text: 'Bulk domain management and easy transfers', text_ko: '대량 도메인 관리 및 간편한 이전 기능' },
    ],
    cons: [
      { text: 'API requires IP whitelisting which is inconvenient for dynamic environments', text_ko: 'API 사용 시 IP 화이트리스트 필수 — 동적 환경에서 불편' },
      { text: 'Renewal prices higher than first-year promotional rates', text_ko: '첫해 프로모션 가격 대비 갱신 가격이 높음' },
      { text: 'No built-in CDN or DDoS protection unlike Cloudflare', text_ko: 'Cloudflare와 달리 내장 CDN·DDoS 방어 없음' },
    ],
    api_key_url: 'https://ap.www.namecheap.com/settings/tools/apiaccess/',
    api_key_url_label: 'Namecheap API Access',
  },

  // -------------------------------------------------------------------------
  // 2. Cloudflare Registrar
  // -------------------------------------------------------------------------
  {
    service_id: S.cloudflare_reg,
    quick_start: 'Cloudflare 대시보드에서 도메인을 등록하거나 이전하면 마크업 없는 원가 가격과 자동 DNSSEC, CDN, DDoS 방어를 즉시 사용할 수 있습니다.',
    quick_start_en: 'Register or transfer your domain via the Cloudflare dashboard to get at-cost pricing with no markup, automatic DNSSEC, CDN, and DDoS protection.',
    setup_steps: [
      {
        step: 1,
        title: 'Add domain to Cloudflare',
        title_ko: 'Cloudflare에 도메인 추가',
        description: 'Go to Cloudflare Dashboard → Add a Site, enter your domain, and select a plan (Free works for most use cases).',
        description_ko: 'Cloudflare 대시보드 → Add a Site에서 도메인을 입력하고 플랜을 선택합니다(대부분의 경우 Free로 충분합니다).',
        code_snippet: `# 기존 도메인 이전 또는 신규 등록
# 대시보드: https://dash.cloudflare.com
# 1. Add a Site → 도메인 입력 → Free 플랜 선택
# 2. DNS 레코드 스캔 결과 확인 후 Continue
# 3. 현재 레지스트라에서 Cloudflare 네임서버로 변경`,
      },
      {
        step: 2,
        title: 'Transfer domain to Cloudflare Registrar',
        title_ko: 'Cloudflare Registrar로 도메인 이전',
        description: 'In Cloudflare Dashboard, go to Domain Registration → Transfer Domains and follow the transfer process using your domain\'s EPP/Auth code.',
        description_ko: 'Cloudflare 대시보드 → Domain Registration → Transfer Domains에서 EPP/Auth 코드로 이전 절차를 진행합니다.',
        code_snippet: `# 도메인 이전 사전 조건:
# 1. 현재 레지스트라에서 도메인 잠금(lock) 해제
# 2. EPP/Auth 코드 발급 요청
# 3. WHOIS 이메일 확인 가능 상태 유지
# 4. 최근 60일 이내 등록/이전 이력 없어야 함`,
      },
      {
        step: 3,
        title: 'Configure DNS records',
        title_ko: 'DNS 레코드 설정',
        description: 'In Cloudflare Dashboard → DNS → Records, add or edit A, CNAME, MX, TXT records. Enable Proxy (orange cloud) for CDN and DDoS protection.',
        description_ko: 'Cloudflare 대시보드 → DNS → Records에서 A, CNAME, MX, TXT 레코드를 추가하거나 편집합니다. 프록시(주황색 구름)를 활성화하면 CDN과 DDoS 방어가 적용됩니다.',
        code_snippet: `# DNS 레코드 예시 (Vercel 배포)
# Type: A,     Name: @,   Content: 76.76.21.21,         Proxy: DNS only
# Type: CNAME, Name: www, Content: cname.vercel-dns.com, Proxy: DNS only
# (Vercel 커스텀 도메인은 Proxy 비활성화 필수)`,
      },
      {
        step: 4,
        title: 'Manage via Cloudflare API',
        title_ko: 'Cloudflare API로 관리',
        description: 'Use the cloudflare npm package to manage DNS records and domain settings programmatically.',
        description_ko: 'cloudflare npm 패키지로 DNS 레코드와 도메인 설정을 프로그래밍 방식으로 관리합니다.',
        code_snippet: `npm install cloudflare`,
      },
    ],
    code_examples: {
      typescript: `import Cloudflare from 'cloudflare';

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
});

// 계정의 등록 도메인 목록 조회
async function listRegisteredDomains(accountId: string) {
  const domains = [];
  for await (const domain of client.registrar.domains.list({ account_id: accountId })) {
    domains.push(domain);
  }
  return domains;
}

// DNS 레코드 생성
async function createDnsRecord(zoneId: string) {
  const record = await client.dns.records.create({
    zone_id: zoneId,
    type: 'A',
    name: '@',
    content: '76.76.21.21',
    ttl: 1,       // 1 = 자동
    proxied: false, // Vercel 사용 시 false 필수
  });
  return record;
}

// DNS 레코드 목록 조회
async function listDnsRecords(zoneId: string) {
  const records = [];
  for await (const record of client.dns.records.list({ zone_id: zoneId })) {
    records.push(record);
  }
  return records;
}

// Zone ID 조회 (도메인 이름으로)
async function getZoneId(domainName: string): Promise<string> {
  const zones = await client.zones.list({ name: domainName });
  const zone = zones.result[0];
  if (!zone) throw new Error(\`Zone not found for domain: \${domainName}\`);
  return zone.id;
}`,
    },
    common_pitfalls: [
      {
        title: 'Proxy mode breaks Vercel/Netlify custom domains',
        title_ko: '프록시 모드가 Vercel/Netlify 커스텀 도메인을 방해',
        problem: 'Enabling Cloudflare Proxy (orange cloud) on DNS records used for Vercel or Netlify causes SSL certificate errors or deployment failures.',
        solution: 'Set DNS records for Vercel/Netlify deployments to "DNS only" (grey cloud). Only enable proxy for records you want Cloudflare CDN to handle.',
        code: `// Cloudflare API로 DNS only 레코드 생성
await client.dns.records.create({
  zone_id: zoneId,
  type: 'CNAME',
  name: 'www',
  content: 'cname.vercel-dns.com',
  proxied: false,  // Vercel 사용 시 반드시 false
});`,
      },
      {
        title: 'Domain registration limited to Cloudflare nameservers',
        title_ko: '도메인 등록은 Cloudflare 네임서버 전용',
        problem: 'Cloudflare Registrar requires using Cloudflare nameservers — you cannot change nameservers to another DNS provider.',
        solution: 'If you need to use external nameservers, consider a different registrar. Cloudflare Registrar is ideal when you also want Cloudflare DNS/CDN.',
      },
      {
        title: 'API Token must have correct permissions',
        title_ko: 'API 토큰에 올바른 권한 필요',
        problem: 'API calls fail with 403 errors if the token lacks the required Zone:DNS:Edit or Account:Registrar:Edit permissions.',
        solution: 'Create a scoped API Token in My Profile → API Tokens → Create Token. Use the "Edit zone DNS" template or add specific permissions as needed.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Use Cloudflare as DNS-only (no proxy) for Vercel deployments. Add an A record for apex domain and CNAME for www, both with proxy disabled. Vercel handles SSL certificates independently.',
        tip_ko: 'Vercel 배포 시 Cloudflare를 DNS 전용(프록시 비활성화)으로 사용합니다. 루트 도메인 A 레코드와 www CNAME 모두 프록시를 끄세요. Vercel이 SSL을 독립적으로 처리합니다.',
        code: `# Cloudflare DNS 설정 (Vercel 연동, 프록시 OFF)
# Type: A,     Name: @,   Content: 76.76.21.21,          Proxy: DNS only
# Type: CNAME, Name: www, Content: cname.vercel-dns.com,  Proxy: DNS only`,
      },
      {
        with_service_slug: 'netlify',
        tip: 'Point your Cloudflare-managed domain to Netlify with proxy disabled. Use an A record (75.2.60.5) for the apex and a CNAME for www. Netlify will provision SSL via Let\'s Encrypt.',
        tip_ko: '프록시를 비활성화한 상태로 Cloudflare 도메인을 Netlify와 연결합니다. 루트 도메인 A 레코드(75.2.60.5)와 www CNAME을 설정하면 Netlify가 Let\'s Encrypt SSL을 발급합니다.',
      },
      {
        with_service_slug: 'supabase',
        tip: 'Use Cloudflare Workers or Pages with your Supabase backend. Set up a CNAME or subdomain (e.g., api.yourdomain.com) pointing to your Supabase project URL for custom domain routing.',
        tip_ko: 'Cloudflare Workers/Pages를 Supabase 백엔드와 함께 사용할 수 있습니다. Supabase 프로젝트 URL에 대한 서브도메인(예: api.yourdomain.com) CNAME을 설정하여 커스텀 도메인 라우팅을 구성합니다.',
      },
    ],
    pros: [
      { text: 'At-cost pricing with zero markup on domain renewals', text_ko: '도메인 갱신 시 마크업 없는 원가 가격' },
      { text: 'Automatic DNSSEC, CDN, and DDoS protection included', text_ko: '자동 DNSSEC, CDN, DDoS 방어 기본 제공' },
      { text: 'Powerful API with official TypeScript SDK', text_ko: '공식 TypeScript SDK를 갖춘 강력한 API' },
      { text: 'Seamless integration with Cloudflare Workers, Pages, and R2', text_ko: 'Cloudflare Workers, Pages, R2와 원활한 통합' },
    ],
    cons: [
      { text: 'Cannot use non-Cloudflare nameservers — locked into Cloudflare DNS', text_ko: 'Cloudflare 이외의 네임서버 사용 불가 — Cloudflare DNS에 종속' },
      { text: 'Domain registration via API not fully supported (dashboard only for purchase)', text_ko: 'API를 통한 신규 도메인 등록 미지원 — 구매는 대시보드에서만 가능' },
      { text: 'Limited TLD selection compared to dedicated registrars', text_ko: '전문 레지스트라 대비 지원 TLD 수가 제한적' },
    ],
    api_key_url: 'https://dash.cloudflare.com/profile/api-tokens',
    api_key_url_label: 'Cloudflare API Tokens',
  },

  // -------------------------------------------------------------------------
  // 3. GoDaddy
  // -------------------------------------------------------------------------
  {
    service_id: S.godaddy,
    quick_start: 'GoDaddy에서 도메인을 구매하고 DNS 레코드를 설정하거나 네임서버를 변경하여 Vercel, Cloudflare 등의 서비스와 연결할 수 있습니다. Developer API로 도메인 구매·DNS 관리를 자동화할 수 있습니다.',
    quick_start_en: 'Purchase a domain on GoDaddy and configure DNS records or change nameservers to connect with Vercel, Cloudflare, and other services. Use the Developer API to automate domain purchases and DNS management.',
    setup_steps: [
      {
        step: 1,
        title: 'Purchase a domain',
        title_ko: '도메인 구매',
        description: 'Search for your domain on godaddy.com and complete the purchase. GoDaddy offers the world\'s largest domain inventory.',
        description_ko: 'godaddy.com에서 원하는 도메인을 검색하고 구매를 완료합니다. GoDaddy는 세계 최대 규모의 도메인 인벤토리를 보유합니다.',
        code_snippet: `# godaddy.com에서 도메인 검색 후 구매
# 구매 완료 후 My Products → Domains에서 도메인 확인`,
      },
      {
        step: 2,
        title: 'Configure DNS records',
        title_ko: 'DNS 레코드 설정',
        description: 'Go to My Products → Domains → DNS to add or edit A, CNAME, TXT records.',
        description_ko: 'My Products → Domains → DNS에서 A, CNAME, TXT 레코드를 추가하거나 편집합니다.',
        code_snippet: `# Vercel 배포를 위한 DNS 설정
# Type: A,     Name: @,   Value: 76.76.21.21
# Type: CNAME, Name: www, Value: cname.vercel-dns.com`,
      },
      {
        step: 3,
        title: 'Create API key',
        title_ko: 'API 키 생성',
        description: 'Go to developer.godaddy.com → Keys to create an API key and secret. Use the OTE environment for testing before going live.',
        description_ko: 'developer.godaddy.com → Keys에서 API 키와 시크릿을 생성합니다. 실제 운영 전 OTE 테스트 환경을 사용하세요.',
        code_snippet: `# .env
GODADDY_API_KEY=your_api_key
GODADDY_API_SECRET=your_api_secret

# 프로덕션: https://api.godaddy.com
# 테스트(OTE): https://api.ote-godaddy.com`,
      },
      {
        step: 4,
        title: 'Manage DNS via API',
        title_ko: 'API로 DNS 관리',
        description: 'Use the GoDaddy Domains API to check availability, purchase domains, and manage DNS records.',
        description_ko: 'GoDaddy Domains API로 도메인 가용성 확인, 구매, DNS 레코드 관리를 자동화합니다.',
        code_snippet: `// DNS 레코드 조회
const res = await fetch(
  'https://api.godaddy.com/v1/domains/example.com/records',
  {
    headers: {
      Authorization: \`sso-key \${API_KEY}:\${API_SECRET}\`,
    },
  }
);`,
      },
    ],
    code_examples: {
      typescript: `// GoDaddy Domains API - TypeScript
const GODADDY_API_BASE = 'https://api.godaddy.com';

function getHeaders(apiKey: string, apiSecret: string) {
  return {
    Authorization: \`sso-key \${apiKey}:\${apiSecret}\`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

const headers = getHeaders(
  process.env.GODADDY_API_KEY!,
  process.env.GODADDY_API_SECRET!
);

// 도메인 가용성 확인
async function checkDomainAvailability(domain: string) {
  const res = await fetch(
    \`\${GODADDY_API_BASE}/v1/domains/available?domain=\${domain}\`,
    { headers }
  );
  return res.json() as Promise<{ available: boolean; price: number; currency: string }>;
}

// DNS 레코드 조회
async function getDnsRecords(domain: string, type?: string, name?: string) {
  const path = type && name
    ? \`/v1/domains/\${domain}/records/\${type}/\${name}\`
    : \`/v1/domains/\${domain}/records\`;
  const res = await fetch(\`\${GODADDY_API_BASE}\${path}\`, { headers });
  return res.json();
}

// DNS 레코드 추가/수정 (PUT은 동일 type+name 레코드 전체 교체)
async function setDnsRecords(
  domain: string,
  type: string,
  name: string,
  records: Array<{ data: string; ttl?: number }>
) {
  const res = await fetch(
    \`\${GODADDY_API_BASE}/v1/domains/\${domain}/records/\${type}/\${name}\`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(
        records.map(r => ({ data: r.data, ttl: r.ttl ?? 3600, name, type }))
      ),
    }
  );
  if (!res.ok) throw new Error(\`GoDaddy API error: \${res.status}\`);
}

// 사용 예시
const avail = await checkDomainAvailability('myapp.com');
console.log(avail.available, avail.price);

// Vercel을 위한 A 레코드 설정
await setDnsRecords('myapp.com', 'A', '@', [{ data: '76.76.21.21', ttl: 600 }]);`,
    },
    common_pitfalls: [
      {
        title: 'OTE vs Production environment confusion',
        title_ko: 'OTE(테스트)와 프로덕션 환경 혼동',
        problem: 'API keys created in the OTE (test) environment only work against api.ote-godaddy.com, not the production API.',
        solution: 'Create separate API keys: one for OTE testing (api.ote-godaddy.com) and another for production (api.godaddy.com). Store both in environment variables with clear naming.',
        code: `# .env
GODADDY_API_BASE_OTE=https://api.ote-godaddy.com
GODADDY_API_BASE_PROD=https://api.godaddy.com
GODADDY_OTE_API_KEY=...
GODADDY_PROD_API_KEY=...`,
      },
      {
        title: 'DNS propagation after API update',
        title_ko: 'API 업데이트 후 DNS 전파 지연',
        problem: 'DNS changes made via API may take up to 48 hours to fully propagate globally.',
        solution: 'Use low TTL values (600s) before making changes, and verify propagation using external tools like dnschecker.org or dig command.',
      },
      {
        title: 'Aggressive upselling during checkout',
        title_ko: '결제 과정의 강압적 추가 판매',
        problem: 'GoDaddy checkout adds optional add-ons (privacy protection, hosting, SSL) by default, inflating the final price.',
        solution: 'Carefully review the cart and deselect unnecessary add-ons. WHOIS privacy is often available for free with other registrars like Namecheap.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'In GoDaddy DNS settings, add an A record for @ pointing to 76.76.21.21 and a CNAME for www pointing to cname.vercel-dns.com. Then add the custom domain in Vercel project settings.',
        tip_ko: 'GoDaddy DNS 설정에서 @ A 레코드를 76.76.21.21로, www CNAME을 cname.vercel-dns.com으로 설정합니다. 이후 Vercel 프로젝트 설정에서 커스텀 도메인을 추가합니다.',
        code: `# GoDaddy DNS Manager 설정
# Type: A,     Name: @,   Value: 76.76.21.21
# Type: CNAME, Name: www, Value: cname.vercel-dns.com
# TTL: 1 Hour (변경 후 최소 1시간 대기)`,
      },
      {
        with_service_slug: 'cloudflare',
        tip: 'Change GoDaddy nameservers to Cloudflare\'s assigned nameservers to leverage Cloudflare CDN and DDoS protection. Go to My Products → Domains → Nameservers and enter the Cloudflare nameserver addresses.',
        tip_ko: 'GoDaddy 네임서버를 Cloudflare에서 할당한 네임서버로 변경하면 Cloudflare CDN과 DDoS 방어를 활용할 수 있습니다. My Products → Domains → Nameservers에서 Cloudflare 네임서버를 입력합니다.',
      },
      {
        with_service_slug: 'netlify',
        tip: 'Add an A record for the apex domain (75.2.60.5) and a CNAME for www pointing to your Netlify site subdomain. Then verify the custom domain in Netlify site settings.',
        tip_ko: '루트 도메인 A 레코드(75.2.60.5)와 www CNAME을 Netlify 사이트 서브도메인으로 설정한 후 Netlify 사이트 설정에서 커스텀 도메인을 확인합니다.',
      },
    ],
    pros: [
      { text: 'World\'s largest domain registrar with widest TLD selection', text_ko: '세계 최대 레지스트라로 가장 넓은 TLD 선택지 제공' },
      { text: 'REST API with domain availability check, purchase, and DNS management', text_ko: '도메인 가용성 확인·구매·DNS 관리를 위한 REST API 제공' },
      { text: 'Promotional pricing for first year (.com from $0.01)', text_ko: '첫해 프로모션 가격(.com $0.01부터)' },
      { text: 'All-in-one service: hosting, email, SSL, website builder', text_ko: '올인원 서비스: 호스팅, 이메일, SSL, 웹사이트 빌더 포함' },
    ],
    cons: [
      { text: 'Renewal prices significantly higher than first-year rates ($18.99/year)', text_ko: '갱신 가격이 첫해 프로모션보다 크게 높음 (연간 $18.99)' },
      { text: 'WHOIS privacy is a paid add-on (~$10/year)', text_ko: 'WHOIS 프라이버시가 유료 추가 옵션 (~$10/년)' },
      { text: 'Aggressive upselling during checkout process', text_ko: '결제 과정에서 강압적인 추가 서비스 권유' },
    ],
    api_key_url: 'https://developer.godaddy.com/keys',
    api_key_url_label: 'GoDaddy Developer Keys',
  },

  // -------------------------------------------------------------------------
  // 4. Gabia (가비아)
  // -------------------------------------------------------------------------
  {
    service_id: S.gabia,
    quick_start: '가비아에서 .kr 또는 .com 도메인을 등록하고 DNS 설정에서 네임서버를 변경하거나 레코드를 추가하여 Vercel, Cloudflare 등 서비스와 연결할 수 있습니다.',
    quick_start_en: 'Register a .kr or .com domain on Gabia and change nameservers or add DNS records to connect with Vercel, Cloudflare, and other services.',
    setup_steps: [
      {
        step: 1,
        title: 'Search and register domain',
        title_ko: '도메인 검색 및 등록',
        description: 'Go to domain.gabia.com, search for your desired domain, and complete the registration. Gabia is the #1 domain registrar in Korea with extensive .kr TLD support.',
        description_ko: 'domain.gabia.com에서 원하는 도메인을 검색하고 등록을 완료합니다. 가비아는 한국 도메인(.kr) 등록 1위 업체입니다.',
        code_snippet: `# domain.gabia.com에서 도메인 검색 후 등록
# 등록 완료 후: my.gabia.com → 서비스 관리 → 도메인 관리`,
      },
      {
        step: 2,
        title: 'Access DNS management',
        title_ko: 'DNS 관리 접속',
        description: 'Log in to my.gabia.com, navigate to 서비스 관리 → 도메인 → DNS 레코드 설정 to manage DNS records.',
        description_ko: 'my.gabia.com에 로그인한 후 서비스 관리 → 도메인 → DNS 레코드 설정으로 이동하여 DNS 레코드를 관리합니다.',
        code_snippet: `# 가비아 DNS 레코드 설정 경로
# my.gabia.com 로그인 →
# 서비스 관리 → 도메인 → 해당 도메인 선택 →
# DNS 레코드 설정 → 레코드 추가`,
      },
      {
        step: 3,
        title: 'Change nameservers for external DNS',
        title_ko: '외부 DNS를 위한 네임서버 변경',
        description: 'To use Cloudflare or Vercel DNS, change nameservers in 서비스 관리 → 도메인 → 네임서버 설정.',
        description_ko: 'Cloudflare나 Vercel DNS를 사용하려면 서비스 관리 → 도메인 → 네임서버 설정에서 네임서버를 변경합니다.',
        code_snippet: `# 네임서버 변경 경로
# my.gabia.com → 서비스 관리 → 도메인 →
# 네임서버 설정 → 직접입력 선택 →
# 1차: ns1.cloudflare.com
# 2차: ns2.cloudflare.com
# (Cloudflare 대시보드에서 발급된 네임서버 사용)`,
      },
      {
        step: 4,
        title: 'Set DNS records for deployment',
        title_ko: '배포 서비스 연동을 위한 DNS 레코드 설정',
        description: 'Add A and CNAME records in Gabia\'s DNS record settings to point your domain to your deployment service.',
        description_ko: '가비아 DNS 레코드 설정에서 A 레코드와 CNAME 레코드를 추가하여 도메인을 배포 서비스로 연결합니다.',
        code_snippet: `# Vercel 연동 DNS 레코드 예시
# 타입: A,     호스트: @,   값: 76.76.21.21,          TTL: 3600
# 타입: CNAME, 호스트: www, 값: cname.vercel-dns.com,  TTL: 3600

# Railway 연동 DNS 레코드 예시
# 타입: CNAME, 호스트: @,   값: your-service.up.railway.app
# 타입: CNAME, 호스트: www, 값: your-service.up.railway.app`,
      },
    ],
    code_examples: {
      typescript: `// 가비아 도메인 - Vercel 연동 설정 참고 코드
// 가비아는 API를 통한 DNS 관리보다 대시보드 기반 설정이 일반적입니다.
// 아래는 DNS 설정 완료 후 Vercel API로 커스텀 도메인을 추가하는 예시입니다.

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID!;

// Vercel 프로젝트에 커스텀 도메인 추가
async function addCustomDomainToVercel(domain: string) {
  const res = await fetch(
    \`https://api.vercel.com/v10/projects/\${VERCEL_PROJECT_ID}/domains\`,
    {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${VERCEL_TOKEN}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(\`Vercel API error: \${JSON.stringify(error)}\`);
  }

  return res.json();
}

// 도메인 인증 상태 확인
async function checkDomainVerification(domain: string) {
  const res = await fetch(
    \`https://api.vercel.com/v10/projects/\${VERCEL_PROJECT_ID}/domains/\${domain}\`,
    {
      headers: { Authorization: \`Bearer \${VERCEL_TOKEN}\` },
    }
  );
  return res.json();
}

// 가비아 DNS 설정 후 Vercel 도메인 추가 실행
await addCustomDomainToVercel('mydomain.co.kr');
// 이후 가비아 DNS 설정:
// A 레코드: @ → 76.76.21.21
// CNAME: www → cname.vercel-dns.com`,
      shell: `# 가비아에서 구매한 .kr 도메인을 Cloudflare로 연동하는 단계별 과정

# 1. Cloudflare에 도메인 추가
#    dash.cloudflare.com → Add a Site → 도메인 입력

# 2. Cloudflare에서 네임서버 확인 (예시)
#    ns1: xxxxxxx.ns.cloudflare.com
#    ns2: yyyyyyy.ns.cloudflare.com

# 3. 가비아에서 네임서버 변경
#    my.gabia.com → 서비스 관리 → 도메인 → 네임서버 설정
#    1차 네임서버: xxxxxxx.ns.cloudflare.com
#    2차 네임서버: yyyyyyy.ns.cloudflare.com

# 4. 전파 확인 (최대 48시간 소요)
dig NS mydomain.co.kr @8.8.8.8`,
    },
    common_pitfalls: [
      {
        title: '.kr domain transfer restrictions',
        title_ko: '.kr 도메인 이전 제한',
        problem: '.kr domains registered at Gabia have specific transfer requirements and may require a 60-day lock-in period after registration.',
        solution: '.kr 도메인을 외부로 이전하려면 가비아 고객센터에 이전 신청을 해야 하며, 등록 후 60일 이후부터 가능합니다. 급하게 이전이 필요하다면 네임서버 변경으로 DNS만 이전하는 것을 고려하세요.',
      },
      {
        title: 'DNS propagation delay for Korean ISPs',
        title_ko: '국내 ISP DNS 전파 지연',
        problem: '가비아 DNS 변경 후 KT, SKT, LGU+ 등 국내 ISP에서 변경사항이 반영되는 데 시간이 걸릴 수 있습니다.',
        solution: 'TTL을 낮게 설정한 후 변경하고, nslookup이나 dig 명령으로 확인하세요. 국내 DNS 체크는 dnschecker.org에서 KR 서버를 선택하여 확인합니다.',
        code: `# DNS 전파 확인 명령어
nslookup mydomain.co.kr 8.8.8.8      # Google DNS
nslookup mydomain.co.kr 168.126.63.1 # KT DNS
dig @1.1.1.1 mydomain.co.kr A`,
      },
      {
        title: 'Automatic renewal enabled by default',
        title_ko: '자동 갱신 기본 활성화',
        problem: '가비아는 도메인 자동 갱신이 기본값으로 설정되어 있어 원하지 않는 갱신이 발생할 수 있습니다.',
        solution: '사용하지 않을 도메인은 my.gabia.com → 서비스 관리에서 자동 갱신을 수동으로 해제하세요.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'In Gabia DNS settings, add an A record for the apex domain (@ → 76.76.21.21) and a CNAME for www (→ cname.vercel-dns.com). Then add the domain in Vercel project settings and wait for DNS propagation.',
        tip_ko: '가비아 DNS 설정에서 루트 도메인 A 레코드(@ → 76.76.21.21)와 www CNAME(→ cname.vercel-dns.com)을 추가합니다. 이후 Vercel 프로젝트 설정에서 도메인을 추가하고 DNS 전파를 기다립니다.',
        code: `# 가비아 DNS 레코드 설정 (Vercel 연동)
# 타입  | 호스트 | 값                       | TTL
# A     | @      | 76.76.21.21              | 3600
# CNAME | www    | cname.vercel-dns.com     | 3600`,
      },
      {
        with_service_slug: 'cloudflare',
        tip: 'Change nameservers in Gabia to Cloudflare\'s assigned nameservers. Gabia nameserver change is available in 서비스 관리 → 도메인 → 네임서버 설정. After change, manage all DNS from Cloudflare dashboard.',
        tip_ko: '가비아 서비스 관리 → 도메인 → 네임서버 설정에서 Cloudflare에서 발급한 네임서버로 변경합니다. 변경 후에는 모든 DNS를 Cloudflare 대시보드에서 관리합니다.',
      },
      {
        with_service_slug: 'netlify',
        tip: 'Set Gabia DNS A record for apex domain to 75.2.60.5 and CNAME for www to your-site.netlify.app. Add and verify the custom domain in Netlify site configuration.',
        tip_ko: '가비아 DNS에서 루트 도메인 A 레코드를 75.2.60.5로, www CNAME을 your-site.netlify.app으로 설정합니다. Netlify 사이트 설정에서 커스텀 도메인을 추가하고 확인합니다.',
      },
    ],
    pros: [
      { text: 'Leading Korean domain registrar with best .kr TLD support', text_ko: '한국 1위 도메인 등록업체로 .kr TLD 지원 최우수' },
      { text: 'Korean customer support and Korean-language dashboard', text_ko: '한국어 고객 지원 및 한국어 대시보드' },
      { text: 'Competitive pricing for Korean domains (.kr ~12,000원/년)', text_ko: '한국 도메인 경쟁력 있는 가격 (.kr 약 12,000원/년)' },
      { text: 'Integrated hosting, SSL, and email services in Korean', text_ko: '호스팅, SSL, 이메일 통합 서비스 제공 (한국어)' },
    ],
    cons: [
      { text: 'Limited or no public REST API for automated DNS management', text_ko: '자동화된 DNS 관리를 위한 공개 REST API 미비' },
      { text: 'International domain prices slightly higher than global registrars', text_ko: '국제 도메인 가격이 글로벌 레지스트라 대비 다소 높음' },
      { text: 'Dashboard UI is less developer-friendly compared to Cloudflare', text_ko: '대시보드 UI가 Cloudflare 대비 개발자 친화적이지 않음' },
    ],
    api_key_url: 'https://my.gabia.com',
    api_key_url_label: '가비아 My 서비스',
  },

  // -------------------------------------------------------------------------
  // 5. HostingKR
  // -------------------------------------------------------------------------
  {
    service_id: S.hosting_kr,
    quick_start: 'HostingKR에서 도메인을 등록하고 DNS 레코드를 설정하거나 네임서버를 변경하여 Vercel, Cloudflare 등 서비스와 연결할 수 있습니다. 500개 이상의 도메인 확장자를 지원합니다.',
    quick_start_en: 'Register a domain on HostingKR and configure DNS records or change nameservers to connect with Vercel, Cloudflare, and other services. Supports 500+ domain extensions.',
    setup_steps: [
      {
        step: 1,
        title: 'Register a domain',
        title_ko: '도메인 등록',
        description: 'Go to hosting.kr, search for your domain, and complete registration. HostingKR supports 500+ TLDs including .kr and popular international domains.',
        description_ko: 'hosting.kr에서 원하는 도메인을 검색하고 등록합니다. HostingKR은 .kr을 포함한 500개 이상의 TLD를 지원합니다.',
        code_snippet: `# hosting.kr에서 도메인 검색 및 등록
# 등록 완료 후: hosting.kr 로그인 →
# My Service → Domain에서 도메인 확인`,
      },
      {
        step: 2,
        title: 'Change nameservers',
        title_ko: '네임서버 변경',
        description: 'Log in to hosting.kr, navigate to My Service → Domain, and change nameservers to use an external DNS provider like Cloudflare.',
        description_ko: 'hosting.kr에 로그인하고 My Service → Domain으로 이동하여 Cloudflare 등 외부 DNS 공급자의 네임서버로 변경합니다.',
        code_snippet: `# HostingKR 네임서버 변경 경로
# hosting.kr 로그인 → My Service → Domain →
# 해당 도메인 선택 → 네임서버 변경 →
# 사용자 지정 네임서버 입력:
# 1차: xxxxxxx.ns.cloudflare.com
# 2차: yyyyyyy.ns.cloudflare.com`,
      },
      {
        step: 3,
        title: 'Set up DNS records',
        title_ko: 'DNS 레코드 설정',
        description: 'If using HostingKR Cloud Name Server, go to DNS Records settings to add A, CNAME, MX, or TXT records.',
        description_ko: 'HostingKR 클라우드 네임서버를 사용하는 경우 DNS 레코드 설정에서 A, CNAME, MX, TXT 레코드를 추가합니다.',
        code_snippet: `# HostingKR Cloud Name Server 사용 시 DNS 레코드 설정
# My Service → Domain → DNS 레코드 설정 →
# 레코드 추가:
# 타입: A,     이름: @,   내용: 76.76.21.21          (Vercel)
# 타입: CNAME, 이름: www, 내용: cname.vercel-dns.com  (Vercel)`,
      },
    ],
    code_examples: {
      typescript: `// HostingKR 도메인 - Vercel 커스텀 도메인 연동 예시
// HostingKR은 대시보드 기반 DNS 관리를 사용합니다.
// 아래는 HostingKR에서 DNS 설정 완료 후 Vercel에 도메인을 등록하는 예시입니다.

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // 팀 프로젝트의 경우

interface VercelDomainResponse {
  name: string;
  verified: boolean;
  verification?: Array<{ type: string; domain: string; value: string; reason: string }>;
}

// Vercel에 커스텀 도메인 추가
async function addDomainToVercel(
  projectId: string,
  domain: string
): Promise<VercelDomainResponse> {
  const url = new URL(\`https://api.vercel.com/v10/projects/\${projectId}/domains\`);
  if (VERCEL_TEAM_ID) url.searchParams.set('teamId', VERCEL_TEAM_ID);

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: \`Bearer \${VERCEL_TOKEN}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: domain }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(\`Vercel domain error: \${JSON.stringify(err)}\`);
  }

  return res.json() as Promise<VercelDomainResponse>;
}

// DNS TXT 레코드 검증 (도메인 소유권 확인)
async function verifyDomain(projectId: string, domain: string) {
  const url = \`https://api.vercel.com/v10/projects/\${projectId}/domains/\${domain}/verify\`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: \`Bearer \${VERCEL_TOKEN}\` },
  });
  return res.json();
}`,
      shell: `# HostingKR에서 구매한 도메인 → Cloudflare 연동 단계별 가이드

# Step 1. Cloudflare에 사이트 추가
#   https://dash.cloudflare.com → Add a Site

# Step 2. Cloudflare 네임서버 확인
#   예: iris.ns.cloudflare.com, kirk.ns.cloudflare.com

# Step 3. HostingKR에서 네임서버 변경
#   My Service → Domain → 네임서버 변경 → 사용자 지정
#   1차: iris.ns.cloudflare.com
#   2차: kirk.ns.cloudflare.com

# Step 4. DNS 전파 확인 (최대 48시간)
dig NS mydomain.kr @8.8.8.8

# Step 5. Cloudflare에서 DNS 레코드 추가
#   dash.cloudflare.com → 도메인 선택 → DNS → 레코드 추가`,
    },
    common_pitfalls: [
      {
        title: 'DNS records can only be set via HostingKR nameservers',
        title_ko: 'DNS 레코드는 HostingKR 네임서버 사용 시에만 설정 가능',
        problem: 'If you are using a third-party nameserver, DNS record settings must be done on that provider, not in the HostingKR dashboard.',
        solution: 'Decide upfront: use HostingKR Cloud Name Server for DNS management within HostingKR, or change to Cloudflare/Vercel nameservers and manage DNS there. Do not mix.',
      },
      {
        title: 'Nameserver change propagation time',
        title_ko: '네임서버 변경 전파 시간',
        problem: 'After changing nameservers in HostingKR, it can take up to 48 hours for the changes to propagate globally.',
        solution: '네임서버 변경 후 즉시 dig나 nslookup으로 주기적으로 확인하세요. 전파 전까지는 기존 서비스가 정상 동작해야 합니다.',
        code: `# 네임서버 전파 확인
nslookup -type=NS mydomain.kr 8.8.8.8
dig NS mydomain.kr @1.1.1.1`,
      },
      {
        title: '.kr domain registration requires Korean ID verification',
        title_ko: '.kr 도메인 등록 시 한국 신원 확인 필요',
        problem: '.kr 도메인 등록 시 한국 주민등록번호 또는 사업자등록번호 인증이 필요할 수 있습니다.',
        solution: '개인은 주민등록번호, 법인은 사업자등록번호로 인증합니다. 외국인의 경우 외국인등록증 번호를 사용합니다.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'cloudflare',
        tip: 'Change HostingKR nameservers to Cloudflare\'s nameservers (found in Cloudflare dashboard after adding your site). This delegates all DNS management to Cloudflare and enables CDN, SSL, and DDoS protection.',
        tip_ko: 'HostingKR 네임서버를 Cloudflare 네임서버로 변경하면(Cloudflare 대시보드에서 사이트 추가 후 확인) 모든 DNS 관리가 Cloudflare로 위임되고 CDN, SSL, DDoS 방어가 자동 활성화됩니다.',
        code: `# HostingKR 네임서버 변경 → Cloudflare
# My Service → Domain → 해당 도메인 → 네임서버 변경
# Cloudflare 대시보드에서 확인한 네임서버 2개 입력
# 전파 후 Cloudflare에서 DNS 레코드 관리`,
      },
      {
        with_service_slug: 'vercel',
        tip: 'In HostingKR Cloud Name Server settings, add an A record (@ → 76.76.21.21) for the apex domain and CNAME (www → cname.vercel-dns.com). Add the domain in Vercel project settings to complete the connection.',
        tip_ko: 'HostingKR 클라우드 네임서버 설정에서 루트 도메인 A 레코드(@ → 76.76.21.21)와 CNAME(www → cname.vercel-dns.com)을 추가합니다. Vercel 프로젝트 설정에서 도메인을 추가하면 연결이 완료됩니다.',
      },
    ],
    pros: [
      { text: 'Supports 500+ domain extensions including all major Korean TLDs', text_ko: '모든 주요 한국 TLD를 포함한 500개 이상 도메인 확장자 지원' },
      { text: 'Korean language support and local customer service', text_ko: '한국어 지원 및 한국 현지 고객 서비스' },
      { text: 'Integrated cloud name server with DNS record management', text_ko: '클라우드 네임서버 통합 및 DNS 레코드 관리 기능' },
      { text: 'Bundled hosting and email services for Korean market', text_ko: '한국 시장을 위한 호스팅 및 이메일 서비스 번들' },
    ],
    cons: [
      { text: 'No public REST API for programmatic domain or DNS management', text_ko: '프로그래밍 방식의 도메인/DNS 관리를 위한 공개 REST API 없음' },
      { text: 'Less known internationally compared to Namecheap or GoDaddy', text_ko: 'Namecheap이나 GoDaddy에 비해 국제적 인지도 낮음' },
      { text: 'Dashboard primarily in Korean, limited English interface', text_ko: '대시보드가 주로 한국어 — 영어 인터페이스 제한적' },
    ],
    api_key_url: 'https://www.hosting.kr/member/login.php',
    api_key_url_label: 'HostingKR 로그인',
  },

  // -------------------------------------------------------------------------
  // 6. DotName (닷네임)
  // -------------------------------------------------------------------------
  {
    service_id: S.dotname,
    quick_start: '닷네임에서 .kr 및 국제 도메인을 등록하고 DNS 설정을 통해 배포 서비스와 연결할 수 있습니다. 도메인 등록 시 무료 웹호스팅이 제공됩니다.',
    quick_start_en: 'Register .kr and international domains on DotName and connect with deployment services via DNS settings. Free web hosting is included with domain registration.',
    setup_steps: [
      {
        step: 1,
        title: 'Register a domain',
        title_ko: '도메인 등록',
        description: 'Go to dotname.co.kr, search for your domain, and complete registration. .kr domains come with free basic web hosting.',
        description_ko: 'dotname.co.kr에서 원하는 도메인을 검색하고 등록을 완료합니다. .kr 도메인에는 무료 기본 웹호스팅이 포함됩니다.',
        code_snippet: `# dotname.co.kr에서 도메인 검색 및 등록
# 등록 완료 후: 닷네임 회원 로그인 →
# 나의 서비스 → 도메인 관리`,
      },
      {
        step: 2,
        title: 'Access DNS management panel',
        title_ko: 'DNS 관리 패널 접속',
        description: 'Log in to dotname.co.kr and navigate to 나의 서비스 → 도메인 관리 → DNS 설정 to manage DNS records.',
        description_ko: 'dotname.co.kr에 로그인하고 나의 서비스 → 도메인 관리 → DNS 설정으로 이동하여 DNS 레코드를 관리합니다.',
        code_snippet: `# 닷네임 DNS 설정 경로
# dotname.co.kr 로그인 →
# 나의 서비스 → 도메인 관리 →
# 해당 도메인 선택 → DNS 설정`,
      },
      {
        step: 3,
        title: 'Change nameservers for external DNS',
        title_ko: '외부 DNS를 위한 네임서버 변경',
        description: 'In DotName domain management, navigate to 네임서버 변경 and enter Cloudflare or Vercel nameservers.',
        description_ko: '닷네임 도메인 관리에서 네임서버 변경으로 이동하여 Cloudflare 또는 Vercel 네임서버를 입력합니다.',
        code_snippet: `# 닷네임 네임서버 변경 (Cloudflare로 위임)
# 나의 서비스 → 도메인 관리 → 네임서버 변경
# 네임서버 1: iris.ns.cloudflare.com
# 네임서버 2: kirk.ns.cloudflare.com
# (Cloudflare 대시보드에서 발급된 실제 네임서버 입력)`,
      },
      {
        step: 4,
        title: 'Add DNS records for deployment',
        title_ko: '배포 서비스를 위한 DNS 레코드 추가',
        description: 'Add A and CNAME records in DotName DNS settings to connect your domain with Vercel, Netlify, or Railway.',
        description_ko: '닷네임 DNS 설정에서 A 레코드와 CNAME 레코드를 추가하여 도메인을 Vercel, Netlify, Railway와 연결합니다.',
        code_snippet: `# Vercel 연동 DNS 레코드
# 타입: A,     이름: @,   값: 76.76.21.21,          TTL: 3600
# 타입: CNAME, 이름: www, 값: cname.vercel-dns.com,  TTL: 3600

# Railway 연동 DNS 레코드
# 타입: CNAME, 이름: @,   값: your-app.up.railway.app
# 타입: CNAME, 이름: www, 값: your-app.up.railway.app`,
      },
    ],
    code_examples: {
      typescript: `// 닷네임 도메인 - Cloudflare API로 DNS 관리 (네임서버 위임 후)
// 닷네임에서 Cloudflare로 네임서버를 위임한 후
// Cloudflare API로 DNS 레코드를 프로그래밍 방식으로 관리합니다.

import Cloudflare from 'cloudflare';

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
});

const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID!; // 닷네임 도메인의 Cloudflare Zone ID

// DNS 레코드 목록 조회
async function getDnsRecords() {
  const records = [];
  for await (const record of client.dns.records.list({ zone_id: ZONE_ID })) {
    records.push(record);
  }
  return records;
}

// A 레코드 추가 (Vercel 배포용)
async function addVercelDnsRecords() {
  // 루트 도메인
  await client.dns.records.create({
    zone_id: ZONE_ID,
    type: 'A',
    name: '@',
    content: '76.76.21.21',
    ttl: 3600,
    proxied: false, // Vercel SSL 사용 시 반드시 false
  });

  // www 서브도메인
  await client.dns.records.create({
    zone_id: ZONE_ID,
    type: 'CNAME',
    name: 'www',
    content: 'cname.vercel-dns.com',
    ttl: 3600,
    proxied: false,
  });

  console.log('DNS records created for Vercel deployment');
}

// TXT 레코드 추가 (도메인 소유권 확인)
async function addTxtRecord(name: string, content: string) {
  await client.dns.records.create({
    zone_id: ZONE_ID,
    type: 'TXT',
    name,
    content,
    ttl: 300,
  });
}

await addVercelDnsRecords();`,
      shell: `# 닷네임 도메인 → Vercel 배포 전체 연동 가이드

# 1. 닷네임에서 도메인 등록
#    dotname.co.kr → 도메인 검색 → 등록

# 2. Vercel에 프로젝트 배포
#    vercel.com → 새 프로젝트 생성 및 배포

# 3. Vercel 프로젝트 설정에서 커스텀 도메인 추가
#    Settings → Domains → Add domain: mydomain.co.kr

# 4. Vercel이 제공하는 DNS 레코드를 닷네임에 추가
#    나의 서비스 → 도메인 관리 → DNS 설정:
#    A     @    76.76.21.21
#    CNAME www  cname.vercel-dns.com

# 5. DNS 전파 후 Vercel에서 자동 SSL 발급 확인
#    일반적으로 5~30분 내 완료

# DNS 전파 확인
dig A mydomain.co.kr @8.8.8.8
curl -I https://mydomain.co.kr`,
    },
    common_pitfalls: [
      {
        title: 'Free hosting may interfere with custom DNS settings',
        title_ko: '무료 호스팅이 커스텀 DNS 설정을 방해할 수 있음',
        problem: 'The included free web hosting may have default DNS records that conflict with your deployment service settings.',
        solution: '닷네임 DNS 설정에서 기존 A 레코드를 삭제하거나 덮어쓰기 전에 현재 레코드를 확인하세요. Cloudflare로 네임서버를 위임하면 닷네임의 기본 DNS 설정과 충돌하지 않습니다.',
        code: `# 기존 DNS 레코드 확인 후 충돌 여부 점검
dig A mydomain.co.kr
dig CNAME www.mydomain.co.kr
# 기존 레코드를 확인하고 Vercel/Netlify 레코드로 교체`,
      },
      {
        title: '.kr domain propagation can be slower',
        title_ko: '.kr 도메인 전파가 더 느릴 수 있음',
        problem: '.kr 도메인의 DNS 변경은 한국 NIC 인프라 특성상 일부 경우 전파가 더 오래 걸릴 수 있습니다.',
        solution: 'DNS 변경 후 최소 24시간을 기다리고, 국내외 여러 DNS 서버에서 전파 상태를 확인하세요.',
        code: `# 국내외 DNS 전파 확인
dig NS mydomain.co.kr @8.8.8.8        # Google (해외)
dig NS mydomain.co.kr @168.126.63.1   # KT (국내)
dig A  mydomain.co.kr @1.1.1.1        # Cloudflare DNS`,
      },
      {
        title: 'Limited documentation for developers',
        title_ko: '개발자를 위한 문서 부족',
        problem: '닷네임은 일반 사용자 중심의 서비스로, 개발자를 위한 API 문서나 자동화 가이드가 제한적입니다.',
        solution: '네임서버를 Cloudflare로 위임하면 Cloudflare의 풍부한 API와 문서를 활용하여 DNS를 프로그래밍 방식으로 관리할 수 있습니다.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Add A record (@ → 76.76.21.21) and CNAME (www → cname.vercel-dns.com) in DotName DNS settings. Then add the .co.kr domain in Vercel project settings. Vercel will automatically provision an SSL certificate.',
        tip_ko: '닷네임 DNS 설정에서 A 레코드(@ → 76.76.21.21)와 CNAME(www → cname.vercel-dns.com)을 추가합니다. Vercel 프로젝트 설정에서 .co.kr 도메인을 추가하면 SSL 인증서가 자동 발급됩니다.',
        code: `# 닷네임 DNS 레코드 설정 (Vercel 연동)
# 타입  | 이름 | 값                       | TTL
# A     | @    | 76.76.21.21              | 3600
# CNAME | www  | cname.vercel-dns.com     | 3600`,
      },
      {
        with_service_slug: 'cloudflare',
        tip: 'Delegate DNS management to Cloudflare by changing nameservers in DotName. After delegation, use Cloudflare\'s dashboard or API for all DNS management. This provides CDN, DDoS protection, and SSL at no extra cost.',
        tip_ko: '닷네임에서 네임서버를 Cloudflare로 변경하여 DNS 관리를 위임합니다. 위임 후 Cloudflare 대시보드나 API로 모든 DNS를 관리할 수 있으며, CDN, DDoS 방어, SSL이 무료로 제공됩니다.',
      },
      {
        with_service_slug: 'netlify',
        tip: 'Point your DotName domain to Netlify by adding an A record for the apex domain (75.2.60.5) and CNAME for www. Then add and verify the domain in Netlify site settings.',
        tip_ko: '닷네임 도메인을 Netlify로 연결하려면 루트 도메인 A 레코드(75.2.60.5)와 www CNAME을 설정합니다. Netlify 사이트 설정에서 도메인을 추가하고 확인하면 SSL이 자동 발급됩니다.',
      },
    ],
    pros: [
      { text: 'Free basic web hosting included with domain registration', text_ko: '도메인 등록 시 무료 기본 웹호스팅 포함' },
      { text: 'Affordable .kr domain prices and Korean TLD expertise', text_ko: '합리적인 .kr 도메인 가격 및 한국 TLD 전문성' },
      { text: 'Simple, easy-to-use dashboard for non-technical users', text_ko: '비기술 사용자를 위한 간단하고 쉬운 대시보드' },
      { text: 'Korean language support and local payment options', text_ko: '한국어 지원 및 국내 결제 수단 지원' },
    ],
    cons: [
      { text: 'No public API for programmatic domain or DNS management', text_ko: '프로그래밍 방식의 도메인/DNS 관리를 위한 공개 API 없음' },
      { text: 'Smaller service with less international TLD variety', text_ko: '소규모 서비스로 국제 TLD 다양성이 낮음' },
      { text: 'Limited developer tools and documentation compared to global registrars', text_ko: '글로벌 레지스트라 대비 개발자 도구 및 문서 부족' },
    ],
    api_key_url: 'https://www.dotname.co.kr/member/login',
    api_key_url_label: '닷네임 로그인',
  },
];
