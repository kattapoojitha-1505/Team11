from __future__ import annotations

from datetime import datetime
from typing import Any

from supabase import Client
from supabase.lib.client_options import ClientOptions

from app.database.supabase import supabase_client


class ProfileService:
    """Service layer for managing user profiles in the profiles table.
    
    
    """

    def __init__(self, client: Client | None = None) -> None:
        """Initialize the service with the shared Supabase client.
        
        
        """
        self.client = client or supabase_client

    def create_profile(self, user_id: str, name: str, email: str) -> dict[str, Any]:
        """Create a new user profile after successful registration.

        This method creates a corresponding entry in the profiles table.
        """
        try:
            data = {
                "id": user_id,
                "name": name,
                "email": email,
                "created_at": datetime.utcnow().isoformat(),
            }
            response = self.client.table("profiles").insert(data).execute()

            if not response.data:
                raise Exception("Failed to create profile: No data returned")

            return response.data[0]
        except Exception as e:
            raise Exception(f"Error creating profile for user {user_id}: {str(e)}")

    def get_profile_by_id(self, user_id: str) -> dict[str, Any] | None:
        """Retrieve a user profile by user ID.
        
        
        """
        try:
            response = (
                self.client.table("profiles")
                .select("*")
                .eq("id", user_id)
                .execute()
            )
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            raise Exception(f"Error retrieving profile for user {user_id}: {str(e)}")

    def update_profile(self, user_id: str, data: dict[str, Any]) -> dict[str, Any]:
        """Update a user profile with new data."""
        try:
            if not data:
                raise ValueError("No profile fields provided to update")

            response = (
                self.client.table("profiles")
                .update(data)
                .eq("id", user_id)
                .execute()
            )

            if not response.data:
                raise Exception(f"Profile not found for user {user_id}")

            return response.data[0]
        except Exception as e:
            raise Exception(f"Error updating profile for user {user_id}: {str(e)}")

    def delete_profile(self, user_id: str) -> bool:
        """Delete a user profile.
        
         
        """
        try:
            response = (
                self.client.table("profiles")
                .delete()
                .eq("id", user_id)
                .execute()
            )
            return True
        except Exception as e:
            raise Exception(f"Error deleting profile for user {user_id}: {str(e)}")
