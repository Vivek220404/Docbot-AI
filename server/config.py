import os
from typing import Dict, Any

class RAGConfig:
    """Configuration settings for RAG system"""
    
    # File paths
    PDF_PATH = "RAG/The-Gale-Encyclopedia-of-Medicine-3rd-Edition-staibabussalamsula.ac_.id_ (1).pdf"
    VECTOR_STORE_PATH = "vector_store"
    DOCUMENTS_CACHE_PATH = "documents.pkl"
    
    # Embedding settings
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DEVICE = "cpu"
    
    # Text splitting settings
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200
    
    # Retrieval settings
    RETRIEVAL_K = 5  # Number of documents to retrieve
    RETRIEVAL_SCORE_THRESHOLD = 0.7
    
    # LLM settings
    LLM_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
    LLM_TEMPERATURE = 0.3
    LLM_MAX_TOKENS = 1500
    
    # Chat settings
    CHAT_MAX_TOKENS = 800
    CHAT_TEMPERATURE = 0.4
    
    # Medical info settings
    MEDICAL_INFO_MAX_TOKENS = 1200
    MEDICAL_INFO_TEMPERATURE = 0.3
    
    @classmethod
    def get_config(cls) -> Dict[str, Any]:
        """Get all configuration as a dictionary"""
        return {
            "pdf_path": cls.PDF_PATH,
            "vector_store_path": cls.VECTOR_STORE_PATH,
            "documents_cache_path": cls.DOCUMENTS_CACHE_PATH,
            "embedding_model": cls.EMBEDDING_MODEL,
            "embedding_device": cls.EMBEDDING_DEVICE,
            "chunk_size": cls.CHUNK_SIZE,
            "chunk_overlap": cls.CHUNK_OVERLAP,
            "retrieval_k": cls.RETRIEVAL_K,
            "retrieval_score_threshold": cls.RETRIEVAL_SCORE_THRESHOLD,
            "llm_model": cls.LLM_MODEL,
            "llm_temperature": cls.LLM_TEMPERATURE,
            "llm_max_tokens": cls.LLM_MAX_TOKENS,
            "chat_max_tokens": cls.CHAT_MAX_TOKENS,
            "chat_temperature": cls.CHAT_TEMPERATURE,
            "medical_info_max_tokens": cls.MEDICAL_INFO_MAX_TOKENS,
            "medical_info_temperature": cls.MEDICAL_INFO_TEMPERATURE,
        }

# Medical prompts for different use cases
class MedicalPrompts:
    """Medical prompt templates for different scenarios"""
    
    SYMPTOM_ANALYSIS_SYSTEM = """You are an experienced medical AI assistant with access to comprehensive medical knowledge. 
    Analyze symptoms using the provided medical reference information. Provide evidence-based analysis while being conservative 
    and always recommending professional medical consultation when appropriate. Always respond with valid JSON only."""
    
    CHAT_SYSTEM = """You are a helpful medical AI assistant with access to comprehensive medical literature. 
    Provide accurate health information using markdown formatting and evidence-based responses. 
    Always recommend consulting healthcare providers for serious concerns."""
    
    MEDICAL_INFO_SYSTEM = """Provide accurate medical information using markdown formatting and evidence from medical literature. 
    Use headers, lists, bold text, italics, and other markdown features appropriately. 
    Base responses on medical literature when available."""
    
    DISCLAIMER = "This analysis is based on medical literature but is not a substitute for professional medical advice. Always consult with a healthcare provider for proper medical evaluation and treatment."
    
    EMERGENCY_KEYWORDS = [
        "chest pain", "difficulty breathing", "shortness of breath", "severe headache",
        "unconscious", "bleeding", "severe pain", "heart attack", "stroke",
        "seizure", "poisoning", "overdose", "severe allergic reaction",
        "unable to breathe", "choking", "severe injury", "broken bone",
        "high fever", "severe vomiting", "severe diarrhea", "dehydration"
    ]
    
    @classmethod
    def get_symptom_analysis_prompt(cls, context_text: str, patient_context: str, symptoms: str) -> str:
        """Get formatted symptom analysis prompt"""
        return f"""
MEDICAL REFERENCE CONTEXT:
{context_text}

PATIENT CONTEXT: {patient_context}
SYMPTOMS: {symptoms}

Based on the medical reference information above and the patient's symptoms, provide a detailed analysis in the following JSON format:
{{
    "analysis_summary": "Brief summary of the symptom analysis based on medical literature",
    "possible_conditions": [
        {{
            "name": "Condition name from medical literature",
            "probability": "High/Moderate/Low",
            "description": "Description based on medical reference",
            "common_symptoms": ["symptom1", "symptom2", "symptom3"],
            "reference_match": "How well this matches the reference material"
        }}
    ],
    "treatment_recommendations": [
        {{
            "type": "Home care/Medical consultation/Emergency",
            "description": "Treatment recommendation based on medical literature",
            "urgency": "low/moderate/high/emergency",
            "source": "Evidence from medical reference"
        }}
    ],
    "urgency_level": "low/moderate/high/emergency",
    "medical_evidence": "Summary of relevant medical evidence from the reference material",
    "disclaimer": "{cls.DISCLAIMER}",
    "follow_up_questions": ["question1", "question2"]
}}

IMPORTANT GUIDELINES:
1. Base your analysis primarily on the provided medical reference material
2. Provide 2-4 most likely conditions that match the reference information
3. Include evidence-based treatment recommendations
4. Always prioritize safety and recommend professional consultation when appropriate
5. Reference the medical literature in your recommendations
6. Be conservative and evidence-based in your analysis
7. If emergency keywords are detected, prioritize emergency care recommendations

Response must be valid JSON only, no additional text.
"""
    
    @classmethod
    def get_chat_prompt(cls, context_text: str, message: str) -> str:
        """Get formatted chat prompt"""
        return f"""
MEDICAL REFERENCE CONTEXT:
{context_text}

USER QUESTION: {message}

Based on the medical reference information provided above, please answer the user's question. Use markdown formatting for better readability.

Guidelines:
- Base your response on the provided medical reference material when relevant
- Use evidence from the medical literature
- Always recommend consulting healthcare providers for serious concerns
- Format your response with proper markdown for enhanced readability
- If the reference material doesn't contain relevant information, provide general medical knowledge but clearly indicate this
- Include references to the medical literature when applicable
- Add disclaimer: {cls.DISCLAIMER}

Provide a comprehensive, well-formatted response using markdown.
"""
    
    @classmethod
    def get_medical_info_prompt(cls, context_text: str, condition: str) -> str:
        """Get formatted medical information prompt"""
        return f"""
MEDICAL REFERENCE CONTEXT:
{context_text}

CONDITION TO RESEARCH: {condition}

Based on the medical reference information provided above, provide comprehensive information about: {condition}

Format your response using markdown for better readability. Include:

## {condition} Overview

### Definition
Brief definition and overview based on medical literature

### Common Symptoms
- List symptoms from medical reference material
- Use **bold** for important symptoms from the literature
- Use *italic* for mild symptoms mentioned in references

### Possible Causes
1. Primary causes (from medical literature)
2. Secondary causes (evidence-based)
3. Risk factors (referenced in medical literature)

### Treatment Options
#### Conservative Treatment
- Evidence-based non-medical approaches
- Lifestyle changes supported by medical literature

#### Medical Treatment
- Medications mentioned in medical references
- Procedures referenced in medical literature

### When to See a Doctor
> **Important**: Warning signs from medical literature that require immediate attention

### Prevention Tips
- Preventive measures from medical evidence
- Evidence-based lifestyle recommendations

### Medical Evidence Summary
Brief summary of the key medical evidence found in the reference material

### Additional Information
Any other relevant information from the medical literature

### Disclaimer
{cls.DISCLAIMER}

Guidelines:
- Base your response primarily on the provided medical reference material
- Clearly indicate when information comes from the medical literature
- Use proper markdown formatting throughout
- If limited information is available in references, supplement with general medical knowledge but clearly distinguish this
- Include evidence-based recommendations

Please use proper markdown formatting throughout your response for enhanced readability.
"""
