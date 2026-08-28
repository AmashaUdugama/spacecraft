import os
import uuid

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.upload import Upload
from app.schemas.predict import UploadOut
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/upload", tags=["upload"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


@router.post("", response_model=UploadOut, status_code=201)
def upload_room_image(
    file: UploadFile = File(...),
    budget: str | None = Form(default=None),          # "low" | "medium" | "high"
    lifestyle: str | None = Form(default=None),        # "student" | "family" | "remote_worker" | ...
    preferred_style: str | None = Form(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only .jpg, .jpeg, .png files are supported")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    unique_name = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(settings.UPLOAD_DIR, unique_name)

    contents = file.file.read()
    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(status_code=400, detail=f"File too large (max {settings.MAX_UPLOAD_MB}MB)")

    with open(save_path, "wb") as f:
        f.write(contents)

    upload = Upload(
        owner_id=current_user.id,
        file_path=save_path,
        original_filename=file.filename,
        budget=budget,
        lifestyle=lifestyle,
        preferred_style=preferred_style,
    )
    db.add(upload)
    db.commit()
    db.refresh(upload)
    return upload
