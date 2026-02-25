"""
Linkmap Icon V6~V8 Generator
V6: 참조 이미지 최대 반영
V7: 참조 기반 + 다이나믹 노드 크기
V8: 참조 기반 + 컴팩트 응집형
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


def draw_circle_gradient(img, center, radius, color_top, color_bottom,
                         border_color=None, border_width=0, shadow=False):
    cx, cy = center
    d = radius * 2
    if shadow:
        s_layer = Image.new('RGBA', (d + 24, d + 24), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(s_layer)
        s_draw.ellipse([12, 14, d + 12, d + 14], fill=(0, 0, 0, 50))
        s_layer = s_layer.filter(ImageFilter.GaussianBlur(radius=10))
        img.paste(s_layer, (cx - radius - 12, cy - radius - 10), s_layer)

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
        b_img = Image.new('RGBA', (d, d), (0, 0, 0, 0))
        b_draw = ImageDraw.Draw(b_img)
        b_draw.ellipse([0, 0, d - 1, d - 1], outline=border_color, width=border_width)
        circle = Image.alpha_composite(circle, b_img)
    img.paste(circle, (cx - radius, cy - radius), circle)


def draw_diamond(img, center, width, height, color_top, color_bottom, outline_color=None):
    cx, cy = center
    hw, hh = width // 2, height // 2
    diamond = Image.new('RGBA', (width + 4, height + 4), (0, 0, 0, 0))
    d_draw = ImageDraw.Draw(diamond)
    ox, oy = 2, 2
    pts_full = [(hw + ox, oy), (width + ox, hh + oy), (hw + ox, height + oy), (ox, hh + oy)]
    d_draw.polygon(pts_full, fill=color_top)
    pts_lower = [(hw + ox, hh + oy), (width + ox, hh + oy), (hw + ox, height + oy), (ox, hh + oy)]
    lower = Image.new('RGBA', (width + 4, height + 4), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lower)
    ld.polygon(pts_lower, fill=color_bottom)
    diamond = Image.alpha_composite(diamond, lower)
    if outline_color:
        ol = Image.new('RGBA', (width + 4, height + 4), (0, 0, 0, 0))
        old = ImageDraw.Draw(ol)
        old.polygon(pts_full, outline=outline_color, width=2)
        diamond = Image.alpha_composite(diamond, ol)
    img.paste(diamond, (cx - hw - 2, cy - hh - 2), diamond)


def draw_diagonal_gradient_bg(img, c_tl, c_br, corner_radius):
    """대각선 그라데이션 배경 (좌상 -> 우하)"""
    w, h = CANVAS, CANVAS
    gradient = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    for y in range(h):
        for x in range(w):
            # 대각선 보간: (x+y) / (w+h)
            t = (x + y) / (w + h)
            r = int(c_tl[0] + (c_br[0] - c_tl[0]) * t)
            g = int(c_tl[1] + (c_br[1] - c_tl[1]) * t)
            b = int(c_tl[2] + (c_br[2] - c_tl[2]) * t)
            gradient.putpixel((x, y), (r, g, b, 255))
    mask = Image.new('L', (w, h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, w, h], radius=corner_radius, fill=255)
    gradient.putalpha(mask)
    img.paste(gradient, (0, 0), gradient)


def draw_diagonal_gradient_bg_fast(img, c_tl, c_tr, c_bl, c_br, corner_radius):
    """4-corner 대각선 그라데이션 (빠른 라인 방식)"""
    w, h = CANVAS, CANVAS
    gradient = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    grad_draw = ImageDraw.Draw(gradient)
    for y in range(h):
        ty = y / h
        left_color = lerp_color(c_tl, c_bl, ty)
        right_color = lerp_color(c_tr, c_br, ty)
        for x in range(w):
            tx = x / w
            color = lerp_color(left_color, right_color, tx)
            gradient.putpixel((x, y), color + (255,))
    mask = Image.new('L', (w, h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, w, h], radius=corner_radius, fill=255)
    gradient.putalpha(mask)
    img.paste(gradient, (0, 0), gradient)


def draw_vertical_gradient_bg(img, c_top, c_bottom, corner_radius):
    w, h = CANVAS, CANVAS
    gradient = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    grad_draw = ImageDraw.Draw(gradient)
    for y in range(h):
        t = y / h
        color = lerp_color(c_top, c_bottom, t)
        grad_draw.line([(0, y), (w, y)], fill=color + (255,))
    mask = Image.new('L', (w, h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, w, h], radius=corner_radius, fill=255)
    gradient.putalpha(mask)
    img.paste(gradient, (0, 0), gradient)


def draw_highlight(img, cx, cy, radius, intensity=50):
    highlight = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(highlight)
    h_draw.ellipse(
        [cx - int(radius * 0.65), cy - int(radius * 0.85),
         cx + int(radius * 0.65), cy - int(radius * 0.15)],
        fill=(255, 255, 255, intensity)
    )
    highlight = highlight.filter(ImageFilter.GaussianBlur(radius=15))
    return Image.alpha_composite(img, highlight)


# ===================================================
# V6: 참조 이미지 최대 반영
# ===================================================
def render_v6(theme='light'):
    img = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    corner_radius = int(CANVAS * 0.22)

    if theme == 'light':
        # 참조: 좌상 밝은 시안 -> 우하 진한 블루 (대각선)
        draw_diagonal_gradient_bg_fast(
            img,
            c_tl=(30, 190, 240),   # 좌상: 밝은 시안
            c_tr=(10, 150, 230),   # 우상: 중간 블루
            c_bl=(20, 130, 225),   # 좌하: 중간 블루
            c_br=(15, 70, 200),    # 우하: 진한 블루
            corner_radius=corner_radius
        )
        center_top = (120, 215, 255, 255)
        center_bot = (50, 155, 240, 255)
        center_border = (255, 255, 255, 110)
        node_top = (85, 200, 255, 255)
        node_bot = (35, 135, 230, 255)
        node_border = (255, 255, 255, 70)
        line_color = (200, 230, 255, 170)
        diamond_top = (120, 175, 245, 160)
        diamond_bot = (70, 125, 215, 190)
        diamond_outline = (180, 210, 250, 80)
    else:
        draw_diagonal_gradient_bg_fast(
            img,
            c_tl=(22, 38, 72),
            c_tr=(16, 28, 58),
            c_bl=(14, 26, 55),
            c_br=(8, 18, 42),
            corner_radius=corner_radius
        )
        center_top = (75, 215, 255, 255)
        center_bot = (30, 140, 230, 255)
        center_border = (120, 210, 255, 90)
        node_top = (55, 195, 250, 255)
        node_bot = (22, 115, 215, 255)
        node_border = (100, 190, 245, 55)
        line_color = (60, 145, 230, 155)
        diamond_top = (50, 110, 195, 140)
        diamond_bot = (30, 80, 165, 170)
        diamond_outline = (80, 150, 220, 60)

    # 참조 이미지 노드 배치 (최대한 충실하게)
    cx, cy = CENTER, CENTER - 10
    cr = 105  # 중앙 원

    # 참조 이미지 각도/거리 분석:
    # 좌상(10시): -135도, 중상(12시): -78도, 우(2시방향): -18도
    # 좌하(8시): 200도(=-160), 우하(4시): 35도
    nodes = [
        {'angle': -135, 'dist': 275, 'radius': 44},  # 좌상 - 약간 큰
        {'angle': -78,  'dist': 265, 'radius': 40},   # 중상
        {'angle': -18,  'dist': 285, 'radius': 46},   # 우측 - 큰
        {'angle': -200, 'dist': 270, 'radius': 38},   # 좌하 - 약간 작은
        {'angle': 35,   'dist': 265, 'radius': 42},   # 우하
    ]

    node_positions = []
    for n in nodes:
        rad = math.radians(n['angle'])
        nx = cx + int(n['dist'] * math.cos(rad))
        ny = cy + int(n['dist'] * math.sin(rad))
        node_positions.append((nx, ny, n['radius']))

    # 연결선
    line_layer = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    ld = ImageDraw.Draw(line_layer)
    for (nx, ny, _) in node_positions:
        ld.line([(cx, cy), (nx, ny)], fill=line_color, width=10)
    glow = line_layer.filter(ImageFilter.GaussianBlur(radius=3))
    img = Image.alpha_composite(img, glow)
    img = Image.alpha_composite(img, line_layer)

    # 다이아몬드
    diamond_y = cy + cr + 38
    draw_diamond(img, (cx, diamond_y), 215, 82, diamond_top, diamond_bot, diamond_outline)

    # 중앙 노드
    draw_circle_gradient(img, (cx, cy), cr, center_top, center_bot,
                         border_color=center_border, border_width=4, shadow=True)
    img = draw_highlight(img, cx, cy, cr, 45)

    # 위성 노드
    for i, (nx, ny, nr) in enumerate(node_positions):
        # 각 노드 살짝 다른 색조
        t_shift = i * 0.08
        nt = lerp_color(node_top[:3], (130, 225, 255), t_shift) + (255,)
        nb = lerp_color(node_bot[:3], (25, 110, 215), t_shift) + (255,)
        draw_circle_gradient(img, (nx, ny), nr, nt, nb,
                             border_color=node_border, border_width=2, shadow=True)

    # 글로우
    gl = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gl)
    gd.ellipse([cx - 180, cy - 180, cx + 180, cy + 180], fill=(100, 200, 255, 12))
    gl = gl.filter(ImageFilter.GaussianBlur(radius=45))
    img = Image.alpha_composite(img, gl)

    return img


# ===================================================
# V7: 참조 기반 + 더 다이나믹한 크기 차이
# ===================================================
def render_v7(theme='light'):
    img = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    corner_radius = int(CANVAS * 0.22)

    if theme == 'light':
        draw_diagonal_gradient_bg_fast(
            img,
            c_tl=(20, 180, 245),
            c_tr=(5, 140, 235),
            c_bl=(15, 120, 220),
            c_br=(10, 60, 195),
            corner_radius=corner_radius
        )
        center_top = (115, 218, 255, 255)
        center_bot = (45, 150, 238, 255)
        center_border = (255, 255, 255, 120)
        line_color = (195, 228, 255, 175)
        diamond_top = (115, 170, 242, 165)
        diamond_bot = (68, 120, 212, 195)
        diamond_outline = (175, 208, 248, 85)
    else:
        draw_diagonal_gradient_bg_fast(
            img,
            c_tl=(20, 36, 70),
            c_tr=(14, 26, 56),
            c_bl=(12, 24, 52),
            c_br=(7, 16, 40),
            corner_radius=corner_radius
        )
        center_top = (70, 212, 255, 255)
        center_bot = (28, 138, 228, 255)
        center_border = (115, 208, 255, 85)
        line_color = (58, 142, 228, 160)
        diamond_top = (48, 108, 192, 145)
        diamond_bot = (28, 78, 162, 175)
        diamond_outline = (78, 148, 218, 55)

    cx, cy = CENTER, CENTER - 12
    cr = 115  # 더 큰 중앙

    # 크기 차이 극대화
    nodes = [
        {'angle': -132, 'dist': 285, 'radius': 54},   # 좌상 - 특대
        {'angle': -75,  'dist': 255, 'radius': 34},    # 중상 - 소
        {'angle': -15,  'dist': 295, 'radius': 48},    # 우측 - 대
        {'angle': -205, 'dist': 275, 'radius': 30},    # 좌하 - 특소
        {'angle': 38,   'dist': 270, 'radius': 44},    # 우하 - 중대
    ]

    node_positions = []
    for n in nodes:
        rad = math.radians(n['angle'])
        nx = cx + int(n['dist'] * math.cos(rad))
        ny = cy + int(n['dist'] * math.sin(rad))
        node_positions.append((nx, ny, n['radius']))

    line_layer = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    ld = ImageDraw.Draw(line_layer)
    for (nx, ny, _) in node_positions:
        ld.line([(cx, cy), (nx, ny)], fill=line_color, width=10)
    glow = line_layer.filter(ImageFilter.GaussianBlur(radius=3))
    img = Image.alpha_composite(img, glow)
    img = Image.alpha_composite(img, line_layer)

    diamond_y = cy + cr + 36
    draw_diamond(img, (cx, diamond_y), 230, 88, diamond_top, diamond_bot, diamond_outline)

    draw_circle_gradient(img, (cx, cy), cr, center_top, center_bot,
                         border_color=center_border, border_width=5, shadow=True)
    img = draw_highlight(img, cx, cy, cr, 50)

    node_colors_light = [
        ((100, 215, 255, 255), (40, 140, 235, 255)),
        ((75, 195, 250, 255), (30, 125, 225, 255)),
        ((120, 225, 255, 255), (50, 155, 240, 255)),
        ((60, 185, 248, 255), (22, 110, 218, 255)),
        ((90, 205, 252, 255), (35, 130, 228, 255)),
    ]
    node_colors_dark = [
        ((60, 200, 250, 255), (28, 118, 218, 255)),
        ((42, 178, 242, 255), (18, 102, 205, 255)),
        ((72, 210, 252, 255), (35, 135, 230, 255)),
        ((35, 168, 238, 255), (14, 92, 195, 255)),
        ((52, 192, 248, 255), (25, 112, 215, 255)),
    ]

    colors = node_colors_light if theme == 'light' else node_colors_dark
    for i, (nx, ny, nr) in enumerate(node_positions):
        ct, cb = colors[i]
        bdr = (255, 255, 255, 65) if theme == 'light' else (95, 185, 242, 50)
        draw_circle_gradient(img, (nx, ny), nr, ct, cb,
                             border_color=bdr, border_width=2, shadow=True)

    gl = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gl)
    gd.ellipse([cx - 190, cy - 190, cx + 190, cy + 190], fill=(100, 200, 255, 14))
    gl = gl.filter(ImageFilter.GaussianBlur(radius=48))
    img = Image.alpha_composite(img, gl)

    return img


# ===================================================
# V8: 참조 기반 + 컴팩트 응집, 두꺼운 선
# ===================================================
def render_v8(theme='light'):
    img = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    corner_radius = int(CANVAS * 0.22)

    if theme == 'light':
        draw_diagonal_gradient_bg_fast(
            img,
            c_tl=(35, 195, 248),
            c_tr=(15, 155, 235),
            c_bl=(22, 135, 228),
            c_br=(12, 65, 198),
            corner_radius=corner_radius
        )
        center_top = (125, 220, 255, 255)
        center_bot = (52, 158, 242, 255)
        center_border = (255, 255, 255, 130)
        line_color = (210, 235, 255, 185)
        diamond_top = (125, 178, 248, 170)
        diamond_bot = (75, 130, 218, 200)
        diamond_outline = (185, 215, 252, 90)
    else:
        draw_diagonal_gradient_bg_fast(
            img,
            c_tl=(24, 42, 78),
            c_tr=(18, 30, 62),
            c_bl=(15, 28, 58),
            c_br=(8, 18, 44),
            corner_radius=corner_radius
        )
        center_top = (78, 218, 255, 255)
        center_bot = (32, 142, 232, 255)
        center_border = (125, 215, 255, 95)
        line_color = (65, 150, 235, 168)
        diamond_top = (55, 115, 198, 150)
        diamond_bot = (32, 82, 168, 178)
        diamond_outline = (85, 155, 225, 65)

    cx, cy = CENTER, CENTER - 8
    cr = 108

    # 컴팩트 + 적당한 크기 변화
    nodes = [
        {'angle': -130, 'dist': 245, 'radius': 48},
        {'angle': -76,  'dist': 235, 'radius': 42},
        {'angle': -20,  'dist': 255, 'radius': 50},   # 가장 큰 위성
        {'angle': -198, 'dist': 240, 'radius': 38},
        {'angle': 32,   'dist': 248, 'radius': 44},
    ]

    node_positions = []
    for n in nodes:
        rad = math.radians(n['angle'])
        nx = cx + int(n['dist'] * math.cos(rad))
        ny = cy + int(n['dist'] * math.sin(rad))
        node_positions.append((nx, ny, n['radius']))

    line_layer = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    ld = ImageDraw.Draw(line_layer)
    for (nx, ny, _) in node_positions:
        ld.line([(cx, cy), (nx, ny)], fill=line_color, width=13)
    glow = line_layer.filter(ImageFilter.GaussianBlur(radius=4))
    img = Image.alpha_composite(img, glow)
    img = Image.alpha_composite(img, line_layer)

    diamond_y = cy + cr + 35
    draw_diamond(img, (cx, diamond_y), 225, 85, diamond_top, diamond_bot, diamond_outline)

    draw_circle_gradient(img, (cx, cy), cr, center_top, center_bot,
                         border_color=center_border, border_width=5, shadow=True)
    img = draw_highlight(img, cx, cy, cr, 55)

    node_colors_light = [
        ((95, 208, 255, 255), (38, 138, 232, 255)),
        ((80, 198, 252, 255), (32, 128, 228, 255)),
        ((115, 222, 255, 255), (48, 152, 238, 255)),
        ((65, 188, 250, 255), (25, 115, 220, 255)),
        ((88, 202, 254, 255), (35, 132, 230, 255)),
    ]
    node_colors_dark = [
        ((58, 198, 248, 255), (26, 116, 216, 255)),
        ((45, 182, 244, 255), (20, 105, 208, 255)),
        ((68, 208, 252, 255), (32, 132, 228, 255)),
        ((38, 172, 240, 255), (16, 95, 198, 255)),
        ((50, 190, 246, 255), (24, 110, 212, 255)),
    ]

    colors = node_colors_light if theme == 'light' else node_colors_dark
    for i, (nx, ny, nr) in enumerate(node_positions):
        ct, cb = colors[i]
        bdr = (255, 255, 255, 72) if theme == 'light' else (100, 188, 245, 55)
        draw_circle_gradient(img, (nx, ny), nr, ct, cb,
                             border_color=bdr, border_width=3, shadow=True)

    gl = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gl)
    gd.ellipse([cx - 175, cy - 175, cx + 175, cy + 175], fill=(105, 205, 255, 16))
    gl = gl.filter(ImageFilter.GaussianBlur(radius=42))
    img = Image.alpha_composite(img, gl)

    return img


# ===================================================
# Main
# ===================================================
def save_variant(render_fn, folder_name, desc):
    out_dir = os.path.join(CANDIDATES_DIR, folder_name)
    os.makedirs(out_dir, exist_ok=True)

    light = render_fn('light')
    light.save(os.path.join(out_dir, "icon_light_1024.png"), format='PNG')

    dark = render_fn('dark')
    dark.save(os.path.join(out_dir, "icon_dark_1024.png"), format='PNG')

    light_sm = light.resize((192, 192), Image.Resampling.LANCZOS)
    light_sm.save(os.path.join(out_dir, "icon_light_192.png"), format='PNG')

    dark_sm = dark.resize((192, 192), Image.Resampling.LANCZOS)
    dark_sm.save(os.path.join(out_dir, "icon_dark_192.png"), format='PNG')

    print(f"  [{folder_name}] {desc}")


def main():
    os.makedirs(CANDIDATES_DIR, exist_ok=True)
    print("=== Linkmap Icon V6~V8 ===\n")

    save_variant(render_v6, "v6", "Reference Match - max fidelity")
    save_variant(render_v7, "v7", "Reference + Dynamic sizes")
    save_variant(render_v8, "v8", "Reference + Compact bold")

    print("\nDone!")


if __name__ == "__main__":
    main()
