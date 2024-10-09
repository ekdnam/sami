from segment_anything import sam_model_registry, SamPredictor
import numpy as np
import torch
from PIL import Image
import os

# Initialize the SAM model (you'll need to download the model checkpoint)

sam_checkpoint = f"{os.getcwd()}/checkpoint/sam_vit_h_4b8939.pth"
model_type = "vit_h"

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
sam = sam_model_registry[model_type](checkpoint=sam_checkpoint)
sam.to(device=device)

predictor = SamPredictor(sam)

def generate_masks(image_path):
    image = np.array(Image.open(image_path))
    predictor.set_image(image)
    
    # Generate masks (this is a simplified version, you might want to adjust this)
    masks, _, _ = predictor.predict(
        point_coords=None,
        point_labels=None,
        box=None,
        multimask_output=True,
    )
    
    # Convert masks to a list of points for each mask
    mask_points = []
    for mask in masks:
        points = np.argwhere(mask)
        mask_points.append(points.tolist())
    
    return mask_points