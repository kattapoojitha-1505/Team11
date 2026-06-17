from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import uuid4

from supabase import Client

from app.database.supabase import supabase_client


class ProjectService:
    """Service layer for managing projects in the projects table.
    
    
    """

    def __init__(self, client: Client | None = None) -> None:
        """Initialize the service with the shared Supabase client.
        """
        self.client = client or supabase_client

    def _check_project_ownership(self, project_id: str, owner_id: str) -> bool:
        """Helper method to verify that a project is owned by a specific user.
        """
        try:
            response = (
                self.client.table("projects")
                .select("owner_id")
                .eq("id", project_id)
                .execute()
            )

            if not response.data:
                return False

            return response.data[0]["owner_id"] == owner_id
        except Exception as e:
            raise Exception(f"Error checking project ownership: {str(e)}")

    def create_project(self, data: dict[str, Any]) -> dict[str, Any]:
        """Create a new project.
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
                "owner_id",
            ]
            
            missing_fields = [f for f in required_fields if f not in data]
            if missing_fields:
                raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
            
            # Prepare project data
            project_data = {
                "id": str(uuid4()),
                **data,
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
        """Retrieve a single project by its ID
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

    def get_projects_by_owner(self, owner_id: str) -> list[dict[str, Any]]:
        """Retrieve all projects created by a specific owner.
        """
        try:
            response = (
                self.client.table("projects")
                .select("*")
                .eq("owner_id", owner_id)
                .order("created_at", desc=True)
                .execute()
            )
            return response.data if response.data else []
        except Exception as e:
            raise Exception(f"Error retrieving projects for owner {owner_id}: {str(e)}")

    def update_project(
        self, project_id: str, owner_id: str, data: dict[str, Any]
    ) -> dict[str, Any]:
        """Update a project only if the current user owns it.
        """
        try:
            # Verify ownership
            if not self._check_project_ownership(project_id, owner_id):
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

    def delete_project(self, project_id: str, owner_id: str) -> bool:
        """Delete a project only if the current user owns it.
        """
        try:
            # Verify ownership
            if not self._check_project_ownership(project_id, owner_id):
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
