"""
Extracts real, computed spatial-proxy features from a room image using OpenCV.
No object-detection model is used (kept out of scope per your proposal
discussion) - instead this uses edge density and contour analysis as a
lightweight proxy for "how crowded / how much free space" a room has.
These features feed the comfort Random Forest model.
"""
import cv2
import numpy as np


def extract_features(image_path: str) -> dict:
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image at {image_path}")

    img = cv2.resize(img, (256, 256))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Edge density - proxy for visual clutter / furniture density
    edges = cv2.Canny(gray, 50, 150)
    edge_density = float(np.mean(edges > 0))

    # Contours - proxy for number of distinct objects/shapes in the room
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    significant_contours = [c for c in contours if cv2.contourArea(c) > 50]
    contour_count = len(significant_contours)

    # Free-space proxy: fraction of large, low-texture (flat) regions -
    # flat regions often indicate open floor/wall/ceiling space
    blur = cv2.GaussianBlur(gray, (15, 15), 0)
    texture = cv2.absdiff(gray, blur)
    flat_ratio = float(np.mean(texture < 8))  # low local variance = "flat"/open area

    # Color variance - proxy for visual busyness
    color_std = float(np.std(img))

    return {
        "edge_density": edge_density,
        "contour_count": min(contour_count, 200) / 200.0,  # normalize 0-1
        "flat_ratio": flat_ratio,
        "color_std": color_std / 255.0,
    }
