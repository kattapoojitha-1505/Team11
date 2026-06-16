from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import uuid4

from supabase import Client

from app.database.supabase import supabase_client


class ProjectService:
    """Service layer for managing projects in the projects table.
    
    Handles CRUD operations for published applications/projects with ownership validation.
    Includes methods for filtering, updating, and analytics (visit tracking).
    """

    def __init__(self, client: Client | None = None) -> None:
        """Initialize the service with the shared Supabase client.
        
        Args:
            client: Optional Supabase Client instance. Defaults to the shared singleton.
        """
        self.client = client or supabase_client

    def _check_project_ownership(self, project_id: str, developer_id: str) -> bool:
        """Helper method to verify that a project is owned by a specific developer.
        
        Args:
            project_id: UUID of the project
            developer_id: UUID of the developer to verify ownership
            
        Returns:
            bool: True if project is owned by developer, False otherwise
            
        Raises:
            Exception: If database query fails
        """
        try:
            response = (
                self.client.table("projects")
                .select("developer_id")
                .eq("id", project_id)
                .execute()
            )
            
            if not response.data:
                return False
                
            return response.data[0]["developer_id"] == developer_id
        except Exception as e:
            raise Exception(f"Error checking project ownership: {str(e)}")

    def create_project(self, data: dict[str, Any]) -> dict[str, Any]:
        """Create a new project.
        
        The developer_id should be the UUID of the authenticated user creating the project.
        All required fields should be provided in the data dict.
        
        Args:
            data: Dictionary containing project data:
                - title: Project title (required)
                - short_description: Brief description (required)
                - description: Full description (required)
                - category: Project category (required)
                - tech_stack: List of technologies used (required)
                - project_url: URL to the project (required)
                - thumbnail_url: URL to project thumbnail (required)
                - developer_id: UUID of the project creator (required)
                
        Returns:
            dict: The created project record with generated id and timestamps
            
        Raises:
            Exception: If creation fails or required fields are missing
        """
        try:
            # Validate required fields
            required_fields = [
                "title",
                "short_description",
                "description",
                "category",
                "tech_stack",
                "project_url",
                "thumbnail_url",
                "developer_id",
            ]
            
            missing_fields = [f for f in required_fields if f not in data]
            if missing_fields:
                raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
            
            # Prepare project data
            project_data = {
                "id": str(uuid4()),
                **data,
                "visits_count": 0,
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
            }
            
            response = self.client.table("projects").insert(project_data).execute()
            
            if not response.data:
                raise Exception("Failed to create project: No data returned")
                
            return response.data[0]
        except Exception as e:
            raise Exception(f"Error creating project: {str(e)}")

    def get_all_projects(self) -> list[dict[str, Any]]:
        """Retrieve all public projects.
        
        Returns projects ordered by creation date (newest first).
        
        Returns:
            list: List of all project records
            
        Raises:
            Exception: If database query fails
        """
        try:
            response = (
                self.client.table("projects")
                .select("*")
                .order("created_at", desc=True)
                .execute()
            )
            return response.data if response.data else []
        except Exception as e:
            raise Exception(f"Error retrieving all projects: {str(e)}")

    def get_project_by_id(self, project_id: str) -> dict[str, Any] | None:
        """Retrieve a single project by its ID.
        
        Args:
            project_id: UUID of the project
            
        Returns:
            dict: The project record if found, None if not found
            
        Raises:
            Exception: If database query fails
        """
        try:
            response = (
                self.client.table("projects")
                .select("*")
                .eq("id", project_id)
                .execute()
            )
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            raise Exception(f"Error retrieving project {project_id}: {str(e)}")

    def get_projects_by_developer(self, developer_id: str) -> list[dict[str, Any]]:
        """Retrieve all projects created by a specific developer.
        
        Args:
            developer_id: UUID of the developer
            
        Returns:
            list: List of projects owned by the developer
            
        Raises:
            Exception: If database query fails
        """
        try:
            response = (
                self.client.table("projects")
                .select("*")
                .eq("developer_id", developer_id)
                .order("created_at", desc=True)
                .execute()
            )
            return response.data if response.data else []
        except Exception as e:
            raise Exception(f"Error retrieving projects for developer {developer_id}: {str(e)}")

    def update_project(
        self, project_id: str, developer_id: str, data: dict[str, Any]
    ) -> dict[str, Any]:
        """Update a project only if the current user owns it.
        
        This method enforces ownership validation - only the project creator
        can update their own project.
        
        Args:
            project_id: UUID of the project to update
            developer_id: UUID of the user requesting the update
            data: Dictionary of fields to update
            
        Returns:
            dict: The updated project record
            
        Raises:
            Exception: If update fails, project not found, or user doesn't own the project
        """
        try:
            # Verify ownership
            if not self._check_project_ownership(project_id, developer_id):
                raise PermissionError(
                    "You do not have permission to update this project"
                )
            
            # Add updated_at timestamp
            update_data = {
                **data,
                "updated_at": datetime.utcnow().isoformat(),
            }
            
            response = (
                self.client.table("projects")
                .update(update_data)
                .eq("id", project_id)
                .execute()
            )
            
            if not response.data:
                raise Exception(f"Project not found: {project_id}")
                
            return response.data[0]
        except PermissionError as e:
            raise e
        except Exception as e:
            raise Exception(f"Error updating project {project_id}: {str(e)}")

    def delete_project(self, project_id: str, developer_id: str) -> bool:
        """Delete a project only if the current user owns it.
        
        Enforces ownership validation - only the project creator can delete.
        
        Args:
            project_id: UUID of the project to delete
            developer_id: UUID of the user requesting deletion
            
        Returns:
            bool: True if deletion was successful
            
        Raises:
            Exception: If deletion fails, project not found, or user doesn't own the project
        """
        try:
            # Verify ownership
            if not self._check_project_ownership(project_id, developer_id):
                raise PermissionError(
                    "You do not have permission to delete this project"
                )
            
            response = (
                self.client.table("projects")
                .delete()
                .eq("id", project_id)
                .execute()
            )
            
            return True
        except PermissionError as e:
            raise e
        except Exception as e:
            raise Exception(f"Error deleting project {project_id}: {str(e)}")

    def increment_visit_count(self, project_id: str) -> dict[str, Any]:
        """Increment the visit count for a project.
        
        Call this method each time a project is viewed to track analytics.
        
        Args:
            project_id: UUID of the project
            
        Returns:
            dict: The updated project record with new visit count
            
        Raises:
            Exception: If update fails or project not found
        """
        try:
            # Get current visit count
            project = self.get_project_by_id(project_id)
            if not project:
                raise Exception(f"Project not found: {project_id}")
            
            current_visits = project.get("visits_count", 0)
            new_visits = current_visits + 1
            
            # Update with incremented count
            response = (
                self.client.table("projects")
                .update({"visits_count": new_visits})
                .eq("id", project_id)
                .execute()
            )
            
            if not response.data:
                raise Exception(f"Failed to update visit count for project {project_id}")
                
            return response.data[0]
        except Exception as e:
            raise Exception(f"Error incrementing visit count for project {project_id}: {str(e)}")

    def search_projects_by_category(self, category: str) -> list[dict[str, Any]]:
        """Search projects by category (bonus helper method).
        
        Args:
            category: Category name to filter by
            
        Returns:
            list: List of projects in the given category
            
        Raises:
            Exception: If database query fails
        """
        try:
            response = (
                self.client.table("projects")
                .select("*")
                .eq("category", category)
                .order("created_at", desc=True)
                .execute()
            )
            return response.data if response.data else []
        except Exception as e:
            raise Exception(f"Error searching projects by category {category}: {str(e)}")
