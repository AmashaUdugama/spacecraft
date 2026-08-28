from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.upload import Upload
from app.models.prediction import Prediction
from app.schemas.predict import PredictionOut
from app.services.auth_service import get_current_user

from app.ml.room_classifier import get_room_classifier
from app.ml.style_predictor import get_style_predictor
from app.ml.comfort_model import get_comfort_model
from app.ml.color_extractor import extract_dominant_colors

router = APIRouter(prefix="/api/predict", tags=["predict"])


@router.post("/{upload_id}", response_model=PredictionOut, status_code=201)
def run_prediction(
    upload_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    upload = (
        db.query(Upload)
        .filter(Upload.id == upload_id, Upload.owner_id == current_user.id)
        .first()
    )
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    if upload.prediction:
        return upload.prediction  # idempotent - don't re-run if already predicted

    room_type, room_confidence = get_room_classifier().predict(upload.file_path)
    style, style_confidence = get_style_predictor().predict(upload.file_path)
    comfort = get_comfort_model().score(upload.file_path)
    color_results = extract_dominant_colors(upload.file_path, n_colors=5)  # list of (hex, percentage)

    prediction = Prediction(
        upload_id=upload.id,
        room_type=room_type,
        room_confidence=room_confidence,
        style=style,
        style_confidence=style_confidence,
        comfort_score=comfort["comfort_score"],
        crowdedness=comfort["crowdedness"],
        movement_efficiency=comfort["movement_efficiency"],
        layout_balance=comfort["layout_balance"],
        dominant_colors=",".join(hex_color for hex_color, _ in color_results),
        dominant_color_percentages=",".join(str(pct) for _, pct in color_results),
    )
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction