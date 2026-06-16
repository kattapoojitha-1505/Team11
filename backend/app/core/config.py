from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    """Application settings loaded from environment variables.
    pydantic-settings reads variables from the ``.env`` file located at the project root.
    Validation ensures all required values are present before the app starts.
    """
    SUPABASE_URL: str
    SUPABASE_KEY: str
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    # Configure where to read the ``.env`` file from (project root)
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[2] / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )
# Export a singleton that can be imported throughout the codebase
settings = Settings()
