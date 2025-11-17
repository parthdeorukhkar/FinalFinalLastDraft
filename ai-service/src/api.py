# -*- coding: utf-8 -*-
import sys
import io

# Force UTF-8 encoding for Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
import os
from dotenv import load_dotenv

from src.resume_parser import ResumeParser
from src.gemini_parser import GeminiResumeParser
from src.matching_engine import MatchingEngine

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="HR Automation AI Service",
    description="NLP and AI service for resume parsing and candidate matching",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
# Try to use Gemini parser if API key is available, fallback to regex parser
try:
    gemini_api_key = os.getenv('GEMINI_API_KEY')
    if gemini_api_key and gemini_api_key != 'your_gemini_api_key_here':
        resume_parser = GeminiResumeParser()
        print("✅ Using Gemini AI-powered resume parser")
    else:
        resume_parser = ResumeParser()
        print("⚠️  Using regex-based resume parser (Gemini API key not configured)")
except Exception as e:
    print(f"⚠️  Failed to initialize Gemini parser: {e}")
    print("Falling back to regex-based parser")
    resume_parser = ResumeParser()

matching_engine = MatchingEngine()


# Request/Response Models
class ParseResumeRequest(BaseModel):
    candidateId: str
    resumePath: str


class MatchCandidateRequest(BaseModel):
    candidateId: str
    resumePath: str
    jobRequirements: Dict


class SkillModel(BaseModel):
    name: str
    proficiency: Optional[str] = None


class ExperienceModel(BaseModel):
    company: Optional[str]
    position: Optional[str]
    duration: Optional[str]
    description: Optional[str]


class EducationModel(BaseModel):
    institution: Optional[str]
    degree: Optional[str]
    field: Optional[str]
    graduationYear: Optional[int]


class ParseResumeResponse(BaseModel):
    text: str
    skills: List[Dict]
    experience: List[Dict]
    education: List[Dict]


class JobRoleRecommendation(BaseModel):
    role: str
    matchPercentage: int
    description: str
    matchedSkills: List[str]
    reason: str


class MatchCandidateResponse(BaseModel):
    matchScore: float
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    recommendedRoles: Optional[List[JobRoleRecommendation]] = None


# Health check
@app.get("/")
def read_root():
    return {
        "status": "success",
        "message": "HR Automation AI Service is running",
        "version": "1.0.0"
    }


# Health check endpoint
@app.get("/health")
def health_check():
    # Check if using Gemini or regex parser
    parser_type = "gemini" if isinstance(resume_parser, GeminiResumeParser) else "regex"
    spacy_loaded = hasattr(resume_parser, 'nlp') and resume_parser.nlp is not None

    return {
        "status": "healthy",
        "service": "ai-service",
        "parser_type": parser_type,
        "spacy_model_loaded": spacy_loaded
    }


# Parse resume endpoint
@app.post("/parse-resume", response_model=ParseResumeResponse)
async def parse_resume(request: ParseResumeRequest):
    """
    Parse resume and extract structured information using NLP
    """
    try:
        print(f"📄 Parsing resume for candidate: {request.candidateId}")

        # Parse resume
        parsed_data = resume_parser.parse_resume(request.resumePath)

        return ParseResumeResponse(
            text=parsed_data["text"],
            skills=parsed_data["skills"],
            experience=parsed_data["experience"],
            education=parsed_data["education"]
        )

    except FileNotFoundError as e:
        print(f"Error parsing resume - File not found: {request.resumePath}")
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=404, detail=f"Resume file not found: {request.resumePath}")
    except Exception as e:
        print(f"Error parsing resume: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")


# Match candidate to job
@app.post("/match-candidate", response_model=MatchCandidateResponse)
async def match_candidate(request: MatchCandidateRequest):
    """
    Analyze candidate-job match and generate score with role recommendations
    """
    try:
        print(f"🎯 Matching candidate: {request.candidateId}")

        # Parse resume first
        parsed_data = resume_parser.parse_resume(request.resumePath)

        print(f"DEBUG - Parsed data type: {type(parsed_data)}")
        print(f"DEBUG - Skills data: {parsed_data.get('skills', [])[:2]}")  # First 2 skills
        print(f"DEBUG - Education data: {parsed_data.get('education', [])[:1]}")  # First education

        # Calculate match score
        print("DEBUG - About to calculate match...")
        match_result = matching_engine.calculate_match(
            parsed_data,
            request.jobRequirements
        )
        print("DEBUG - Match calculation complete")

        # Generate job role recommendations
        print("DEBUG - About to recommend roles...")
        recommended_roles = matching_engine.recommend_job_roles(parsed_data)
        print("DEBUG - Role recommendation complete")

        return MatchCandidateResponse(
            matchScore=match_result["score"],
            summary=match_result["summary"],
            strengths=match_result["strengths"],
            weaknesses=match_result["weaknesses"],
            recommendedRoles=recommended_roles
        )

    except Exception as e:
        print(f"❌ Error matching candidate: {str(e)}")
        import traceback
        print("Full traceback:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error matching candidate: {str(e)}")


# Recommend job roles endpoint
@app.post("/recommend-roles")
async def recommend_roles(request: ParseResumeRequest):
    """
    Recommend suitable job roles based on candidate's skills and experience
    """
    try:
        print(f"💼 Recommending job roles for candidate: {request.candidateId}")

        # Parse resume first
        parsed_data = resume_parser.parse_resume(request.resumePath)

        # Generate job role recommendations
        recommended_roles = matching_engine.recommend_job_roles(parsed_data)

        return {
            "status": "success",
            "candidateId": request.candidateId,
            "recommendedRoles": recommended_roles
        }

    except Exception as e:
        print(f"Error recommending roles: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error recommending roles: {str(e)}")


# Chat endpoint (for RAG chatbot - to be implemented in Sprint 5)
@app.post("/chat")
async def chat(question: str):
    """
    RAG chatbot endpoint - Coming in Sprint 5
    """
    return {
        "status": "coming_soon",
        "message": "RAG chatbot will be implemented in Sprint 5",
        "question": question
    }


# Run the app
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
