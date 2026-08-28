"""
Trains the comfort-score Random Forest model.

There is no public "room comfort score" dataset (flagged in the proposal
review). So this generates synthetic training examples from a defined
scoring formula (domain-expert-style rules), adds noise, and trains a
RandomForestRegressor to approximate it. This is a REAL trained model
(actual .fit() call, actual saved weights) - the synthetic-label approach is
a standard technique when no ground-truth dataset exists yet.

Run this once:
    python -m app.ml.training.train_comfort_model

Output: app/ml/models/comfort_rf.pkl
"""
import os
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib

MODEL_OUT = os.path.join(os.path.dirname(__file__), "..", "models", "comfort_rf.pkl")

FEATURE_NAMES = ["edge_density", "contour_count", "flat_ratio", "color_std"]


def synthetic_comfort_score(edge_density, contour_count, flat_ratio, color_std, rng):
    """
    Domain-rule formula: more edges/contours (clutter) and high color
    variance -> lower comfort. More flat/open space -> higher comfort.
    """
    score = (
        100
        - edge_density * 45
        - contour_count * 30
        - color_std * 15
        + flat_ratio * 45
    )
    score += rng.normal(0, 5)  # measurement noise
    return float(np.clip(score, 0, 100))


def generate_dataset(n_samples: int = 3000, seed: int = 42):
    rng = np.random.default_rng(seed)

    edge_density = rng.uniform(0, 1, n_samples)
    contour_count = rng.uniform(0, 1, n_samples)
    flat_ratio = rng.uniform(0, 1, n_samples)
    color_std = rng.uniform(0, 1, n_samples)

    X = np.column_stack([edge_density, contour_count, flat_ratio, color_std])
    y = np.array([
        synthetic_comfort_score(e, c, f, s, rng)
        for e, c, f, s in zip(edge_density, contour_count, flat_ratio, color_std)
    ])
    return X, y


def main():
    X, y = generate_dataset()

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=8,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X, y)

    score = model.score(X, y)
    print(f"Training R^2 on synthetic data: {score:.4f}")
    print("Feature importances:")
    for name, importance in zip(FEATURE_NAMES, model.feature_importances_):
        print(f"  {name}: {importance:.3f}")

    os.makedirs(os.path.dirname(MODEL_OUT), exist_ok=True)
    joblib.dump(model, MODEL_OUT)
    print(f"Saved model to {os.path.abspath(MODEL_OUT)}")


if __name__ == "__main__":
    main()
