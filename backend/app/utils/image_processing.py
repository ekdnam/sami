import os
from fastapi import UploadFile
from PIL import Image

UPLOAD_DIR = "data/images"

async def save_image(file: UploadFile) -> str:
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with Image.open(file.file) as image:
        image.save(file_path)
    
    return file_path