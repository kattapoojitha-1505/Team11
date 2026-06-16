"""Verification script to test all imports."""

from app.database.supabase import supabase_client
from app.services.supabase_service import SupabaseService
from app.services.storage_service import StorageService


if __name__ == "__main__":
    print("✓ Supabase client imported successfully")
    print(f"✓ Client type: {type(supabase_client).__name__}")
    
    service = SupabaseService()
    print("✓ SupabaseService imported and instantiated successfully")
    
    storage_service = StorageService()
    print("✓ StorageService imported and instantiated successfully")
    
    print("\n✅ All imports verified successfully!")
    print("Backend services are ready for use.")