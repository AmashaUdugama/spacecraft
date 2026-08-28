"""
Shared transfer-learning setup for both CNN models (room classifier, style
predictor). Uses MobileNetV2 pretrained on ImageNet as a frozen feature
extractor, with a small trainable classification head on top.

Why transfer learning instead of training a CNN from scratch (as hinted in
the proposal): with only a few hundred images per class, training from
scratch overfits badly and needs far more data/GPU time than is realistic
for a final year project timeline. Transfer learning is standard practice
and still counts as "using TensorFlow / building a CNN model" - you're
fine-tuning a real CNN, not calling an external prediction API.
"""
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import MobileNetV2

IMG_SIZE = (224, 224)


def build_transfer_model(num_classes: int, fine_tune_base: bool = False) -> tf.keras.Model:
    base_model = MobileNetV2(
        input_shape=IMG_SIZE + (3,),
        include_top=False,
        weights="imagenet",
    )
    base_model.trainable = fine_tune_base  # False = frozen feature extractor (fast, needs less data)

    inputs = layers.Input(shape=IMG_SIZE + (3,))
    # Rescaling(scale=1/127.5, offset=-1) replicates mobilenet_v2.preprocess_input
    # (maps 0-255 -> -1..1) using a proper serializable Keras layer, instead of
    # calling the raw preprocess_input function inline (which breaks .h5 reload).
    x = layers.Rescaling(scale=1 / 127.5, offset=-1)(inputs)
    x = base_model(x, training=fine_tune_base)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)

    model = models.Model(inputs, outputs)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def build_datasets(data_dir: str, class_names: list[str], batch_size: int = 16, val_split: float = 0.2):
    """
    data_dir must contain one subfolder per class name, each full of images:
        data_dir/
            bedroom/*.jpg
            kitchen/*.jpg
            office/*.jpg
            living_room/*.jpg
    """
    train_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=val_split,
        subset="training",
        seed=42,
        image_size=IMG_SIZE,
        batch_size=batch_size,
        label_mode="categorical",
        class_names=class_names,
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        data_dir,
        validation_split=val_split,
        subset="validation",
        seed=42,
        image_size=IMG_SIZE,
        batch_size=batch_size,
        label_mode="categorical",
        class_names=class_names,
    )

    # Light augmentation on the training set only - helps a lot with small datasets
    augment = tf.keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.05),
        layers.RandomZoom(0.1),
        layers.RandomContrast(0.1),
    ])
    train_ds = train_ds.map(lambda x, y: (augment(x, training=True), y))

    train_ds = train_ds.prefetch(tf.data.AUTOTUNE)
    val_ds = val_ds.prefetch(tf.data.AUTOTUNE)
    return train_ds, val_ds
