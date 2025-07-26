from google import genai
import json
from models.vidyamodels import CBSESchedule
from dotenv import load_dotenv
from .agentic_search import agentic_search_service
import logging
load_dotenv(".env")
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("gemini_api_key")
client = genai.Client(api_key=GEMINI_API_KEY)

async def create_teaching_plan(prompt_by_teacher: str):
    logger.info(f"Creating teaching plan for prompt: {prompt_by_teacher[:100]}...")
    
    # Step 1: Perform agentic search to gather relevant educational content
    logger.info("Step 1: Starting agentic search...")
    search_results = await agentic_search_service.analyze_prompt_and_search(prompt_by_teacher)
    logger.info(f"Search completed with status: {search_results.get('status')}")
    
    # Step 2: Enhance the prompt with search results
    logger.info("Step 2: Enhancing prompt with search results...")
    enhanced_prompt = f"""
    Original Teacher Request: {prompt_by_teacher}
    
    Based on the following research findings, create a comprehensive CBSE-aligned teaching plan:
    
    Educational Context Analysis:
    {json.dumps(search_results.get('extracted_info', {}), indent=2) if search_results.get('status') == 'success' else 'Using direct prompt analysis'}
    
    Research Findings:
    """
    
    if search_results.get('status') == 'success':
        logger.info(f"Using {len(search_results.get('search_results', []))} search results")
        for i, result in enumerate(search_results.get('search_results', [])[:2], 1):
            enhanced_prompt += f"""
    
    Research {i}: {result.get('query', '')}
    Findings: {result.get('results', '')[:500]}...
    """
    else:
        logger.warning("Search failed, using fallback approach")
        enhanced_prompt += f"\nNote: Enhanced search unavailable. Creating plan based on standard CBSE guidelines."
    
    enhanced_prompt += f"""
    
    Requirements:
    - The term 1 and term 2 should be planned in detail with weekly topics, learning outcomes, and assessments
    - The plan should follow the CBSE syllabus and include practical and theory hours as specified in the course information
    - Time duration for each term is 18 weeks (not 18 months)
    - Incorporate the research findings above to ensure curriculum alignment
    - Include specific CBSE references and learning outcomes
    """
    
    # Step 3: Generate content using enhanced prompt
    logger.info("Step 3: Generating content with Gemini...")
    logger.info(f"Enhanced prompt length: {len(enhanced_prompt)} characters")
    
    resp = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=enhanced_prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": CBSESchedule,
        },
    )
    logger.info("Gemini response received, parsing JSON...")
    result = json.loads(resp.text)
    
    # Step 4: Add metadata about the search process
    result["_metadata"] = {
        "search_status": search_results.get('status', 'unknown'),
        "queries_used": search_results.get('search_queries', []) if search_results.get('status') == 'success' else [],
        "enhanced_with_search": search_results.get('status') == 'success'
    }
    
    logger.info("Teaching plan created successfully")
    return result