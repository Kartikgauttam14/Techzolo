import os
from dotenv import load_dotenv
from datetime import datetime
import bcrypt
import psycopg2
from psycopg2 import sql
from psycopg2.extras import DictCursor
import bcrypt
import os
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from urllib.parse import urlparse, quote_plus

load_dotenv(dotenv_path='.env.local')

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/techzolo")

class DatabaseManager:
    """Database management utility for Tech Zolo"""
    
    def __init__(self):
        self.db_url = DATABASE_URL

    def get_db_connection(self):
        """Establishes a connection to the PostgreSQL database."""
        parsed_url = urlparse(self.db_url)
        encoded_password = quote_plus(parsed_url.password)
        
        # Reconstruct the URL with the encoded password
        # Handle cases where there might not be a password (though unlikely for Supabase)
        if parsed_url.password:
            netloc = f"{parsed_url.username}:{encoded_password}@{parsed_url.hostname}:{parsed_url.port}"
        else:
            netloc = f"{parsed_url.username}@{parsed_url.hostname}:{parsed_url.port}"

        encoded_url = parsed_url._replace(netloc=netloc).geturl()
        return psycopg2.connect(encoded_url)

    def execute_sql_file(self, script_path: str):
        """Executes an SQL script against the PostgreSQL database."""
        conn = None
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()
            with open(script_path, 'r') as f:
                sql_script = f.read()
                cursor.execute(sql_script)
            conn.commit()
            print(f"Successfully executed SQL script: {script_path}")
            return True
        except Exception as e:
            if conn:
                conn.rollback()
            print(f"Error executing SQL script {script_path}: {e}")
            return False
        finally:
            if conn:
                conn.close()

    def drop_all_tables(self):
        """Drops all tables in the database."""
        conn = None
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()
            cursor.execute("DROP SCHEMA public CASCADE; CREATE SCHEMA public;")
            conn.commit()
            print("All tables dropped successfully.")
            return True
        except Exception as e:
            if conn:
                conn.rollback()
            print(f"Error dropping tables: {e}")
            return False
        finally:
            if conn:
                conn.close()
    
    def setup_database(self):
        """Set up the complete database with schema and seed data"""
        print("Setting up Tech Zolo PostgreSQL database...")
        
        # Drop all tables before setting up to ensure a clean slate
        self.drop_all_tables()

        # Execute schema
        if self.execute_sql_file("scripts/database_schema.sql"):
            print("Database schema created")
        
        # Execute seed data
        if self.execute_sql_file("scripts/seed_data.sql"):
            print("Seed data inserted")
        
        print("Database setup complete!")

    def create_user(self, email, password, full_name, company=None, phone=None, is_admin=False):
        """Create a new user"""
        # Check if password is already hashed (starts with $2b$)
        if password.startswith('$2b$'):
            # Password is already hashed, use it as-is
            password_hash = password
        else:
            # Password is plain text, hash it
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        conn = None
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO users (email, password_hash, full_name, company, phone, is_admin) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                (email, password_hash, full_name, company, phone, is_admin)
            )
            user_id = cursor.fetchone()[0]
            conn.commit()
            return user_id
        except Exception as e:
            print(f"Error creating user: {e}")
            conn.rollback()
            return None
        finally:
            if conn:
                conn.close()

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Retrieve a user by their email address."""
        conn = None
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor(cursor_factory=DictCursor)
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user_data = cursor.fetchone()
            if user_data:
                return dict(user_data)
            return None
        except Exception as e:
            print(f"Error retrieving user by email: {e}")
            return None
        finally:
            if conn:
                conn.close()

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve a user by their ID."""
        conn = None
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor(cursor_factory=DictCursor)
            cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            user_data = cursor.fetchone()
            if user_data:
                return dict(user_data)
            return None
        except Exception as e:
            print(f"Error retrieving user by ID: {e}")
            return None
        finally:
            if conn:
                conn.close()

    def get_database_stats(self) -> Dict[str, int]:
        """Get database statistics"""
        conn = None
        try:
            conn = self.get_db_connection()
            cursor = conn.cursor()
            
            stats = {}
            tables = ['users', 'user_sessions', 'contact_submissions', 'user_projects', 'user_preferences', 'activity_logs']
            
            for table in tables:
                cursor.execute(sql.SQL("SELECT COUNT(*) FROM {}").format(sql.Identifier(table)))
                count = cursor.fetchone()[0]
                stats[table] = count
            
            return stats
        except Exception as e:
            print(f"Error getting database stats: {e}")
            return {}
        finally:
            if conn:
                conn.close()

    def backup_database(self):
        print("Backup not implemented for PostgreSQL.")
        return None

if __name__ == "__main__":
    # Initialize database manager
    db_manager = DatabaseManager()
    
    # Set up database
    db_manager.setup_database()
    
    # Show statistics
    stats = db_manager.get_database_stats()
    print("\nDatabase Statistics:")
    for table, count in stats.items():
        print(f"  {table}: {count} records")
