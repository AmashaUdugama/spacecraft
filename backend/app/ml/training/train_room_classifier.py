"""
Trains the room classification CNN (bedroom / kitchen / office / living_room)
using transfer learning on MobileNetV2, as described in the proposal's use
of TensorFlow + custom-trained CNN models.

USAGE:
1. Gather images into this structure:
   app/ml/training/datasets/rooms/
       bedroom/       (200+ images recommended)
       kitchen/
       office/
       living_room/

   Sources: Kaggle "House Rooms Image Dataset", MIT Indoor Scenes (filtered
   to these 4 categories). See dataset notes in README.

2. Run (ideally on Google Colab with a GPU for real datasets):
       python -m app.ml.training.train_room_classifier

3. Output: app/ml/models/room_classifier.h5
   The backend (app/ml/room_classifier.py) auto-detects and loads this file
   on next restart - no other code changes needed.
"""
import os
import tensorflow as tf

from app.ml.training.transfer_utils import build_transfer_model, build_datasets

CLASS_NAMES = ["bedroom", "kitchen", "living_room"]  # "office" not yet sourced - add back once you have it
DATA_DIR = os.path.join(os.path.dirname(__file__), "datasets", "rooms")
MODEL_OUT = os.path.join(os.path.dirname(__file__), "..", "models", "room_classifier.h5")
EPOCHS = 15


def main():
    if not os.path.isdir(DATA_DIR) or not any(os.scandir(DATA_DIR)):
        raise SystemExit(
            f"No dataset found at {DATA_DIR}.\n"
            f"Create subfolders {CLASS_NAMES} inside it, each full of room images, then re-run this script."
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
