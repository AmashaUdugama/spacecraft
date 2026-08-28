from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.user import User
from app.models.upload import Upload
from app.models.prediction import Prediction
from app.schemas.predict import PredictionOut
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/history", response_model=list[PredictionOut])
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    predictions = (
        db.query(Prediction)
        .join(Upload)
        .filter(Upload.owner_id == current_user.id)
        .order_by(Prediction.created_at.desc())
        .all()
    )
    return predictions


@router.get("/summary")
def get_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    base_query = (
        db.query(Prediction)
        .join(Upload)
        .filter(Upload.owner_id == current_user.id)
    )

    total = base_query.count()
    avg_comfort = base_query.with_entities(func.avg(Prediction.comfort_score)).scalar() or 0

    room_type_counts = (
        base_query.with_entities(Prediction.room_type, func.count(Prediction.id))
        .group_by(Prediction.room_type)
        .all()
    )
    style_counts = (
        base_query.with_entities(Prediction.style, func.count(Prediction.id))
        .group_by(Prediction.style)
        .all()
    )

    return {
        "total_uploads_analyzed": total,
        "average_comfort_score": round(float(avg_comfort), 2),
        "room_type_breakdown": dict(room_type_counts),
        "style_breakdown": dict(style_counts),
    }
