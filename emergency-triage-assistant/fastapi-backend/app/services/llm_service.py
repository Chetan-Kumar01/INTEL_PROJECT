from groq import AsyncGroq
from typing import Dict, List

class LLMService:
    def __init__(self, api_key: str):
        self.client = AsyncGroq(api_key=api_key)
    
    async def generate_response(
        self, 
        context: str, 
        query: str, 
        mode: str = "emergency"
    ) -> Dict:
        """Generate response using Groq LLM."""
        system_prompt = (
            "You are an emergency medical AI. Provide immediate, actionable triage recommendations."
            if mode == "emergency"
            else "You are a medical AI assistant. Provide detailed, comprehensive analysis."
        )
        
        user_prompt = f"""Context from patient records:
{context}

Query: {query}

Provide your answer with citations to specific parts of the context."""
        
        response = await self.client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1 if mode == "emergency" else 0.3,
            max_tokens=500 if mode == "emergency" else 1000
        )
        
        return {
            "answer": response.choices[0].message.content,
            "model": "mixtral-8x7b-32768",
            "tokens": {
                "prompt": response.usage.prompt_tokens,
                "completion": response.usage.completion_tokens,
                "total": response.usage.total_tokens
            }
        }

# Will be initialized in main.py
llm_service = None
