from google import genai
import json
from models.vidyamodels import CBSESchedule
from dotenv import load_dotenv
load_dotenv(".env")
import os
GEMINI_API_KEY = os.getenv("gemini_api_key")
client = genai.Client(api_key=GEMINI_API_KEY)

async def create_teaching_plan(prompt_by_teacher: str):
    prompt = f"{prompt_by_teacher}. The term 1 and term 2 should be planned in detail with weekly topics, learning outcomes, and assessments. The plan should follow the CBSE syllabus and include practical and theory hours as specified in the course information. Time duration for each terms is 18 months."
    resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": CBSESchedule,
        },
    )
    result = json.loads(resp.text)
    return result