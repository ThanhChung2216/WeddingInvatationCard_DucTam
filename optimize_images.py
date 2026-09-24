import os
from PIL import Image, ImageOps

def optimize_image(filepath, max_dim=3200, quality=93):
    if not os.path.exists(filepath):
        return
    
    orig_size = os.path.getsize(filepath)
    try:
        with Image.open(filepath) as img:
            # Handle orientation from EXIF if present
            img = ImageOps.exif_transpose(img)
            
            # Convert RGBA to RGB if needed
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
                
            w, h = img.size
            if max(w, h) > max_dim:
                scale = max_dim / float(max(w, h))
                new_w = int(w * scale)
                new_h = int(h * scale)
                img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
            
            # Save with high quality and no chroma downsampling (4:4:4)
            temp_path = filepath + ".temp.jpg"
            img.save(temp_path, "JPEG", quality=quality, optimize=True, progressive=True, subsampling=0)
            
        new_size = os.path.getsize(temp_path)
        os.replace(temp_path, filepath)
        print(f"HQ Optimized {os.path.basename(filepath)}: {orig_size / (1024*1024):.2f} MB -> {new_size / (1024*1024):.2f} MB (retained {(new_size/orig_size)*100:.1f}%)")
    except Exception as e:
        print(f"Error optimizing {filepath}: {e}")

def main():
    img_dir = os.path.join("assets", "images")
    qr_dir = os.path.join("assets", "qr")
    
    # Process hero & gallery photos with High Resolution (max 3200px, quality 93)
    for filename in os.listdir(img_dir):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            fpath = os.path.join(img_dir, filename)
            if 'avatar' in filename.lower():
                optimize_image(fpath, max_dim=1200, quality=95)
            else:
                optimize_image(fpath, max_dim=3200, quality=93)
                
    # Process QR photos
    if os.path.exists(qr_dir):
        for filename in os.listdir(qr_dir):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                fpath = os.path.join(qr_dir, filename)
                optimize_image(fpath, max_dim=1200, quality=95)

if __name__ == "__main__":
    main()
