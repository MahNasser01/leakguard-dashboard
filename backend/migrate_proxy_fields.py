"""
Migration script to add proxy-related columns to the projects table.
Run this once to update your existing database schema.
"""
import sqlite3
import os

DB_PATH = "leakguard.db"

def migrate():
    """Add new columns to projects table if they don't exist."""
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} not found. It will be created on first run.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if columns exist
        cursor.execute("PRAGMA table_info(projects)")
        columns = [row[1] for row in cursor.fetchall()]
        
        # Add is_public column if it doesn't exist
        if 'is_public' not in columns:
            print("Adding is_public column...")
            cursor.execute("ALTER TABLE projects ADD COLUMN is_public BOOLEAN DEFAULT 0")
            print("✓ Added is_public column")
        else:
            print("✓ is_public column already exists")
        
        # Add proxy_slug column if it doesn't exist
        if 'proxy_slug' not in columns:
            print("Adding proxy_slug column...")
            cursor.execute("ALTER TABLE projects ADD COLUMN proxy_slug TEXT")
            print("✓ Added proxy_slug column")
        else:
            print("✓ proxy_slug column already exists")
        
        # Add supported_llms column if it doesn't exist
        if 'supported_llms' not in columns:
            print("Adding supported_llms column...")
            cursor.execute("ALTER TABLE projects ADD COLUMN supported_llms TEXT")
            print("✓ Added supported_llms column")
        else:
            print("✓ supported_llms column already exists")
        
        conn.commit()
        print("\nMigration completed successfully!")
        
    except Exception as e:
        conn.rollback()
        print(f"Error during migration: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    print("Running database migration...")
    migrate()

