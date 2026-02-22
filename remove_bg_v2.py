import os
from PIL import Image, ImageDraw

def flood_fill_transparency(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    
    # We'll use a flood fill from the four corners to remove the background
    # This avoids removing colors inside the icon that might match the background.
    
    # Use a mask for flood fill
    # We'll use a slightly higher tolerance since the checkerboard has variations
    tolerance = 20
    
    # Create a copy to work on
    mask = Image.new("L", (width, height), 0)
    
    def get_color(x, y):
        return img.getpixel((x, y))

    points_to_fill = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    
    # Pillow's floodfill is basic. Let's implement a simple one or use ImageDraw.floodfill
    for pt in points_to_fill:
        target_color = get_color(*pt)
        # Note: ImageDraw.floodfill only works with a single color. 
        # Since our background is a checkerboard, we need something better.
        
    # Better approach: Since we know the background is a checkerboard of 2 colors,
    # let's just use the "is_background" logic but only for the outer region.
    # We can find the icon's main shape (the rounded square) and preserve everything inside.
    
    # Let's use the alpha channel we can generate from the colorfulness
    # or just use the fact that the icon is a contiguous block.
    
    data = img.load()
    visited = set()
    bg_pixels = set()
    
    stack = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    for p in stack: visited.add(p)
    
    # BFS to find background
    while stack:
        x, y = stack.pop()
        r, g, b, a = data[x, y]
        
        # Check if it's "background-like"
        # Background is gray or white
        is_bg = (abs(r-g) < 15 and abs(g-b) < 15 and abs(r-b) < 15 and (r > 150 or r == 204 or r == 255))
        
        if is_bg:
            bg_pixels.add((x, y))
            for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    stack.append((nx, ny))

    # Apply transparency
    new_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    new_data = new_img.load()
    for y in range(height):
        for x in range(width):
            if (x, y) not in bg_pixels:
                new_data[x, y] = data[x, y]
    
    # Final trim
    bbox = new_img.getbbox()
    if bbox:
        new_img = new_img.crop(bbox)
        
    new_img.save(output_path)

if __name__ == "__main__":
    input_dir = r"c:\Dev\linkmap\img\split_icons"
    output_dir = r"c:\Dev\linkmap\img\icons_final"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    for filename in os.listdir(input_dir):
        if filename.endswith(".png") and filename != "icon_1.png":
            flood_fill_transparency(os.path.join(input_dir, filename), os.path.join(output_dir, f"final_{filename}"))
            print(f"Produced final_{filename}")
