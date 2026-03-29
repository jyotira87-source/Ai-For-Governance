import os
import json
import re
import logging
from typing import List, Any
from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

# 4. Strict Data Models
class PolicyRequest(BaseModel):
    policy: str

class PolicyResponse(BaseModel):
    summary: str
    risks: List[str]
    references: List[str]
    impact: List[str]
    simulation: List[str]
    score: float
    recommendations: List[str]

app = FastAPI(title="PolisAI India-Centric Backend (Advanced)", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ADVANCED HELPER FUNCTIONS ---

def clean_llm_json(raw_text: str) -> dict:
    """Strips markdown formatting (```json) and parses the string."""
    try:
        # Regex to find everything between the first { and the last }
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
        # Check if this specific dictionary has the core keys we need
        if "summary" in data and "score" in data and "risks" in data:
            return data
        # If not, dig deeper into its values
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
        
        system_prompt = """
        You are a Senior Indian Constitutional Expert and Data Scientist. 
        Analyze the policy strictly within the context of the Constitution of India and Indian Laws.
        
        CRITICAL INSTRUCTION: You MUST return a strictly valid JSON object. 
        Use the EXACT structure and data types shown below. Do not deviate.
        
        {
          "summary": "2-sentence Indian context summary as a single string.",
          "risks": ["Risk 1 string", "Risk 2 string", "Risk 3 string"],
          "references": ["Article 21 string", "IT Act 2000 string", "DPDP Act 2023 string"],
          "impact": ["Impact point 1 string", "Impact point 2 string"],
          "simulation": ["Urban scenario string", "Rural scenario string"],
          "score": 40.5,
          "recommendations": ["Recommendation 1 string", "Recommendation 2 string"]
        }
        
        WARNING: 'impact' and 'simulation' MUST be Arrays of Strings, NOT objects. 
        RETURN EXCLUSIVELY THE RAW JSON. NO MARKDOWN.
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
        
        # 1. Strip markdown and parse to Python Dictionary
        ai_dict = clean_llm_json(raw_content)
        
        # 2. Recursively unwrap the data if the AI nested it
        valid_data = extract_policy_data(ai_dict)

        if not valid_data:
            logger.error(f"Data structure mismatch. Raw AI Output: {raw_content}")
            raise ValueError("AI response did not contain the required fields.")

        # 3. Validate against Pydantic and return
        logger.info("Data validated successfully. Returning response to frontend.")
        return PolicyResponse(**valid_data)

    except Exception as e:
        logger.error(f"🔥 PIPELINE FAILURE: {str(e)}")
        # Safe Fallback to prevent 500 Server Errors
        return PolicyResponse(
            summary="Analysis pipeline triggered a safety fallback due to unexpected AI formatting.",
            risks=["LLM Output Parsing Error", "Structure Validation Failure"],
            references=["System Architecture Guardrails"],
            impact=["Unable to process request accurately"],
            simulation=["N/A"],
            score=0.0,
            recommendations=["Check backend terminal logs for exact JSON mismatch details."]
        )

@app.get("/health")
async def health():
    return {"status": "active", "engine": "Llama-3-AI", "version": "3.0 Advanced"}