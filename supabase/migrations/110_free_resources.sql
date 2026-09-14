-- Migration 110: 무료배포 자료(free_resources) — 코드 하드코딩 → DB 이관 + 관리자 CRUD
--
-- 배경: /resources 자료는 src/data/resources/free-resources.ts 배열에 하드코딩돼 있어
-- 자료 1건을 추가하거나 영상 ID를 채울 때마다 배포가 필요했다. 관리자가 화면
-- (/admin/resources)에서 항목을 추가·발행할 수 있도록 테이블로 옮기고, 공개 페이지는
-- ISR(60s)로 읽는다. 기존 자료 1번은 아래 시드로 그대로 이관한다.
--
-- RLS:
--   · anon/authenticated: is_published = true 행만 SELECT (공개 페이지·sitemap·llms.txt)
--   · admin(profiles.is_admin): 전체 CRUD — API는 user-scoped 클라이언트로 쓰므로
--     이 정책이 실효 방어선이다 (API 레벨 isAdmin() 검사와 이중 방어).
--
-- JSONB 컬럼(hero/prompts/links)의 형태는 src/types/resource.ts 와
-- src/lib/validations/resource.ts(Zod)가 계약한다. DB는 배열/객체 여부만 CHECK한다.
--
-- 신규 함수 없음 → M108 default privileges(GRANT 명시) 고려 대상 없음.
-- updated_at 트리거는 M065의 공용 함수 update_updated_at_column()을 재사용한다.

CREATE TABLE IF NOT EXISTS public.free_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- URL 경로(/resources/<slug>)에 그대로 들어간다
  slug TEXT NOT NULL UNIQUE
    CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 80),
  -- 배포자료 번호("자료 N번") 겸 허브 정렬 기준
  sort_order INTEGER NOT NULL DEFAULT 1 CHECK (sort_order BETWEEN 1 AND 9999),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 1 AND 500),
  category TEXT NOT NULL CHECK (category IN ('prompt', 'tool', 'checklist')),
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  tags TEXT[] NOT NULL DEFAULT '{}',
  -- { headline, highlight, sub }
  hero JSONB NOT NULL DEFAULT '{"headline":"","highlight":"","sub":""}'::jsonb
    CHECK (jsonb_typeof(hero) = 'object'),
  -- null이면 허브 카드에 "영상 준비 중" 칩. 발행 후 ID만 채우면 유튜브 버튼·썸네일로 전환
  youtube_video_id TEXT
    CHECK (youtube_video_id IS NULL OR youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'),
  youtube_title TEXT NOT NULL DEFAULT '',
  -- [{ id, title, description, body, note? }]
  prompts JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(prompts) = 'array'),
  -- [{ label, description, href, external, primary? }]
  links JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(links) = 'array'),
  -- 오프라인 배포본. 반드시 /downloads/ 아래 — public/resources/ 는 라우트를 가린다
  download_href TEXT,
  closing TEXT NOT NULL DEFAULT '',
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_free_resources_published_order
  ON public.free_resources (is_published, sort_order);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.free_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published" ON public.free_resources;
CREATE POLICY "public_read_published" ON public.free_resources
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS "admin_full_access" ON public.free_resources;
CREATE POLICY "admin_full_access" ON public.free_resources
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- ─── updated_at 트리거 (M065 공용 함수 재사용) ───────────────────────────────

DROP TRIGGER IF EXISTS trg_free_resources_updated_at ON public.free_resources;
CREATE TRIGGER trg_free_resources_updated_at
  BEFORE UPDATE ON public.free_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── 시드: 기존 자료 1번 이관 (src/data/resources/free-resources.ts 2026-09-14 기준) ──
-- slug 충돌 시 건너뛴다 — 재실행해도 관리자가 화면에서 고친 내용을 덮어쓰지 않는다.

INSERT INTO public.free_resources (
  slug, sort_order, title, description, category, published_at, tags, hero,
  youtube_video_id, youtube_title, prompts, links, download_href, closing, is_published
) VALUES (
  'excel-merger-prompt',
  1,
  '엑셀 취합기 — 클로드 지시문 전문',
  '부서별 엑셀 파일을 하나로 합치는 도구를 코드 없이 만드는 지시문 전문. 클로드에 그대로 붙여넣고 파일 이름과 열 이름만 바꾸면 됩니다.',
  'prompt',
  '2026-08-18',
  ARRAY['엑셀 취합', '클로드', '사무직 자동화', '바이브코딩', '노코드 배포'],
  jsonb_build_object(
    'headline', '코드 몰라도,',
    'highlight', '3분 만에',
    'sub', '나만의 도구를 배포합니다'
  ),
  'ytTX-OmHspY',
  '클로드 엑셀 — 매달 하던 파일 취합, 클릭 한 번으로 끝냈습니다',
  jsonb_build_array(
    jsonb_build_object(
      'id', 'build',
      'title', '직접 만들고 싶다면 — 복사용 지시문',
      'description', '클로드에 아래를 그대로 붙여넣으세요. 어떤 파일이 오는지 · 어떤 결과를 원하는지 · 결과물의 형태, 세 가지가 전부 들어 있습니다.',
      'body', $prompt$엑셀 여러 개를 하나로 합치는 도구를 만들어 줘. 개발자가 아니어도 쓸 수 있어야 해.

[어떤 파일이 오는지]
- 매달 부서별로 엑셀 파일을 받아. .xlsx, .xls, .csv가 섞여 있어.
- 부서마다 열 이름과 머리글 위치가 조금씩 달라.
  어떤 파일은 맨 위에 제목이 두 줄 있어서, 머리글이 서너 번째 줄에서 시작해.
- 같은 뜻인데 표기가 조금 다른 열이 있어. 예: "품목코드"와 "품목 코드".
- 숫자가 글자로 저장된 칸이 있어. 예: 수량 칸의 "1,200".
- 시트가 두 개 이상인 파일도 있어.

[어떤 결과를 원하는지]
1. 파일 여러 개를 한꺼번에 끌어다 놓으면, 전부 한 표로 합쳐 줘.
2. 어느 파일에서 온 줄인지 알 수 있게 "출처파일" 열을 자동으로 붙여 줘.
3. 머리글이 첫 줄이 아니면 자동으로 찾아 줘.
4. 표기만 조금 다른 열은 같은 열로 합쳐 줘.
5. 글자로 저장된 숫자는 숫자로 바꿔 줘. 합계가 되도록.
6. 시트가 여러 개면 기본은 첫 시트만 쓰고, "모든 시트 합치기" 옵션도 넣어 줘.
7. 합치기 전에 미리보기로 행 수와 열이 맞는지 확인하게 해 주고,
   "엑셀로 내려받기" 버튼으로 저장하게 해 줘.
8. 제일 중요한 것 — 도구가 알아서 처리한 건 전부 "확인이 필요한 것" 목록으로
   화면에 보여 줘. (머리글을 몇 번째 줄로 봤는지 / 어떤 열들을 하나로 합쳤는지 /
   숫자로 바꾼 칸이 몇 개인지 / 안 쓴 시트가 있는지 / 이름 없는 열이 있는지)

[결과물의 형태]
- 인터넷 페이지처럼 보이는 HTML 파일 "하나"로 만들어 줘. 더블클릭하면 바로 열리게.
- 파일은 절대 서버로 보내지 마. 모든 처리는 브라우저 안에서만 끝나야 해.
- 회사 PC처럼 외부 연결이 막힌 곳에서도 돌아가야 해. 필요한 라이브러리는
  파일 안에 넣거나, "내 컴퓨터에 저장" 버튼으로 오프라인용 파일을
  따로 저장할 수 있게 해 줘.$prompt$,
      'note', '잠시 기다리면 HTML 파일이 하나 나옵니다. 내려받아서 더블클릭하면 끝. 파일 이름과 열 이름만 여러분 업무에 맞게 바꾸면 됩니다.'
    ),
    jsonb_build_object(
      'id', 'refine',
      'title', '한 번에 안 되면 — 이렇게 다듬으세요',
      'description', '여러분만 아는 함정을 한 줄씩 말해 주면 됩니다. 필요한 줄만 복사해서 쓰세요.',
      'body', $prompt$우리 자재팀 파일은 머리글이 4번째 줄이야. 자동 감지가 놓치면 4번째 줄부터 읽게 해 줘.
수량, 금액, 단가 열은 무조건 숫자로 취급해 줘. 글자가 섞여 있으면 알려 줘.
"거래처"와 "거래처명"도 같은 열로 합쳐 줘.
합친 결과에서 빈 줄과 소계 줄은 빼 줘. 몇 줄을 뺐는지 알려 줘.$prompt$
    )
  ),
  jsonb_build_array(
    jsonb_build_object(
      'label', '나만의 엑셀자동화 템플릿으로 배포하기',
      'description', '템플릿을 고르고 클릭 한 번이면 내 도구에 URL이 생깁니다. 무료 3개까지.',
      'href', '/sites/new?template=excel-merge',
      'external', false,
      'primary', true
    ),
    jsonb_build_object(
      'label', '완성본 먼저 써 보기',
      'description', '설치도 가입도 없이 링크만 열면 바로 씁니다. 파일은 브라우저 밖으로 나가지 않습니다.',
      'href', 'https://setlog-ntl.github.io/myexceltool/',
      'external', true
    )
  ),
  '/downloads/excel-merger-prompt.html',
  '다 만들었다면 Linkmap에 올려 URL 하나로 어디서든 여세요. 파일 처리는 똑같이 브라우저 안에서만 됩니다.',
  true
)
ON CONFLICT (slug) DO NOTHING;
