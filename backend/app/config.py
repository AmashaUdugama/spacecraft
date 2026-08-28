from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Central config. Values are read from a .env file in backend/ if present,
    otherwise these defaults are used. NEVER commit a real .env to git.
    """
    DATABASE_URL: str = "sqlite:///./spacecraft.db"
    SECRET_KEY: str = "dev-secret-change-me-before-deployment"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_MB: int = 10
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5173",
    ]

    class Config:
        env_file = ".env"


settings = Settings()
