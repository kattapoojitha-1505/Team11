from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import uuid4

from supabase import Client

from app.database.supabase import supabase_client


class ProjectImageService:
    """Service layer for managing project images in the project_images table.
    
    Handles CRUD operations for project gallery images. Each image is linked
    to a project and includes metadata about creation time.
    """

    def __init__(self, client: Client | None = None) -> None:
        """Initialize the service with the shared Supabase client.
        
        Args:
            client: Optional Supabase Client instance. Defaults to the shared singleton.
        """
        self.client = client or supabase_client

    def add_project_image(self, project_id: str, image_url: str) -> dict[str, Any]:
        """Add a new image to a project's gallery.
        
        Creates a new record in the project_images table linking an image URL
        to a specific project.
        
        Args:
            project_id: UUID of the project to add image to
            image_url: URL of the image (typically from Supabase Storage)
            
        Returns:
            dict: The created image record with id, project_id, image_url, and created_at
            
        Raises:
            Exception: If image addition fails (project not found, database error, etc.)
        """
        try:
            # Validate that the project exists
            project_response = (
                self.client.table("projects")
                .select("id")
                .eq("id", project_id)
                .execute()
            )
            
            if not project_response.data:
                raise ValueError(f"Project not found: {project_id}")
            
            # Create image record
            image_data = {
                "id": str(uuid4()),
                "project_id": project_id,
                "image_url": image_url,
                "created_at": datetime.utcnow().isoformat(),
            }
            
            response = self.client.table("project_images").insert(image_data).execute()
            
            if not response.data:
                raise Exception("Failed to add image: No data returned")
                
            return response.data[0]
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Error adding image to project {project_id}: {str(e)}")

    def get_project_images(self, project_id: str) -> list[dict[str, Any]]:
        """Retrieve all images for a specific project.
        
        Returns images ordered by creation date (oldest first) to maintain
        the order they were added to the gallery.
        
        Args:
            project_id: UUID of the project
            
        Returns:
            list: List of image records for the project
            
        Raises:
            Exception: If database query fails
        """
        try:
            response = (
                self.client.table("project_images")
                .select("*")
                .eq("project_id", project_id)
                .order("created_at", desc=False)
                .execute()
            )
            
            return response.data if response.data else []
        except Exception as e:
            raise Exception(f"Error retrieving images for project {project_id}: {str(e)}")

    def get_image_by_id(self, image_id: str) -> dict[str, Any] | None:
        """Retrieve a specific image by its ID.
        
        Args:
            image_id: UUID of the image
            
        Returns:
            dict: The image record if found, None if not found
            
        Raises:
            Exception: If database query fails
        """
        try:
            response = (
                self.client.table("project_images")
                .select("*")
                .eq("id", image_id)
                .execute()
            )
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            raise Exception(f"Error retrieving image {image_id}: {str(e)}")

    def delete_project_image(self, image_id: str, project_id: str) -> bool:
        """Delete an image only if it belongs to the specified project.
        
        Validates that the image belongs to the provided project before deletion
        to prevent unauthorized image removal.
        
        Args:
            image_id: UUID of the image to delete
            project_id: UUID of the project (for validation)
            
        Returns:
            bool: True if deletion was successful
            
        Raises:
            Exception: If deletion fails or image doesn't belong to the project
        """
        try:
            # Verify the image belongs to the project
            image = self.get_image_by_id(image_id)
            
            if not image:
                raise ValueError(f"Image not found: {image_id}")
            
            if image["project_id"] != project_id:
                raise PermissionError(
                    f"Image {image_id} does not belong to project {project_id}"
                )
            
            # Delete the image
            response = (
                self.client.table("project_images")
                .delete()
                .eq("id", image_id)
                .execute()
            )
            
            return True
        except (ValueError, PermissionError) as e:
            raise e
        except Exception as e:
            raise Exception(f"Error deleting image {image_id}: {str(e)}")

    def delete_all_project_images(self, project_id: str) -> bool:
        """Delete all images for a project (bonus helper method).
        
        Useful when a project is being deleted to clean up its gallery.
        
        Args:
            project_id: UUID of the project whose images should be deleted
            
        Returns:
            bool: True if deletion was successful
            
        Raises:
            Exception: If deletion fails
        """
        try:
            response = (
                self.client.table("project_images")
                .delete()
                .eq("project_id", project_id)
                .execute()
            )
            
            return True
        except Exception as e:
            raise Exception(f"Error deleting images for project {project_id}: {str(e)}")

    def count_project_images(self, project_id: str) -> int:
        """Get the count of images for a project (bonus helper method).
        
        Args:
            project_id: UUID of the project
            
        Returns:
            int: Number of images for the project
            
        Raises:
            Exception: If database query fails
        """
        try:
            images = self.get_project_images(project_id)
            return len(images)
        except Exception as e:
            raise Exception(f"Error counting images for project {project_id}: {str(e)}")
