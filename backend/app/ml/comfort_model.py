"""
Loads the trained comfort Random Forest (app/ml/models/comfort_rf.pkl) and
uses it, combined with real OpenCV feature extraction, to score an uploaded
room image on comfort, crowdedness, movement efficiency and layout balance.
"""
import os
import joblib

from app.ml.feature_extraction import extract_features

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "comfort_rf.pkl")


class ComfortModel:
    def __init__(self):
        self.model = None
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
        else:
            print(
                "[ComfortModel] No trained model found at "
                f"{MODEL_PATH}. Run: python -m app.ml.training.train_comfort_model"
            )

    def score(self, image_path: str) -> dict:
        features = extract_features(image_path)

        if self.model is not None:
            X = [[
                features["edge_density"],
                features["contour_count"],
                features["flat_ratio"],
                features["color_std"],
            ]]
            comfort_score = float(self.model.predict(X)[0])
        else:
            # simple rule fallback if the model file is missing
            comfort_score = max(0.0, min(100.0,
                100 - features["edge_density"] * 45 - features["contour_count"] * 30
                + features["flat_ratio"] * 45 - features["color_std"] * 15
            ))

        crowdedness = round(features["edge_density"] * 0.6 + features["contour_count"] * 0.4, 3)
        movement_efficiency = round(features["flat_ratio"] * 100, 2)
        layout_balance = round(100 - abs(features["flat_ratio"] * 100 - crowdedness * 100) * 0.5, 2)

        return {
            "comfort_score": round(comfort_score, 2),
            "crowdedness": crowdedness,
            "movement_efficiency": movement_efficiency,
            "layout_balance": max(0.0, min(100.0, layout_balance)),
        }


_comfort_singleton: ComfortModel | None = None


def get_comfort_model() -> ComfortModel:
    global _comfort_singleton
    if _comfort_singleton is None:
        _comfort_singleton = ComfortModel()
    return _comfort_singleton
