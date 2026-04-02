from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel
import os
import hashlib
from dotenv import load_dotenv

load_dotenv()

# Security configs
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production-with-32-chars-min")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing - use argon2 (handles long passwords natively)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Pre-hash passwords longer than 72 bytes for extra security (optional SHA256 layer)
def _preprocess_password(password: str) -> str:
    """
    Pre-hash passwords longer than 100 bytes for extra security.
    Argon2 can handle any length, but we add SHA256 for extremely long passwords.
    """
    if len(password.encode('utf-8')) > 100:
        return hashlib.sha256(password.encode()).hexdigest()
    return password

# Pydantic models for auth
class Token(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

class UserCreate(BaseModel):
    email: str
    username: str
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Password hashing functions
def hash_password(password: str) -> str:
    """Hash a password using bcrypt after pre-processing if needed."""
    processed_password = _preprocess_password(password)
    return pwd_context.hash(processed_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    processed_password = _preprocess_password(plain_password)
    return pwd_context.verify(processed_password, hashed_password)

# JWT token functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[TokenData]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        user_id: int = payload.get("user_id")
        if email is None or user_id is None:
            return None
        token_data = TokenData(email=email, user_id=user_id)
        return token_data
    except JWTError:
        return None
