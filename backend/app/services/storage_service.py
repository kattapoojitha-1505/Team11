from __future__ import annotations

from typing import Any

from supabase import Client

from app.database.supabase import supabase_client


class StorageService:
    """Service layer for managing Supabase Storage objects."""

    def __init__(self, client: Client | None = None) -> None:
        """Initialize the service with the shared client by default."""
        self.client = client or supabase_client

    def upload_file(self, bucket: str, path: str, file_data: bytes) -> Any:
        """Upload a file to a specific storage bucket."""
        return self.client.storage.from_(bucket).upload(path, file_data)

    def delete_file(self, bucket: str, path: str) -> Any:
        """Delete a file from a storage bucket."""
        return self.client.storage.from_(bucket).remove([path])

    def get_public_url(self, bucket: str, path: str) -> str:
        """Return the public URL for a stored object."""
        return self.client.storage.from_(bucket).get_public_url(path)
