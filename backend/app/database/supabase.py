from __future__ import annotations

"""Shared Supabase client configuration for the application."""

from supabase import Client, create_client

from app.core.config import settings


supabase_client: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_KEY,
)

# Reuse this single client instance across services to avoid creating
# duplicate connections for every request or operation.
