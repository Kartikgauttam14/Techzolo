from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import jwt
import bcrypt
import sqlite3
import os
from datetime import datetime, timedelta, timezone
import uvicorn
import psycopg2
from psycopg2 import sql
from psycopg2.extras import DictCursor
from dotenv import load_dotenv
from urllib.parse import urlparse, quote_plus
import sys

# Add the scripts directory to the Python path
sys.path.append(os.path.dirname(__file__))

from database_manager import DatabaseManager

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env.local'))
print(f"Current working directory: {os.getcwd()}")
print(f"sys.path: {sys.path}")

# Initialize FastAPI app
app = FastAPI(title="Tech Zolo API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        "https://*.vercel.app",
        "https://*.v0.app",
        "https://your-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Security
security = HTTPBearer()
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database setup
# DATABASE_PATH = "techzolo.db" # No longer needed for PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/techzolo")  # Replace with your actual connection string
print(f"DATABASE_URL: {DATABASE_URL}")

def get_db_connection():
    """Get a PostgreSQL database connection"""
    parsed_url = urlparse(DATABASE_URL)
    encoded_password = quote_plus(parsed_url.password)
    
    # Reconstruct the URL with the encoded password
    encoded_url = parsed_url._replace(netloc=f"{parsed_url.username}:{encoded_password}@{parsed_url.hostname}:{parsed_url.port}").geturl()
    return psycopg2.connect(encoded_url)

def init_database():
    """Initialize PostgreSQL database with all required tables from database_schema.sql"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        with open(os.path.join(os.path.dirname(__file__), 'database_schema.sql'), 'r') as f:
            sql_script = f.read()
            cursor.execute(sql_script)
        conn.commit()
        print("Database schema initialized successfully from database_schema.sql")
    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error initializing database from schema: {e}")
        import traceback
        traceback.print_exc()
    finally:
        if conn:
            conn.close()

# Pydantic models
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company: Optional[str] = None
    phone: Optional[str] = None
    is_admin: Optional[bool] = False

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    id: int
    email: str
    full_name: str
    company: Optional[str]
    phone: Optional[str]
    created_at: datetime
    is_active: bool
    is_admin: bool

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserProfile

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    phone: Optional[str] = None

# Utility functions
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    to_encode = data.copy()
    if "sub" in data:
        user = get_user_by_id(int(data["sub"]))
        if user:
            to_encode["is_admin"] = user.get("is_admin", False)
        else:
            to_encode["is_admin"] = False
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    """Get user by email from database"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=DictCursor)
        cursor.execute("SELECT id, email, password_hash, full_name, company, phone, created_at, is_active, is_admin FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        return dict(user) if user else None
    except Exception as e:
        print(f"Error getting user by email: {e}")
        return None
    finally:
        if conn:
            conn.close()

def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """Get user by ID from database"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=DictCursor)
        cursor.execute("SELECT id, email, password_hash, full_name, company, phone, created_at, is_active, is_admin FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        return dict(user) if user else None
    except Exception as e:
        print(f"Error getting user by ID: {e}")
        return None
    finally:
        if conn:
            conn.close()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        is_admin: bool = payload.get("is_admin", False)
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = get_user_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    print(f"User data from DB: {user}, is_admin from token: {is_admin}") # Debugging print
    user_profile = UserProfile(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        company=user["company"],
        phone=user["phone"],
        created_at=user["created_at"].replace(tzinfo=timezone.utc),
        is_active=user["is_active"],
        is_admin=is_admin
    )
    return user_profile

async def get_current_active_admin_user(current_user: UserProfile = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not an admin user")
    return current_user

# API Routes
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    # init_database() # Removed as database is initialized by database_manager.py

@app.get("/")
async def root():
    """Health check endpoint with detailed status"""
    conn = None
    try:
        # Test database connection
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        conn.close()
        
        return {
            "message": "Tech Zolo API is running",
            "version": "1.0.0",
            "status": "healthy",
            "database": "PostgreSQL connected",
            "users": user_count,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        return {
            "message": "Tech Zolo API is running",
            "version": "1.0.0", 
            "status": "degraded",
            "database": "PostgreSQL error",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

@app.options("/{path:path}")
async def options_handler(path: str):
    """Handle preflight OPTIONS requests"""
    return {"message": "OK"}

@app.post("/auth/signup", response_model=Token)
async def signup(user_data: UserSignup):
    """Register a new user"""
    db_manager = DatabaseManager()
    if db_manager.get_user_by_email(user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user_data.password)
    user_id = db_manager.create_user(
        user_data.email,
        hashed_password,
        user_data.full_name,
        user_data.company,
        user_data.phone,
        user_data.is_admin
    )
    if not user_id:
        raise HTTPException(status_code=500, detail="Error creating user")
    
    user = db_manager.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=500, detail="User not found after creation")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["id"])},
        expires_delta=access_token_expires
    )
    
    user_profile = UserProfile(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        company=user["company"],
        phone=user["phone"],
        created_at=user["created_at"].replace(tzinfo=timezone.utc),
        is_active=user["is_active"],
        is_admin=user["is_admin"]
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_profile)


@app.post("/auth/login", response_model=Token)
async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    """User login endpoint"""
    user = get_user_by_email(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = user["id"]

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user["id"])}, expires_delta=access_token_expires
    )
    user_profile = UserProfile(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        company=user["company"],
        phone=user["phone"],
        created_at=user["created_at"].replace(tzinfo=timezone.utc),
        is_active=user["is_active"],
        is_admin=user["is_admin"]
    )
    response.set_cookie(key="access_token", value=access_token, httponly=True)
    return Token(access_token=access_token, token_type="bearer", user=user_profile)


@app.get("/auth/me", response_model=UserProfile)
async def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return UserProfile(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user["full_name"],
        company=current_user["company"],
        phone=current_user["phone"],
        created_at=current_user["created_at"].replace(tzinfo=timezone.utc),
        is_active=current_user["is_active"]
    )

@app.put("/auth/profile", response_model=UserProfile)
async def update_profile(
    profile_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update user profile"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Update allowed fields
        allowed_fields = ["full_name", "company", "phone"]
        update_fields = []
        update_values = []
        
        for field in allowed_fields:
            if field in profile_data:
                update_fields.append(sql.Identifier(field) + sql.SQL(" = %s"))
                update_values.append(profile_data[field])
        
        if update_fields:
            update_values.append(current_user["id"])
            cursor.execute(
                sql.SQL("UPDATE users SET {} , updated_at = CURRENT_TIMESTAMP WHERE id = %s").format(sql.SQL(', ').join(update_fields)),
                update_values
            )
            conn.commit()
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {e}"
        )
    finally:
        if conn:
            conn.close()
    
    # Return updated profile
    updated_user = get_user_by_id(current_user["id"])
    return UserProfile(
        id=updated_user["id"],
        email=updated_user["email"],
        full_name=updated_user["full_name"],
        company=updated_user["company"],
        phone=updated_user["phone"],
        created_at=updated_user["created_at"].replace(tzinfo=timezone.utc),
        is_active=updated_user["is_active"]
    )

@app.post("/contact")
async def submit_contact_form(contact_data: ContactForm):
    """Submit contact form and save to database"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insert contact form data into database
        cursor.execute('''
            INSERT INTO contact_submissions (name, email, subject, message, phone)
            VALUES (%s, %s, %s, %s, %s) RETURNING id
        ''', (
            contact_data.name,
            contact_data.email,
            contact_data.subject,
            contact_data.message,
            contact_data.phone
        ))
        
        submission_id = cursor.fetchone()[0]
        conn.commit()
        
        return {
            "message": "Contact form submitted successfully",
            "submission_id": submission_id,
            "status": "success"
        }
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit contact form: {str(e)}"
        )
    finally:
        if conn:
            conn.close()

@app.get("/admin/contacts")
async def get_contact_submissions(page: int = 1, page_size: int = 10, current_user: dict = Depends(get_current_active_admin_user)):
    """Get all contact form submissions (admin only)"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=DictCursor)
        
        offset = (page - 1) * page_size
        cursor.execute('''
            SELECT * FROM contact_submissions 
            ORDER BY created_at DESC 
            LIMIT %s OFFSET %s
        ''', (page_size, offset))
        
        submissions = [dict(row) for row in cursor.fetchall()]
        
        cursor.execute("SELECT COUNT(*) FROM contact_submissions")
        total_submissions = cursor.fetchone()[0]
        return {"submissions": submissions, "total": total_submissions, "page": page, "page_size": page_size}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve contact submissions: {str(e)}"
        )
    finally:
        if conn:
            conn.close()

@app.post("/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout user (invalidate token)"""
    # In a real application, you would add token to blacklist
    return {"message": "Successfully logged out"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
