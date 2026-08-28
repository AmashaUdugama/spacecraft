# Training the Real CNN Models

## Dataset status — what's actually included vs. what you still need

**Already included in this project — real, verified, loading correctly through the training pipeline:**

Room classifier (3 of 4 classes):
- `datasets/rooms/bedroom/` — 535 images (GitHub: emanhamed/Houses-dataset)
- `datasets/rooms/kitchen/` — 1,500 images (Kaggle house-rooms dataset, merged with the GitHub set)
- `datasets/rooms/living_room/` — 1,273 images (Kaggle house-rooms dataset)
- `datasets/rooms/office/` — **still missing**

Style predictor (4 of 5 classes):
- `datasets/styles/modern/` — 106 images
- `datasets/styles/minimalist/` — 92 images
- `datasets/styles/industrial/` — 99 images
- `datasets/styles/scandinavian/` — 99 images
- Source: Roboflow interiordesign dataset, sorted using its `_classes.csv` ground-truth labels (309 multi-labeled images were excluded to keep training clean — only single-label images used)
- `datasets/styles/luxury/` — **still missing**

**⚠️ Important — class list mismatch to fix before training the final version:**
`train_room_classifier.py` and `train_style_predictor.py` are currently set to
train on only the classes with real data (3 rooms, 4 styles). But
`app/ml/room_classifier.py` and `app/ml/style_predictor.py` (the backend
inference code) still list the full original class sets (4 rooms, 5 styles)
for their heuristic fallback mode. **If you train now with the reduced
class lists, you must update the `CLASSES`/`CLASS_NAMES` list in those two
inference files to match exactly** (same classes, same order) before the
real model will give correct predictions — otherwise it'll load fine but
mislabel outputs. Simplest fix: get `office` and `luxury` data before your
final training run, so all files stay at the original 4/5 classes and
nothing needs changing.


This closes the TensorFlow gap between your proposal and the implementation.
Both training scripts here are **tested and confirmed working** (train → save
→ reload → predict, verified end-to-end) — you just need to supply real
image datasets.

## Why transfer learning (MobileNetV2), not training from scratch

Your proposal describes "custom-trained CNN models." Transfer learning
still means you are training a real CNN — you're taking a pretrained
MobileNetV2 backbone and training a new classification head on top of it
for your specific classes. This is standard, legitimate practice and is
what almost every real-world small-dataset image classifier does. Training
a CNN completely from scratch would need many thousands of images per
class to avoid overfitting, which isn't realistic for a student project
timeline.

If your module specifically requires a "from scratch" custom architecture
(not transfer learning) for full marks, tell me and I'll write that version
instead — it's a straightforward swap, but needs a much larger dataset to
get any real accuracy.

## Step 1 — Get datasets

### Room classifier (bedroom / kitchen / office / living_room)
- **Kaggle**: search "House Rooms Image Dataset" or "Indoor Scene Recognition"
- **MIT Indoor Scenes**: http://web.mit.edu/torralba/www/indoor.html — filter down to just your 4 categories
- Aim for **200+ images per class minimum**, ideally 400-500+ for decent accuracy

### Style predictor (modern / minimalist / luxury / industrial / scandinavian)
- Harder to find pre-labeled — search Kaggle for "interior design style dataset"
- You may need to manually curate/sort images by style from Pinterest-style sources (respect copyright/licensing - use datasets with clear licenses for academic use)
- This is the weakest-data category — expect lower accuracy here than room classification, and say so honestly in your evaluation chapter

## Step 2 — Arrange the folders exactly like this

```
backend/app/ml/training/datasets/
├── rooms/
│   ├── bedroom/          <- put bedroom images here (.jpg/.png)
│   ├── kitchen/
│   ├── office/
│   └── living_room/
└── styles/
    ├── modern/
    ├── minimalist/
    ├── luxury/
    ├── industrial/
    └── scandinavian/
```

Folder names must match exactly (lowercase, underscores where shown) — the training scripts read class names directly from these folder names.

## Step 3 — Where to actually run training

**Do not train on a laptop CPU** — it'll be painfully slow. Use **Google Colab** (free GPU):

1. Go to https://colab.research.google.com, new notebook
2. Runtime → Change runtime type → GPU
3. Upload your `backend/app` folder (or clone from GitHub if you've pushed it)
4. Upload your dataset folders into `app/ml/training/datasets/`
5. In a Colab cell:
   ```python
   !pip install tensorflow -q
   %cd app
   !python -m ml.training.train_room_classifier
   !python -m ml.training.train_style_predictor
   ```
   (adjust the `%cd` path to match wherever you uploaded `app/`)
6. Download the resulting `.h5` files from `app/ml/models/`

## Step 4 — Drop the trained models into your project

Copy the downloaded files into:
```
backend/app/ml/models/room_classifier.h5
backend/app/ml/models/style_predictor.h5
```

Restart your backend server. That's it — `room_classifier.py` and
`style_predictor.py` automatically detect these files and use real CNN
inference instead of the heuristic fallback. **No other code changes
needed anywhere.**

## Step 5 — Confirm it's using the real model

Check your backend terminal output when it starts — if there's no message
about "using heuristic fallback," the real model loaded successfully. You
can also check by running a prediction and comparing outputs: the heuristic
gives fairly generic confidence scores; a real trained model's confidence
distribution will look different (often much higher on clear images).

## What to write in your report

Document honestly: which real dataset(s) you used, how many images per
class, your train/validation split, the transfer-learning architecture
(MobileNetV2 frozen + custom dense head), your actual achieved validation
accuracy (from the script's printed output), and the limitation that style
prediction accuracy is constrained by the smaller/messier available
datasets for that category. This kind of honest evaluation is exactly what
the "Use of Literature" and "Analysis and Discussion" marking criteria are
looking for.
