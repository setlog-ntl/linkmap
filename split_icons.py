import os
from PIL import Image

def split_image(input_path, output_dir):
    print(f"Starting split for {input_path}")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created directory {output_dir}")
    
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found")
        return

    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    print(f"Image size: {width}x{height}")
    
    alpha = img.getchannel('A')
    bbox = alpha.getbbox()
    if not bbox:
        print("No content found in image.")
        return

    rows = []
    in_row = False
    start_y = 0
    for y in range(height):
        has_pixel = False
        for x in range(width):
            if alpha.getpixel((x, y)) > 0:
                has_pixel = True
                break
        
        if has_pixel and not in_row:
            in_row = True
            start_y = y
        elif not has_pixel and in_row:
            in_row = False
            rows.append((start_y, y))
    
    if in_row:
        rows.append((start_y, height))
        
    print(f"Detected {len(rows)} rows.")
    
    count = 0
    for i, (sy, ey) in enumerate(rows):
        row_alpha = alpha.crop((0, sy, width, ey))
        
        cols = []
        in_col = False
        start_x = 0
        for x in range(width):
            has_pixel = False
            for y in range(ey - sy):
                if row_alpha.getpixel((x, y)) > 0:
                    has_pixel = True
                    break
            
            if has_pixel and not in_col:
                in_col = True
                start_x = x
            elif not has_pixel and in_col:
                in_col = False
                cols.append((start_x, x))
        
        if in_col:
            cols.append((start_x, width))
            
        print(f"Row {i}: Detected {len(cols)} columns.")
        
        for j, (sx, ex) in enumerate(cols):
            icon = img.crop((sx, sy, ex, ey))
            icon_alpha = icon.getchannel('A')
            icon_bbox = icon_alpha.getbbox()
            if icon_bbox:
                icon = icon.crop(icon_bbox)
            
            count += 1
            output_name = f"icon_{count}.png"
            output_path = os.path.join(output_dir, output_name)
            icon.save(output_path)
            print(f"Saved: {output_path}")

if __name__ == "__main__":
    # Use absolute paths for Windows
    base_dir = r"c:\Dev\linkmap"
    input_file = os.path.join(base_dir, "img", "image.png")
    output_folder = os.path.join(base_dir, "img", "split_icons")
    split_image(input_file, output_folder)
