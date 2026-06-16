from __future__ import annotations

from datetime import datetime
from typing import Any

from supabase import Client
from supabase.lib.client_options import ClientOptions

from app.database.supabase import supabase_client


class ProfileService:
    """Service layer for managing user profiles in the profiles table.
    
    Handles CRUD operations for user profiles after successful Supabase Auth registration.
    Each profile is linked to an auth.users.id UUID.
    """

    def __init__(self, client: Client | None = None) -> None:
        """Initialize the service with the shared Supabase client.
        
        Args:
            client: Optional Supabase Client instance. Defaults to the shared singleton.
        """
        self.client = client or supabase_client

    def create_profile(self, user_id: str, username: str, email: str) -> dict[str, Any]:
        """Create a new user profile after successful Supabase Auth registration.
        
        This method is called immediately after a user registers with Supabase Auth.
        It creates a corresponding entry in the profiles table.
        
        Args:
            user_id: UUID from auth.users.id
            username: Unique username chosen by the user
            email: Email address of the user
            
        Returns:
            dict: The created profile record with all fields
            
        Raises:
            Exception: If profile creation fails (duplicate user_id, database error, etc.)
        """
        try:
            data = {
                "id": user_id,
                "username": username,
                "email": email,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
            }
            response = self.client.table("profiles").insert(data).execute()
            
            if not response.data:
                raise Exception("Failed to create profile: No data returned")
                
            return response.data[0]
        except Exception as e:
            raise Exception(f"Error creating profile for user {user_id}: {str(e)}")

    def get_profile_by_id(self, user_id: str) -> dict[str, Any] | None:
        """Retrieve a user profile by user ID.
        
        Args:
            user_id: UUID of the user (from auth.users.id)
            
        Returns:
            dict: The profile record if found, None if not found
            
        Raises:
            Exception: If database query fails
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
        """Update a user profile with new data.
        
        Only updates fields provided in the data dict. The updated_at timestamp
        is automatically updated to the current time.
        
        Args:
            user_id: UUID of the user to update
            data: Dictionary containing fields to update (e.g., {"username": "newname"})
            
        Returns:
            dict: The updated profile record
            
        Raises:
            Exception: If update fails or profile not found
        """
        try:
            # Add updated_at timestamp
            update_data = {
                **data,
                "updated_at": datetime.utcnow().isoformat(),
            }
            
            response = (
                self.client.table("profiles")
                .update(update_data)
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
        
        Note: In production, you may want to soft-delete profiles instead of hard-deleting.
        
        Args:
            user_id: UUID of the user to delete
            
        Returns:
            bool: True if deletion was successful
            
        Raises:
            Exception: If deletion fails
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
