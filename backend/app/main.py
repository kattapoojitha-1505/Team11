from __future__ import annotations

from fastapi import FastAPI

from app.core.config import settings
from app.database.supabase import supabase_client
from app.services.storage_service import StorageService
from app.services.supabase_service import SupabaseService

app = FastAPI(title="Backend API")

supabase_service = SupabaseService()
storage_service = StorageService()


@app.get("/health")
async def health_check() -> dict[str, object]:
    """Verify the configuration and Supabase services can initialize."""
    return {
        "status": "ok",
        "app_name": app.title,
        "supabase_url_configured": bool(settings.SUPABASE_URL),
        "supabase_key_configured": bool(settings.SUPABASE_KEY),
        "supabase_client_initialized": supabase_client is not None,
        "services_ready": supabase_service is not None and storage_service is not None,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
