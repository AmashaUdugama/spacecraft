# SpaceCraft Backend

Full working FastAPI backend for the SpaceCraft interior design & space optimization system.

## What's real vs. placeholder right now

| Component | Status |
|---|---|
| Auth (register/login/JWT) | ✅ Fully real |
| Database (SQLite + SQLAlchemy) | ✅ Fully real |
| Image upload | ✅ Fully real |
| Dominant color extraction (K-Means) | ✅ Fully real, runs on every request |
| Comfort score (Random Forest) | ✅ **Actually trained** model (`app/ml/models/comfort_rf.pkl`) on synthetic labels — see note below |
| Room classification CNN | ⚠️ Tested training pipeline ready (`app/ml/training/train_room_classifier.py`) — needs a real dataset to actually train. Falls back to heuristic until you do. |
| Style prediction CNN | ⚠️ Same — training pipeline tested and working, needs your dataset. |
| Recommendation engine | ✅ Real rule/similarity-based matching (not "trained" by design) |

The two CNNs use image statistics (brightness/saturation/edges) as a stand-in so the **entire pipeline works end-to-end today**. Drop a trained `.h5` file into `app/ml/models/` and restart — zero code changes needed elsewhere, they're auto-detected and used.

The comfort model **is a real trained RandomForestRegressor** — since no public "room comfort" dataset exists, it's trained on synthetic labels generated from a defined scoring formula (documented in `app/ml/training/train_comfort_model.py`). This is a legitimate technique when no ground-truth data exists yet, but it's worth explaining this choice in your report.

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Train the comfort model once (takes a few seconds):
```bash
python -m app.ml.training.train_comfort_model
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Get JWT token (form fields: `username`=email, `password`) |
| GET | `/api/auth/me` | Yes | Current user info |
| POST | `/api/upload` | Yes | Upload room image + preferences (multipart form: `file`, `budget`, `lifestyle`, `preferred_style`) |
| POST | `/api/predict/{upload_id}` | Yes | Run full ML pipeline on an uploaded image |
| GET | `/api/recommend/{prediction_id}` | Yes | Get furniture/color/layout recommendations |
| GET | `/api/dashboard/history` | Yes | All past predictions for the logged-in user |
| GET | `/api/dashboard/summary` | Yes | Aggregate stats (avg comfort, room/style breakdown) |

All authenticated routes need header: `Authorization: Bearer <token>`

## Training the real CNNs

**See `app/ml/training/README.md` for the full guide** — dataset sourcing, folder layout, and how to run on Google Colab.

Quick version:
1. Put labeled images into `app/ml/training/datasets/rooms/<class>/` and `.../styles/<class>/`
2. Run `python -m app.ml.training.train_room_classifier` and `python -m app.ml.training.train_style_predictor` (ideally on Colab with GPU)
3. Copy the resulting `.h5` files into `app/ml/models/`
4. Restart the server — auto-detected, no other code changes needed

Both training scripts were built and verified end-to-end (train → save → reload → predict all confirmed working) before being handed to you.
