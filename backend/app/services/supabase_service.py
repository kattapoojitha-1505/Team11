from __future__ import annotations

from typing import Any

from supabase import Client

from app.database.supabase import supabase_client


class SupabaseService:
    """Reusable database helper methods for common CRUD operations."""

    def __init__(self, client: Client | None = None) -> None:
        """Initialize the service with a shared client when one is not provided."""
        self.client = client or supabase_client

    def create_record(self, table: str, data: dict[str, Any]) -> Any:
        """Insert a new record into the given table."""
        return self.client.table(table).insert(data).execute()

    def get_record_by_id(self, table: str, record_id: str) -> Any:
        """Fetch a single record by its UUID identifier."""
        return self.client.table(table).select("*").eq("id", record_id).execute()

    def update_record(self, table: str, record_id: str, data: dict[str, Any]) -> Any:
        """Update a record identified by its UUID."""
        return self.client.table(table).update(data).eq("id", record_id).execute()

    def delete_record(self, table: str, record_id: str) -> Any:
        """Delete a record identified by its UUID."""
        return self.client.table(table).delete().eq("id", record_id).execute()
