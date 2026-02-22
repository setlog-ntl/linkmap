import os
from PIL import Image

def make_transparent(input_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    for filename in os.listdir(input_dir):
        if filename.endswith(".png") and filename != "icon_1.png": # skip the full image
            path = os.path.join(input_dir, filename)
            img = Image.open(path).convert("RGBA")
            data = img.getdata()
            
            # Sample corners to get background colors
            w, h = img.size
            corners = [img.getpixel((0,0)), img.getpixel((w-1, 0)), img.getpixel((0, h-1)), img.getpixel((w-1, h-1))]
            
            # Typically checkerboard has 2 colors. Let's find unique-ish colors in corners.
            # We use a small threshold for color matching.
            def is_background(pixel):
                r, g, b, a = pixel
                # Checkerboard colors are gray (r~g~b) and usually high brightness
                # Light gray: (204, 204, 204), White: (255, 255, 255)
                # Let's say if it's very close to any corner color AND it's a "gray"
                for cr, cg, cb, ca in corners:
                    if abs(r - cr) < 15 and abs(g - cg) < 15 and abs(b - cb) < 15:
                        # Check if it's gray-ish
                        if abs(r - g) < 10 and abs(g - b) < 10:
                            return True
                return False

            new_data = []
            for item in data:
                if is_background(item):
                    new_data.append((255, 255, 255, 0))
                else:
                    new_data.append(item)
            
            img.putdata(new_data)
            
            # Trim the icon
            bbox = img.getbbox()
            if bbox:
                img = img.crop(bbox)
                
            new_name = f"split_{filename}"
            img.save(os.path.join(output_dir, new_name))
            print(f"Processed: {new_name}")

if __name__ == "__main__":
    make_transparent(r"c:\Dev\linkmap\img\split_icons", r"c:\Dev\linkmap\img\icons_transparent")
