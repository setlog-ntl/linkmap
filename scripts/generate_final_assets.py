"""
Linkmap Final Assets Generator - V11 확정
V11 기반으로 모든 앱 에셋 생성
"""
import os
import sys

# V11 렌더링 함수 재사용
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from generate_icon_v9_v11 import render_v11

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(BASE_DIR, "img")
APP_DIR = os.path.join(BASE_DIR, "src", "app")
PUBLIC_DIR = os.path.join(BASE_DIR, "public")

CANVAS = 1024
CENTER = CANVAS // 2


def lerp_color(c1, c2, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))


def generate_icon_only_v11(theme='light'):
    """V11 노드 구조를 투명 배경으로 (로고용)"""
    img = Image.new('RGBA', (CANVAS, CANVAS), (0, 0, 0, 0))

    if theme == 'light':
        center_top = (45, 155, 238, 255)
        center_bot = (30, 110, 210, 255)
        node_colors = [
            ((85, 200, 250, 255), (35, 130, 225, 255)),
            ((70, 190, 248, 255), (28, 120, 220, 255)),
            ((100, 215, 255, 255), (42, 148, 235, 255)),
            ((55, 178, 245, 255), (22, 108, 215, 255)),
            ((78, 195, 252, 255), (32, 125, 228, 255)),
        ]
        line_color = (60, 140, 220, 200)
        diamond_top = (55, 125, 215, 190)
        diamond_bot = (38, 85, 175, 210)
    else:
        center_top = (210, 235, 255, 255)
        center_bot = (180, 215, 245, 255)
        node_colors = [
            ((195, 225, 255, 255), (170, 205, 240, 255)),
            ((185, 218, 250, 255), (162, 198, 235, 255)),
            ((205, 232, 255, 255), (178, 212, 245, 255)),
            ((175, 210, 248, 255), (155, 192, 232, 255)),
            ((190, 222, 252, 255), (165, 202, 238, 255)),
        ]
        line_color = (190, 215, 240, 190)
        diamond_top = (175, 205, 238, 175)
        diamond_bot = (155, 185, 218, 195)

    cx, cy = CENTER, CENTER - 8
    cr = 105

    nodes_config = [
        {'angle': -132, 'dist': 270, 'radius': 60},
        {'angle': -75,  'dist': 258, 'radius': 54},
        {'angle': -16,  'dist': 280, 'radius': 62},
        {'angle': -202, 'dist': 265, 'radius': 50},
        {'angle': 35,   'dist': 272, 'radius': 56},
    ]

    node_positions = []
    for n in nodes_config:
        rad = math.radians(n['angle'])
        nx = cx + int(n['dist'] * math.cos(rad))
        ny = cy + int(n['dist'] * math.sin(rad))
        node_positions.append((nx, ny, n['radius']))

    # lines
    draw = ImageDraw.Draw(img)
    for (nx, ny, _) in node_positions:
        draw.line([(cx, cy), (nx, ny)], fill=line_color, width=12)

    # diamond
    hw, hh = 110, 41
    dy = cy + cr + 38
    pts = [(cx, dy - hh), (cx + hw, dy), (cx, dy + hh), (cx - hw, dy)]
    draw.polygon(pts, fill=diamond_top)
    lower_pts = [(cx, dy), (cx + hw, dy), (cx, dy + hh), (cx - hw, dy)]
    draw.polygon(lower_pts, fill=diamond_bot)

    # center
    d = cr * 2
    circle = Image.new('RGBA', (d, d), (0, 0, 0, 0))
    cd = ImageDraw.Draw(circle)
    for y in range(d):
        t = y / d
        color = lerp_color(center_top[:3], center_bot[:3], t) + (255,)
        cd.line([(0, y), (d, y)], fill=color)
    mask = Image.new('L', (d, d), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, d-1, d-1], fill=255)
    circle.putalpha(mask)
    img.paste(circle, (cx - cr, cy - cr), circle)

    # nodes
    for i, (nx, ny, nr) in enumerate(node_positions):
        nd = nr * 2
        nc = Image.new('RGBA', (nd, nd), (0, 0, 0, 0))
        ncd = ImageDraw.Draw(nc)
        ct, cb = node_colors[i]
        for y in range(nd):
            t = y / nd
            color = lerp_color(ct[:3], cb[:3], t) + (255,)
            ncd.line([(0, y), (nd, y)], fill=color)
        nmask = Image.new('L', (nd, nd), 0)
        ImageDraw.Draw(nmask).ellipse([0, 0, nd-1, nd-1], fill=255)
        nc.putalpha(nmask)
        img.paste(nc, (nx - nr, ny - nr), nc)

    return img


def generate_og_image(theme='light'):
    """OG Image (1200x630) with icon + text"""
    icon = generate_icon_only_v11(theme)
    icon_small = icon.resize((380, 380), Image.Resampling.LANCZOS)

    if theme == 'light':
        bg_color = (248, 250, 252, 255)
        text_color = (25, 55, 105, 255)
    else:
        bg_color = (12, 20, 38, 255)
        text_color = (195, 218, 248, 255)

    canvas = Image.new('RGBA', (1200, 630), bg_color)
    icon_x = (1200 - 380) // 2
    canvas.paste(icon_small, (icon_x, 50), icon_small)

    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype("arial.ttf", 72)
    except (OSError, IOError):
        font = ImageFont.load_default()

    text = "linkmap"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((1200 - tw) // 2, 455), text, fill=text_color, font=font)

    return canvas


def main():
    os.makedirs(IMG_DIR, exist_ok=True)
    os.makedirs(APP_DIR, exist_ok=True)
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    print("=== V11 Final Assets Generator ===\n")

    # 1. Light icon 1024
    print("[1/9] Light icon 1024px...")
    light = render_v11('light')
    light.save(os.path.join(IMG_DIR, "linkmap_icon_light.png"), format='PNG')
    light.save(os.path.join(IMG_DIR, "linkmap icon.png"), format='PNG')

    # 2. Dark icon 1024
    print("[2/9] Dark icon 1024px...")
    dark = render_v11('dark')
    dark.save(os.path.join(IMG_DIR, "linkmap_icon_dark.png"), format='PNG')

    # 3. Favicon
    print("[3/9] Favicon (ICO)...")
    favicon_sizes = [(16, 16), (32, 32), (48, 48)]
    light.save(os.path.join(IMG_DIR, "linkmap_favicon.ico"), format='ICO', sizes=favicon_sizes)
    light.save(os.path.join(APP_DIR, "favicon.ico"), format='ICO', sizes=favicon_sizes)

    # 4. Apple Touch Icon (180x180)
    print("[4/9] Apple Touch Icon...")
    apple = light.resize((180, 180), Image.Resampling.LANCZOS)
    apple.save(os.path.join(IMG_DIR, "linkmap_apple_icon.png"), format='PNG')
    apple.save(os.path.join(APP_DIR, "apple-icon.png"), format='PNG')

    # 5. Web Icon (192x192)
    print("[5/9] Web Icon (192px)...")
    web = light.resize((192, 192), Image.Resampling.LANCZOS)
    web.save(os.path.join(IMG_DIR, "linkmap_web_icon.png"), format='PNG')
    web.save(os.path.join(APP_DIR, "icon.png"), format='PNG')

    # 6. Logo icon (transparent, public)
    print("[6/9] Logo icon (transparent)...")
    logo_icon = generate_icon_only_v11('light')
    logo_512 = logo_icon.resize((512, 512), Image.Resampling.LANCZOS)
    logo_512.save(os.path.join(PUBLIC_DIR, "logo-icon.png"), format='PNG')

    # 7. Logo (light bg, public)
    print("[7/9] Logo light (512px)...")
    logo_light = light.resize((512, 512), Image.Resampling.LANCZOS)
    logo_light.save(os.path.join(PUBLIC_DIR, "logo.png"), format='PNG')

    # 8. Logo dark (public)
    print("[8/9] Logo dark (512px)...")
    logo_dark = dark.resize((512, 512), Image.Resampling.LANCZOS)
    logo_dark.save(os.path.join(PUBLIC_DIR, "logo-dark.png"), format='PNG')

    # 9. OG Image
    print("[9/9] OG Image (1200x630)...")
    og = generate_og_image('light')
    og.save(os.path.join(IMG_DIR, "linkmap_og_image.png"), format='PNG')
    og.save(os.path.join(APP_DIR, "opengraph-image.png"), format='PNG')

    print("\n=== Done! ===")
    print("Generated files:")
    print(f"  img/linkmap_icon_light.png  (1024x1024)")
    print(f"  img/linkmap_icon_dark.png   (1024x1024)")
    print(f"  img/linkmap icon.png        (1024x1024, source)")
    print(f"  img/linkmap_favicon.ico     (16/32/48)")
    print(f"  img/linkmap_apple_icon.png  (180x180)")
    print(f"  img/linkmap_web_icon.png    (192x192)")
    print(f"  img/linkmap_og_image.png    (1200x630)")
    print(f"  src/app/favicon.ico")
    print(f"  src/app/apple-icon.png")
    print(f"  src/app/icon.png")
    print(f"  src/app/opengraph-image.png")
    print(f"  public/logo.png")
    print(f"  public/logo-dark.png")
    print(f"  public/logo-icon.png")


if __name__ == "__main__":
    main()
