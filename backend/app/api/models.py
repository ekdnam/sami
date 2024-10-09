from pydantic import BaseModel
from typing import List

class Annotation(BaseModel):
    mask_id: int
    text: str

class AnnotationResponse(BaseModel):
    success: bool
    message: str