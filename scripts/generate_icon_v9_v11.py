"""
Linkmap Icon V9~V11 Generator
V8 기반 + 위성 노드 크기 확대 변형
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


def draw_diagonal_gradient_bg_fast(img, c_tl, c_tr, c_bl, c_br, corner_radius):
    w, h = CANVAS, CANVAS
    gradient = Image.new('RGBA', (w, h), (0, 0, 0, 0))
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


def render_variant(theme, center_radius, nodes_config, line_width, diamond_config,
                   bg_colors_light, bg_colors_dark):
    img = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    corner_radius = int(CANVAS * 0.22)

    if theme == 'light':
        draw_diagonal_gradient_bg_fast(img, *bg_colors_light, corner_radius)
        center_top = (125, 220, 255, 255)
        center_bot = (52, 158, 242, 255)
        center_border = (255, 255, 255, 130)
        line_color = (210, 235, 255, 185)
        diamond_top = (125, 178, 248, 170)
        diamond_bot = (75, 130, 218, 200)
        diamond_outline = (185, 215, 252, 90)
        node_colors = [
            ((95, 208, 255, 255), (38, 138, 232, 255)),
            ((80, 198, 252, 255), (32, 128, 228, 255)),
            ((115, 222, 255, 255), (48, 152, 238, 255)),
            ((65, 188, 250, 255), (25, 115, 220, 255)),
            ((88, 202, 254, 255), (35, 132, 230, 255)),
        ]
        node_border = (255, 255, 255, 72)
    else:
        draw_diagonal_gradient_bg_fast(img, *bg_colors_dark, corner_radius)
        center_top = (78, 218, 255, 255)
        center_bot = (32, 142, 232, 255)
        center_border = (125, 215, 255, 95)
        line_color = (65, 150, 235, 168)
        diamond_top = (55, 115, 198, 150)
        diamond_bot = (32, 82, 168, 178)
        diamond_outline = (85, 155, 225, 65)
        node_colors = [
            ((58, 198, 248, 255), (26, 116, 216, 255)),
            ((45, 182, 244, 255), (20, 105, 208, 255)),
            ((68, 208, 252, 255), (32, 132, 228, 255)),
            ((38, 172, 240, 255), (16, 95, 198, 255)),
            ((50, 190, 246, 255), (24, 110, 212, 255)),
        ]
        node_border = (100, 188, 245, 55)

    cx, cy = CENTER, CENTER - 8
    cr = center_radius

    node_positions = []
    for n in nodes_config:
        rad = math.radians(n['angle'])
        nx = cx + int(n['dist'] * math.cos(rad))
        ny = cy + int(n['dist'] * math.sin(rad))
        node_positions.append((nx, ny, n['radius']))

    # lines
    line_layer = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    ld = ImageDraw.Draw(line_layer)
    for (nx, ny, _) in node_positions:
        ld.line([(cx, cy), (nx, ny)], fill=line_color, width=line_width)
    glow = line_layer.filter(ImageFilter.GaussianBlur(radius=4))
    img = Image.alpha_composite(img, glow)
    img = Image.alpha_composite(img, line_layer)

    # diamond
    dm = diamond_config
    diamond_y = cy + cr + dm['offset']
    draw_diamond(img, (cx, diamond_y), dm['width'], dm['height'],
                 diamond_top, diamond_bot, diamond_outline)

    # center node
    draw_circle_gradient(img, (cx, cy), cr, center_top, center_bot,
                         border_color=center_border, border_width=5, shadow=True)
    img = draw_highlight(img, cx, cy, cr, 55)

    # satellite nodes
    for i, (nx, ny, nr) in enumerate(node_positions):
        ct, cb = node_colors[i]
        draw_circle_gradient(img, (nx, ny), nr, ct, cb,
                             border_color=node_border, border_width=3, shadow=True)

    # glow
    gl = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gl)
    gd.ellipse([cx - 175, cy - 175, cx + 175, cy + 175], fill=(105, 205, 255, 16))
    gl = gl.filter(ImageFilter.GaussianBlur(radius=42))
    img = Image.alpha_composite(img, gl)

    return img


# V8 기본 배경색
BG_LIGHT = ((35, 195, 248), (15, 155, 235), (22, 135, 228), (12, 65, 198))
BG_DARK = ((24, 42, 78), (18, 30, 62), (15, 28, 58), (8, 18, 44))


# ===================================================
# V9: V8 + 위성 노드 크기 UP (균일하게 큰)
# ===================================================
def render_v9(theme='light'):
    return render_variant(
        theme=theme,
        center_radius=108,
        nodes_config=[
            {'angle': -130, 'dist': 255, 'radius': 56},   # 좌상 - 크게
            {'angle': -76,  'dist': 245, 'radius': 50},   # 중상 - 크게
            {'angle': -20,  'dist': 265, 'radius': 58},   # 우측 - 가장 큰
            {'angle': -198, 'dist': 250, 'radius': 48},   # 좌하
            {'angle': 32,   'dist': 258, 'radius': 54},   # 우하
        ],
        line_width=13,
        diamond_config={'width': 225, 'height': 85, 'offset': 35},
        bg_colors_light=BG_LIGHT,
        bg_colors_dark=BG_DARK,
    )


# ===================================================
# V10: V8 + 위성 크게 + 크기 차이 강화
# ===================================================
def render_v10(theme='light'):
    return render_variant(
        theme=theme,
        center_radius=112,
        nodes_config=[
            {'angle': -128, 'dist': 260, 'radius': 62},   # 좌상 - 특대
            {'angle': -74,  'dist': 242, 'radius': 46},   # 중상 - 중
            {'angle': -18,  'dist': 270, 'radius': 58},   # 우측 - 대
            {'angle': -200, 'dist': 252, 'radius': 42},   # 좌하 - 소
            {'angle': 34,   'dist': 260, 'radius': 54},   # 우하 - 중대
        ],
        line_width=12,
        diamond_config={'width': 230, 'height': 88, 'offset': 36},
        bg_colors_light=BG_LIGHT,
        bg_colors_dark=BG_DARK,
    )


# ===================================================
# V11: V8 + 전체적으로 큰 위성 + 약간 넓은 배치
# ===================================================
def render_v11(theme='light'):
    return render_variant(
        theme=theme,
        center_radius=105,
        nodes_config=[
            {'angle': -132, 'dist': 270, 'radius': 60},   # 좌상
            {'angle': -75,  'dist': 258, 'radius': 54},   # 중상
            {'angle': -16,  'dist': 280, 'radius': 62},   # 우측 - 최대
            {'angle': -202, 'dist': 265, 'radius': 50},   # 좌하
            {'angle': 35,   'dist': 272, 'radius': 56},   # 우하
        ],
        line_width=12,
        diamond_config={'width': 220, 'height': 82, 'offset': 38},
        bg_colors_light=BG_LIGHT,
        bg_colors_dark=BG_DARK,
    )


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
    print("=== Linkmap Icon V9~V11 (V8 base + bigger satellites) ===\n")

    save_variant(render_v9,  "v9",  "V8+Bigger nodes uniform (48~58px)")
    save_variant(render_v10, "v10", "V8+Bigger nodes dynamic (42~62px)")
    save_variant(render_v11, "v11", "V8+Bigger nodes wide (50~62px)")

    print("\nDone!")


if __name__ == "__main__":
    main()
