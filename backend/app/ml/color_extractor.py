"""
Dominant color extraction via K-Means clustering.
This is fully functional right now - no training/dataset needed, it clusters
pixel colors of whatever image is uploaded, at request time.
"""
import cv2
import numpy as np
from sklearn.cluster import KMeans


def extract_dominant_colors(image_path: str, n_colors: int = 5) -> list[tuple[str, float]]:
    """Returns a list of (hex_color, percentage) tuples, most dominant first.
    Percentage is the real proportion of image pixels belonging to that
    color's cluster, not an estimate."""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image at {image_path}")

    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Downscale for speed - color distribution barely changes at smaller sizes
    small = cv2.resize(img, (150, 150), interpolation=cv2.INTER_AREA)
    pixels = small.reshape(-1, 3).astype(np.float32)

    kmeans = KMeans(n_clusters=n_colors, n_init=4, random_state=42)
    labels = kmeans.fit_predict(pixels)

    # Sort clusters by how many pixels belong to them (most dominant first)
    counts = np.bincount(labels)
    total_pixels = counts.sum()
    order = np.argsort(-counts)

    results = []
    for idx in order:
        r, g, b = kmeans.cluster_centers_[idx].astype(int)
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        percentage = round(100 * counts[idx] / total_pixels, 1)
        results.append((hex_color, percentage))

    return results