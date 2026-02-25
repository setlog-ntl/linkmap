"""
Linkmap Icon Candidates Generator
5가지 변형 아이콘을 각각 별도 폴더에 생성
- 중앙 원 크게
- 개별 노드 크기 차등 (다이나믹)
- 참조: 상단 3개 + 하단 2개 노드
"""
import os
import math
from PIL import Image, ImageDraw, ImageFilter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANDIDATES_DIR = os.path.join(BASE_DIR, "img", "icon_candidates")

CANVAS = 1024
CENTER = CANVAS // 2


def lerp_color(c1, c2, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))


def draw_gradient_rounded_rect(img, xy, radius, color_top, color_bottom):
    x0, y0, x1, y1 = xy
    w, h = x1 - x0, y1 - y0
    gradient = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    grad_draw = ImageDraw.Draw(gradient)
    for y in range(h):
        t = y / h
        color = lerp_color(color_top, color_bottom, t)
        grad_draw.line([(0, y), (w, y)], fill=color)
    mask = Image.new('L', (w, h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, w, h], radius=radius, fill=255)
    gradient.putalpha(mask)
    img.paste(gradient, (x0, y0), gradient)


def draw_circle_gradient(img, center, radius, color_top, color_bottom,
                         border_color=None, border_width=0, shadow=False):
    cx, cy = center
    d = radius * 2

    if shadow:
        shadow_layer = Image.new('RGBA', (d + 20, d + 20), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(shadow_layer)
        s_draw.ellipse([10, 10, d + 10, d + 10], fill=(0, 0, 0, 60))
        shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=8))
        img.paste(shadow_layer, (cx - radius - 10, cy - radius - 6), shadow_layer)

    circle = Image.new('RGBA', (d, d), (0, 0, 0, 0))
    circ_draw = ImageDraw.Draw(circle)
    for y in range(d):
        t = y / d
        color = lerp_color(color_top, color_bottom, t)
        circ_draw.line([(0, y), (d, y)], fill=color)
    mask = Image.new('L', (d, d), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse([0, 0, d - 1, d - 1], fill=255)
    circle.putalpha(mask)

    if border_color and border_width > 0:
        border_img = Image.new('RGBA', (d, d), (0, 0, 0, 0))
        b_draw = ImageDraw.Draw(border_img)
        b_draw.ellipse([0, 0, d - 1, d - 1], outline=border_color, width=border_width)
        circle = Image.alpha_composite(circle, border_img)

    img.paste(circle, (cx - radius, cy - radius), circle)


def draw_diamond(img, center, width, height, color_top, color_bottom):
    cx, cy = center
    hw, hh = width // 2, height // 2
    diamond = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(diamond)
    d_draw.polygon([(hw, 0), (width, hh), (hw, height), (0, hh)], fill=color_top)
    lower = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lower)
    ld.polygon([(hw, hh), (width, hh), (hw, height), (0, hh)], fill=color_bottom)
    diamond = Image.alpha_composite(diamond, lower)
    img.paste(diamond, (cx - hw, cy - hh), diamond)


def draw_highlight(img, cx, cy, radius):
    highlight = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(highlight)
    h_draw.ellipse(
        [cx - radius + 25, cy - radius + 12,
         cx + radius - 25, cy - int(radius * 0.3)],
        fill=(255, 255, 255, 50)
    )
    highlight = highlight.filter(ImageFilter.GaussianBlur(radius=12))
    return Image.alpha_composite(img, highlight)


# ═══════════════════════════════════════════════
# 변형 정의
# ═══════════════════════════════════════════════

def variant_1():
    """V1: Classic Dynamic -참조 이미지에 가장 가까운 버전
    중앙 원 크게, 노드 크기 대/중/소 혼합"""
    return {
        'name': 'v1_classic_dynamic',
        'desc': 'Classic Dynamic - 참조 이미지 기반, 노드 크기 차등',
        'center_radius': 110,
        'center_y_offset': -15,
        'top_nodes': [
            {'angle': -120, 'dist': 280, 'radius': 48},  # 좌상 - 대
            {'angle': -72,  'dist': 260, 'radius': 38},   # 중상 - 중
            {'angle': -25,  'dist': 290, 'radius': 44},   # 우상 - 대
        ],
        'bottom_nodes': [
            {'angle': 155, 'dist': 270, 'radius': 34},    # 좌하 - 소
            {'angle': 25,  'dist': 260, 'radius': 40},    # 우하 - 중
        ],
        'diamond': {'width': 220, 'height': 85, 'offset': 40},
        'line_width': 11,
        'bg_top': (0, 150, 240, 255),
        'bg_bottom': (20, 80, 210, 255),
    }


def variant_2():
    """V2: Bold Hub -중앙 원 매우 크게, 위성 노드 작게"""
    return {
        'name': 'v2_bold_hub',
        'desc': 'Bold Hub -중앙 허브 강조, 위성 노드 소형화',
        'center_radius': 130,
        'center_y_offset': -10,
        'top_nodes': [
            {'angle': -125, 'dist': 300, 'radius': 36},
            {'angle': -75,  'dist': 270, 'radius': 42},
            {'angle': -20,  'dist': 310, 'radius': 30},
        ],
        'bottom_nodes': [
            {'angle': 160, 'dist': 285, 'radius': 38},
            {'angle': 20,  'dist': 275, 'radius': 34},
        ],
        'diamond': {'width': 250, 'height': 95, 'offset': 42},
        'line_width': 10,
        'bg_top': (10, 130, 230, 255),
        'bg_bottom': (15, 65, 190, 255),
    }


def variant_3():
    """V3: Energetic Scatter -넓게 퍼진 비대칭, 크기 차이 극대화"""
    return {
        'name': 'v3_energetic_scatter',
        'desc': 'Energetic Scatter -비대칭 배치, 크기 차이 극대화',
        'center_radius': 105,
        'center_y_offset': -20,
        'top_nodes': [
            {'angle': -130, 'dist': 310, 'radius': 52},   # 좌상 - 특대
            {'angle': -78,  'dist': 250, 'radius': 32},   # 중상 - 소
            {'angle': -15,  'dist': 300, 'radius': 45},   # 우상 - 대
        ],
        'bottom_nodes': [
            {'angle': 150, 'dist': 290, 'radius': 28},    # 좌하 - 특소
            {'angle': 35,  'dist': 280, 'radius': 50},    # 우하 - 특대
        ],
        'diamond': {'width': 210, 'height': 80, 'offset': 38},
        'line_width': 10,
        'bg_top': (0, 160, 245, 255),
        'bg_bottom': (30, 90, 220, 255),
    }


def variant_4():
    """V4: Orbital Flow -궤도형, 노드가 흐르는 느낌"""
    return {
        'name': 'v4_orbital_flow',
        'desc': 'Orbital Flow -궤도 배치, 유기적 흐름',
        'center_radius': 115,
        'center_y_offset': -10,
        'top_nodes': [
            {'angle': -115, 'dist': 260, 'radius': 44},
            {'angle': -65,  'dist': 290, 'radius': 50},   # 가장 큰 위성
            {'angle': -18,  'dist': 270, 'radius': 36},
        ],
        'bottom_nodes': [
            {'angle': 162, 'dist': 250, 'radius': 40},
            {'angle': 30,  'dist': 290, 'radius': 32},
        ],
        'diamond': {'width': 230, 'height': 88, 'offset': 40},
        'line_width': 12,
        'bg_top': (5, 140, 235, 255),
        'bg_bottom': (10, 70, 200, 255),
    }


def variant_5():
    """V5: Tight Cluster -밀집형, 중앙 원 크고 노드 가까이"""
    return {
        'name': 'v5_tight_cluster',
        'desc': 'Tight Cluster -밀집 배치, 응집력 강조',
        'center_radius': 120,
        'center_y_offset': -15,
        'top_nodes': [
            {'angle': -118, 'dist': 240, 'radius': 46},
            {'angle': -70,  'dist': 230, 'radius': 40},
            {'angle': -28,  'dist': 250, 'radius': 52},   # 가장 큰 위성
        ],
        'bottom_nodes': [
            {'angle': 155, 'dist': 235, 'radius': 36},
            {'angle': 28,  'dist': 245, 'radius': 42},
        ],
        'diamond': {'width': 240, 'height': 90, 'offset': 38},
        'line_width': 13,
        'bg_top': (0, 145, 238, 255),
        'bg_bottom': (25, 75, 205, 255),
    }


# ═══════════════════════════════════════════════
# 렌더링 엔진
# ═══════════════════════════════════════════════

def render_icon(v, theme='light'):
    img = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))

    # 테마 색상
    if theme == 'light':
        bg_top = v['bg_top']
        bg_bottom = v['bg_bottom']
        node_colors = [
            ((90, 210, 255, 255), (35, 130, 225, 255)),    # 밝은 시안→파랑
            ((60, 190, 250, 255), (25, 110, 210, 255)),    # 중간 시안
            ((110, 220, 255, 255), (45, 150, 235, 255)),   # 연한 시안
            ((40, 170, 240, 255), (20, 95, 200, 255)),     # 진한 시안
            ((80, 200, 252, 255), (30, 120, 218, 255)),    # 기본 시안
        ]
        center_top = (110, 220, 255, 255)
        center_bot = (40, 145, 235, 255)
        line_color = (180, 225, 255, 190)
        diamond_top = (110, 170, 245, 170)
        diamond_bot = (65, 115, 210, 200)
        center_border = (255, 255, 255, 90)
        node_border = (255, 255, 255, 60)
    else:
        bg_top = (18, 32, 65, 255)
        bg_bottom = (10, 20, 48, 255)
        node_colors = [
            ((50, 190, 245, 255), (25, 110, 210, 255)),
            ((35, 170, 235, 255), (18, 95, 195, 255)),
            ((65, 205, 250, 255), (30, 130, 225, 255)),
            ((28, 155, 228, 255), (15, 85, 185, 255)),
            ((45, 185, 242, 255), (22, 105, 205, 255)),
        ]
        center_top = (70, 210, 255, 255)
        center_bot = (30, 135, 225, 255)
        line_color = (55, 140, 225, 170)
        diamond_top = (45, 105, 185, 155)
        diamond_bot = (28, 75, 155, 180)
        center_border = (110, 210, 255, 75)
        node_border = (90, 180, 240, 50)

    # 1. 배경
    corner_radius = int(CANVAS * 0.22)
    draw_gradient_rounded_rect(img, [0, 0, CANVAS, CANVAS], corner_radius, bg_top, bg_bottom)

    # 2. 노드 위치 계산
    cx = CENTER
    cy = CENTER + v['center_y_offset']
    cr = v['center_radius']

    all_nodes = []
    for node_def in v['top_nodes'] + v['bottom_nodes']:
        angle_rad = math.radians(node_def['angle'])
        nx = cx + int(node_def['dist'] * math.cos(angle_rad))
        ny = cy + int(node_def['dist'] * math.sin(angle_rad))
        all_nodes.append((nx, ny, node_def['radius']))

    # 3. 연결선 (글로우 효과 포함)
    line_layer = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    line_draw = ImageDraw.Draw(line_layer)
    lw = v['line_width']
    for (nx, ny, _) in all_nodes:
        line_draw.line([(cx, cy), (nx, ny)], fill=line_color, width=lw)

    glow = line_layer.filter(ImageFilter.GaussianBlur(radius=5))
    img = Image.alpha_composite(img, glow)
    img = Image.alpha_composite(img, line_layer)

    # 4. 다이아몬드
    dm = v['diamond']
    diamond_y = cy + cr + dm['offset']
    draw_diamond(img, (cx, diamond_y), dm['width'], dm['height'], diamond_top, diamond_bot)

    # 5. 중앙 노드 (그림자 + 그라데이션 + 하이라이트)
    draw_circle_gradient(img, (cx, cy), cr, center_top, center_bot,
                         border_color=center_border, border_width=4, shadow=True)
    img = draw_highlight(img, cx, cy, cr)

    # 6. 작은 노드들 (각각 다른 크기와 색상)
    for i, (nx, ny, nr) in enumerate(all_nodes):
        ct, cb = node_colors[i % len(node_colors)]
        draw_circle_gradient(img, (nx, ny), nr, ct, cb,
                             border_color=node_border, border_width=3, shadow=True)

    # 7. 글로우 오버레이
    glow_layer = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow_layer)
    g_draw.ellipse([cx - 200, cy - 200, cx + 200, cy + 200], fill=(100, 200, 255, 15))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=50))
    img = Image.alpha_composite(img, glow_layer)

    return img


def save_variant(variant_fn, folder_name):
    v = variant_fn()
    out_dir = os.path.join(CANDIDATES_DIR, folder_name)
    os.makedirs(out_dir, exist_ok=True)

    # Light 1024
    light = render_icon(v, 'light')
    light.save(os.path.join(out_dir, "icon_light_1024.png"), format='PNG')

    # Dark 1024
    dark = render_icon(v, 'dark')
    dark.save(os.path.join(out_dir, "icon_dark_1024.png"), format='PNG')

    # 192x192 preview
    light_sm = light.resize((192, 192), Image.Resampling.LANCZOS)
    light_sm.save(os.path.join(out_dir, "icon_light_192.png"), format='PNG')

    dark_sm = dark.resize((192, 192), Image.Resampling.LANCZOS)
    dark_sm.save(os.path.join(out_dir, "icon_dark_192.png"), format='PNG')

    # 설명 파일
    with open(os.path.join(out_dir, "README.txt"), 'w', encoding='utf-8') as f:
        f.write(f"=== {v['name']} ===\n")
        f.write(f"{v['desc']}\n\n")
        f.write(f"Center radius: {v['center_radius']}px\n")
        f.write(f"Top nodes: {len(v['top_nodes'])}개\n")
        for i, n in enumerate(v['top_nodes']):
            f.write(f"  Top {i+1}: angle={n['angle']}°, dist={n['dist']}px, radius={n['radius']}px\n")
        f.write(f"Bottom nodes: {len(v['bottom_nodes'])}개\n")
        for i, n in enumerate(v['bottom_nodes']):
            f.write(f"  Bottom {i+1}: angle={n['angle']}°, dist={n['dist']}px, radius={n['radius']}px\n")
        f.write(f"Line width: {v['line_width']}px\n")
        f.write(f"Diamond: {v['diamond']['width']}x{v['diamond']['height']}px\n")

    print(f"  [{folder_name}] {v['desc']}")


def main():
    os.makedirs(CANDIDATES_DIR, exist_ok=True)

    print("=== Linkmap Icon Candidates ===\n")
    print(f"Output: {CANDIDATES_DIR}\n")

    variants = [
        (variant_1, "v1"),
        (variant_2, "v2"),
        (variant_3, "v3"),
        (variant_4, "v4"),
        (variant_5, "v5"),
    ]

    for fn, folder in variants:
        save_variant(fn, folder)

    print(f"\n=== 완료! 5개 변형 생성됨 ===")
    print(f"각 폴더에 light/dark 1024px + 192px 프리뷰 포함")
    print(f"\n폴더 목록:")
    for _, folder in variants:
        v = eval(f"{folder.replace('v', 'variant_')}")()
        print(f"  img/icon_candidates/{folder}/  →  {v['desc']}")


if __name__ == "__main__":
    main()
