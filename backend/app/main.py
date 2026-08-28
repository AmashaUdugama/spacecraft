from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import Base, engine

# Import models so SQLAlchemy knows about every table before create_all()
from app.models import user, upload, prediction  # noqa: F401

from app.api import auth, upload as upload_api, predict, recommend, dashboard

# Creates spacecraft.db and all tables on first run if they don't exist yet
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SpaceCraft API",
    description="ML-Based Personalized Interior Design and Space Optimization System",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.include_router(auth.router)
app.include_router(upload_api.router)
app.include_router(predict.router)
app.include_router(recommend.router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "SpaceCraft API is running. See /docs for API documentation."}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
