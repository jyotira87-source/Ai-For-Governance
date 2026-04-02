from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL - Using PostgreSQL (or SQLite for local dev)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./polisai.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- DATABASE MODELS ---

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    policies = relationship("PolicyAnalysis", back_populates="user", cascade="all, delete-orphan")
    sentiments = relationship("SentimentHistory", back_populates="user", cascade="all, delete-orphan")


class PolicyAnalysis(Base):
    __tablename__ = "policy_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    policy_title = Column(String, nullable=True)
    policy_text = Column(Text)
    governance_score = Column(Float)
    friction_score = Column(Float)
    cost_estimate = Column(String)
    summary = Column(Text)
    risks = Column(Text)  # JSON stored as string
    references = Column(Text)  # JSON stored as string
    impact = Column(Text)  # JSON stored as string
    simulation = Column(Text)  # JSON stored as string
    bias_matrix = Column(Text)  # JSON stored as string
    recommendations = Column(Text)  # JSON stored as string
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="policies")
    sentiment = relationship("SentimentHistory", back_populates="policy_analysis", uselist=False, cascade="all, delete-orphan")


class SentimentHistory(Base):
    __tablename__ = "sentiment_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    policy_id = Column(Integer, ForeignKey("policy_analyses.id"), index=True)
    overall_approval = Column(Float)
    key_themes = Column(Text)  # JSON stored as string
    social_volume = Column(Integer)
    platforms = Column(Text)  # JSON stored as string
    languages = Column(Text)  # JSON stored as string
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="sentiments")
    policy_analysis = relationship("PolicyAnalysis", back_populates="sentiment")


# Create tables
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
