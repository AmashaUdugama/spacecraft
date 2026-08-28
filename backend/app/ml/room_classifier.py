"""
Room classification model.

Real behaviour:
- If a trained Keras model exists at app/ml/models/room_classifier.h5, it is
  loaded and used for actual CNN inference.
- If not (i.e. you haven't trained it yet - see app/ml/training/), this falls
  back to a deterministic image-statistics heuristic so the rest of the
  pipeline (upload -> predict -> recommend -> dashboard) is fully testable
  end-to-end right now.

Swap in the real model later with ZERO changes to any other file - just drop
room_classifier.h5 into app/ml/models/ and restart the server.
"""
import os
import numpy as np
import cv2

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "room_classifier.h5")
IMG_SIZE = (224, 224)
CLASSES = ["bedroom", "kitchen", "office", "living_room"]


class RoomClassifier:
    def __init__(self):
        self.model = None
        self._try_load_real_model()

    def _try_load_real_model(self):
        if not os.path.exists(MODEL_PATH):
            return
        try:
            import tensorflow as tf  # heavy, imported lazily
            self.model = tf.keras.models.load_model(MODEL_PATH)
        except Exception as e:
            print(f"[RoomClassifier] Could not load trained model, using heuristic fallback: {e}")
            self.model = None

    def predict(self, image_path: str) -> tuple[str, float]:
        if self.model is not None:
            return self._predict_with_model(image_path)
        return self._predict_heuristic(image_path)

    def _predict_with_model(self, image_path: str) -> tuple[str, float]:
        import tensorflow as tf
        img = tf.keras.preprocessing.image.load_img(image_path, target_size=IMG_SIZE)
        # NOTE: do NOT divide by 255 here. The trained model has a built-in
        # Rescaling(1/127.5, offset=-1) layer as its first layer, matching how
        # training data was fed in raw (0-255) via image_dataset_from_directory.
        # Pre-dividing here would double-scale the input and silently wreck
        # prediction accuracy despite the model itself being good.
        arr = tf.keras.preprocessing.image.img_to_array(img)
        arr = np.expand_dims(arr, axis=0)
        preds = self.model.predict(arr, verbose=0)[0]
        idx = int(np.argmax(preds))
        return CLASSES[idx], float(preds[idx])

    def _predict_heuristic(self, image_path: str) -> tuple[str, float]:
        """
        NOT a trained model. Uses simple image statistics (brightness,
        saturation, edge density) to produce a plausible, varied, repeatable
        classification so you can build/test the rest of the app before the
        real CNN is trained.
        """
        img = cv2.imread(image_path)
        if img is None:
            return CLASSES[0], 0.25

        img = cv2.resize(img, (224, 224))
        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        brightness = float(np.mean(hsv[:, :, 2])) / 255.0
        saturation = float(np.mean(hsv[:, :, 1])) / 255.0
        edges = cv2.Canny(gray, 50, 150)
        edge_density = float(np.mean(edges > 0))

        # simple rule scoring per class - not real ML, just deterministic placeholder
        scores = {
            "kitchen": edge_density * 2.0 + (1 - saturation),      # kitchens: lots of hard edges, low saturation
            "office": edge_density * 1.5 + (1 - brightness) * 0.5,  # offices: edges, moderate light
            "bedroom": saturation * 1.5 + brightness * 0.5,          # bedrooms: softer, more saturated (textiles)
            "living_room": brightness * 1.0 + saturation * 1.0,      # living rooms: balanced
        }

        total = sum(scores.values()) or 1.0
        room_type = max(scores, key=scores.get)
        confidence = scores[room_type] / total
        return room_type, round(min(confidence, 0.95), 3)


_classifier_singleton: RoomClassifier | None = None


def get_room_classifier() -> RoomClassifier:
    global _classifier_singleton
    if _classifier_singleton is None:
        _classifier_singleton = RoomClassifier()
    return _classifier_singleton