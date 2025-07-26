from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class TopicType(str, Enum):
    THEORY = "theory"
    PRACTICAL = "practical"
    REVISION = "revision"
    ASSESSMENT = "assessment"

class AssessmentType(str, Enum):
    FORMATIVE = "Formative Assessment"
    SUMMATIVE = "Summative Assessment"
    TERM_EXAM = "Term Exam"
    PRACTICAL_EXAM = "Practical Exam"
    PROJECT = "Project"

class CourseInfo(BaseModel):
    title: str = Field(..., description="Course title")
    class_: str = Field(..., description="Class level (e.g., XII)")
    subject: str = Field(..., description="Subject with code (e.g., Computer Science (083))")
    academic_year: str = Field(..., description="Academic year")
    total_weeks: int = Field(..., description="Total weeks in course")
    periods_per_week: int = Field(..., description="Periods per week")
    practical_hours: int = Field(..., ge=0, description="Total practical hours")
    theory_hours: int = Field(..., ge=0, description="Total theory hours")

class CBSEAssessment(BaseModel):
    type: AssessmentType = Field(..., description="Type of assessment")
    marks: int = Field(..., ge=0, description="Maximum marks")
    technique: str = Field(..., description="Assessment technique or method")

class Topic(BaseModel):
    topic: str = Field(..., description="Main topic name")
    subtopics: Optional[List[str]] = Field(None, description="List of subtopics")
    cbse_reference: str = Field(..., description="CBSE syllabus reference")
    periods: int = Field(..., description="Number of periods for this topic")
    type: TopicType = Field(..., description="Type of topic (theory/practical)")
    equipment: Optional[List[str]] = Field(None, description="Required equipment for practical topics")

class WeekSchedule(BaseModel):
    week: int = Field(..., description="Week number")
    unit: str = Field(..., description="CBSE unit reference")
    title: str = Field(..., description="Week title")
    topics: List[Topic] = Field(..., min_length=1, description="List of topics for the week")
    learning_outcomes: List[str] = Field(..., min_length=1, description="Expected learning outcomes")
    cbse_assessment: Optional[CBSEAssessment] = Field(None, description="Assessment for this week")

class TermInfo(BaseModel):
    weeks: str = Field(..., description="Week range (e.g., '1-18')")
    units: List[str] = Field(..., min_length=1, description="Units covered in this term")
    assessment: str = Field(..., description="Term assessment details")

class TermPlan(BaseModel):
    term1: TermInfo
    term2: TermInfo

class CBSESchedule(BaseModel):
    course_info: CourseInfo = Field(..., description="Course information")
    schedule: List[WeekSchedule] = Field(..., min_length=1, description="Weekly schedule")
    term_plan: TermPlan = Field(..., description="Term-wise planning")