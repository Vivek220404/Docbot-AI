import os
from typing import List, Dict, Any
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from groq import AsyncGroq
from pathlib import Path
import json
from config import RAGConfig, MedicalPrompts

class RAGService:
    def __init__(self, groq_api_key: str, pdf_path: str = None):
        self.groq_api_key = groq_api_key
        self.config = RAGConfig()
        self.prompts = MedicalPrompts()
        
        # Initialize embeddings
        self.embeddings = HuggingFaceEmbeddings(
            model_name=self.config.EMBEDDING_MODEL,
            model_kwargs={'device': self.config.EMBEDDING_DEVICE}
        )
        
        self.vector_store = None
        self.retriever = None
        
        # Initialize LLM clients
        self.llm = ChatGroq(
            groq_api_key=groq_api_key,
            model_name=self.config.LLM_MODEL,
            temperature=self.config.LLM_TEMPERATURE
        )
        self.async_client = AsyncGroq(api_key=groq_api_key)
        
        # Set paths
        self.pdf_path = pdf_path or self.config.PDF_PATH
        self.vector_store_path = self.config.VECTOR_STORE_PATH
        self.documents_cache_path = self.config.DOCUMENTS_CACHE_PATH
        
        # Initialize RAG system
        self._initialize_rag()
    
    def _initialize_rag(self):
        """Initialize or load the RAG system"""
        try:
            # Try to load existing vector store
            if os.path.exists(self.vector_store_path):
                print("Loading existing vector store...")
                self.vector_store = FAISS.load_local(
                    self.vector_store_path, 
                    self.embeddings,
                    allow_dangerous_deserialization=True
                )
                self.retriever = self.vector_store.as_retriever(
                    search_kwargs={"k": self.config.RETRIEVAL_K}
                )
                print("Vector store loaded successfully!")
            else:
                print("Creating new vector store...")
                self._create_vector_store()
        except Exception as e:
            print(f"Error initializing RAG: {e}")
            print("Creating new vector store...")
            self._create_vector_store()
    
    def _create_vector_store(self):
        """Create vector store from PDF documents"""
        try:
            # Load documents
            if not os.path.exists(self.pdf_path):
                raise FileNotFoundError(f"PDF file not found at {self.pdf_path}")
            
            print("Loading PDF documents...")
            loader = PyPDFLoader(self.pdf_path)
            documents = loader.load()
            
            print(f"Loaded {len(documents)} pages from PDF")
            
            # Split documents into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=self.config.CHUNK_SIZE,
                chunk_overlap=self.config.CHUNK_OVERLAP,
                length_function=len,
            )
            
            print("Splitting documents into chunks...")
            texts = text_splitter.split_documents(documents)
            print(f"Created {len(texts)} text chunks")
            
            # Create vector store
            print("Creating embeddings and vector store...")
            self.vector_store = FAISS.from_documents(texts, self.embeddings)
            
            # Save vector store
            self.vector_store.save_local(self.vector_store_path)
            print("Vector store created and saved successfully!")
            
            # Create retriever
            self.retriever = self.vector_store.as_retriever(
                search_kwargs={"k": self.config.RETRIEVAL_K}
            )
            
        except Exception as e:
            print(f"Error creating vector store: {e}")
            raise
    
    def get_relevant_context(self, query: str, k: int = 5) -> List[str]:
        """Retrieve relevant context for a query"""
        if not self.retriever:
            return []
        
        try:
            docs = self.retriever.get_relevant_documents(query)
            return [doc.page_content for doc in docs[:k]]
        except Exception as e:
            print(f"Error retrieving context: {e}")
            return []
    
    async def analyze_symptoms_with_rag(self, symptoms: str, age: int = None, gender: str = None, medical_history: str = None) -> Dict[str, Any]:
        """Analyze symptoms using RAG-enhanced prompts"""
        # Get relevant medical context
        context_docs = self.get_relevant_context(f"symptoms {symptoms} diagnosis treatment")
        context_text = "\n\n".join(context_docs[:3])  # Use top 3 most relevant documents
        
        # Build patient context
        patient_context = []
        if age:
            patient_context.append(f"Age: {age}")
        if gender:
            patient_context.append(f"Gender: {gender}")
        if medical_history:
            patient_context.append(f"Medical History: {medical_history}")
        
        patient_context_str = ", ".join(patient_context) if patient_context else "No additional context"
        
        # Check for emergency keywords
        emergency_detected = any(keyword in symptoms.lower() for keyword in self.prompts.EMERGENCY_KEYWORDS)
        
        prompt = self.prompts.get_symptom_analysis_prompt(context_text, patient_context_str, symptoms)

        try:
            response = await self.async_client.chat.completions.create(
                model=self.config.LLM_MODEL,
                messages=[
                    {"role": "system", "content": self.prompts.SYMPTOM_ANALYSIS_SYSTEM},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.config.LLM_MAX_TOKENS,
                temperature=self.config.LLM_TEMPERATURE
            )
            
            content = response.choices[0].message.content.strip()
            # Clean up response
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
            
            content = content.strip()
            
            try:
                result = json.loads(content)
                # Add emergency flag if detected
                if emergency_detected:
                    result["emergency_detected"] = True
                    if result.get("urgency_level") != "emergency":
                        result["urgency_level"] = "high"  # Escalate urgency
                return result
            except json.JSONDecodeError:
                return self._get_fallback_response("Analysis completed but formatting issue occurred")
                
        except Exception as e:
            print(f"Error in symptom analysis: {e}")
            return self._get_fallback_response("Analysis unavailable due to technical issue")
    
    async def chat_with_rag(self, message: str, conversation_id: str = None) -> Dict[str, Any]:
        """Chat with RAG-enhanced responses"""
        # Get relevant medical context
        context_docs = self.get_relevant_context(message)
        context_text = "\n\n".join(context_docs[:2])  # Use top 2 most relevant documents
        
        prompt = self.prompts.get_chat_prompt(context_text, message)

        try:
            response = await self.async_client.chat.completions.create(
                model=self.config.LLM_MODEL,
                messages=[
                    {"role": "system", "content": self.prompts.CHAT_SYSTEM},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.config.CHAT_MAX_TOKENS,
                temperature=self.config.CHAT_TEMPERATURE
            )
            
            return {
                "response": response.choices[0].message.content.strip(),
                "conversation_id": conversation_id,
                "sources_used": len(context_docs) > 0
            }
            
        except Exception as e:
            print(f"Error in chat: {e}")
            raise Exception(f"Chat failed: {str(e)}")
    
    async def get_condition_info_with_rag(self, condition: str) -> Dict[str, Any]:
        """Get condition information enhanced with RAG"""
        # Get relevant medical context
        context_docs = self.get_relevant_context(f"{condition} symptoms causes treatment diagnosis")
        context_text = "\n\n".join(context_docs[:3])  # Use top 3 most relevant documents
        
        prompt = self.prompts.get_medical_info_prompt(context_text, condition)
        
        try:
            response = await self.async_client.chat.completions.create(
                model=self.config.LLM_MODEL,
                messages=[
                    {"role": "system", "content": self.prompts.MEDICAL_INFO_SYSTEM},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.config.MEDICAL_INFO_MAX_TOKENS,
                temperature=self.config.MEDICAL_INFO_TEMPERATURE
            )
            
            return {
                "condition": condition,
                "information": response.choices[0].message.content.strip(),
                "sources_used": len(context_docs) > 0,
                "reference_count": len(context_docs)
            }
            
        except Exception as e:
            print(f"Error getting condition info: {e}")
            raise Exception(f"Information retrieval failed: {str(e)}")
    
    def _get_fallback_response(self, message: str) -> Dict[str, Any]:
        """Get fallback response for errors"""
        return {
            "analysis_summary": message,
            "possible_conditions": [{
                "name": "Unable to analyze", 
                "probability": "Unknown", 
                "description": "Please consult a healthcare provider", 
                "common_symptoms": [],
                "reference_match": "None"
            }],
            "treatment_recommendations": [{
                "type": "Medical consultation", 
                "description": "Please see a healthcare provider for proper evaluation", 
                "urgency": "moderate",
                "source": "General recommendation"
            }],
            "urgency_level": "moderate",
            "medical_evidence": "Unable to retrieve medical evidence",
            "disclaimer": "This is not medical advice. Consult a healthcare provider.",
            "follow_up_questions": []
        }
