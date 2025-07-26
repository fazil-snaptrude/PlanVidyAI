import type { Route } from "./+types/api.generate-plan";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const syllabus = formData.get("syllabus") as string;

  // For now, return dummy data regardless of input
  // In the future, this would process the syllabus and generate a real plan
  const dummyResponse = {
    courseInfo: {
      title: "Mathematics Advanced Course",
      class: "XI",
      subject: "Mathematics (041)",
      academicYear: "2025-26",
      totalWeeks: 40,
      periodsPerWeek: 6,
      practicalHours: 0,
      theoryHours: 240
    },
    schedule: [
      {
        week: 1,
        unit: "Unit I: Sets and Functions",
        title: "Introduction to Sets",
        topics: [
          {
            topic: "Basic Set Theory",
            subtopics: [
              "Definition of sets",
              "Types of sets",
              "Set operations",
              "Venn diagrams"
            ],
            cbseReference: "Unit I - Sets",
            periods: 4,
            type: "theory"
          },
          {
            topic: "Practice Problems on Sets",
            cbseReference: "Exercise 1.1-1.3",
            periods: 2,
            type: "practice",
            equipment: ["Whiteboard", "Textbook"]
          }
        ],
        learningOutcomes: [
          "Students will understand basic set concepts",
          "Students can perform set operations",
          "Students can represent sets using Venn diagrams"
        ],
        cbseAssessment: {
          type: "Formative Assessment",
          marks: 10,
          technique: "Class exercises and problem solving"
        }
      },
      {
        week: 2,
        unit: "Unit I: Sets and Functions",
        title: "Relations and Functions",
        topics: [
          {
            topic: "Relations",
            subtopics: [
              "Cartesian product",
              "Definition of relation",
              "Types of relations",
              "Equivalence relations"
            ],
            cbseReference: "Unit I - Relations",
            periods: 3,
            type: "theory"
          },
          {
            topic: "Introduction to Functions",
            subtopics: [
              "Definition of function",
              "Domain and range",
              "Types of functions"
            ],
            cbseReference: "Unit I - Functions",
            periods: 3,
            type: "theory"
          }
        ],
        learningOutcomes: [
          "Students will understand the concept of relations",
          "Students can identify different types of functions",
          "Students can find domain and range of functions"
        ],
        cbseAssessment: {
          type: "Formative Assessment",
          marks: 15,
          technique: "Weekly test and assignments"
        }
      }
    ],
    termPlan: {
      term1: {
        weeks: "1-20",
        units: ["Unit I", "Unit II", "Unit III"],
        assessment: "Term 1 Exam (40 marks)"
      },
      term2: {
        weeks: "21-40",
        units: ["Unit IV", "Unit V", "Unit VI"],
        assessment: "Term 2 Exam (40 marks) + Project (20 marks)"
      }
    }
  };

  return Response.json(dummyResponse);
}