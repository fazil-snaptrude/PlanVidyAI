from google.adk.agents import LlmAgent
from google.adk.tools import google_search
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Search Query Generation Agent
search_query_agent = LlmAgent(
    name="search_query_agent",
    model="gemini-2.0-flash",
    description="Analyzes educational prompts to generate targeted search queries for CBSE curriculum and syllabus content.",
    instruction="""You are an educational search query specialist. When given a teacher's prompt for creating a lesson plan, analyze it to extract:
    1. Subject (Physics, Chemistry, Mathematics, etc.)
    2. Class level (IX, X, XI, XII, etc.)
    3. Board (CBSE, ICSE, State boards)
    4. Academic year if mentioned
    
    Generate 2-3 specific search queries that would help find:
    - Official CBSE syllabus documents
    - Curriculum guidelines
    - Assessment patterns
    - Learning outcomes
    
    Return your response as a JSON object with this format:
    {
        "extracted_info": {
            "subject": "extracted subject",
            "class": "extracted class",
            "board": "extracted board",
            "year": "extracted year or current"
        },
        "search_queries": [
            "query 1",
            "query 2", 
            "query 3"
        ]
    }""",
    tools=[]
)

# Content Search Agent
content_search_agent = LlmAgent(
    name="content_search_agent", 
    model="gemini-2.0-flash",
    description="Searches for educational content using generated queries and summarizes relevant information.",
    instruction="""You are an educational content researcher. Use the Google search tool to find relevant educational content based on the provided search queries. 

    Focus on finding:
    - Official CBSE syllabus documents
    - Curriculum guidelines and frameworks
    - Assessment patterns and evaluation criteria
    - Learning outcomes and objectives
    - Topic breakdowns and unit structures

    After searching, summarize the key findings that would be useful for creating a detailed lesson plan. Include:
    - Curriculum structure
    - Key topics and subtopics
    - Assessment methods
    - Learning outcomes
    - Time allocation guidelines""",
    tools=[google_search]
)

class AgenticSearchService:
    def __init__(self):
        self.session_service = InMemorySessionService()
        self.search_query_runner = None
        self.content_search_runner = None
    
    async def initialize(self):
        """Initialize the agents and runners"""
        logger.info("Initializing agentic search service...")
        
        # Create session
        self.session = await self.session_service.create_session(
            app_name="vidya_planner_search",
            user_id="system",
            session_id="search_session"
        )
        logger.info(f"Created session: {self.session.id}")
        
        # Create runners
        self.search_query_runner = Runner(
            agent=search_query_agent,
            app_name="vidya_planner_search", 
            session_service=self.session_service
        )
        
        self.content_search_runner = Runner(
            agent=content_search_agent,
            app_name="vidya_planner_search",
            session_service=self.session_service
        )
        logger.info("Agents and runners initialized successfully")
    
    async def analyze_prompt_and_search(self, teacher_prompt: str) -> dict:
        """
        Analyze teacher's prompt and perform targeted search for educational content
        
        Args:
            teacher_prompt: The original prompt from the teacher
            
        Returns:
            dict: Combined analysis and search results
        """
        logger.info(f"Starting agentic search for prompt: {teacher_prompt[:100]}...")
        
        try:
            if not self.search_query_runner:
                logger.info("Initializing search runners...")
                await self.initialize()
            
            # Step 1: Analyze prompt to generate search queries
            logger.info("Step 1: Analyzing prompt to generate search queries...")
            query_analysis_prompt = f"""
            Analyze this teacher's prompt and generate targeted search queries:
            
            Teacher's Prompt: "{teacher_prompt}"
            
            Extract the educational context and generate specific search queries for finding relevant CBSE curriculum content.
            """
            
            logger.info("Sending prompt to search query agent...")
            query_content = types.Content(role='user', parts=[types.Part(text=query_analysis_prompt)])
            query_response_generator = self.search_query_runner.run_async(
                user_id="system",
                session_id=self.session.id,
                new_message=query_content
            )
            
            # Process async generator to get final response
            query_response_text = ""
            async for event in query_response_generator:
                if hasattr(event, 'is_final_response') and event.is_final_response():
                    query_response_text = event.content.parts[0].text
                    break
                elif hasattr(event, 'content') and event.content:
                    query_response_text = event.content.parts[0].text
            
            logger.info(f"Query agent response: {query_response_text[:200]}...")
            
            # Parse the JSON response from search query agent
            try:
                query_data = json.loads(query_response_text)
                search_queries = query_data.get("search_queries", [])
                extracted_info = query_data.get("extracted_info", {})
                logger.info(f"Extracted info: {extracted_info}")
                logger.info(f"Generated queries: {search_queries}")
            except json.JSONDecodeError as e:
                logger.warning(f"JSON parsing failed: {e}, using fallback queries")
                # Fallback if JSON parsing fails
                search_queries = [
                    f"CBSE syllabus {teacher_prompt}",
                    f"CBSE curriculum guidelines {teacher_prompt}",
                    f"CBSE assessment pattern {teacher_prompt}"
                ]
                extracted_info = {}
            
            # Step 2: Perform searches using the generated queries
            logger.info("Step 2: Performing searches with generated queries...")
            search_results = []
            for i, query in enumerate(search_queries[:3], 1):  # Limit to 3 queries
                logger.info(f"Search {i}/3: {query}")
                search_prompt = f"""
                Search for educational content using this query: "{query}"
                
                Focus on finding official CBSE documents, curriculum guidelines, and educational resources.
                Summarize the key findings that would help in creating a comprehensive lesson plan.
                """
                
                search_content = types.Content(role='user', parts=[types.Part(text=search_prompt)])
                search_response_generator = self.content_search_runner.run_async(
                    user_id="system",
                    session_id=self.session.id,
                    new_message=search_content
                )
                
                # Process async generator to get final response
                search_response_text = ""
                async for event in search_response_generator:
                    if hasattr(event, 'is_final_response') and event.is_final_response():
                        search_response_text = event.content.parts[0].text
                        break
                    elif hasattr(event, 'content') and event.content:
                        search_response_text = event.content.parts[0].text
                
                logger.info(f"Search {i} completed, result length: {len(search_response_text)}")
                search_results.append({
                    "query": query,
                    "results": search_response_text
                })
            
            logger.info("Agentic search completed successfully")
            return {
                "extracted_info": extracted_info,
                "search_queries": search_queries,
                "search_results": search_results,
                "status": "success"
            }
            
        except Exception as e:
            logger.error(f"Agentic search failed: {str(e)}")
            return {
                "error": str(e),
                "status": "error",
                "fallback_info": {
                    "message": "Search functionality unavailable, using direct prompt processing"
                }
            }

# Global instance
agentic_search_service = AgenticSearchService()