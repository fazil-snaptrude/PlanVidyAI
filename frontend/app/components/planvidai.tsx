import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Paperclip, ArrowUp, Loader2 } from "lucide-react";
import { ResultsView, type ResultsData } from "./results-view";
import { PlanVidhAILogo } from "./planvidai-logo";

// Function to convert backend snake_case response to frontend camelCase
function transformBackendResponse(backendResponse: any): ResultsData {
  return {
    courseInfo: {
      title: backendResponse.course_info.title,
      class: backendResponse.course_info.class_,
      subject: backendResponse.course_info.subject,
      academicYear: backendResponse.course_info.academic_year,
      totalWeeks: backendResponse.course_info.total_weeks,
      periodsPerWeek: backendResponse.course_info.periods_per_week,
      practicalHours: backendResponse.course_info.practical_hours,
      theoryHours: backendResponse.course_info.theory_hours,
    },
    schedule: backendResponse.schedule.map((week: any) => ({
      week: week.week,
      unit: week.unit,
      title: week.title,
      topics: week.topics.map((topic: any) => ({
        topic: topic.topic,
        subtopics: topic.subtopics || undefined,
        cbseReference: topic.cbse_reference,
        periods: topic.periods,
        type: topic.type,
        equipment: topic.equipment,
      })),
      learningOutcomes: week.learning_outcomes,
      cbseAssessment: week.cbse_assessment
        ? {
            type: week.cbse_assessment.type,
            marks: week.cbse_assessment.marks,
            technique: week.cbse_assessment.technique,
          }
        : null,
    })),
    termPlan: {
      term1: {
        weeks: backendResponse.term_plan.term1.weeks,
        units: backendResponse.term_plan.term1.units,
        assessment: backendResponse.term_plan.term1.assessment,
      },
      term2: {
        weeks: backendResponse.term_plan.term2.weeks,
        units: backendResponse.term_plan.term2.units,
        assessment: backendResponse.term_plan.term2.assessment,
      },
    },
  };
}

export function PlanVidAI() {
  const [syllabus, setSyllabus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!syllabus.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Call the backend API directly
      const response = await fetch("https://planvidyai.onrender.com/api/teacher_help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: syllabus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const backendResponse = await response.json();

      // Transform the backend response to match frontend expectations
      const transformedResponse = transformBackendResponse(backendResponse);
      setResults(transformedResponse);
    } catch (error) {
      console.error("Error calling backend API:", error);
      setError("Failed to generate lesson plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setResults(null);
    setError(null);
  };

  if (results) {
    return <ResultsView data={results} onBack={handleBack} />;
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "rgb(254, 255, 251)" }}
    >
      <div className="w-full max-w-3xl">
        <div className="mb-12">
          <PlanVidhAILogo />
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="relative p-0 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="relative">
              <Textarea
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                placeholder="Enter syllabus details"
                className="p-6 min-h-[200px] text-base border-0 focus:ring-0 focus:outline-none resize-none bg-transparent rounded-2xl placeholder:text-slate-400 selection:bg-slate-200 selection:text-slate-900 dark:selection:bg-slate-600 dark:selection:text-white"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute bottom-4 left-4 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Attach PDF"
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                className="absolute bottom-4 right-4 bg-slate-800 hover:bg-slate-900 focus:bg-slate-900 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 text-white w-10 h-10 rounded-full flex items-center justify-center"
                aria-label="Send"
                disabled={isLoading || !syllabus.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Card>
          
          {error && (
            <Card className="mt-4 bg-red-50 border-red-200">
              <div className="p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </Card>
          )}
        </form>
      </div>
    </main>
  );
}
