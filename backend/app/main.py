from __future__ import annotations

from fastapi import FastAPI

from app.core.config import settings
from app.database.supabase import supabase_client

app = FastAPI(title="Backend API")


@app.get("/health")
async def health_check() -> dict[str, object]:
    """Verify the configuration and Supabase services can initialize."""
    return {
        "status": "ok",
        "app_name": app.title,
        "supabase_url_configured": bool(settings.SUPABASE_URL),
        "supabase_key_configured": bool(settings.SUPABASE_KEY),
        "supabase_client_initialized": supabase_client is not None,
        "storage_bucket": settings.SUPABASE_STORAGE_BUCKET,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
