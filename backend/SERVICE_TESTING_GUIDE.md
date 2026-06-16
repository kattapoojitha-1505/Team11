"""
COMPREHENSIVE TESTING AND USAGE GUIDE FOR DATABASE SERVICES
===========================================================

This guide covers how to test and use the three new service classes:
- ProfileService
- ProjectService  
- ProjectImageService

=================================================
PART 1: UNIT TESTING WITH PYTEST
=================================================

Install test dependencies:

pip install pytest pytest-supabase pytest-asyncio


Test File Structure:
app/tests/
├── __init__.py
├── conftest.py
├── test_profile_service.py
├── test_project_service.py
└── test_project_image_service.py


-------------------------------------------------
conftest.py - Shared Test Configuration
-------------------------------------------------

import pytest
from unittest.mock import Mock, MagicMock
from app.services.profile_service import ProfileService
from app.services.project_service import ProjectService
from app.services.project_image_service import ProjectImageService


@pytest.fixture
def mock_supabase_client():
    \"\"\"Fixture providing a mocked Supabase client for testing.\"\"\"
    client = Mock()
    client.table = MagicMock()
    client.storage = MagicMock()
    return client


@pytest.fixture
def profile_service(mock_supabase_client):
    \"\"\"Fixture providing ProfileService with mocked client.\"\"\"
    return ProfileService(client=mock_supabase_client)


@pytest.fixture
def project_service(mock_supabase_client):
    \"\"\"Fixture providing ProjectService with mocked client.\"\"\"
    return ProjectService(client=mock_supabase_client)


@pytest.fixture
def project_image_service(mock_supabase_client):
    \"\"\"Fixture providing ProjectImageService with mocked client.\"\"\"
    return ProjectImageService(client=mock_supabase_client)


@pytest.fixture
def sample_user_id():
    \"\"\"Sample UUID for testing.\"\"\"
    return "550e8400-e29b-41d4-a716-446655440000"


@pytest.fixture
def sample_project_id():
    \"\"\"Sample project UUID for testing.\"\"\"
    return "660e8400-e29b-41d4-a716-446655440001"


-------------------------------------------------
test_profile_service.py - Profile Service Tests
-------------------------------------------------

import pytest
from datetime import datetime
from app.services.profile_service import ProfileService


class TestProfileService:
    \"\"\"Tests for ProfileService CRUD operations.\"\"\"

    def test_create_profile_success(self, profile_service, mock_supabase_client, sample_user_id):
        \"\"\"Test successful profile creation.\"\"\"
        # Arrange
        username = "testuser"
        email = "test@example.com"
        
        mock_response = Mock()
        mock_response.data = [{
            "id": sample_user_id,
            "username": username,
            "email": email,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }]
        
        mock_supabase_client.table.return_value.insert.return_value.execute.return_value = mock_response
        
        # Act
        result = profile_service.create_profile(sample_user_id, username, email)
        
        # Assert
        assert result["id"] == sample_user_id
        assert result["username"] == username
        assert result["email"] == email
        mock_supabase_client.table.assert_called_once_with("profiles")

    def test_create_profile_missing_fields(self, profile_service):
        \"\"\"Test profile creation with missing fields raises error.\"\"\"
        with pytest.raises(Exception):
            profile_service.create_profile("", "username", "email@test.com")

    def test_get_profile_by_id_success(self, profile_service, mock_supabase_client, sample_user_id):
        \"\"\"Test successful profile retrieval.\"\"\"
        # Arrange
        mock_response = Mock()
        mock_response.data = [{
            "id": sample_user_id,
            "username": "testuser",
            "email": "test@example.com",
        }]
        
        mock_select = Mock()
        mock_select.eq.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value.select.return_value = mock_select
        
        # Act
        result = profile_service.get_profile_by_id(sample_user_id)
        
        # Assert
        assert result["id"] == sample_user_id
        assert result["username"] == "testuser"

    def test_get_profile_by_id_not_found(self, profile_service, mock_supabase_client, sample_user_id):
        \"\"\"Test getting non-existent profile returns None.\"\"\"
        # Arrange
        mock_response = Mock()
        mock_response.data = []
        
        mock_select = Mock()
        mock_select.eq.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value.select.return_value = mock_select
        
        # Act
        result = profile_service.get_profile_by_id(sample_user_id)
        
        # Assert
        assert result is None

    def test_update_profile_success(self, profile_service, mock_supabase_client, sample_user_id):
        \"\"\"Test successful profile update.\"\"\"
        # Arrange
        update_data = {"username": "newusername"}
        
        mock_response = Mock()
        mock_response.data = [{
            "id": sample_user_id,
            "username": "newusername",
            "email": "test@example.com",
            "updated_at": datetime.utcnow().isoformat(),
        }]
        
        mock_update = Mock()
        mock_update.eq.return_value.execute.return_value = mock_response
        mock_supabase_client.table.return_value.update.return_value = mock_update
        
        # Act
        result = profile_service.update_profile(sample_user_id, update_data)
        
        # Assert
        assert result["username"] == "newusername"
        mock_supabase_client.table.assert_called_once_with("profiles")


-------------------------------------------------
test_project_service.py - Project Service Tests
-------------------------------------------------

import pytest
from app.services.project_service import ProjectService


class TestProjectService:
    \"\"\"Tests for ProjectService CRUD operations.\"\"\"

    def test_create_project_success(self, project_service, mock_supabase_client, sample_user_id, sample_project_id):
        \"\"\"Test successful project creation.\"\"\"
        # Arrange
        project_data = {
            "title": "My Awesome App",
            "short_description": "A cool application",
            "description": "A very cool application that does X",
            "category": "Mobile",
            "tech_stack": ["React Native", "Firebase"],
            "project_url": "https://example.com",
            "thumbnail_url": "https://storage.example.com/thumb.jpg",
            "developer_id": sample_user_id,
        }
        
        mock_response = Mock()
        mock_response.data = [{
            "id": sample_project_id,
            **project_data,
            "visits_count": 0,
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00",
        }]
        
        mock_supabase_client.table.return_value.insert.return_value.execute.return_value = mock_response
        
        # Act
        result = project_service.create_project(project_data)
        
        # Assert
        assert result["id"] == sample_project_id
        assert result["title"] == "My Awesome App"
        assert result["visits_count"] == 0

    def test_create_project_missing_required_fields(self, project_service):
        \"\"\"Test project creation fails with missing required fields.\"\"\"
        incomplete_data = {
            "title": "My Project",
            # Missing other required fields
        }
        
        with pytest.raises(Exception) as exc_info:
            project_service.create_project(incomplete_data)
        
        assert "Missing required fields" in str(exc_info.value)

    def test_get_all_projects_success(self, project_service, mock_supabase_client):
        \"\"\"Test retrieving all projects.\"\"\"
        # Arrange
        mock_response = Mock()
        mock_response.data = [
            {
                "id": "proj1",
                "title": "Project 1",
                "visits_count": 10,
            },
            {
                "id": "proj2",
                "title": "Project 2",
                "visits_count": 20,
            },
        ]
        
        mock_order = Mock()
        mock_order.execute.return_value = mock_response
        mock_select = Mock()
        mock_select.order.return_value = mock_order
        mock_supabase_client.table.return_value.select.return_value = mock_select
        
        # Act
        result = project_service.get_all_projects()
        
        # Assert
        assert len(result) == 2
        assert result[0]["title"] == "Project 1"

    def test_get_project_by_id_success(self, project_service, mock_supabase_client, sample_project_id):
        \"\"\"Test retrieving a single project by ID.\"\"\"
        # Arrange
        mock_response = Mock()
        mock_response.data = [{
            "id": sample_project_id,
            "title": "Test Project",
        }]
        
        mock_eq = Mock()
        mock_eq.execute.return_value = mock_response
        mock_select = Mock()
        mock_select.eq.return_value = mock_eq
        mock_supabase_client.table.return_value.select.return_value = mock_select
        
        # Act
        result = project_service.get_project_by_id(sample_project_id)
        
        # Assert
        assert result["id"] == sample_project_id
        assert result["title"] == "Test Project"

    def test_update_project_unauthorized(self, project_service, mock_supabase_client, sample_project_id):
        \"\"\"Test update fails when user doesn't own project.\"\"\"
        # Arrange - mock ownership check to return False
        different_developer_id = "different-uuid"
        mock_response = Mock()
        mock_response.data = [{"developer_id": "other-dev-id"}]
        
        mock_eq = Mock()
        mock_eq.execute.return_value = mock_response
        mock_select = Mock()
        mock_select.eq.return_value = mock_eq
        mock_supabase_client.table.return_value.select.return_value = mock_select
        
        # Act & Assert
        with pytest.raises(PermissionError):
            project_service.update_project(sample_project_id, different_developer_id, {"title": "New Title"})

    def test_increment_visit_count_success(self, project_service, mock_supabase_client, sample_project_id):
        \"\"\"Test incrementing visit count.\"\"\"
        # Arrange - First call returns current project, second call returns updated
        mock_get_response = Mock()
        mock_get_response.data = [{"visits_count": 5}]
        
        mock_update_response = Mock()
        mock_update_response.data = [{"visits_count": 6}]
        
        mock_eq = Mock()
        mock_eq.execute.return_value = mock_get_response
        mock_select = Mock()
        mock_select.eq.return_value = mock_eq
        
        mock_update_eq = Mock()
        mock_update_eq.execute.return_value = mock_update_response
        mock_update = Mock()
        mock_update.eq.return_value = mock_update_eq
        
        mock_supabase_client.table.side_effect = [
            Mock(select=Mock(return_value=mock_select)),
            Mock(update=Mock(return_value=mock_update)),
        ]
        
        # Act
        result = project_service.increment_visit_count(sample_project_id)
        
        # Assert
        assert result["visits_count"] == 6


-------------------------------------------------
test_project_image_service.py - Image Service Tests
-------------------------------------------------

import pytest
from app.services.project_image_service import ProjectImageService


class TestProjectImageService:
    \"\"\"Tests for ProjectImageService operations.\"\"\"

    def test_add_project_image_success(self, project_image_service, mock_supabase_client, 
                                       sample_project_id):
        \"\"\"Test successfully adding an image to a project.\"\"\"
        # Arrange
        image_url = "https://storage.example.com/image.jpg"
        image_id = "img-uuid-123"
        
        # Mock project existence check
        mock_project_response = Mock()
        mock_project_response.data = [{"id": sample_project_id}]
        
        # Mock image creation
        mock_image_response = Mock()
        mock_image_response.data = [{
            "id": image_id,
            "project_id": sample_project_id,
            "image_url": image_url,
            "created_at": "2024-01-01T00:00:00",
        }]
        
        mock_project_eq = Mock()
        mock_project_eq.execute.return_value = mock_project_response
        mock_project_select = Mock()
        mock_project_select.eq.return_value = mock_project_eq
        
        mock_insert = Mock()
        mock_insert.execute.return_value = mock_image_response
        
        mock_supabase_client.table.side_effect = [
            Mock(select=Mock(return_value=mock_project_select)),
            Mock(insert=Mock(return_value=mock_insert)),
        ]
        
        # Act
        result = project_image_service.add_project_image(sample_project_id, image_url)
        
        # Assert
        assert result["id"] == image_id
        assert result["project_id"] == sample_project_id
        assert result["image_url"] == image_url

    def test_add_project_image_project_not_found(self, project_image_service, mock_supabase_client, 
                                                  sample_project_id):
        \"\"\"Test adding image to non-existent project fails.\"\"\"
        # Arrange
        mock_response = Mock()
        mock_response.data = []  # Project not found
        
        mock_eq = Mock()
        mock_eq.execute.return_value = mock_response
        mock_select = Mock()
        mock_select.eq.return_value = mock_eq
        mock_supabase_client.table.return_value.select.return_value = mock_select
        
        # Act & Assert
        with pytest.raises(ValueError) as exc_info:
            project_image_service.add_project_image(sample_project_id, "https://example.com/img.jpg")
        
        assert "Project not found" in str(exc_info.value)

    def test_get_project_images_success(self, project_image_service, mock_supabase_client, 
                                        sample_project_id):
        \"\"\"Test retrieving images for a project.\"\"\"
        # Arrange
        mock_response = Mock()
        mock_response.data = [
            {
                "id": "img1",
                "project_id": sample_project_id,
                "image_url": "https://example.com/img1.jpg",
            },
            {
                "id": "img2",
                "project_id": sample_project_id,
                "image_url": "https://example.com/img2.jpg",
            },
        ]
        
        mock_order = Mock()
        mock_order.execute.return_value = mock_response
        mock_eq = Mock()
        mock_eq.order.return_value = mock_order
        mock_select = Mock()
        mock_select.eq.return_value = mock_eq
        mock_supabase_client.table.return_value.select.return_value = mock_select
        
        # Act
        result = project_image_service.get_project_images(sample_project_id)
        
        # Assert
        assert len(result) == 2
        assert result[0]["image_url"] == "https://example.com/img1.jpg"

    def test_delete_project_image_unauthorized(self, project_image_service, mock_supabase_client):
        \"\"\"Test deleting image from wrong project fails.\"\"\"
        # Arrange
        image_id = "img-123"
        wrong_project_id = "wrong-proj-id"
        
        mock_response = Mock()
        mock_response.data = [{
            "id": image_id,
            "project_id": "actual-proj-id",  # Different project
        }]
        
        mock_eq = Mock()
        mock_eq.execute.return_value = mock_response
        mock_select = Mock()
        mock_select.eq.return_value = mock_eq
        mock_supabase_client.table.return_value.select.return_value = mock_select
        
        # Act & Assert
        with pytest.raises(PermissionError):
            project_image_service.delete_project_image(image_id, wrong_project_id)


=================================================
PART 2: RUNNING THE TESTS
=================================================

Run all tests:
    pytest

Run tests with verbose output:
    pytest -v

Run specific test file:
    pytest app/tests/test_profile_service.py

Run specific test class:
    pytest app/tests/test_profile_service.py::TestProfileService

Run specific test:
    pytest app/tests/test_profile_service.py::TestProfileService::test_create_profile_success

Run with coverage report:
    pytest --cov=app.services app/tests/

=================================================
PART 3: INTEGRATION TESTING
=================================================

For integration tests against a real Supabase instance:

@pytest.fixture
def real_supabase_client():
    \"\"\"Fixture for real Supabase client.\"\"\"
    from app.database.supabase import supabase_client
    return supabase_client


class TestProfileServiceIntegration:
    \"\"\"Integration tests against real Supabase database.\"\"\"
    
    def test_create_and_retrieve_profile(self, real_supabase_client):
        \"\"\"Test creating a profile and retrieving it.\"\"\"
        from app.services.profile_service import ProfileService
        
        service = ProfileService(client=real_supabase_client)
        
        # Create
        user_id = "test-user-" + str(uuid4())
        profile = service.create_profile(user_id, "testuser", "test@example.com")
        
        # Retrieve
        retrieved = service.get_profile_by_id(user_id)
        
        assert retrieved["username"] == "testuser"
        
        # Cleanup
        service.delete_profile(user_id)


=================================================
PART 4: EXAMPLE FUNCTION CALLS IN FASTAPI ROUTES
=================================================

-------------------------------------------------
Profile Routes Example
-------------------------------------------------

from fastapi import APIRouter, Depends, HTTPException, status
from app.services.profile_service import ProfileService
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/profiles", tags=["profiles"])

@router.get("/{user_id}")
def get_profile(user_id: str):
    \"\"\"Get a user's profile.\"\"\"
    service = ProfileService()
    try:
        profile = service.get_profile_by_id(user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
def create_profile(
    user_id: str,
    username: str,
    email: str,
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Create a new profile (called after Supabase Auth registration).\"\"\"
    service = ProfileService()
    try:
        # Ensure user can only create their own profile
        if current_user["sub"] != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        profile = service.create_profile(user_id, username, email)
        return profile
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/{user_id}")
def update_profile(
    user_id: str,
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Update your own profile.\"\"\"
    service = ProfileService()
    try:
        if current_user["sub"] != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        updated = service.update_profile(user_id, data)
        return updated
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


-------------------------------------------------
Project Routes Example
-------------------------------------------------

from fastapi import APIRouter, Depends, HTTPException, Query
from app.services.project_service import ProjectService
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/projects", tags=["projects"])

@router.post("/")
def create_project(
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Create a new project.\"\"\"
    service = ProjectService()
    try:
        # Add the current user as developer
        data["developer_id"] = current_user["sub"]
        project = service.create_project(data)
        return project
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
def get_all_projects(skip: int = Query(0), limit: int = Query(10)):
    \"\"\"Get all projects (paginated).\"\"\"
    service = ProjectService()
    try:
        projects = service.get_all_projects()
        # Simple pagination
        return projects[skip:skip + limit]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{project_id}")
def get_project(project_id: str):
    \"\"\"Get a specific project and increment visit count.\"\"\"
    service = ProjectService()
    try:
        project = service.get_project_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Increment visits
        service.increment_visit_count(project_id)
        
        return project
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/developer/{developer_id}")
def get_developer_projects(developer_id: str):
    \"\"\"Get all projects by a specific developer.\"\"\"
    service = ProjectService()
    try:
        projects = service.get_projects_by_developer(developer_id)
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{project_id}")
def update_project(
    project_id: str,
    data: dict,
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Update your own project.\"\"\"
    service = ProjectService()
    try:
        updated = service.update_project(project_id, current_user["sub"], data)
        return updated
    except PermissionError:
        raise HTTPException(status_code=403, detail="You don't own this project")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{project_id}")
def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Delete your own project.\"\"\"
    service = ProjectService()
    try:
        service.delete_project(project_id, current_user["sub"])
        return {"message": "Project deleted successfully"}
    except PermissionError:
        raise HTTPException(status_code=403, detail="You don't own this project")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


-------------------------------------------------
Project Image Routes Example
-------------------------------------------------

from fastapi import APIRouter, Depends, HTTPException
from app.services.project_image_service import ProjectImageService
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/api/projects/{project_id}/images", tags=["images"])

@router.post("/")
def add_image(
    project_id: str,
    image_url: str,
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Add an image to a project.\"\"\"
    from app.services.project_service import ProjectService
    
    project_service = ProjectService()
    image_service = ProjectImageService()
    
    try:
        # Verify ownership
        project = project_service.get_project_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if project["developer_id"] != current_user["sub"]:
            raise HTTPException(status_code=403, detail="You don't own this project")
        
        # Add image
        image = image_service.add_project_image(project_id, image_url)
        return image
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
def get_project_images(project_id: str):
    \"\"\"Get all images for a project.\"\"\"
    service = ProjectImageService()
    try:
        images = service.get_project_images(project_id)
        return images
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{image_id}")
def delete_image(
    project_id: str,
    image_id: str,
    current_user: dict = Depends(get_current_user)
):
    \"\"\"Delete an image from your project.\"\"\"
    from app.services.project_service import ProjectService
    
    project_service = ProjectService()
    image_service = ProjectImageService()
    
    try:
        # Verify project ownership
        project = project_service.get_project_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if project["developer_id"] != current_user["sub"]:
            raise HTTPException(status_code=403, detail="You don't own this project")
        
        # Delete image
        image_service.delete_project_image(image_id, project_id)
        return {"message": "Image deleted successfully"}
    except PermissionError:
        raise HTTPException(status_code=403, detail="Image doesn't belong to this project")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


=================================================
PART 5: CHANGES TO EXISTING SUPABASESERVICE
=================================================

The existing SupabaseService is generic and provides basic CRUD operations.
For these specific services, it may be helpful to add these helper methods:


def filter_records(self, table: str, filters: dict[str, Any]) -> Any:
    \"\"\"Filter records by multiple conditions.
    
    Example:
        filters = {"status": "published", "category": "mobile"}
        records = service.filter_records("projects", filters)
    \"\"\"
    query = self.client.table(table).select("*")
    for key, value in filters.items():
        query = query.eq(key, value)
    return query.execute()


def order_records(self, table: str, order_by: str, ascending: bool = False) -> Any:
    \"\"\"Get records ordered by a field.\"\"\"
    return (
        self.client.table(table)
        .select("*")
        .order(order_by, desc=not ascending)
        .execute()
    )


def count_records(self, table: str, filter_key: str = None, filter_value: Any = None) -> int:
    \"\"\"Count records in a table, optionally filtered.\"\"\"
    query = self.client.table(table).select("id", count="exact")
    if filter_key and filter_value is not None:
        query = query.eq(filter_key, filter_value)
    result = query.execute()
    return result.count


However, these are optional and the current services work fine without them.

=================================================
PART 6: TESTING CHECKLIST
=================================================

ProfileService:
- ✓ Create profile with valid data
- ✓ Create profile fails without required fields
- ✓ Get profile by ID (found and not found cases)
- ✓ Update profile successfully
- ✓ Delete profile
- ✓ Timestamps are correctly set

ProjectService:
- ✓ Create project with all required fields
- ✓ Create fails with missing fields
- ✓ Get all projects
- ✓ Get single project
- ✓ Get projects by developer
- ✓ Update project (only owner can update)
- ✓ Delete project (only owner can delete)
- ✓ Increment visit count
- ✓ Ownership validation works

ProjectImageService:
- ✓ Add image to project
- ✓ Add image to non-existent project fails
- ✓ Get all images for project
- ✓ Get specific image by ID
- ✓ Delete image (with project verification)
- ✓ Delete image from wrong project fails
- ✓ Count images for project

"""
