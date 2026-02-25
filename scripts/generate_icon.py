"""
Linkmap Icon Generator
참조 이미지 기반: 중앙 노드 + 상단 3개 + 하단 2개 노드 연결
Light/Dark 버전 생성 + 모든 에셋 사이즈 자동 생성
"""
import os
import math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ── 경로 설정 ──
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(BASE_DIR, "img")
APP_DIR = os.path.join(BASE_DIR, "src", "app")
PUBLIC_DIR = os.path.join(BASE_DIR, "public")

# ── 캔버스 크기 (고해상도 작업 후 축소) ──
CANVAS = 1024
CENTER = CANVAS // 2
PADDING = 120  # 아이콘 영역 패딩


def lerp_color(c1, c2, t):
    """두 RGB(A) 색상 사이 보간"""
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))


def draw_rounded_rect(draw, xy, radius, fill):
    """둥근 사각형 그리기"""
    x0, y0, x1, y1 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def draw_gradient_rounded_rect(img, xy, radius, color_top, color_bottom):
    """그라데이션 둥근 사각형"""
    x0, y0, x1, y1 = xy
    w, h = x1 - x0, y1 - y0

    gradient = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    grad_draw = ImageDraw.Draw(gradient)

    for y in range(h):
        t = y / h
        color = lerp_color(color_top, color_bottom, t)
        grad_draw.line([(0, y), (w, y)], fill=color)

    # 마스크로 둥근 모서리 적용
    mask = Image.new('L', (w, h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, w, h], radius=radius, fill=255)

    gradient.putalpha(mask)
    img.paste(gradient, (x0, y0), gradient)


def draw_line_aa(img, start, end, color, width):
    """안티앨리어싱 선 그리기"""
    draw = ImageDraw.Draw(img)
    draw.line([start, end], fill=color, width=width)


def draw_circle_gradient(img, center, radius, color_top, color_bottom, border_color=None, border_width=0):
    """그라데이션 원 그리기"""
    cx, cy = center
    x0, y0 = cx - radius, cy - radius
    x1, y1 = cx + radius, cy + radius

    circle = Image.new('RGBA', (radius * 2, radius * 2), (0, 0, 0, 0))
    circ_draw = ImageDraw.Draw(circle)

    for y in range(radius * 2):
        t = y / (radius * 2)
        color = lerp_color(color_top, color_bottom, t)
        circ_draw.line([(0, y), (radius * 2, y)], fill=color)

    mask = Image.new('L', (radius * 2, radius * 2), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([0, 0, radius * 2 - 1, radius * 2 - 1], fill=255)

    circle.putalpha(mask)

    if border_color and border_width > 0:
        border_circle = Image.new('RGBA', (radius * 2, radius * 2), (0, 0, 0, 0))
        bc_draw = ImageDraw.Draw(border_circle)
        bc_draw.ellipse([0, 0, radius * 2 - 1, radius * 2 - 1], outline=border_color, width=border_width)
        circle = Image.alpha_composite(circle, border_circle)

    img.paste(circle, (x0, y0), circle)


def draw_diamond(img, center, width, height, color_top, color_bottom):
    """다이아몬드/플랫폼 형태"""
    cx, cy = center
    hw, hh = width // 2, height // 2

    diamond = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(diamond)

    points = [
        (hw, 0),           # top
        (width, hh),       # right
        (hw, height),      # bottom
        (0, hh),           # left
    ]
    d_draw.polygon(points, fill=color_top)

    # 하단 반 더 어둡게
    lower = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lower)
    lower_points = [
        (hw, hh),
        (width, hh),
        (hw, height),
        (0, hh),
    ]
    ld.polygon(lower_points, fill=color_bottom)
    diamond = Image.alpha_composite(diamond, lower)

    img.paste(diamond, (cx - hw, cy - hh), diamond)


def generate_icon(theme='light'):
    """아이콘 생성 - light 또는 dark 테마"""

    img = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))

    # ── 배경 그라데이션 색상 ──
    if theme == 'light':
        bg_top = (0, 140, 235, 255)       # 밝은 파랑
        bg_bottom = (25, 85, 210, 255)     # 진한 파랑
        node_color_top = (80, 200, 255, 255)   # 밝은 시안
        node_color_bot = (30, 120, 220, 255)   # 파랑
        center_color_top = (100, 210, 255, 255)
        center_color_bot = (40, 140, 230, 255)
        line_color = (180, 220, 255, 200)
        diamond_top = (100, 160, 240, 180)
        diamond_bot = (60, 110, 200, 200)
        center_border = (255, 255, 255, 100)
    else:
        bg_top = (15, 30, 60, 255)         # 어두운 네이비
        bg_bottom = (10, 20, 45, 255)      # 더 어두운 네이비
        node_color_top = (40, 180, 240, 255)
        node_color_bot = (20, 100, 200, 255)
        center_color_top = (60, 200, 250, 255)
        center_color_bot = (30, 130, 220, 255)
        line_color = (60, 140, 220, 180)
        diamond_top = (40, 100, 180, 160)
        diamond_bot = (25, 70, 150, 180)
        center_border = (100, 200, 255, 80)

    # ── 1. 배경 (둥근 사각형) ──
    corner_radius = int(CANVAS * 0.22)  # iOS 스타일
    draw_gradient_rounded_rect(
        img,
        [0, 0, CANVAS, CANVAS],
        corner_radius,
        bg_top,
        bg_bottom
    )

    # ── 2. 노드 위치 계산 ──
    # 중앙 노드
    center_x, center_y = CENTER, CENTER - 20
    center_radius = 85

    # 상단 3개 노드 (부채꼴 배치)
    top_radius_dist = 280  # 중앙에서의 거리
    top_nodes = []
    top_angles = [-110, -70, -20]  # 도 단위 (12시 = -90도)
    for angle_deg in top_angles:
        angle_rad = math.radians(angle_deg)
        nx = center_x + int(top_radius_dist * math.cos(angle_rad))
        ny = center_y + int(top_radius_dist * math.sin(angle_rad))
        top_nodes.append((nx, ny))

    # 하단 2개 노드
    bottom_radius_dist = 260
    bottom_nodes = []
    bottom_angles = [155, 30]  # 좌하단, 우하단
    for angle_deg in bottom_angles:
        angle_rad = math.radians(angle_deg)
        nx = center_x + int(bottom_radius_dist * math.cos(angle_rad))
        ny = center_y + int(bottom_radius_dist * math.sin(angle_rad))
        bottom_nodes.append((nx, ny))

    all_nodes = top_nodes + bottom_nodes
    small_radius = 42

    # ── 3. 연결선 그리기 (노드 아래에) ──
    line_layer = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    line_draw = ImageDraw.Draw(line_layer)
    line_width = 12

    for node in all_nodes:
        line_draw.line([(center_x, center_y), node], fill=line_color, width=line_width)

    # 약간의 글로우 효과
    glow = line_layer.filter(ImageFilter.GaussianBlur(radius=4))
    img = Image.alpha_composite(img, glow)
    img = Image.alpha_composite(img, line_layer)

    # ── 4. 다이아몬드 플랫폼 (중앙 노드 아래) ──
    diamond_y = center_y + center_radius + 35
    draw_diamond(img, (center_x, diamond_y), 200, 80, diamond_top, diamond_bot)

    # ── 5. 중앙 노드 그리기 ──
    draw_circle_gradient(
        img, (center_x, center_y), center_radius,
        center_color_top, center_color_bot,
        border_color=center_border, border_width=4
    )

    # 중앙 노드 하이라이트 (상단 반사)
    highlight = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(highlight)
    h_draw.ellipse(
        [center_x - center_radius + 20, center_y - center_radius + 10,
         center_x + center_radius - 20, center_y - 10],
        fill=(255, 255, 255, 40)
    )
    highlight = highlight.filter(ImageFilter.GaussianBlur(radius=15))
    img = Image.alpha_composite(img, highlight)

    # ── 6. 작은 노드들 그리기 ──
    for i, node in enumerate(all_nodes):
        # 각 노드 약간 다른 색조
        t = i / len(all_nodes)
        n_top = lerp_color(node_color_top[:3], (150, 230, 255), t) + (255,)
        n_bot = lerp_color(node_color_bot[:3], (20, 90, 200), t) + (255,)

        draw_circle_gradient(
            img, node, small_radius,
            n_top, n_bot,
            border_color=(255, 255, 255, 60), border_width=3
        )

    # ── 7. 전체 미세 글로우 ──
    glow_layer = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow_layer)
    g_draw.ellipse(
        [center_x - 180, center_y - 180, center_x + 180, center_y + 180],
        fill=(100, 200, 255, 20)
    )
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=60))
    img = Image.alpha_composite(img, glow_layer)

    return img


def generate_icon_only(theme='light'):
    """배경 없는 아이콘 (로고용, 투명 배경)"""
    img = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))

    if theme == 'light':
        node_color_top = (30, 130, 220, 255)
        node_color_bot = (25, 90, 190, 255)
        center_color_top = (35, 140, 230, 255)
        center_color_bot = (25, 100, 200, 255)
        line_color = (60, 140, 220, 220)
        diamond_top = (50, 120, 210, 200)
        diamond_bot = (35, 80, 170, 220)
        small_top = (80, 190, 250, 255)
        small_bot = (30, 120, 210, 255)
    else:
        node_color_top = (200, 230, 255, 255)
        node_color_bot = (180, 210, 240, 255)
        center_color_top = (220, 240, 255, 255)
        center_color_bot = (200, 225, 250, 255)
        line_color = (200, 220, 240, 200)
        diamond_top = (180, 210, 240, 180)
        diamond_bot = (160, 190, 220, 200)
        small_top = (200, 230, 255, 255)
        small_bot = (180, 210, 240, 255)

    center_x, center_y = CENTER, CENTER - 20
    center_radius = 85

    top_radius_dist = 280
    top_nodes = []
    for angle_deg in [-110, -70, -20]:
        angle_rad = math.radians(angle_deg)
        nx = center_x + int(top_radius_dist * math.cos(angle_rad))
        ny = center_y + int(top_radius_dist * math.sin(angle_rad))
        top_nodes.append((nx, ny))

    bottom_radius_dist = 260
    bottom_nodes = []
    for angle_deg in [155, 30]:
        angle_rad = math.radians(angle_deg)
        nx = center_x + int(bottom_radius_dist * math.cos(angle_rad))
        ny = center_y + int(bottom_radius_dist * math.sin(angle_rad))
        bottom_nodes.append((nx, ny))

    all_nodes = top_nodes + bottom_nodes
    small_radius = 42

    # 연결선
    line_draw = ImageDraw.Draw(img)
    for node in all_nodes:
        line_draw.line([(center_x, center_y), node], fill=line_color, width=12)

    # 다이아몬드
    diamond_y = center_y + center_radius + 35
    draw_diamond(img, (center_x, diamond_y), 200, 80, diamond_top, diamond_bot)

    # 중앙 노드
    draw_circle_gradient(img, (center_x, center_y), center_radius, center_color_top, center_color_bot)

    # 작은 노드들
    for i, node in enumerate(all_nodes):
        t = i / len(all_nodes)
        n_top = lerp_color(small_top[:3], (100, 200, 255), t) + (255,)
        n_bot = lerp_color(small_bot[:3], (20, 90, 200), t) + (255,)
        draw_circle_gradient(img, node, small_radius, n_top, n_bot)

    return img


def generate_logo_with_text(theme='light'):
    """텍스트 포함 로고 (OG 이미지용)"""
    icon = generate_icon_only(theme)

    # 아이콘을 400x400으로 축소
    icon_small = icon.resize((400, 400), Image.Resampling.LANCZOS)

    # OG 캔버스 (1200x630)
    if theme == 'light':
        bg_color = (248, 250, 252, 255)
    else:
        bg_color = (15, 23, 42, 255)

    canvas = Image.new('RGBA', (1200, 630), bg_color)

    # 아이콘 배치 (중앙 상단)
    icon_x = (1200 - 400) // 2
    icon_y = 40
    canvas.paste(icon_small, (icon_x, icon_y), icon_small)

    # "linkmap" 텍스트
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("arial.ttf", 72)
    except (OSError, IOError):
        font = ImageFont.load_default()

    text = "linkmap"
    if theme == 'light':
        text_color = (30, 60, 110, 255)
    else:
        text_color = (200, 220, 250, 255)

    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    text_x = (1200 - tw) // 2
    text_y = 460
    draw.text((text_x, text_y), text, fill=text_color, font=font)

    return canvas


def save_all_assets():
    """모든 아이콘 에셋 생성 및 저장"""

    os.makedirs(IMG_DIR, exist_ok=True)
    os.makedirs(APP_DIR, exist_ok=True)
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    print("=== Linkmap Icon Generator ===\n")

    # 1. 메인 아이콘 (Light - 앱 아이콘용)
    print("[1/8] Light 앱 아이콘 생성...")
    light_icon = generate_icon('light')
    light_icon.save(os.path.join(IMG_DIR, "linkmap_icon_light.png"), format='PNG')

    # 2. 다크 아이콘
    print("[2/8] Dark 앱 아이콘 생성...")
    dark_icon = generate_icon('dark')
    dark_icon.save(os.path.join(IMG_DIR, "linkmap_icon_dark.png"), format='PNG')

    # 3. Favicon (ICO - light 기반)
    print("[3/8] Favicon 생성...")
    favicon_sizes = [(16, 16), (32, 32), (48, 48)]
    light_icon.save(os.path.join(IMG_DIR, "linkmap_favicon.ico"), format='ICO', sizes=favicon_sizes)
    light_icon.save(os.path.join(APP_DIR, "favicon.ico"), format='ICO', sizes=favicon_sizes)

    # 4. Apple Touch Icon (180x180)
    print("[4/8] Apple Touch Icon 생성...")
    apple = light_icon.resize((180, 180), Image.Resampling.LANCZOS)
    apple.save(os.path.join(IMG_DIR, "linkmap_apple_icon.png"), format='PNG')
    apple.save(os.path.join(APP_DIR, "apple-icon.png"), format='PNG')

    # 5. Web Icon (192x192)
    print("[5/8] Web Icon 생성...")
    web = light_icon.resize((192, 192), Image.Resampling.LANCZOS)
    web.save(os.path.join(IMG_DIR, "linkmap_web_icon.png"), format='PNG')
    web.save(os.path.join(APP_DIR, "icon.png"), format='PNG')

    # 6. Logo icon (투명 배경, public용)
    print("[6/8] Logo Icons 생성...")
    logo_light = generate_icon_only('light')
    logo_light_512 = logo_light.resize((512, 512), Image.Resampling.LANCZOS)
    logo_light_512.save(os.path.join(PUBLIC_DIR, "logo-icon.png"), format='PNG')

    # public/logo.png (텍스트 포함 버전 - 배경 포함 아이콘)
    logo_full = generate_icon('light')
    logo_full_512 = logo_full.resize((512, 512), Image.Resampling.LANCZOS)
    logo_full_512.save(os.path.join(PUBLIC_DIR, "logo.png"), format='PNG')

    # Dark 로고
    logo_dark = generate_icon('dark')
    logo_dark_512 = logo_dark.resize((512, 512), Image.Resampling.LANCZOS)
    logo_dark_512.save(os.path.join(PUBLIC_DIR, "logo-dark.png"), format='PNG')

    # 7. OpenGraph Image (1200x630)
    print("[7/8] OG Image 생성...")
    og_light = generate_logo_with_text('light')
    og_light.save(os.path.join(IMG_DIR, "linkmap_og_image.png"), format='PNG')
    og_light.save(os.path.join(APP_DIR, "opengraph-image.png"), format='PNG')

    # 8. 소스 이미지 업데이트 (img/linkmap icon.png)
    print("[8/8] 소스 이미지 업데이트...")
    light_icon.save(os.path.join(IMG_DIR, "linkmap icon.png"), format='PNG')

    print("\n=== 완료! 생성된 파일 목록 ===")
    print(f"  img/linkmap_icon_light.png  (1024x1024)")
    print(f"  img/linkmap_icon_dark.png   (1024x1024)")
    print(f"  img/linkmap_favicon.ico     (16/32/48)")
    print(f"  img/linkmap_apple_icon.png  (180x180)")
    print(f"  img/linkmap_web_icon.png    (192x192)")
    print(f"  img/linkmap_og_image.png    (1200x630)")
    print(f"  img/linkmap icon.png        (1024x1024, 소스)")
    print(f"  src/app/favicon.ico")
    print(f"  src/app/apple-icon.png")
    print(f"  src/app/icon.png")
    print(f"  src/app/opengraph-image.png")
    print(f"  public/logo.png")
    print(f"  public/logo-dark.png")
    print(f"  public/logo-icon.png")


if __name__ == "__main__":
    save_all_assets()
