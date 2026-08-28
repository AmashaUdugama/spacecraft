from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.prediction import Prediction
from app.schemas.predict import RecommendationOut
from app.services.auth_service import get_current_user
from app.services.recommendation_engine import generate_recommendations

router = APIRouter(prefix="/api/recommend", tags=["recommend"])


@router.get("/{prediction_id}", response_model=RecommendationOut)
def get_recommendations(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prediction = (
        db.query(Prediction)
        .join(Prediction.upload)
        .filter(Prediction.id == prediction_id)
        .first()
    )
    if not prediction or prediction.upload.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Prediction not found")

    colors = prediction.dominant_colors.split(",") if prediction.dominant_colors else []

    items = generate_recommendations(
        room_type=prediction.room_type,
        style=prediction.style,
        dominant_colors=colors,
        budget=prediction.upload.budget,
        lifestyle=prediction.upload.lifestyle,
    )

    return RecommendationOut(
        prediction_id=prediction.id,
        room_type=prediction.room_type,
        style=prediction.style,
        items=items,
    )
