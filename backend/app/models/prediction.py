from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    upload_id = Column(Integer, ForeignKey("uploads.id"), nullable=False, unique=True)

    # Room classification
    room_type = Column(String, nullable=False)
    room_confidence = Column(Float, nullable=False)

    # Style prediction
    style = Column(String, nullable=False)
    style_confidence = Column(Float, nullable=False)

    # Space optimization engine outputs
    comfort_score = Column(Float, nullable=False)          # 0-100
    crowdedness = Column(Float, nullable=False)             # 0-1
    movement_efficiency = Column(Float, nullable=False)     # 0-100
    layout_balance = Column(Float, nullable=False)          # 0-100

    # Dominant colors as a comma-separated list of hex codes, e.g. "#a1b2c3,#ffffff"
    dominant_colors = Column(Text, nullable=False)
    # Matching real pixel-proportion percentages for each color above, e.g. "34.2,26.1,20.5,12.0,7.2"
    dominant_color_percentages = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    upload = relationship("Upload", back_populates="prediction")