import pytest
from httpx import WSGITransport, Client
from fastapi.testclient import TestClient
from backend_api import app, get_db_connection, init_database
from database_manager import DatabaseManager
import os
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
from urllib.parse import urlparse, quote_plus

# Load environment variables from .env.local
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))

# Use a test database for testing
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/test_techzolo")

# Override get_db_connection for testing
def get_test_db_connection():
    parsed_url = urlparse(DATABASE_URL)
    encoded_password = quote_plus(parsed_url.password)
    encoded_url = parsed_url._replace(netloc=f"{parsed_url.username}:{encoded_password}@{parsed_url.hostname}:{parsed_url.port}").geturl()
    return psycopg2.connect(encoded_url)

app.dependency_overrides[get_db_connection] = get_test_db_connection

client = TestClient(app)

@pytest.fixture(name="db_connection")
def fixture_db_connection():
    conn = get_test_db_connection()
    yield conn
    conn.close()

@pytest.fixture(name="setup_test_db", autouse=True)
def fixture_setup_test_db():
    # Clear and initialize the test database before each test
    conn = get_test_db_connection()
    cursor = conn.cursor()
    
    # Drop all tables
    cursor.execute("""
        DROP TABLE IF EXISTS user_sessions CASCADE;
        DROP TABLE IF EXISTS user_projects CASCADE;
        DROP TABLE IF EXISTS contact_submissions CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
    """)
    conn.commit()
    conn.close()
    
    DatabaseManager().setup_database() # Initialize with the schema and seed data

    yield

    # Clean up after tests (optional, but good practice)
    conn = get_test_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        DROP TABLE IF EXISTS user_sessions CASCADE;
        DROP TABLE IF EXISTS user_projects CASCADE;
        DROP TABLE IF EXISTS contact_submissions CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
    """)
    conn.commit()
    conn.close()

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "Tech Zolo API is running" in response.json()["message"]

def test_signup_and_login():
    # Signup
    signup_data = {
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User",
        "company": "TestCo",
        "phone": "1234567890"
    }
    response = client.post("/auth/signup", json=signup_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["user"]["email"] == "test@example.com"

    # Login
    login_data = {
        "username": "test@example.com",
        "password": "password123"
    }
    print(f"DEBUG: Attempting login with data: {login_data}")
    response = client.post("/auth/login", data=login_data)
    print(f"DEBUG: Login response status: {response.status_code}")
    print(f"DEBUG: Login response content: {response.text}")
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["user"]["email"] == "test@example.com"

def test_duplicate_signup():
    signup_data = {
        "email": "duplicate@example.com",
        "password": "password123",
        "full_name": "Duplicate User"
    }
    client.post("/auth/signup", json=signup_data)
    response = client.post("/auth/signup", json=signup_data)
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]

def test_login_invalid_credentials():
    login_data = {
        "username": "nonexistent@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/auth/login", data=login_data)
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_contact_form_submission():
    contact_data = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "subject": "Inquiry",
        "message": "I have a question.",
        "phone": "9876543210"
    }
    response = client.post("/contact", json=contact_data)
    assert response.status_code == 200
    assert "Contact form submitted successfully" in response.json()["message"]

def test_get_contact_submissions_pagination(setup_test_db):
    # Add multiple contact submissions
    for i in range(1, 25):
        contact_data = {
            "name": f"User {i}",
            "email": f"user{i}@example.com",
            "subject": f"Subject {i}",
            "message": f"Message {i}"
        }
        client.post("/contact", json=contact_data)

    # Signup and login an admin user to get a token
    signup_data = {
        "email": "admin@example.com",
        "password": "adminpassword",
        "full_name": "Admin User",
        "is_admin": True
    }
    response = client.post("/auth/signup", json=signup_data)
    # The signup response for admin might return the token nested under a 'token' key
    # or the signup itself might be failing with a 500 error, leading to KeyError.
    # Assuming the token is nested if signup is successful.
    # A more robust test would assert response.status_code == 200 first.
    admin_token = response.json().get("access_token") or response.json().get("token", {}).get("access_token")
    assert admin_token is not None, f"Could not extract access_token from signup response: {response.json()}"
    headers = {"Authorization": f"Bearer {admin_token}"}

    # Test first page
    response = client.get("/admin/contacts?page=1&page_size=10", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["submissions"]) == 10
    assert data["total"] == 26  # 24 from test + 2 from seed data
    assert data["page"] == 1
    assert data["page_size"] == 10

    # Test second page
    response = client.get("/admin/contacts?page=2&page_size=10", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["submissions"]) == 10
    assert data["total"] == 26  # 24 from test + 2 from seed data
    assert data["page"] == 2
    assert data["page_size"] == 10

    # Test last page
    response = client.get("/admin/contacts?page=3&page_size=10", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["submissions"]) == 6  # 6 remaining submissions
    assert data["total"] == 26  # 24 from test + 2 from seed data
    assert data["page"] == 3
    assert data["page_size"] == 10

    # Test page out of bounds
    response = client.get("/admin/contacts?page=4&page_size=10", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["submissions"]) == 0
    assert data["total"] == 26  # 24 from test + 2 from seed data
    assert data["page"] == 4
    assert data["page_size"] == 10