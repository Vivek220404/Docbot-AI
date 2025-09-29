from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from rag_service import RAGService

load_dotenv()

app = FastAPI(title="DocBot AI Medical Assistant with RAG")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG service
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY environment variable is required")

rag_service = RAGService(groq_api_key)

class SymptomRequest(BaseModel):
    symptoms: str
    age: Optional[int] = None
    gender: Optional[str] = None
    medical_history: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

@app.get("/")
async def root():
    return {
        "message": "DocBot AI Medical Assistant with RAG is running",
        "features": [
            "RAG-enhanced symptom analysis",
            "Medical literature-based responses", 
            "FAISS vector search",
            "LangChain integration"
        ]
    }

@app.post("/analyze-symptoms")
async def analyze_symptoms(request: SymptomRequest):
    if not request.symptoms or len(request.symptoms.strip()) < 3:
        raise HTTPException(status_code=400, detail="Please provide detailed symptoms")
    
    try:
        # Use RAG service for enhanced symptom analysis
        result = await rag_service.analyze_symptoms_with_rag(
            symptoms=request.symptoms,
            age=request.age,
            gender=request.gender,
            medical_history=request.medical_history
        )
        return result
        
    except Exception as e:
        print(f"Error in symptom analysis: {e}")
        return {
            "analysis_summary": "Analysis unavailable due to technical issue",
            "possible_conditions": [{"name": "Technical Error", "probability": "Unknown", "description": "System error occurred", "common_symptoms": [], "reference_match": "None"}],
            "treatment_recommendations": [{"type": "Medical consultation", "description": "Please consult a healthcare provider", "urgency": "moderate", "source": "System recommendation"}],
            "urgency_level": "moderate",
            "medical_evidence": "Unable to retrieve medical evidence due to technical issue",
            "disclaimer": "This is not medical advice. Consult a healthcare provider.",
            "follow_up_questions": []
        }

@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.message or len(request.message.strip()) < 2:
        raise HTTPException(status_code=400, detail="Please provide a message")
    
    try:
        # Use RAG service for enhanced chat responses
        result = await rag_service.chat_with_rag(
            message=request.message,
            conversation_id=request.conversation_id
        )
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@app.get("/medical-info/{condition}")
async def get_condition_info(condition: str):
    if len(condition.strip()) < 2:
        raise HTTPException(status_code=400, detail="Please provide a valid condition")
    
    try:
        # Use RAG service for enhanced condition information
        result = await rag_service.get_condition_info_with_rag(condition)
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Information retrieval failed: {str(e)}")

@app.get("/rag-status")
async def get_rag_status():
    """Get the status of the RAG system"""
    try:
        vector_store_exists = rag_service.vector_store is not None
        retriever_ready = rag_service.retriever is not None
        
        return {
            "status": "operational" if vector_store_exists and retriever_ready else "initializing",
            "vector_store_loaded": vector_store_exists,
            "retriever_ready": retriever_ready,
            "pdf_source": rag_service.pdf_path,
            "embeddings_model": "sentence-transformers/all-MiniLM-L6-v2",
            "vector_store_type": "FAISS"
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

