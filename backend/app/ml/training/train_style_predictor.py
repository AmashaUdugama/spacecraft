"""
Trains the interior style prediction CNN (modern / minimalist / luxury /
industrial / scandinavian) using transfer learning on MobileNetV2.

USAGE:
1. Gather images into:
   app/ml/training/datasets/styles/
       modern/
       minimalist/
       luxury/
       industrial/
       scandinavian/

2. Run (ideally on Colab with GPU):
       python -m app.ml.training.train_style_predictor

3. Output: app/ml/models/style_predictor.h5
   Auto-detected by app/ml/style_predictor.py on next backend restart.
"""
import os
import tensorflow as tf

from app.ml.training.transfer_utils import build_transfer_model, build_datasets

CLASS_NAMES = ["modern", "minimalist", "industrial", "scandinavian"]  # "luxury" not yet sourced - add back once you have it
DATA_DIR = os.path.join(os.path.dirname(__file__), "datasets", "styles")
MODEL_OUT = os.path.join(os.path.dirname(__file__), "..", "models", "style_predictor.h5")
EPOCHS = 15


def main():
    if not os.path.isdir(DATA_DIR) or not any(os.scandir(DATA_DIR)):
        raise SystemExit(
            f"No dataset found at {DATA_DIR}.\n"
            f"Create subfolders {CLASS_NAMES} inside it, each full of style-labeled room images, then re-run."
        )

    train_ds, val_ds = build_datasets(DATA_DIR, CLASS_NAMES)
    model = build_transfer_model(num_classes=len(CLASS_NAMES))

    callbacks = [
        tf.keras.callbacks.EarlyStopping(patience=4, restore_best_weights=True),
    ]

    history = model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS, callbacks=callbacks)

    val_acc = max(history.history["val_accuracy"])
    print(f"Best validation accuracy: {val_acc:.3f}")

    os.makedirs(os.path.dirname(MODEL_OUT), exist_ok=True)
    model.save(MODEL_OUT)
    print(f"Saved model to {os.path.abspath(MODEL_OUT)}")
    print(f"Class order used: {CLASS_NAMES}")


if __name__ == "__main__":
    main()
