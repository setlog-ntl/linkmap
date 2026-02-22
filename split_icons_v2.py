import os
from PIL import Image, ImageFilter, ImageOps

def split_icons(input_path, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    img = Image.open(input_path).convert("RGB")
    width, height = img.size
    
    # The checkerboard typically has R, G, B values close to each other (gray/white)
    # Icons have more colorful pixels OR are different shades.
    # Let's try to find regions that are NOT the checkerboard.
    # We can detect checkerboard by looking at a small neighborhood.
    
    # Alternative: Use Edge detection to find the square boundaries
    edges = img.filter(ImageFilter.FIND_EDGES).convert("L")
    # Threshold the edges
    threshold = 30
    binary_edges = edges.point(lambda p: 255 if p > threshold else 0)
    
    # Dilate a bit to connect edges
    # Pillow doesn't have dilation, but we can use MaxFilter
    binary_edges = binary_edges.filter(ImageFilter.MaxFilter(5))
    
    # Now find connected components (bounding boxes)
    # We'll use a simple BFS or just scan for blocks.
    
    pixels = binary_edges.load()
    visited = set()
    bboxes = []
    
    for y in range(height):
        for x in range(width):
            if pixels[x, y] == 255 and (x, y) not in visited:
                # Found a new component
                stack = [(x, y)]
                visited.add((x, y))
                min_x, min_y = x, y
                max_x, max_y = x, y
                
                while stack:
                    cx, cy = stack.pop()
                    min_x = min(min_x, cx)
                    min_y = min(min_y, cy)
                    max_x = max(max_x, cx)
                    max_y = max(max_y, cy)
                    
                    # Check neighbors (4-connectivity)
                    for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < width and 0 <= ny < height and \
                           pixels[nx, ny] == 255 and (nx, ny) not in visited:
                            visited.add((nx, ny))
                            stack.append((nx, ny))
                
                # Check if this component is "icon-sized"
                w, h = max_x - min_x, max_y - min_y
                if w > 100 and h > 100: # Heuristic for icon size
                    bboxes.append((min_x, min_y, max_x, max_y))
    
    print(f"Found {len(bboxes)} potential icons.")
    
    # Sort bboxes by Y then X to maintain order
    bboxes.sort(key=lambda b: (b[1] // 100, b[0]))
    
    for i, bbox in enumerate(bboxes):
        # Expand bbox slightly to catch the whole icon
        padding = 10
        bx1 = max(0, bbox[0] - padding)
        by1 = max(0, bbox[1] - padding)
        bx2 = min(width, bbox[2] + padding)
        by2 = min(height, bbox[3] + padding)
        
        icon = img.crop((bx1, by1, bx2, by2))
        
        # Try to trim the checkerboard if possible
        # But for now, let's just save the crop
        output_path = os.path.join(output_dir, f"icon_{i+1}.png")
        icon.save(output_path)
        print(f"Saved: {output_path}")

if __name__ == "__main__":
    split_icons(r"c:\Dev\linkmap\img\image.png", r"c:\Dev\linkmap\img\split_icons")
