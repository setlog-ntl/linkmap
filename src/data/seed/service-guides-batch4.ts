import type { ServiceGuideSeed } from './service-guides';

// Service ID constants for Batch 4
const S = {
  sendgrid:      '10000000-0000-4000-a000-000000000009',
  aws_ses:       '10000000-0000-4000-a000-000000000075',
  mailchimp:     '10000000-0000-4000-a000-000000000076',
  twilio:        '10000000-0000-4000-a000-000000000022',
  onesignal:     '10000000-0000-4000-a000-000000000023',
  pusher:        '10000000-0000-4000-a000-000000000034',
  toss_payments: '10000000-0000-4000-a000-000000000073',
  paypal:        '10000000-0000-4000-a000-000000000074',
  lemonsqueezy:  '10000000-0000-4000-a000-000000000017',
  ga4:           '10000000-0000-4000-a000-000000000026',
  mixpanel:      '10000000-0000-4000-a000-000000000031',
  plausible:     '10000000-0000-4000-a000-000000000047',
  logrocket:     '10000000-0000-4000-a000-000000000039',
  slack_api:     '10000000-0000-4000-a000-000000000041',
  discord_api:   '10000000-0000-4000-a000-000000000042',
};

export const serviceGuidesBatch4: ServiceGuideSeed[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. SendGrid
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.sendgrid,
    quick_start: 'SendGrid API 키를 발급받고 @sendgrid/mail 패키지로 트랜잭셔널 이메일을 5분 내에 발송할 수 있습니다.',
    quick_start_en: 'Get a SendGrid API key and send transactional emails in under 5 minutes using the @sendgrid/mail package.',
    setup_steps: [
      {
        step: 1,
        title: 'Install SendGrid Mail SDK',
        title_ko: 'SendGrid Mail SDK 설치',
        description: 'Install the official @sendgrid/mail npm package',
        description_ko: '공식 @sendgrid/mail npm 패키지 설치',
        code_snippet: 'npm install @sendgrid/mail',
      },
      {
        step: 2,
        title: 'Set API key environment variable',
        title_ko: 'API 키 환경변수 설정',
        description: 'Add your SendGrid API key to .env (never expose with NEXT_PUBLIC_ prefix)',
        description_ko: '.env에 API 키 추가 (NEXT_PUBLIC_ 접두사 절대 금지)',
        code_snippet: 'SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      },
      {
        step: 3,
        title: 'Send your first email',
        title_ko: '첫 번째 이메일 발송',
        description: 'Initialize the client and send an email from a verified sender address',
        description_ko: 'verified sender 주소에서 이메일 발송',
        code_snippet: `import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

await sgMail.send({
  to: 'user@example.com',
  from: 'noreply@yourdomain.com', // verified sender
  subject: 'Hello from SendGrid',
  text: 'Hello, World!',
  html: '<strong>Hello, World!</strong>',
})`,
      },
    ],
    code_examples: {
      typescript: `import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

// Single email
await sgMail.send({
  to: 'user@example.com',
  from: 'noreply@yourdomain.com',
  subject: 'Welcome!',
  templateId: 'd-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Dynamic Template
  dynamicTemplateData: {
    first_name: 'John',
    confirmation_link: 'https://example.com/confirm?token=abc123',
  },
})

// Multiple recipients (personalizations)
await sgMail.sendMultiple({
  to: ['alice@example.com', 'bob@example.com'],
  from: 'noreply@yourdomain.com',
  subject: 'Bulk announcement',
  text: 'This is an announcement.',
})`,
    },
    common_pitfalls: [
      {
        title: 'Sender not verified',
        title_ko: '발신자 미인증',
        problem: 'Emails fail with 403 "The from address does not match a verified Sender Identity"',
        solution: 'Complete Domain Authentication or Single Sender Verification in the SendGrid dashboard before sending',
      },
      {
        title: 'API key stored insecurely',
        title_ko: 'API 키 보안 취약',
        problem: 'API key hardcoded in source or exposed via NEXT_PUBLIC_ prefix',
        solution: 'Store as server-only env var SENDGRID_API_KEY and only call from API routes or server actions',
        code: `// ❌ 절대 금지
const key = process.env.NEXT_PUBLIC_SENDGRID_API_KEY

// ✅ 올바른 방법 (서버 전용)
// src/app/api/send-email/route.ts
export async function POST(req: Request) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
  await sgMail.send({ ... })
}`,
      },
      {
        title: 'Dynamic template data mismatch',
        title_ko: '동적 템플릿 데이터 불일치',
        problem: 'Template renders empty values when dynamicTemplateData keys do not match Handlebars variables in the template',
        solution: 'Verify template variable names in the SendGrid Email Designer exactly match the keys passed in dynamicTemplateData',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Trigger SendGrid transactional emails from Supabase Edge Functions or Database Webhooks on user sign-up or order events',
        tip_ko: 'Supabase Edge Functions 또는 Database Webhooks에서 회원가입·주문 이벤트 시 SendGrid 이메일 트리거',
        code: `// supabase/functions/send-welcome/index.ts
import sgMail from 'npm:@sendgrid/mail'
sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY')!)

Deno.serve(async (req) => {
  const { email, name } = await req.json()
  await sgMail.send({
    to: email, from: 'noreply@yourdomain.com',
    templateId: 'd-welcometemplateid',
    dynamicTemplateData: { name },
  })
  return new Response('OK')
})`,
      },
      {
        with_service_slug: 'stripe',
        tip: 'Send payment receipts and invoice emails via SendGrid when Stripe webhook events fire (payment_intent.succeeded, invoice.paid)',
        tip_ko: 'Stripe 웹훅(payment_intent.succeeded)에서 SendGrid로 영수증 및 인보이스 이메일 자동 발송',
      },
    ],
    pros: [
      { text: 'Generous free tier (100 emails/day)', text_ko: '넉넉한 무료 플랜 (일 100건)' },
      { text: 'Dynamic Templates with visual editor', text_ko: '비주얼 에디터 기반 동적 템플릿' },
      { text: 'Detailed delivery analytics and open/click tracking', text_ko: '상세한 전송 분석 및 오픈·클릭 추적' },
    ],
    cons: [
      { text: 'Domain Authentication setup can be complex for beginners', text_ko: '도메인 인증 초기 설정이 초보자에게 복잡' },
      { text: 'Free tier limited to 100 emails/day after trial', text_ko: '체험 종료 후 무료 플랜 일 100건 제한' },
    ],
    api_key_url: 'https://app.sendgrid.com/settings/api_keys',
    api_key_url_label: 'SendGrid API Keys',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. AWS SES
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.aws_ses,
    quick_start: 'AWS SDK v3 @aws-sdk/client-ses 패키지로 대용량 트랜잭셔널·마케팅 이메일을 저렴하게 발송할 수 있습니다.',
    quick_start_en: 'Send high-volume transactional and marketing emails cost-effectively using AWS SDK v3 @aws-sdk/client-ses.',
    setup_steps: [
      {
        step: 1,
        title: 'Install AWS SES SDK',
        title_ko: 'AWS SES SDK 설치',
        description: 'Install the AWS SDK v3 SES client package',
        description_ko: 'AWS SDK v3 SES 클라이언트 패키지 설치',
        code_snippet: 'npm install @aws-sdk/client-ses',
      },
      {
        step: 2,
        title: 'Configure credentials',
        title_ko: '자격증명 설정',
        description: 'Set AWS credentials as environment variables (never hardcode)',
        description_ko: 'AWS 자격증명을 환경변수로 설정 (하드코딩 금지)',
        code_snippet: `AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1`,
      },
      {
        step: 3,
        title: 'Send email with SES',
        title_ko: 'SES로 이메일 발송',
        description: 'Create an SES client and send an email using SendEmailCommand',
        description_ko: 'SES 클라이언트 생성 후 SendEmailCommand로 이메일 발송',
        code_snippet: `import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({ region: process.env.AWS_REGION })

await ses.send(new SendEmailCommand({
  Source: 'noreply@yourdomain.com',
  Destination: { ToAddresses: ['user@example.com'] },
  Message: {
    Subject: { Data: 'Hello from AWS SES' },
    Body: { Text: { Data: 'Hello, World!' } },
  },
}))`,
      },
    ],
    code_examples: {
      typescript: `import { SESClient, SendEmailCommand, SendTemplatedEmailCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({ region: process.env.AWS_REGION ?? 'us-east-1' })

// Send plain email
async function sendEmail(to: string, subject: string, body: string) {
  const command = new SendEmailCommand({
    Source: 'noreply@yourdomain.com',
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: {
        Html: { Data: body, Charset: 'UTF-8' },
      },
    },
  })
  return ses.send(command)
}

// Send with SES template
async function sendTemplated(to: string, templateName: string, data: Record<string, string>) {
  const command = new SendTemplatedEmailCommand({
    Source: 'noreply@yourdomain.com',
    Destination: { ToAddresses: [to] },
    Template: templateName,
    TemplateData: JSON.stringify(data),
  })
  return ses.send(command)
}`,
    },
    common_pitfalls: [
      {
        title: 'Sending from unverified identity in sandbox',
        title_ko: '샌드박스에서 미인증 도메인 발송',
        problem: 'SES sandbox mode only allows sending to and from verified identities',
        solution: 'Verify your sending domain/email in SES console, and request production access to remove sandbox restrictions',
      },
      {
        title: 'IAM permissions too broad',
        title_ko: 'IAM 권한 과도 부여',
        problem: 'Using root credentials or overly broad IAM roles for SES',
        solution: 'Create a dedicated IAM user with ses:SendEmail and ses:SendRawEmail permissions only',
        code: `// IAM Policy (최소 권한 원칙)
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["ses:SendEmail", "ses:SendRawEmail"],
    "Resource": "arn:aws:ses:us-east-1:123456789012:identity/yourdomain.com"
  }]
}`,
      },
      {
        title: 'Bounce and complaint handling missing',
        title_ko: '반송·불만 처리 누락',
        problem: 'High bounce/complaint rates cause SES account suspension',
        solution: 'Set up SNS topics for SES bounce and complaint notifications, and implement suppression list management',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Configure Supabase Auth to use AWS SES as the SMTP provider for custom email templates at scale',
        tip_ko: 'Supabase Auth의 SMTP를 AWS SES로 설정하여 대규모 커스텀 이메일 발송',
      },
      {
        with_service_slug: 'aws-s3',
        tip: 'Store email attachments in S3 and reference them in SES raw email sends for large file delivery',
        tip_ko: 'S3에 첨부파일 저장 후 SES raw email로 대용량 파일 전송',
      },
    ],
    pros: [
      { text: 'Extremely low cost ($0.10 per 1,000 emails)', text_ko: '매우 저렴한 비용 (1,000건당 $0.10)' },
      { text: 'High deliverability with dedicated IPs option', text_ko: '전용 IP 옵션으로 높은 전송률' },
      { text: 'Native integration with other AWS services (SNS, Lambda, S3)', text_ko: '다른 AWS 서비스와 네이티브 통합' },
    ],
    cons: [
      { text: 'Sandbox mode requires manual production access request', text_ko: '샌드박스 모드 해제 위해 수동 신청 필요' },
      { text: 'More configuration overhead compared to managed services', text_ko: '관리형 서비스보다 초기 설정 부담 큼' },
    ],
    api_key_url: 'https://us-east-1.console.aws.amazon.com/ses/home',
    api_key_url_label: 'AWS SES Console',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Mailchimp
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.mailchimp,
    quick_start: 'Mailchimp Marketing API로 구독자 관리, 이메일 캠페인 생성·발송을 자동화할 수 있습니다.',
    quick_start_en: 'Automate subscriber management and email campaign creation and sending with the Mailchimp Marketing API.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Mailchimp Marketing SDK',
        title_ko: 'Mailchimp Marketing SDK 설치',
        description: 'Install the official Mailchimp Marketing Node.js client',
        description_ko: '공식 Mailchimp Marketing Node.js 클라이언트 설치',
        code_snippet: 'npm install @mailchimp/mailchimp_marketing',
      },
      {
        step: 2,
        title: 'Configure API key and server prefix',
        title_ko: 'API 키 및 서버 접두사 설정',
        description: 'Get your API key and server prefix (e.g. us19) from Mailchimp account settings',
        description_ko: 'Mailchimp 계정 설정에서 API 키와 서버 접두사(예: us19) 확인',
        code_snippet: `import Mailchimp from '@mailchimp/mailchimp_marketing'

Mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!, // e.g. 'us19'
})`,
      },
      {
        step: 3,
        title: 'Add subscriber to a list',
        title_ko: '리스트에 구독자 추가',
        description: 'Add a new subscriber to an audience list using the lists API',
        description_ko: 'lists API로 오디언스 리스트에 신규 구독자 추가',
        code_snippet: `await Mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID!, {
  email_address: 'user@example.com',
  status: 'subscribed',
  merge_fields: { FNAME: 'John', LNAME: 'Doe' },
})`,
      },
    ],
    code_examples: {
      typescript: `import Mailchimp from '@mailchimp/mailchimp_marketing'

Mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!,
})

// Add subscriber
async function subscribeUser(email: string, firstName: string) {
  return Mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID!, {
    email_address: email,
    status: 'subscribed',
    merge_fields: { FNAME: firstName },
  })
}

// Update subscriber status (unsubscribe)
async function unsubscribeUser(email: string) {
  const subscriberHash = require('crypto')
    .createHash('md5')
    .update(email.toLowerCase())
    .digest('hex')
  return Mailchimp.lists.updateListMember(
    process.env.MAILCHIMP_LIST_ID!,
    subscriberHash,
    { status: 'unsubscribed' }
  )
}

// Create and send a campaign
async function sendCampaign(subject: string, htmlContent: string) {
  const campaign = await Mailchimp.campaigns.create({
    type: 'regular',
    recipients: { list_id: process.env.MAILCHIMP_LIST_ID! },
    settings: {
      subject_line: subject,
      from_name: 'My App',
      reply_to: 'hello@yourdomain.com',
    },
  })
  await Mailchimp.campaigns.setContent(campaign.id!, { html: htmlContent })
  await Mailchimp.campaigns.send(campaign.id!)
}`,
    },
    common_pitfalls: [
      {
        title: 'Wrong server prefix',
        title_ko: '잘못된 서버 접두사',
        problem: 'API calls fail with "API key is not valid for this data center" error',
        solution: 'Find your server prefix at the end of your API key (e.g. key-us19 → server: "us19") or check in Account Settings > API Keys',
      },
      {
        title: 'Adding already-subscribed member',
        title_ko: '이미 구독 중인 멤버 재추가',
        problem: 'addListMember throws 400 error when email is already subscribed',
        solution: 'Use lists.setListMember (upsert) instead to handle both new and existing subscribers gracefully',
        code: `// addListMember 대신 setListMember 사용 (upsert)
await Mailchimp.lists.setListMember(listId, subscriberHash, {
  email_address: email,
  status_if_new: 'subscribed',
})`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'stripe',
        tip: 'Automatically add paying customers to a Mailchimp audience segment when Stripe checkout.session.completed fires',
        tip_ko: 'Stripe checkout.session.completed 이벤트에서 결제 고객을 Mailchimp 오디언스 세그먼트에 자동 추가',
      },
      {
        with_service_slug: 'supabase',
        tip: 'Sync user sign-ups from Supabase Auth to Mailchimp audience using Supabase Database Webhooks',
        tip_ko: 'Supabase Auth 회원가입 이벤트를 Database Webhooks로 감지하여 Mailchimp 오디언스에 자동 동기화',
      },
    ],
    pros: [
      { text: 'Powerful audience segmentation and automation workflows', text_ko: '강력한 오디언스 세분화 및 자동화 워크플로우' },
      { text: 'Free tier supports up to 500 contacts and 1,000 sends/month', text_ko: '무료 플랜 최대 500 연락처, 월 1,000건 발송' },
      { text: 'Rich analytics: open rates, clicks, and revenue tracking', text_ko: '풍부한 분석: 오픈율, 클릭, 매출 추적' },
    ],
    cons: [
      { text: 'Pricing scales steeply with list size', text_ko: '리스트 크기에 따라 가격이 가파르게 상승' },
      { text: 'Limited transactional email features on basic plans', text_ko: '기본 플랜에서 트랜잭셔널 이메일 기능 제한' },
    ],
    api_key_url: 'https://admin.mailchimp.com/account/api/',
    api_key_url_label: 'Mailchimp API Keys',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Twilio
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.twilio,
    quick_start: 'Twilio 계정에서 가상 번호를 구매하고 twilio npm 패키지로 SMS·음성 통화를 몇 줄의 코드로 발송할 수 있습니다.',
    quick_start_en: 'Buy a Twilio phone number and send SMS or make voice calls in a few lines of code using the twilio npm package.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Twilio SDK',
        title_ko: 'Twilio SDK 설치',
        description: 'Install the official Twilio Node.js helper library',
        description_ko: '공식 Twilio Node.js 헬퍼 라이브러리 설치',
        code_snippet: 'npm install twilio',
      },
      {
        step: 2,
        title: 'Set credentials as environment variables',
        title_ko: '환경변수로 자격증명 설정',
        description: 'Store Account SID and Auth Token in .env (auto-detected by SDK)',
        description_ko: 'Account SID와 Auth Token을 .env에 저장 (SDK가 자동 인식)',
        code_snippet: `TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+15551234567`,
      },
      {
        step: 3,
        title: 'Send an SMS',
        title_ko: 'SMS 발송',
        description: 'Initialize the Twilio client and send an SMS message',
        description_ko: 'Twilio 클라이언트 초기화 후 SMS 발송',
        code_snippet: `import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const message = await client.messages.create({
  body: '인증 코드: 123456',
  from: process.env.TWILIO_PHONE_NUMBER,
  to: '+821012345678',
})
console.log(message.sid)`,
      },
    ],
    code_examples: {
      typescript: `import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// Send SMS
async function sendSMS(to: string, body: string) {
  return client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
  })
}

// Send OTP via Twilio Verify
async function sendOTP(phoneNumber: string) {
  return client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID!)
    .verifications.create({ to: phoneNumber, channel: 'sms' })
}

// Check OTP
async function checkOTP(phoneNumber: string, code: string) {
  const result = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID!)
    .verificationChecks.create({ to: phoneNumber, code })
  return result.status === 'approved'
}`,
    },
    common_pitfalls: [
      {
        title: 'Sending to unverified numbers in trial mode',
        title_ko: '체험 모드에서 미인증 번호 발송',
        problem: 'Twilio trial accounts can only send to verified caller IDs',
        solution: 'Add test recipient numbers in the Twilio console or upgrade to a paid account for unrestricted sending',
      },
      {
        title: 'Hardcoded phone numbers',
        title_ko: '전화번호 하드코딩',
        problem: 'Phone numbers embedded in source code cause issues when environment changes',
        solution: 'Store sender phone numbers in environment variables: TWILIO_PHONE_NUMBER',
      },
      {
        title: 'Not using Verify for OTP',
        title_ko: 'OTP에 Verify 미사용',
        problem: 'Implementing custom OTP logic wastes engineering time and introduces security risks',
        solution: 'Use Twilio Verify API which handles OTP generation, delivery, and expiry automatically',
        code: `// ❌ 직접 OTP 구현
const otp = Math.floor(100000 + Math.random() * 900000)

// ✅ Twilio Verify 사용
await client.verify.v2.services(VERIFY_SID).verifications
  .create({ to: phone, channel: 'sms' })`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Use Twilio Verify as a second factor in Supabase custom auth flows for phone-based 2FA',
        tip_ko: 'Supabase 커스텀 인증에 Twilio Verify를 2단계 인증으로 통합하여 전화번호 기반 2FA 구현',
      },
      {
        with_service_slug: 'stripe',
        tip: 'Send SMS payment confirmations to customers via Twilio when Stripe payment_intent.succeeded fires',
        tip_ko: 'Stripe payment_intent.succeeded 이벤트에서 Twilio로 고객에게 결제 완료 SMS 발송',
      },
    ],
    pros: [
      { text: 'Programmable SMS, voice, video, and WhatsApp in one API', text_ko: 'SMS, 음성, 영상, WhatsApp을 하나의 API로' },
      { text: 'Twilio Verify simplifies 2FA implementation', text_ko: 'Twilio Verify로 2FA 구현 단순화' },
      { text: 'Global number availability and high deliverability', text_ko: '글로벌 번호 제공 및 높은 전송률' },
    ],
    cons: [
      { text: 'Per-message pricing can add up for high-volume SMS', text_ko: '대량 SMS 시 건당 과금으로 비용 증가' },
      { text: 'Trial account restrictions slow initial testing', text_ko: '체험 계정 제한으로 초기 테스트 불편' },
    ],
    api_key_url: 'https://console.twilio.com',
    api_key_url_label: 'Twilio Console',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. OneSignal
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.onesignal,
    quick_start: 'OneSignal 앱을 생성하고 웹·모바일 푸시 알림을 무료로 무제한 발송할 수 있습니다.',
    quick_start_en: 'Create a OneSignal app and send unlimited web and mobile push notifications for free.',
    setup_steps: [
      {
        step: 1,
        title: 'Install OneSignal Node.js SDK',
        title_ko: 'OneSignal Node.js SDK 설치',
        description: 'Install the official OneSignal Node.js API client for server-side notification sending',
        description_ko: '서버 사이드 알림 발송용 공식 OneSignal Node.js API 클라이언트 설치',
        code_snippet: 'npm install @onesignal/node-onesignal',
      },
      {
        step: 2,
        title: 'Add web script to your site',
        title_ko: '웹 스크립트 추가',
        description: 'Add the OneSignal SDK script to your HTML head and configure with your App ID',
        description_ko: 'HTML head에 OneSignal SDK 스크립트 추가 후 App ID로 설정',
        code_snippet: `// next.config.ts or layout.tsx (client component)
// Add App ID from OneSignal Dashboard > Settings > Keys & IDs
<Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer />
<Script id="onesignal-init">{
  \`window.OneSignalDeferred = window.OneSignalDeferred || [];
   OneSignalDeferred.push(async function(OneSignal) {
     await OneSignal.init({ appId: "\${process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID}" });
   });\`
}</Script>`,
      },
      {
        step: 3,
        title: 'Send push notification from server',
        title_ko: '서버에서 푸시 알림 발송',
        description: 'Use the Node.js SDK with REST API key to send targeted notifications',
        description_ko: 'REST API 키로 Node.js SDK를 통해 타겟 알림 발송',
        code_snippet: `import * as OneSignal from '@onesignal/node-onesignal'

const client = OneSignal.createConfiguration({
  restApiKey: process.env.ONESIGNAL_REST_API_KEY!,
})
const api = new OneSignal.DefaultApi(client)

const notification = new OneSignal.Notification()
notification.app_id = process.env.ONESIGNAL_APP_ID!
notification.included_segments = ['All']
notification.contents = { en: 'Hello from OneSignal!' }

await api.createNotification(notification)`,
      },
    ],
    code_examples: {
      typescript: `import * as OneSignal from '@onesignal/node-onesignal'

const config = OneSignal.createConfiguration({
  restApiKey: process.env.ONESIGNAL_REST_API_KEY!,
})
const api = new OneSignal.DefaultApi(config)

// Send to all subscribers
async function sendToAll(title: string, message: string, url?: string) {
  const notification = new OneSignal.Notification()
  notification.app_id = process.env.ONESIGNAL_APP_ID!
  notification.included_segments = ['All']
  notification.headings = { en: title }
  notification.contents = { en: message }
  if (url) notification.url = url
  return api.createNotification(notification)
}

// Send to specific user by external ID
async function sendToUser(userId: string, message: string) {
  const notification = new OneSignal.Notification()
  notification.app_id = process.env.ONESIGNAL_APP_ID!
  notification.include_aliases = { external_id: [userId] }
  notification.target_channel = 'push'
  notification.contents = { en: message }
  return api.createNotification(notification)
}`,
    },
    common_pitfalls: [
      {
        title: 'REST API Key vs App ID confusion',
        title_ko: 'REST API 키와 App ID 혼동',
        problem: 'App ID is public (used in browser SDK), REST API Key is secret (server only). Exposing REST API Key in client code is a critical security risk',
        solution: 'Use NEXT_PUBLIC_ONESIGNAL_APP_ID for browser scripts, ONESIGNAL_REST_API_KEY as server-only env var',
      },
      {
        title: 'Notification permission prompt UX',
        title_ko: '알림 권한 요청 UX',
        problem: 'Prompting for push permission immediately on page load leads to high denial rates',
        solution: 'Delay the permission prompt until after user engagement or use a soft prompt with explanation',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Store OneSignal player/subscription IDs in Supabase user profiles to enable user-targeted push notifications',
        tip_ko: 'OneSignal 플레이어 ID를 Supabase 유저 프로필에 저장하여 사용자별 타겟 푸시 알림 구현',
      },
      {
        with_service_slug: 'posthog',
        tip: 'Track push notification click events in PostHog to measure notification campaign effectiveness',
        tip_ko: 'PostHog에서 푸시 알림 클릭 이벤트를 추적하여 알림 캠페인 효과 측정',
      },
    ],
    pros: [
      { text: 'Unlimited push notifications on free plan', text_ko: '무료 플랜에서 푸시 알림 무제한 발송' },
      { text: 'Cross-platform: web, iOS, Android in one dashboard', text_ko: '웹·iOS·Android 하나의 대시보드에서 관리' },
      { text: 'Built-in A/B testing and delivery analytics', text_ko: '내장 A/B 테스트 및 전송 분석' },
    ],
    cons: [
      { text: 'Limited segmentation features on free plan', text_ko: '무료 플랜에서 세분화 기능 제한' },
      { text: 'Web push relies on browser permission which users often deny', text_ko: '웹 푸시는 브라우저 권한 의존 — 사용자 거부율 높음' },
    ],
    api_key_url: 'https://dashboard.onesignal.com',
    api_key_url_label: 'OneSignal Dashboard',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Pusher
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.pusher,
    quick_start: 'Pusher Channels로 WebSocket 인프라 없이 실시간 채팅, 라이브 업데이트, 협업 기능을 추가할 수 있습니다.',
    quick_start_en: 'Add real-time chat, live updates, and collaboration features without managing WebSocket infrastructure using Pusher Channels.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Pusher server and client SDKs',
        title_ko: 'Pusher 서버·클라이언트 SDK 설치',
        description: 'Install pusher for server-side event triggering and pusher-js for client-side subscriptions',
        description_ko: '서버 이벤트 트리거용 pusher와 클라이언트 구독용 pusher-js 설치',
        code_snippet: 'npm install pusher pusher-js',
      },
      {
        step: 2,
        title: 'Configure server-side Pusher client',
        title_ko: '서버 사이드 Pusher 클라이언트 설정',
        description: 'Initialize Pusher with your app credentials from the Pusher dashboard',
        description_ko: 'Pusher 대시보드의 앱 자격증명으로 초기화',
        code_snippet: `import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})`,
      },
      {
        step: 3,
        title: 'Subscribe on the client and trigger from server',
        title_ko: '클라이언트 구독 및 서버 트리거',
        description: 'Subscribe to a channel on the client and trigger events from API routes',
        description_ko: '클라이언트에서 채널 구독, API 라우트에서 이벤트 트리거',
        code_snippet: `// Client (pusher-js)
import PusherClient from 'pusher-js'
const pusherClient = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
})
const channel = pusherClient.subscribe('my-channel')
channel.bind('my-event', (data: unknown) => console.log(data))

// Server API route
await pusher.trigger('my-channel', 'my-event', { message: 'Hello!' })`,
      },
    ],
    code_examples: {
      typescript: `// lib/pusher.ts — server instance (singleton)
import Pusher from 'pusher'
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

// app/api/chat/route.ts — trigger real-time message
import { pusherServer } from '@/lib/pusher'
export async function POST(req: Request) {
  const { channelId, message, userId } = await req.json()
  await pusherServer.trigger(\`presence-chat-\${channelId}\`, 'new-message', {
    message,
    userId,
    timestamp: new Date().toISOString(),
  })
  return Response.json({ ok: true })
}

// components/Chat.tsx — client subscription
'use client'
import PusherClient from 'pusher-js'
import { useEffect, useState } from 'react'

const client = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
})

export function Chat({ channelId }: { channelId: string }) {
  const [messages, setMessages] = useState<string[]>([])
  useEffect(() => {
    const channel = client.subscribe(\`presence-chat-\${channelId}\`)
    channel.bind('new-message', ({ message }: { message: string }) =>
      setMessages(prev => [...prev, message])
    )
    return () => client.unsubscribe(\`presence-chat-\${channelId}\`)
  }, [channelId])
  return <ul>{messages.map((m, i) => <li key={i}>{m}</li>)}</ul>
}`,
    },
    common_pitfalls: [
      {
        title: 'Exposing PUSHER_SECRET on client',
        title_ko: 'PUSHER_SECRET 클라이언트 노출',
        problem: 'PUSHER_SECRET must never be exposed in browser code',
        solution: 'Only use NEXT_PUBLIC_ prefix for PUSHER_KEY and PUSHER_CLUSTER. Keep PUSHER_APP_ID and PUSHER_SECRET server-only',
        code: `// ❌ 절대 금지
NEXT_PUBLIC_PUSHER_SECRET=xxxx

// ✅ 올바른 env 구성
NEXT_PUBLIC_PUSHER_KEY=xxxx      // 공개 (클라이언트 사용)
NEXT_PUBLIC_PUSHER_CLUSTER=ap3   // 공개
PUSHER_APP_ID=xxxxxx             // 비공개
PUSHER_SECRET=xxxxxxxxxxxxxxxx   // 비공개`,
      },
      {
        title: 'Not disconnecting on component unmount',
        title_ko: '컴포넌트 언마운트 시 연결 해제 누락',
        problem: 'Memory leaks and duplicate event handlers from stale Pusher subscriptions',
        solution: 'Always unsubscribe from channels and disconnect the client in useEffect cleanup',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Use Supabase Realtime for database-driven events, and Pusher for arbitrary server-to-client events that do not require DB persistence',
        tip_ko: 'DB 기반 이벤트는 Supabase Realtime, DB 영속성 불필요한 서버→클라이언트 이벤트는 Pusher 사용',
      },
    ],
    pros: [
      { text: 'Managed WebSocket infrastructure with no servers to run', text_ko: '서버 운영 없는 관리형 WebSocket 인프라' },
      { text: 'Presence channels show who is currently online', text_ko: 'Presence 채널로 현재 접속자 파악 가능' },
      { text: 'Free tier supports 200 concurrent connections', text_ko: '무료 플랜 최대 200 동시 연결' },
    ],
    cons: [
      { text: 'Message size limit (10 KB per event)', text_ko: '메시지 크기 제한 (이벤트당 10 KB)' },
      { text: 'Costs escalate quickly with many concurrent users', text_ko: '동시 접속자 증가 시 비용 빠르게 상승' },
    ],
    api_key_url: 'https://dashboard.pusher.com',
    api_key_url_label: 'Pusher Dashboard',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Toss Payments
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.toss_payments,
    quick_start: '토스페이먼츠 클라이언트 키를 발급받고 @tosspayments/sdk로 카드·간편결제를 한국 서비스에 빠르게 연동할 수 있습니다.',
    quick_start_en: 'Get a Toss Payments client key and integrate card and simple payments into Korean services quickly using @tosspayments/sdk.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Toss Payments SDK',
        title_ko: '토스페이먼츠 SDK 설치',
        description: 'Install the official Toss Payments v2 SDK',
        description_ko: '공식 토스페이먼츠 v2 SDK 설치',
        code_snippet: 'npm install @tosspayments/tosspayments-sdk',
      },
      {
        step: 2,
        title: 'Initialize payment widget on client',
        title_ko: '클라이언트에서 결제 위젯 초기화',
        description: 'Initialize TossPayments with your client key and render the payment widget',
        description_ko: '클라이언트 키로 TossPayments 초기화 후 결제 위젯 렌더링',
        code_snippet: `import { loadTossPayments } from '@tosspayments/tosspayments-sdk'

const tossPayments = await loadTossPayments(
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
)
const payment = tossPayments.payment({ customerKey: 'unique-customer-key' })

await payment.requestPayment({
  method: 'CARD',
  amount: { currency: 'KRW', value: 50000 },
  orderId: 'ORDER-' + Date.now(),
  orderName: '상품명',
  successUrl: window.location.origin + '/payment/success',
  failUrl: window.location.origin + '/payment/fail',
})`,
      },
      {
        step: 3,
        title: 'Confirm payment on server',
        title_ko: '서버에서 결제 승인',
        description: 'Verify and confirm the payment on your API route using the secret key',
        description_ko: 'API 라우트에서 시크릿 키로 결제 검증 및 승인',
        code_snippet: `// app/api/payment/confirm/route.ts
export async function POST(req: Request) {
  const { paymentKey, orderId, amount } = await req.json()
  const response = await fetch(
    'https://api.tosspayments.com/v1/payments/confirm',
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(
          process.env.TOSS_SECRET_KEY! + ':'
        ).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    }
  )
  return Response.json(await response.json())
}`,
      },
    ],
    code_examples: {
      typescript: `// 클라이언트: 결제 요청
'use client'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'

export async function requestPayment(orderId: string, amount: number, orderName: string) {
  const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!)
  const payment = tossPayments.payment({ customerKey: 'GUEST_CUSTOMER' })

  await payment.requestPayment({
    method: 'CARD',
    amount: { currency: 'KRW', value: amount },
    orderId,
    orderName,
    successUrl: \`\${window.location.origin}/payment/success\`,
    failUrl: \`\${window.location.origin}/payment/fail\`,
    card: { useEscrow: false, flowMode: 'DEFAULT', useCardPoint: false },
  })
}

// 서버: 결제 승인 (app/api/payment/confirm/route.ts)
export async function POST(req: Request) {
  const { paymentKey, orderId, amount } = await req.json()
  const secretKey = process.env.TOSS_SECRET_KEY!
  const encryptedKey = Buffer.from(secretKey + ':').toString('base64')

  const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: \`Basic \${encryptedKey}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })
  const data = await res.json()
  if (!res.ok) return Response.json({ error: data }, { status: res.status })
  // DB에 결제 정보 저장 후 응답
  return Response.json(data)
}`,
    },
    common_pitfalls: [
      {
        title: 'Payment amount not verified on server',
        title_ko: '서버에서 결제 금액 미검증',
        problem: 'Confirming payment without comparing the amount to your DB order leads to price manipulation attacks',
        solution: 'Always fetch the expected amount from your DB using orderId and compare it with the amount from the client before calling /confirm',
        code: `// 반드시 DB 금액과 비교
const order = await db.orders.findUnique({ where: { id: orderId } })
if (order.amount !== amount) {
  return Response.json({ error: '금액 불일치' }, { status: 400 })
}
// 일치 확인 후 결제 승인`,
      },
      {
        title: 'Secret key exposed with NEXT_PUBLIC_ prefix',
        title_ko: '시크릿 키 NEXT_PUBLIC_ 노출',
        problem: 'TOSS_SECRET_KEY with NEXT_PUBLIC_ prefix is bundled into the browser',
        solution: 'Only NEXT_PUBLIC_TOSS_CLIENT_KEY is public. TOSS_SECRET_KEY must be server-only',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Save Toss Payments order and receipt data to Supabase in the confirm API route for payment history and refund management',
        tip_ko: 'confirm API 라우트에서 토스페이먼츠 주문·영수증 데이터를 Supabase에 저장하여 결제 내역 및 환불 관리',
      },
      {
        with_service_slug: 'clerk',
        tip: 'Map Clerk userId to Toss Payments customerKey to enable saved payment methods and billing history per user',
        tip_ko: 'Clerk userId를 Toss Payments customerKey로 매핑하여 사용자별 결제 수단 저장 및 결제 이력 관리',
      },
    ],
    pros: [
      { text: 'Korean payment methods: card, Toss Pay, virtual account, and more', text_ko: '카드·토스페이·가상계좌 등 한국 결제 수단 지원' },
      { text: 'Simple REST API and official SDK with TypeScript support', text_ko: '간단한 REST API와 TypeScript 지원 공식 SDK' },
      { text: 'Test mode with real UI simulation (no actual charges)', text_ko: '실제 UI 그대로 테스트 모드 제공 (실제 청구 없음)' },
    ],
    cons: [
      { text: 'Korean market only — not suitable for global payments', text_ko: '국내 전용 — 글로벌 결제 불가' },
      { text: 'Business registration required for production account', text_ko: '프로덕션 계정에 사업자 등록 필요' },
    ],
    api_key_url: 'https://developers.tosspayments.com/my/api-keys',
    api_key_url_label: '토스페이먼츠 API 키',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 8. PayPal
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.paypal,
    quick_start: 'PayPal 개발자 계정에서 앱을 생성하고 @paypal/paypal-server-sdk로 글로벌 결제를 연동할 수 있습니다.',
    quick_start_en: 'Create an app in the PayPal Developer Portal and integrate global payments using @paypal/paypal-server-sdk.',
    setup_steps: [
      {
        step: 1,
        title: 'Install PayPal Server SDK',
        title_ko: 'PayPal Server SDK 설치',
        description: 'Install the official PayPal Server SDK (replaces the deprecated checkout-server-sdk)',
        description_ko: '공식 PayPal Server SDK 설치 (deprecated checkout-server-sdk 대체)',
        code_snippet: 'npm install @paypal/paypal-server-sdk',
      },
      {
        step: 2,
        title: 'Configure credentials',
        title_ko: '자격증명 설정',
        description: 'Add PayPal Client ID and Secret from Developer Portal to .env',
        description_ko: 'Developer Portal의 Client ID와 Secret을 .env에 추가',
        code_snippet: `PAYPAL_CLIENT_ID=AQxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=EPxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Sandbox for development, live for production
PAYPAL_ENVIRONMENT=sandbox`,
      },
      {
        step: 3,
        title: 'Create an order and capture payment',
        title_ko: '주문 생성 및 결제 캡처',
        description: 'Create a PayPal order on the server and capture it after buyer approval',
        description_ko: '서버에서 PayPal 주문 생성 후 구매자 승인 완료 시 캡처',
        code_snippet: `import {
  Client,
  Environment,
  OrdersController,
  CheckoutPaymentIntent,
} from '@paypal/paypal-server-sdk'

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment:
    process.env.PAYPAL_ENVIRONMENT === 'live'
      ? Environment.Production
      : Environment.Sandbox,
})
const orders = new OrdersController(client)

// Create order
const { result } = await orders.ordersCreate({
  body: {
    intent: CheckoutPaymentIntent.Capture,
    purchaseUnits: [{ amount: { currencyCode: 'USD', value: '10.00' } }],
  },
})`,
      },
    ],
    code_examples: {
      typescript: `import {
  Client,
  Environment,
  OrdersController,
  CheckoutPaymentIntent,
} from '@paypal/paypal-server-sdk'

const paypalClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID!,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
  },
  environment:
    process.env.PAYPAL_ENVIRONMENT === 'live'
      ? Environment.Production
      : Environment.Sandbox,
})

const ordersController = new OrdersController(paypalClient)

// Create order (server API route)
export async function createOrder(amount: string, currency = 'USD') {
  const { result } = await ordersController.ordersCreate({
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [{
        amount: { currencyCode: currency, value: amount },
      }],
    },
  })
  return result // contains id for client-side approval
}

// Capture payment after buyer approval
export async function captureOrder(orderId: string) {
  const { result } = await ordersController.ordersCapture({
    id: orderId,
    body: {},
  })
  return result
}`,
    },
    common_pitfalls: [
      {
        title: 'Using deprecated checkout-server-sdk',
        title_ko: 'deprecated checkout-server-sdk 사용',
        problem: '@paypal/checkout-server-sdk is no longer maintained',
        solution: 'Migrate to @paypal/paypal-server-sdk which supports the latest v2 Orders and Payments APIs',
      },
      {
        title: 'Sandbox vs live credentials mixed up',
        title_ko: '샌드박스·라이브 자격증명 혼동',
        problem: 'Using sandbox credentials in production causes all payments to fail silently',
        solution: 'Use separate env variables for sandbox and production, and guard with PAYPAL_ENVIRONMENT check',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'stripe',
        tip: 'Offer both Stripe (cards) and PayPal as payment options to maximize global checkout conversion rates',
        tip_ko: 'Stripe(카드)와 PayPal을 동시에 결제 옵션으로 제공하여 글로벌 전환율 극대화',
      },
      {
        with_service_slug: 'supabase',
        tip: 'Store PayPal order IDs and transaction data in Supabase after successful captures for order management',
        tip_ko: '결제 완료 후 PayPal 주문 ID와 거래 데이터를 Supabase에 저장하여 주문 관리',
      },
    ],
    pros: [
      { text: 'Recognized and trusted brand globally — increases buyer confidence', text_ko: '글로벌 신뢰 브랜드 — 구매자 신뢰 향상' },
      { text: 'Supports PayPal balance, credit cards, and buy now pay later', text_ko: 'PayPal 잔액·카드·할부 결제 지원' },
      { text: 'Sandbox environment for full end-to-end testing', text_ko: '완전한 E2E 테스트를 위한 샌드박스 환경' },
    ],
    cons: [
      { text: 'Higher fees compared to Stripe (2.99% + fixed fee)', text_ko: 'Stripe 대비 높은 수수료 (2.99% + 고정 수수료)' },
      { text: 'Checkout UX redirects to PayPal site by default', text_ko: '기본 체크아웃이 PayPal 사이트로 리디렉션' },
    ],
    api_key_url: 'https://developer.paypal.com/dashboard/applications',
    api_key_url_label: 'PayPal Developer Dashboard',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 9. Lemon Squeezy
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.lemonsqueezy,
    quick_start: 'Lemon Squeezy는 결제·구독·라이선스·세금 처리를 모두 담당하는 SaaS Merchant of Record 서비스입니다. API 키 하나로 시작하세요.',
    quick_start_en: 'Lemon Squeezy is a Merchant of Record that handles payments, subscriptions, licenses, and taxes. Get started with a single API key.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Lemon Squeezy SDK',
        title_ko: 'Lemon Squeezy SDK 설치',
        description: 'Install the official JavaScript/TypeScript SDK',
        description_ko: '공식 JavaScript/TypeScript SDK 설치',
        code_snippet: 'npm install @lemonsqueezy/lemonsqueezy.js',
      },
      {
        step: 2,
        title: 'Initialize SDK with API key',
        title_ko: 'API 키로 SDK 초기화',
        description: 'Call lemonSqueezySetup once (server-side only) before using any SDK functions',
        description_ko: '서버 사이드에서 SDK 함수 사용 전 lemonSqueezySetup 한 번 호출',
        code_snippet: `import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'

lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  onError: (error) => console.error('LemonSqueezy error:', error),
})`,
      },
      {
        step: 3,
        title: 'Create a checkout URL',
        title_ko: '결제 URL 생성',
        description: 'Generate a checkout URL for a specific variant and redirect the user',
        description_ko: '특정 variant의 결제 URL 생성 후 사용자 리디렉션',
        code_snippet: `import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'

const { data, error } = await createCheckout(
  process.env.LEMONSQUEEZY_STORE_ID!,
  process.env.LEMONSQUEEZY_VARIANT_ID!,
  {
    checkoutOptions: { embed: false },
    checkoutData: {
      email: 'user@example.com',
      custom: { user_id: '123' }, // webhook으로 전달됨
    },
    expiresAt: null,
  }
)
const checkoutUrl = data?.data.attributes.url`,
      },
    ],
    code_examples: {
      typescript: `import {
  lemonSqueezySetup,
  createCheckout,
  listSubscriptions,
  cancelSubscription,
} from '@lemonsqueezy/lemonsqueezy.js'

// lib/lemonsqueezy.ts
lemonSqueezySetup({
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  onError: (error) => { throw new Error(\`LemonSqueezy: \${error.message}\`) },
})

// Create checkout session
export async function getCheckoutUrl(email: string, userId: string) {
  const { data, error } = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID!,
    process.env.LEMONSQUEEZY_VARIANT_ID!,
    {
      checkoutData: {
        email,
        custom: { user_id: userId },
      },
    }
  )
  if (error) throw error
  return data!.data.attributes.url
}

// Handle webhook (app/api/webhooks/lemonsqueezy/route.ts)
export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('X-Signature')!
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
  const hmac = require('crypto')
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
  if (hmac !== signature) {
    return new Response('Unauthorized', { status: 401 })
  }
  const event = JSON.parse(body)
  if (event.meta.event_name === 'order_created') {
    // 구독 활성화 처리
  }
  return Response.json({ ok: true })
}`,
    },
    common_pitfalls: [
      {
        title: 'Using SDK in browser (API key exposure)',
        title_ko: '브라우저에서 SDK 사용 (API 키 노출)',
        problem: 'Calling SDK functions client-side exposes your API key in the browser bundle',
        solution: 'Only use @lemonsqueezy/lemonsqueezy.js in API routes or server actions. Never call from Client Components',
      },
      {
        title: 'Webhook signature not verified',
        title_ko: '웹훅 서명 미검증',
        problem: 'Not verifying X-Signature header allows anyone to spoof order events',
        solution: 'Always compute HMAC-SHA256 of the raw body with your webhook secret and compare to the X-Signature header',
        code: `const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!
const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
if (hmac !== signature) return new Response('Forbidden', { status: 403 })`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Store Lemon Squeezy subscription status and customer ID in Supabase user profiles. Update via webhook events for real-time access control',
        tip_ko: 'Lemon Squeezy 구독 상태·고객 ID를 Supabase 유저 프로필에 저장하고 웹훅으로 실시간 업데이트하여 접근 제어',
        code: `// 웹훅에서 Supabase 구독 상태 업데이트
if (event.meta.event_name === 'subscription_updated') {
  const { status, customer_id } = event.data.attributes
  await supabase.from('subscriptions')
    .upsert({ user_id: event.meta.custom_data.user_id, status, customer_id })
}`,
      },
      {
        with_service_slug: 'stripe',
        tip: 'Lemon Squeezy is an alternative to Stripe for solo developers and small teams who want built-in tax handling without Stripe Tax complexity',
        tip_ko: 'Stripe Tax의 복잡함 없이 세금 자동 처리를 원하는 개인 개발자·소규모 팀에게 Stripe 대안',
      },
    ],
    pros: [
      { text: 'Merchant of Record: handles global VAT/tax automatically', text_ko: 'Merchant of Record: 글로벌 부가세·세금 자동 처리' },
      { text: 'Built-in license key generation for software products', text_ko: '소프트웨어 제품용 라이선스 키 자동 생성' },
      { text: 'Simple flat-fee pricing, no hidden costs', text_ko: '단순한 정액 요금제, 숨겨진 비용 없음' },
    ],
    cons: [
      { text: 'Less customizable checkout than Stripe', text_ko: 'Stripe 대비 체크아웃 커스터마이징 제한' },
      { text: 'Smaller ecosystem and fewer integrations', text_ko: '더 작은 생태계와 제한된 통합' },
    ],
    api_key_url: 'https://app.lemonsqueezy.com/settings/api',
    api_key_url_label: 'Lemon Squeezy API Keys',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 10. Google Analytics 4 (GA4)
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.ga4,
    quick_start: 'GA4 스크립트를 Next.js에 추가하고 Measurement Protocol로 서버 사이드 이벤트까지 추적할 수 있습니다.',
    quick_start_en: 'Add the GA4 script to Next.js and track server-side events as well using the Measurement Protocol.',
    setup_steps: [
      {
        step: 1,
        title: 'Add GA4 script to Next.js',
        title_ko: 'Next.js에 GA4 스크립트 추가',
        description: 'Add the gtag.js script to your root layout using next/script',
        description_ko: 'next/script로 루트 레이아웃에 gtag.js 스크립트 추가',
        code_snippet: `// app/layout.tsx
import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src={\`https://www.googletagmanager.com/gtag/js?id=\${GA_ID}\`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {\`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '\${GA_ID}');
          \`}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}`,
      },
      {
        step: 2,
        title: 'Track custom events client-side',
        title_ko: '클라이언트 사이드 커스텀 이벤트 추적',
        description: 'Use the gtag function to send custom events from client components',
        description_ko: 'Client Component에서 gtag 함수로 커스텀 이벤트 전송',
        code_snippet: `// Declare gtag type in global.d.ts
declare global { function gtag(...args: unknown[]): void }

// Usage
gtag('event', 'purchase', {
  transaction_id: 'T12345',
  value: 29.99,
  currency: 'USD',
})`,
      },
      {
        step: 3,
        title: 'Send server-side events via Measurement Protocol',
        title_ko: 'Measurement Protocol로 서버 사이드 이벤트 전송',
        description: 'Send events directly from API routes using the GA4 Measurement Protocol for accurate server-side tracking',
        description_ko: 'API 라우트에서 GA4 Measurement Protocol로 서버 이벤트 직접 전송',
        code_snippet: `const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!
const API_SECRET = process.env.GA_API_SECRET! // Admin > Data Streams > MP > Create

await fetch(
  \`https://www.google-analytics.com/mp/collect?measurement_id=\${GA_ID}&api_secret=\${API_SECRET}\`,
  {
    method: 'POST',
    body: JSON.stringify({
      client_id: '555', // unique per user/session
      events: [{ name: 'login', params: { method: 'Google' } }],
    }),
  }
)`,
      },
    ],
    code_examples: {
      typescript: `// lib/analytics.ts — helper utilities

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''

// Client-side page view
export function pageview(url: string) {
  if (typeof window === 'undefined' || !GA_ID) return
  window.gtag('config', GA_ID, { page_path: url })
}

// Client-side event
export function gaEvent({
  action,
  category,
  label,
  value,
}: {
  action: string
  category?: string
  label?: string
  value?: number
}) {
  if (typeof window === 'undefined' || !GA_ID) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

// Server-side Measurement Protocol event
export async function mpEvent(clientId: string, eventName: string, params: Record<string, unknown> = {}) {
  const apiSecret = process.env.GA_API_SECRET
  if (!GA_ID || !apiSecret) return

  await fetch(
    \`https://www.google-analytics.com/mp/collect?measurement_id=\${GA_ID}&api_secret=\${apiSecret}\`,
    {
      method: 'POST',
      body: JSON.stringify({
        client_id: clientId,
        events: [{ name: eventName, params }],
      }),
    }
  )
}`,
    },
    common_pitfalls: [
      {
        title: 'No cookie consent before loading GA4',
        title_ko: '쿠키 동의 전 GA4 로드',
        problem: 'Loading GA4 without user consent violates GDPR/CCPA in EU/California',
        solution: 'Implement a consent management solution and only initialize GA4 after explicit user consent',
        code: `// Consent Mode v2 설정
gtag('consent', 'default', {
  analytics_storage: 'denied', // 기본 거부
  ad_storage: 'denied',
})
// 동의 후 업데이트
gtag('consent', 'update', { analytics_storage: 'granted' })`,
      },
      {
        title: 'Measurement Protocol events not appearing',
        title_ko: 'Measurement Protocol 이벤트 미반영',
        problem: 'Server-side events sent without a valid client_id do not appear in GA4 reports',
        solution: 'Pass the client_id from the browser (stored in _ga cookie) when sending Measurement Protocol events',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Use Vercel Web Analytics alongside GA4 for privacy-friendly traffic metrics without cookie consent banners',
        tip_ko: 'Vercel Web Analytics를 GA4와 함께 사용하여 쿠키 동의 배너 없이 개인정보 친화적 트래픽 지표 수집',
      },
      {
        with_service_slug: 'posthog',
        tip: 'Use PostHog for product analytics (funnels, retention) and GA4 for marketing attribution and SEO metrics',
        tip_ko: 'PostHog는 제품 분석(퍼널·리텐션), GA4는 마케팅 어트리뷰션·SEO 지표에 사용하여 역할 분리',
      },
    ],
    pros: [
      { text: 'Free and deeply integrated with Google Ads and Search Console', text_ko: '무료이며 Google Ads·Search Console과 깊게 통합' },
      { text: 'AI-powered insights and predictive audiences', text_ko: 'AI 기반 인사이트 및 예측 오디언스' },
      { text: 'Cross-platform tracking (web + app) in one property', text_ko: '웹·앱 크로스 플랫폼 추적을 하나의 속성에서' },
    ],
    cons: [
      { text: 'Complex event model with steep learning curve', text_ko: '복잡한 이벤트 모델로 학습 곡선 가파름' },
      { text: 'Cookie consent required in GDPR regions', text_ko: 'GDPR 적용 지역에서 쿠키 동의 필요' },
    ],
    api_key_url: 'https://analytics.google.com',
    api_key_url_label: 'Google Analytics',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 11. Mixpanel
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.mixpanel,
    quick_start: 'Mixpanel 프로젝트 토큰을 발급받고 mixpanel-browser나 mixpanel-node로 사용자 행동을 추적할 수 있습니다.',
    quick_start_en: 'Get a Mixpanel project token and track user behavior using mixpanel-browser or mixpanel-node.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Mixpanel SDK',
        title_ko: 'Mixpanel SDK 설치',
        description: 'Install mixpanel-browser for client-side or mixpanel for server-side tracking',
        description_ko: '클라이언트는 mixpanel-browser, 서버 사이드는 mixpanel 패키지 설치',
        code_snippet: 'npm install mixpanel-browser\n# Server-side:\nnpm install mixpanel',
      },
      {
        step: 2,
        title: 'Initialize Mixpanel in your app',
        title_ko: '앱에서 Mixpanel 초기화',
        description: 'Initialize Mixpanel with your project token in a client component or server module',
        description_ko: 'Client Component 또는 서버 모듈에서 프로젝트 토큰으로 초기화',
        code_snippet: `// Client-side (mixpanel-browser)
import mixpanel from 'mixpanel-browser'
mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
  debug: process.env.NODE_ENV === 'development',
  track_pageview: true,
  persistence: 'localStorage',
})`,
      },
      {
        step: 3,
        title: 'Track events and identify users',
        title_ko: '이벤트 추적 및 사용자 식별',
        description: 'Track events and call identify after login for cross-session user tracking',
        description_ko: '이벤트 추적 후 로그인 시 identify 호출로 세션 간 사용자 연결',
        code_snippet: `// Track an event
mixpanel.track('Button Clicked', { button_name: 'Sign Up', page: '/landing' })

// Identify user after login
mixpanel.identify(userId)
mixpanel.people.set({ $email: email, $name: name, plan: 'pro' })`,
      },
    ],
    code_examples: {
      typescript: `// lib/mixpanel.ts — client-side helpers
import mixpanel from 'mixpanel-browser'

export function initMixpanel() {
  if (typeof window === 'undefined') return
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
    debug: process.env.NODE_ENV !== 'production',
    track_pageview: 'url-with-path',
    persistence: 'localStorage',
  })
}

export function trackEvent(
  event: string,
  props: Record<string, unknown> = {}
) {
  if (typeof window === 'undefined') return
  mixpanel.track(event, props)
}

export function identifyUser(userId: string, email: string, plan: string) {
  mixpanel.identify(userId)
  mixpanel.people.set({ $email: email, plan, $last_login: new Date() })
}

export function resetUser() {
  mixpanel.reset()
}

// Server-side tracking (API route)
// npm install mixpanel
import Mixpanel from 'mixpanel'
const mp = Mixpanel.init(process.env.MIXPANEL_TOKEN!)

export async function trackServerEvent(
  distinctId: string,
  event: string,
  props: Record<string, unknown> = {}
) {
  return new Promise<void>((resolve, reject) => {
    mp.track(event, { distinct_id: distinctId, ...props }, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}`,
    },
    common_pitfalls: [
      {
        title: 'Calling identify before init',
        title_ko: 'init 전 identify 호출',
        problem: 'Calling mixpanel.identify before mixpanel.init throws an error',
        solution: 'Call identify only after init. In Next.js, initialize in a useEffect with the Mixpanel provider pattern',
      },
      {
        title: 'Not calling reset on logout',
        title_ko: '로그아웃 시 reset 미호출',
        problem: 'If you do not call mixpanel.reset() on logout, the next user on the same device inherits the previous user\'s identity',
        solution: 'Always call mixpanel.reset() when the user logs out to clear the distinct_id',
        code: `// 로그아웃 핸들러
async function handleLogout() {
  mixpanel.reset() // 반드시 호출
  await signOut()
}`,
      },
      {
        title: 'Sending PII in event properties',
        title_ko: '이벤트 속성에 개인정보 포함',
        problem: 'Including email addresses, phone numbers in event properties violates privacy policies',
        solution: 'Use numeric or hashed user IDs in event properties. Store PII only in People profiles via mixpanel.people.set',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'posthog',
        tip: 'Mixpanel excels at funnel and cohort analysis; PostHog is better for session replay and feature flags. Use both for comprehensive product analytics',
        tip_ko: 'Mixpanel은 퍼널·코호트 분석에, PostHog는 세션 리플레이·피처 플래그에 강점. 두 도구를 함께 사용하면 포괄적인 제품 분석 가능',
      },
      {
        with_service_slug: 'supabase',
        tip: 'Mirror Mixpanel event data to Supabase for custom SQL analysis and combining with your business data',
        tip_ko: 'Mixpanel 이벤트를 Supabase로 미러링하여 비즈니스 데이터와 결합한 커스텀 SQL 분석',
      },
    ],
    pros: [
      { text: 'Powerful funnel, retention, and cohort analysis', text_ko: '강력한 퍼널·리텐션·코호트 분석' },
      { text: 'Real-time event tracking with flexible querying', text_ko: '유연한 쿼리가 가능한 실시간 이벤트 추적' },
      { text: 'Free plan supports 20M monthly events', text_ko: '무료 플랜 월 2,000만 이벤트 지원' },
    ],
    cons: [
      { text: 'Pricing scales sharply beyond free tier', text_ko: '무료 플랜 초과 시 가격 급등' },
      { text: 'Requires disciplined event naming convention to stay organized', text_ko: '체계적인 이벤트 명명 규칙 없으면 데이터 혼잡' },
    ],
    api_key_url: 'https://mixpanel.com/settings/project',
    api_key_url_label: 'Mixpanel Project Settings',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 12. Plausible
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.plausible,
    quick_start: 'Plausible 스크립트 한 줄을 추가하면 쿠키 없는 GDPR 친화적 웹 분석을 즉시 시작할 수 있습니다.',
    quick_start_en: 'Add a single Plausible script tag to get cookie-free, GDPR-friendly web analytics up and running immediately.',
    setup_steps: [
      {
        step: 1,
        title: 'Add Plausible script to Next.js',
        title_ko: 'Next.js에 Plausible 스크립트 추가',
        description: 'Add the Plausible tracking script using next/script in your root layout',
        description_ko: '루트 레이아웃에 next/script로 Plausible 추적 스크립트 추가',
        code_snippet: `// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          defer
          data-domain="yourdomain.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}`,
      },
      {
        step: 2,
        title: 'Track custom events',
        title_ko: '커스텀 이벤트 추적',
        description: 'Use the plausible() function to send custom events for conversion tracking',
        description_ko: 'plausible() 함수로 전환 추적을 위한 커스텀 이벤트 전송',
        code_snippet: `// Declare type globally
declare global {
  function plausible(event: string, options?: { props?: Record<string, string> }): void
}

// Track event
plausible('Signup', { props: { plan: 'pro', referrer: 'homepage' } })`,
      },
      {
        step: 3,
        title: 'Use Stats API for programmatic access',
        title_ko: 'Stats API로 프로그래밍 방식 접근',
        description: 'Fetch analytics data via Plausible Stats API to build custom dashboards',
        description_ko: 'Plausible Stats API로 분석 데이터를 가져와 커스텀 대시보드 구축',
        code_snippet: `const res = await fetch(
  'https://plausible.io/api/v1/stats/aggregate?' +
  new URLSearchParams({
    site_id: 'yourdomain.com',
    period: '30d',
    metrics: 'visitors,pageviews,bounce_rate',
  }),
  { headers: { Authorization: \`Bearer \${process.env.PLAUSIBLE_API_KEY}\` } }
)
const { results } = await res.json()`,
      },
    ],
    code_examples: {
      typescript: `// lib/plausible.ts — typed wrapper
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

export function trackEvent(
  event: string,
  props: Record<string, string> = {}
) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event, { props })
  }
}

// Usage in components
trackEvent('Download', { format: 'pdf', page: 'pricing' })
trackEvent('CTA Click', { button: 'Start Free Trial' })

// Stats API — fetch real-time visitor count (server)
export async function getLiveVisitors(domain: string): Promise<number> {
  const res = await fetch(
    \`https://plausible.io/api/v1/stats/realtime/visitors?site_id=\${domain}\`,
    { headers: { Authorization: \`Bearer \${process.env.PLAUSIBLE_API_KEY}\` } }
  )
  return res.json() // returns a number
}`,
    },
    common_pitfalls: [
      {
        title: 'Script blocked by ad blockers',
        title_ko: '광고 차단기에 의한 스크립트 차단',
        problem: 'Many users with ad blockers block plausible.io tracking script, causing under-reporting',
        solution: 'Use Plausible\'s custom domain proxy feature to serve the script from your own domain (e.g. analytics.yourdomain.com)',
      },
      {
        title: 'Custom events not firing due to missing script variant',
        title_ko: '스크립트 변형 미사용으로 커스텀 이벤트 미발동',
        problem: 'plausible() function is undefined when using the base script.js',
        solution: 'Use script.tagged-events.js variant for custom event tracking',
        code: `// ❌ 기본 스크립트 (커스텀 이벤트 불가)
src="https://plausible.io/js/script.js"

// ✅ 커스텀 이벤트 지원 스크립트
src="https://plausible.io/js/script.tagged-events.js"`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'vercel',
        tip: 'Use Vercel\'s Edge Config or environment variables to conditionally load Plausible only in production to avoid polluting analytics with development traffic',
        tip_ko: 'Vercel 환경변수로 프로덕션에서만 Plausible 로드하여 개발 트래픽으로 인한 분석 데이터 오염 방지',
      },
      {
        with_service_slug: 'ga4',
        tip: 'Run Plausible alongside GA4: Plausible for privacy-first quick overview, GA4 for deep marketing attribution and Google Ads integration',
        tip_ko: 'Plausible(빠른 개요·개인정보 보호)과 GA4(마케팅 어트리뷰션·Google Ads)를 병행하여 역할 분리',
      },
    ],
    pros: [
      { text: 'No cookies, no GDPR consent banner required in EU', text_ko: '쿠키 없음, EU에서 GDPR 동의 배너 불필요' },
      { text: 'Lightweight script (< 1 KB) with no performance impact', text_ko: '초경량 스크립트 (< 1 KB), 성능 영향 없음' },
      { text: 'Open source with self-hosting option', text_ko: '오픈소스, 자체 호스팅 가능' },
    ],
    cons: [
      { text: 'No user-level tracking or session replay', text_ko: '사용자 수준 추적 및 세션 리플레이 없음' },
      { text: 'Limited funnel and cohort analysis compared to Mixpanel', text_ko: 'Mixpanel 대비 퍼널·코호트 분석 제한' },
    ],
    api_key_url: 'https://plausible.io/settings',
    api_key_url_label: 'Plausible Settings',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 13. LogRocket
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.logrocket,
    quick_start: 'LogRocket SDK를 Next.js Client Component에 초기화하면 사용자 세션을 픽셀 완벽하게 리플레이하고 버그를 재현할 수 있습니다.',
    quick_start_en: 'Initialize LogRocket SDK in a Next.js Client Component to replay user sessions pixel-perfectly and reproduce bugs.',
    setup_steps: [
      {
        step: 1,
        title: 'Install LogRocket SDK',
        title_ko: 'LogRocket SDK 설치',
        description: 'Install the logrocket npm package',
        description_ko: 'logrocket npm 패키지 설치',
        code_snippet: 'npm install logrocket',
      },
      {
        step: 2,
        title: 'Initialize LogRocket in a Client Component',
        title_ko: 'Client Component에서 LogRocket 초기화',
        description: 'LogRocket must be initialized client-side only. Use a dedicated Client Component in root layout',
        description_ko: 'LogRocket은 클라이언트 전용. 루트 레이아웃에 전용 Client Component로 초기화',
        code_snippet: `// components/LogRocketProvider.tsx
'use client'
import LogRocket from 'logrocket'
import { useEffect } from 'react'

export function LogRocketProvider() {
  useEffect(() => {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID!)
  }, [])
  return null
}

// app/layout.tsx
import { LogRocketProvider } from '@/components/LogRocketProvider'
export default function RootLayout({ children }) {
  return (
    <html><body>
      <LogRocketProvider />
      {children}
    </body></html>
  )
}`,
      },
      {
        step: 3,
        title: 'Identify users for session linking',
        title_ko: '세션 연결을 위한 사용자 식별',
        description: 'Call LogRocket.identify after login to link sessions to specific users',
        description_ko: '로그인 후 LogRocket.identify 호출로 세션을 특정 사용자에 연결',
        code_snippet: `// After user sign-in
LogRocket.identify(userId, {
  name: 'John Doe',
  email: 'john@example.com',
  // Custom traits (non-PII preferred)
  plan: 'pro',
  accountId: 'company-123',
})`,
      },
    ],
    code_examples: {
      typescript: `// components/LogRocketProvider.tsx
'use client'
import LogRocket from 'logrocket'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  userId?: string
  email?: string
  plan?: string
}

export function LogRocketProvider({ userId, email, plan }: Props) {
  useEffect(() => {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID!, {
      // Sanitize sensitive fields from network requests
      network: {
        requestSanitizer: (request) => {
          if (request.headers['Authorization']) {
            request.headers['Authorization'] = '[REDACTED]'
          }
          return request
        },
      },
    })

    if (userId) {
      LogRocket.identify(userId, { email, plan })
    }
  }, [userId, email, plan])

  return null
}

// Track custom events
LogRocket.track('Feature Used', { feature: 'Export PDF' })

// Capture exception with context
try {
  await riskyOperation()
} catch (error) {
  LogRocket.captureException(error as Error, {
    tags: { component: 'ExportButton' },
    extra: { orderId: '123' },
  })
  throw error
}`,
    },
    common_pitfalls: [
      {
        title: 'Initializing in Server Component',
        title_ko: 'Server Component에서 초기화',
        problem: 'Calling LogRocket.init in a Server Component throws "window is not defined" error',
        solution: 'Always initialize LogRocket inside useEffect in a Client Component with "use client" directive',
      },
      {
        title: 'Logging sensitive data in sessions',
        title_ko: '세션에 민감 데이터 기록',
        problem: 'Passwords, credit card numbers, and auth tokens may be captured in session replays by default',
        solution: 'Configure network request/response sanitizers and DOM scrubbing rules to redact sensitive fields',
        code: `LogRocket.init(APP_ID, {
  dom: {
    inputSanitizer: true, // input 값 자동 마스킹
  },
  network: {
    requestSanitizer: (req) => {
      req.headers['Authorization'] = '[REDACTED]'
      return req
    },
  },
})`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'sentry',
        tip: 'Combine LogRocket and Sentry: log the LogRocket session URL in Sentry error metadata to jump directly to the session replay from an error report',
        tip_ko: 'LogRocket 세션 URL을 Sentry 에러 메타데이터에 기록하여 에러 리포트에서 세션 리플레이로 바로 이동',
        code: `LogRocket.getSessionURL((sessionURL) => {
  Sentry.configureScope((scope) => {
    scope.setExtra('sessionURL', sessionURL)
  })
})`,
      },
      {
        with_service_slug: 'mixpanel',
        tip: 'Link LogRocket sessions to Mixpanel events by passing the LogRocket session URL as an event property',
        tip_ko: 'LogRocket 세션 URL을 Mixpanel 이벤트 속성으로 전달하여 이벤트와 세션 리플레이 연결',
      },
    ],
    pros: [
      { text: 'Pixel-perfect session replay with DOM recording', text_ko: '픽셀 완벽한 DOM 녹화 기반 세션 리플레이' },
      { text: 'Captures console logs, network requests, and Redux state', text_ko: '콘솔 로그·네트워크 요청·Redux 상태 캡처' },
      { text: 'Integrates with Sentry, Mixpanel, and Intercom', text_ko: 'Sentry·Mixpanel·Intercom과 통합 가능' },
    ],
    cons: [
      { text: 'Free plan limited to 1,000 sessions/month', text_ko: '무료 플랜 월 1,000 세션 제한' },
      { text: 'Privacy configuration needed to comply with GDPR', text_ko: 'GDPR 준수를 위한 개인정보 설정 필요' },
    ],
    api_key_url: 'https://app.logrocket.com',
    api_key_url_label: 'LogRocket Dashboard',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 14. Slack API
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.slack_api,
    quick_start: 'Slack Bolt for JavaScript로 슬랙 앱·봇을 만들고 메시지 수신·발송, 슬래시 커맨드, 인터랙티브 모달을 구현할 수 있습니다.',
    quick_start_en: 'Build Slack apps and bots with Slack Bolt for JavaScript to handle messages, slash commands, and interactive modals.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Slack Bolt SDK',
        title_ko: 'Slack Bolt SDK 설치',
        description: 'Install the official Slack Bolt framework for Node.js',
        description_ko: 'Slack Bolt Node.js 공식 프레임워크 설치',
        code_snippet: 'npm install @slack/bolt',
      },
      {
        step: 2,
        title: 'Create Slack App and get credentials',
        title_ko: 'Slack 앱 생성 및 자격증명 발급',
        description: 'Create an app at api.slack.com/apps, get Signing Secret from Basic Information and Bot Token from OAuth & Permissions',
        description_ko: 'api.slack.com/apps에서 앱 생성, Basic Information의 Signing Secret과 OAuth & Permissions의 Bot Token 확인',
        code_snippet: `SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx
SLACK_SIGNING_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`,
      },
      {
        step: 3,
        title: 'Initialize Bolt App and handle events',
        title_ko: 'Bolt App 초기화 및 이벤트 처리',
        description: 'Initialize the Bolt App and register listeners for messages and slash commands',
        description_ko: 'Bolt App 초기화 후 메시지·슬래시 커맨드 리스너 등록',
        code_snippet: `import { App } from '@slack/bolt'

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
})

// Message listener
app.message('hello', async ({ message, say }) => {
  if (message.subtype) return
  await say(\`안녕하세요, <@\${message.user}>!\`)
})

await app.start(3000)`,
      },
    ],
    code_examples: {
      typescript: `import { App, type BlockAction } from '@slack/bolt'

const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  socketMode: true, // Socket Mode: no public URL needed
  appToken: process.env.SLACK_APP_TOKEN!, // xapp- token for Socket Mode
})

// Slash command
app.command('/deploy', async ({ command, ack, respond }) => {
  await ack()
  const env = command.text.trim() || 'staging'
  await respond({
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: \`배포 중: *\${env}*\` },
      },
    ],
  })
})

// Interactive button click
app.action<BlockAction>('approve_button', async ({ body, ack, client }) => {
  await ack()
  await client.chat.update({
    channel: body.channel!.id,
    ts: body.message!.ts,
    text: '승인 완료',
  })
})

// Send message to channel (Incoming Webhook alternative)
async function notifyChannel(channel: string, text: string) {
  return app.client.chat.postMessage({ channel, text })
}

;(async () => await app.start())()`,
    },
    common_pitfalls: [
      {
        title: 'Acknowledgement timeout',
        title_ko: '응답 타임아웃',
        problem: 'Slack requires ack() within 3 seconds or the user sees an error',
        solution: 'Always call ack() immediately at the start of any handler, then perform async operations after',
        code: `app.command('/slow-operation', async ({ ack, respond }) => {
  await ack() // 즉시 응답 (3초 내)
  // 이후 비동기 작업 수행
  const result = await longRunningTask()
  await respond(result)
})`,
      },
      {
        title: 'Bot token vs user token confusion',
        title_ko: '봇 토큰·사용자 토큰 혼동',
        problem: 'Bot tokens (xoxb-) and user tokens (xoxp-) have different permission scopes',
        solution: 'Use Bot tokens for most operations. User tokens are only needed for acting on behalf of a user (e.g. posting as a specific user)',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Use Supabase Realtime to listen for database changes and push notifications to Slack channels via Bolt',
        tip_ko: 'Supabase Realtime으로 DB 변경을 감지하고 Bolt로 Slack 채널에 알림 발송',
      },
      {
        with_service_slug: 'sentry',
        tip: 'Configure Sentry Slack integration to receive error alerts in your team Slack channel for instant incident awareness',
        tip_ko: 'Sentry Slack 통합 설정으로 팀 Slack 채널에 에러 알림을 받아 즉각적인 인시던트 인지',
      },
    ],
    pros: [
      { text: 'Bolt framework simplifies event routing and middleware', text_ko: 'Bolt 프레임워크로 이벤트 라우팅·미들웨어 간소화' },
      { text: 'Socket Mode allows development without a public URL', text_ko: 'Socket Mode로 공개 URL 없이 개발 가능' },
      { text: 'Rich Block Kit UI for interactive messages', text_ko: 'Block Kit으로 인터랙티브 메시지 UI 구성 가능' },
    ],
    cons: [
      { text: 'App distribution requires Slack review for public apps', text_ko: '공개 앱 배포 시 Slack 심사 필요' },
      { text: 'Workspace-specific installation limits multi-tenant scenarios', text_ko: '워크스페이스별 설치로 멀티 테넌트 복잡' },
    ],
    api_key_url: 'https://api.slack.com/apps',
    api_key_url_label: 'Slack App Dashboard',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 15. Discord API
  // ──────────────────────────────────────────────────────────────────────────
  {
    service_id: S.discord_api,
    quick_start: 'Discord.js v14와 Bot Token으로 커맨드·이벤트 기반 Discord 봇을 빠르게 구축할 수 있습니다.',
    quick_start_en: 'Build event-driven Discord bots quickly with Discord.js v14 and a Bot Token.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Discord.js',
        title_ko: 'Discord.js 설치',
        description: 'Install discord.js v14 (requires Node.js v16.11.0+)',
        description_ko: 'discord.js v14 설치 (Node.js v16.11.0 이상 필요)',
        code_snippet: 'npm install discord.js',
      },
      {
        step: 2,
        title: 'Create bot application and get token',
        title_ko: '봇 애플리케이션 생성 및 토큰 발급',
        description: 'Create an application at discord.com/developers, add a Bot, and copy the token. Enable required Gateway Intents',
        description_ko: 'discord.com/developers에서 애플리케이션 생성 → Bot 추가 → 토큰 복사. 필요한 Gateway Intents 활성화',
        code_snippet: 'DISCORD_BOT_TOKEN=MTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      },
      {
        step: 3,
        title: 'Initialize client and register slash commands',
        title_ko: '클라이언트 초기화 및 슬래시 커맨드 등록',
        description: 'Create a Discord Client with required intents and listen for InteractionCreate events',
        description_ko: '필요한 Intents로 Discord Client 생성 후 InteractionCreate 이벤트 리슨',
        code_snippet: `import { Client, Events, GatewayIntentBits } from 'discord.js'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

client.once(Events.ClientReady, (c) => {
  console.log(\`Logged in as \${c.user.tag}\`)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!')
  }
})

await client.login(process.env.DISCORD_BOT_TOKEN)`,
      },
    ],
    code_examples: {
      typescript: `import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from 'discord.js'

// Register slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('status')
    .setDescription('서비스 상태 확인')
    .addStringOption((opt) =>
      opt.setName('service').setDescription('서비스 이름').setRequired(true)
    ),
].map((cmd) => cmd.toJSON())

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN!)
await rest.put(
  Routes.applicationGuildCommands(
    process.env.DISCORD_CLIENT_ID!,
    process.env.DISCORD_GUILD_ID!
  ),
  { body: commands }
)

// Bot client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
})

client.once(Events.ClientReady, (c) => console.log(\`Ready: \${c.user.tag}\`))

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  const { commandName } = interaction

  if (commandName === 'status') {
    const service = interaction.options.getString('service', true)
    await interaction.deferReply()
    // 서비스 상태 조회 후 응답
    await interaction.editReply(\`\${service}: 정상 운영 중\`)
  }
})

await client.login(process.env.DISCORD_BOT_TOKEN!)`,
    },
    common_pitfalls: [
      {
        title: 'Missing Privileged Gateway Intents',
        title_ko: 'Privileged Gateway Intents 미설정',
        problem: 'Bot cannot read message content or server member lists without enabling privileged intents',
        solution: 'Enable MESSAGE_CONTENT and GUILD_MEMBERS intents in Discord Developer Portal and add them to the Client constructor',
        code: `// Developer Portal에서 활성화 후 코드에도 추가
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Privileged Intent
    GatewayIntentBits.GuildMembers,   // Privileged Intent
  ],
})`,
      },
      {
        title: 'Registering slash commands on every startup',
        title_ko: '실행 시마다 슬래시 커맨드 재등록',
        problem: 'Discord rate-limits command registration; registering on every bot start triggers 429 errors',
        solution: 'Run command registration as a separate one-time deploy script, not on bot startup',
      },
      {
        title: 'Bot token exposed in client-side code',
        title_ko: '봇 토큰 클라이언트 코드 노출',
        problem: 'Discord Bot tokens give full control over the bot account',
        solution: 'Keep DISCORD_BOT_TOKEN strictly server-side. Never use NEXT_PUBLIC_ prefix',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Link Discord user IDs to Supabase profiles for role-based access control — grant app features based on Discord server roles',
        tip_ko: 'Discord 사용자 ID를 Supabase 프로필과 연결하여 Discord 서버 역할 기반 앱 기능 접근 제어',
      },
      {
        with_service_slug: 'slack-api',
        tip: 'Bridge important Discord events (new member join, bot commands) to Slack channels for team monitoring without switching apps',
        tip_ko: 'Discord 이벤트(신규 멤버 입장, 봇 커맨드)를 Slack 채널에 브리지하여 앱 전환 없이 팀 모니터링',
      },
    ],
    pros: [
      { text: 'Active community and extensive Discord.js documentation', text_ko: '활발한 커뮤니티와 풍부한 Discord.js 문서' },
      { text: 'Slash commands with built-in autocomplete and validation', text_ko: '자동완성·유효성 검사 내장 슬래시 커맨드' },
      { text: 'Webhook support for simple message posting without a bot', text_ko: '봇 없이 간단한 메시지 발송을 위한 웹훅 지원' },
    ],
    cons: [
      { text: 'Bot hosting requires persistent process (not serverless-friendly)', text_ko: '봇 호스팅에 지속적 프로세스 필요 (서버리스 비친화적)' },
      { text: 'API rate limits can be hit quickly in large servers', text_ko: '대형 서버에서 API 속도 제한에 빠르게 도달 가능' },
    ],
    api_key_url: 'https://discord.com/developers/applications',
    api_key_url_label: 'Discord Developer Portal',
  },
];
