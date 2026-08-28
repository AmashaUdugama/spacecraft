from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship

from app.database import Base


class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    file_path = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)

    # user-supplied preferences captured at upload time
    budget = Column(String, nullable=True)      # "low" | "medium" | "high"
    lifestyle = Column(String, nullable=True)    # "student" | "family" | "remote_worker" | ...
    preferred_style = Column(String, nullable=True)

    uploaded_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="uploads")
    prediction = relationship("Prediction", back_populates="upload", uselist=False, cascade="all, delete-orphan")
