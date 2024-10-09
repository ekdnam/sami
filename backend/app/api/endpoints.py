from fastapi import APIRouter, UploadFile, File
from app.services.fastsam_service import generate_masks
from app.utils.image_processing import save_image
from app.api.models import Annotation, AnnotationResponse
import base64

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    image_path = await save_image(file)
    masks = generate_masks(image_path)
    
    with open(image_path, "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read()).decode()
    
    return {"image": encoded_image, "masks": masks}

@router.post("/annotate", response_model=AnnotationResponse)
async def annotate_mask(annotation: Annotation):
    # Here you would save the annotation to a database or file
    # For now, we'll just return a success message
    return AnnotationResponse(success=True, message="Annotation saved successfully")