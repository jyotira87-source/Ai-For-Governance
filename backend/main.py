import os
import json
import re
import logging
from typing import List, Any, Optional
from datetime import timedelta
from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from starlette.requests import Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Database and Auth imports
from database import get_db, User, PolicyAnalysis, SentimentHistory
from auth import (
    hash_password, verify_password, create_access_token, 
    verify_token, UserCreate, UserLogin, Token, UserResponse,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
# ML Model imports
from ml_model import ml_predictor, PolicyDomain

# 1. Advanced Setup: Configure Professional Logging
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# 2. Load Environment Variables safely
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    logger.error("GROQ_API_KEY is missing from the .env file!")

# 3. Initialize the AI Client
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=api_key 
)

# 4. Strict Data Models (UPGRADED FOR ENTERPRISE FEATURES)
class PolicyRequest(BaseModel):
    policy: str

class RiskDetail(BaseModel):
    risk_summary: str
    exact_quote: str

class BiasScores(BaseModel):
    urban_tech: int
    rural_unconnected: int
    corporate: int
    vulnerable: int

class PolicyResponse(BaseModel):
    summary: str
    risks: List[RiskDetail]
    references: List[str]
    impact: List[str]
    simulation: List[str]
    score: float
    bias_matrix: BiasScores
    friction_score: float
    cost_estimate: str
    recommendations: List[str]

# NEW: Sentiment Analysis Models
class SentimentTheme(BaseModel):
    theme: str
    sentiment_score: float  # -1 to 1, negative to positive
    mentions: int
    trend: str  # "rising", "falling", "stable"

class SentimentResponse(BaseModel):
    overall_approval: float  # 0-100
    key_themes: List[SentimentTheme]
    social_volume: int  # total mentions in last 24h
    platforms: dict  # {"twitter": 45, "facebook": 30, etc.}
    languages: dict  # {"english": 60, "hindi": 25, etc.}
    last_updated: str

app = FastAPI(title="PolisAI India-Centric Backend (Ultimate)", version="4.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to ensure database is initialized
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        logger.info("Initializing database at startup...")
        # Try to create tables
        from database import Base, engine
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialization completed successfully")
    except Exception as e:
        logger.error(f"Database initialization error at startup: {str(e)}", exc_info=True)

# Security
security = HTTPBearer()

# Dependency to get current user
async def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid authorization header")
    
    token = auth_header.replace("Bearer ", "")
    token_data = verify_token(token)
    if token_data is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

# --- ADVANCED HELPER FUNCTIONS ---

def clean_llm_json(raw_text: str) -> dict:
    """Strips markdown formatting (```json) and parses the string."""
    try:
        match = re.search(r'\{.*\}', raw_text, re.DOTALL)
        if match:
            clean_text = match.group(0)
            return json.loads(clean_text)
        return json.loads(raw_text)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to decode JSON: {e}")
        raise ValueError("AI did not return valid JSON syntax.")

def extract_policy_data(data: Any) -> dict:
    """Recursively hunts for the correct dictionary keys inside nested AI responses."""
    if isinstance(data, dict):
        # Check if this specific dictionary has the core keys we need (Updated for V4)
        if "summary" in data and "score" in data and "bias_matrix" in data:
            return data
        for key, value in data.items():
            found = extract_policy_data(value)
            if found:
                return found
    return None

# --- MAIN API ENDPOINT ---

@app.post("/analyze", response_model=PolicyResponse)
async def analyze_policy(payload: PolicyRequest):
    try:
        logger.info("Received policy analysis request. Contacting Llama-3...")
        
        # UPGRADED PROMPT FOR X-RAY AND BIAS MATRIX
        system_prompt = """
        You are a Senior Indian Constitutional Expert and GovTech Data Scientist. 
        Analyze the policy strictly within the context of the Constitution of India and Indian Laws.
        
        CRITICAL INSTRUCTION: You MUST return a strictly valid JSON object exactly matching this structure:
        {
          "summary": "2-sentence Indian context summary as a single string.",
          "risks": [
            {"risk_summary": "Description of risk", "exact_quote": "Exact 5-10 words from the user prompt that triggered this risk"}
          ],
          "references": ["Article 21 string", "IT Act 2000 string"],
          "impact": ["Impact point 1 string", "Impact point 2 string"],
          "simulation": ["Urban scenario string", "Rural scenario string"],
          "score": 40.5,
          "bias_matrix": {
             "urban_tech": 85,
             "rural_unconnected": 30,
             "corporate": 90,
             "vulnerable": 25
          },
          "friction_score": 88.5,
          "cost_estimate": "₹500-1000 Crores",
          "recommendations": ["Recommendation 1 string", "Recommendation 2 string"]
        }
        
        RULES:
        - `exact_quote` MUST be a direct, verbatim substring copied exactly from the provided policy text.
        - `friction_score` represents the logistical difficulty of rolling this out to 1.4 billion people (0 = Easy, 100 = Impossible).
        - Bias scores are out of 100 (100 = highly beneficial, 0 = highly detrimental).
        - 'impact' and 'simulation' MUST be Arrays of Strings.
        
        RETURN EXCLUSIVELY RAW JSON. NO MARKDOWN.
        """

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": payload.policy}
            ],
            response_format={"type": "json_object"}
        )

        raw_content = completion.choices[0].message.content
        logger.info("Received response from AI. Processing and validating data...")
        
        ai_dict = clean_llm_json(raw_content)
        valid_data = extract_policy_data(ai_dict)

        if not valid_data:
            logger.error(f"Data structure mismatch. Raw AI Output: {raw_content}")
            raise ValueError("AI response did not contain the required fields.")

        # INTEGRATED ML PREDICTIONS
        governance_score = valid_data.get("score", 50)
        friction_score = valid_data.get("friction_score", 50)
        
        # Get ML predictions using ensemble model
        ml_predictions = ml_predictor.full_prediction(
            governance_score=governance_score,
            friction_score=friction_score,
            domain=PolicyDomain.GOVERNANCE  # Could be determined from policy content
        )
        
        logger.info(f"ML Predictions computed: {ml_predictions}")
        
        # Augment response with ML predictions
        valid_data["ml_predictions"] = ml_predictions

        logger.info("Data validated successfully. Returning response to frontend.")
        return PolicyResponse(**valid_data)

    except Exception as e:
        logger.error(f"🔥 PIPELINE FAILURE: {str(e)}")
        # UPDATED SAFE FALLBACK MATCHING NEW SCHEMA
        return PolicyResponse(
            summary="Analysis pipeline triggered a safety fallback due to unexpected AI formatting.",
            risks=[RiskDetail(risk_summary="LLM Output Parsing Error", exact_quote="N/A")],
            references=["System Architecture Guardrails"],
            impact=["Unable to process request accurately"],
            simulation=["N/A"],
            score=0.0,
            bias_matrix=BiasScores(urban_tech=0, rural_unconnected=0, corporate=0, vulnerable=0),
            friction_score=0.0,
            cost_estimate="N/A",
            recommendations=["Check backend terminal logs for exact JSON mismatch details."]
        )

# NEW: Real-Time Public Sentiment Analysis Endpoint
@app.post("/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(payload: PolicyRequest):
    try:
        logger.info("Received sentiment analysis request. Analyzing public discourse...")

        sentiment_prompt = """
        You are a Social Media Sentiment Analyst specializing in Indian public opinion.
        Analyze the provided policy text and generate realistic public sentiment data as if monitoring real-time social media.

        CRITICAL INSTRUCTION: Return a strictly valid JSON object exactly matching this structure:
        {
          "overall_approval": 67.5,
          "key_themes": [
            {"theme": "Economic Impact", "sentiment_score": 0.3, "mentions": 1250, "trend": "rising"},
            {"theme": "Implementation Concerns", "sentiment_score": -0.4, "mentions": 890, "trend": "stable"}
          ],
          "social_volume": 3400,
          "platforms": {"twitter": 45, "facebook": 30, "instagram": 15, "youtube": 10},
          "languages": {"english": 60, "hindi": 25, "regional": 15},
          "last_updated": "2026-04-02T14:30:00Z"
        }

        RULES:
        - overall_approval: 0-100 percentage of positive sentiment
        - sentiment_score: -1 (very negative) to 1 (very positive)
        - trend: "rising", "falling", or "stable"
        - social_volume: realistic number based on policy importance
        - platforms: distribution percentages that sum to 100
        - languages: distribution percentages that sum to 100
        - Include 3-5 key themes relevant to Indian context
        - Base analysis on the policy's potential impact on different demographics

        RETURN EXCLUSIVELY RAW JSON. NO MARKDOWN.
        """

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": sentiment_prompt},
                {"role": "user", "content": payload.policy}
            ],
            response_format={"type": "json_object"}
        )

        raw_content = completion.choices[0].message.content
        logger.info("Received sentiment data from AI. Processing...")

        ai_dict = clean_llm_json(raw_content)

        # Validate structure
        if not all(key in ai_dict for key in ["overall_approval", "key_themes", "social_volume", "platforms", "languages", "last_updated"]):
            raise ValueError("AI response missing required sentiment fields.")

        logger.info("Sentiment data validated successfully.")
        return SentimentResponse(**ai_dict)

    except Exception as e:
        logger.error(f"🔥 SENTIMENT ANALYSIS FAILURE: {str(e)}")
        # Safe fallback
        return SentimentResponse(
            overall_approval=50.0,
            key_themes=[
                SentimentTheme(theme="General Public Reaction", sentiment_score=0.0, mentions=100, trend="stable")
            ],
            social_volume=500,
            platforms={"twitter": 50, "facebook": 30, "others": 20},
            languages={"english": 70, "hindi": 20, "others": 10},
            last_updated="2026-04-02T12:00:00Z"
        )

# --- AUTHENTICATION ENDPOINTS ---

@app.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    try:
        logger.info(f"Registration attempt: email={user_data.email}, username={user_data.username}")
        
        # Check if user already exists
        try:
            existing_user = db.query(User).filter(
                (User.email == user_data.email) | (User.username == user_data.username)
            ).first()
            logger.info(f"Existing user check completed")
        except Exception as db_err:
            logger.error(f"Database query error during user check: {str(db_err)}", exc_info=True)
            raise db_err
        
        if existing_user:
            logger.warning(f"User already exists: {user_data.email}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email or username already registered")
        
        # Create new user
        try:
            hashed_pwd = hash_password(user_data.password)
            db_user = User(
                email=user_data.email,
                username=user_data.username,
                hashed_password=hashed_pwd,
                full_name=user_data.full_name
            )
            logger.info(f"User object created, adding to database")
            db.add(db_user)
            db.commit()
            logger.info(f"Database commit successful")
            db.refresh(db_user)
            logger.info(f"New user registered: {user_data.email}")
            return db_user
        except Exception as commit_err:
            logger.error(f"Database commit/refresh error: {str(commit_err)}", exc_info=True)
            db.rollback()
            raise commit_err
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Registration failed: {str(e)}")

@app.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """Login user and return JWT token"""
    try:
        logger.info(f"Login attempt: email={user_data.email}")
        
        try:
            user = db.query(User).filter(User.email == user_data.email).first()
            logger.info(f"User query completed")
        except Exception as db_err:
            logger.error(f"Database query error during login: {str(db_err)}", exc_info=True)
            raise db_err
        
        if not user or not verify_password(user_data.password, user.hashed_password):
            logger.warning(f"Invalid credentials for: {user_data.email}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
        if not user.is_active:
            logger.warning(f"User account is inactive: {user_data.email}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account is inactive")
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id},
            expires_delta=access_token_expires
        )
        logger.info(f"Token created for user: {user_data.email}")
        return Token(access_token=access_token, token_type="bearer")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Login failed: {str(e)}")

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return current_user

@app.get("/health")
async def health():
    return {"status": "active", "engine": "Llama-3-AI", "version": "4.0 Ultimate"}

@app.get("/debug/db")
async def debug_db(db: Session = Depends(get_db)):
    """Debug endpoint to check database status"""
    try:
        # Try to count users
        user_count = db.query(User).count()
        logger.info(f"Database debug check - User count: {user_count}")
        return {
            "status": "connected",
            "user_count": user_count,
            "database_url": os.getenv("DATABASE_URL", "sqlite:///./polisai.db")[:30] + "..."
        }
    except Exception as e:
        logger.error(f"Database debug check failed: {str(e)}", exc_info=True)
        return {
            "status": "error",
            "error": str(e),
            "database_url": os.getenv("DATABASE_URL", "sqlite:///./polisai.db")[:30] + "..."
        }