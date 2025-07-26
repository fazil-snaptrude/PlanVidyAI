from fastapi import APIRouter
from pydantic import BaseModel
from utilities.vidyautils import create_teaching_plan

router = APIRouter()

class TeacherInput(BaseModel):
    prompt: str

@router.post("/teacher_help")
async def teacher_help(input: TeacherInput):
    prompt = input.prompt
    response = await create_teaching_plan(prompt)
    return response

