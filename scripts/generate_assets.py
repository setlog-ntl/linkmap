import os
from PIL import Image

def generate_assets():
    source_img_path = r"c:\Dev\linkmap\img\linkmap icon.png"
    img_dir = r"c:\Dev\linkmap\img"
    app_dir = r"c:\Dev\linkmap\src\app"
    
    if not os.path.exists(source_img_path):
        print(f"Error: Source image not found at {source_img_path}")
        return

    try:
        img = Image.open(source_img_path)
        print(f"Original size: {img.size}")
        
        # Ensure RGBA mode for transparency handling
        if img.mode != 'RGBA':
            img = img.convert('RGBA')

        # Generate Favicon (multi-size ICO)
        favicon_sizes = [(16, 16), (32, 32), (48, 48)]
        favicon_path_img = os.path.join(img_dir, "linkmap_favicon.ico")
        favicon_path_app = os.path.join(app_dir, "favicon.ico")
        img.save(favicon_path_img, format='ICO', sizes=favicon_sizes)
        img.save(favicon_path_app, format='ICO', sizes=favicon_sizes)
        print(f"Generated favicon.ico at {favicon_path_img} and {favicon_path_app}")

        # Generate Apple Touch Icon (180x180)
        apple_icon_size = (180, 180)
        apple_icon_img = img.resize(apple_icon_size, Image.Resampling.LANCZOS)
        apple_path_img = os.path.join(img_dir, "linkmap_apple_icon.png")
        apple_path_app = os.path.join(app_dir, "apple-icon.png")
        apple_icon_img.save(apple_path_img, format='PNG')
        apple_icon_img.save(apple_path_app, format='PNG')
        print(f"Generated apple-icon.png at {apple_path_img} and {apple_path_app}")

        # Generate Web Icon (192x192) - often used for Android/Manifest
        web_icon_size = (192, 192)
        web_icon_img = img.resize(web_icon_size, Image.Resampling.LANCZOS)
        web_path_img = os.path.join(img_dir, "linkmap_web_icon.png")
        web_path_app = os.path.join(app_dir, "icon.png")
        web_icon_img.save(web_path_img, format='PNG')
        web_icon_img.save(web_path_app, format='PNG')
        print(f"Generated icon.png at {web_path_img} and {web_path_app}")
        
        # Generate OpenGraph Image (1200x630)
        # Create a canvas of 1200x630 with a background (e.g., white or transparent? Let's use allow transparency or white if the icon is transparent)
        # Assuming transparent background is okay for PNG, but for OG usually solid bg is safer. 
        # Let's use a simple white background for now, or fetch dominant color?
        # A safer bet is just center the icon on a white/light canvas.
        og_size = (1200, 630)
        og_canvas = Image.new('RGBA', og_size, (255, 255, 255, 255))
        
        # Resize icon to fit nicely within 630 height (e.g. 400px height)
        icon_target_height = 400
        aspect_ratio = img.width / img.height
        new_width = int(icon_target_height * aspect_ratio)
        resized_icon = img.resize((new_width, icon_target_height), Image.Resampling.LANCZOS)
        
        # Center position
        pos_x = (og_size[0] - new_width) // 2
        pos_y = (og_size[1] - icon_target_height) // 2
        
        og_canvas.paste(resized_icon, (pos_x, pos_y), resized_icon)
        
        og_path_img = os.path.join(img_dir, "linkmap_og_image.png")
        og_path_app = os.path.join(app_dir, "opengraph-image.png")
        og_canvas.save(og_path_img, format='PNG')
        og_canvas.save(og_path_app, format='PNG')
        print(f"Generated opengraph-image.png at {og_path_img} and {og_path_app}")

    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    generate_assets()
