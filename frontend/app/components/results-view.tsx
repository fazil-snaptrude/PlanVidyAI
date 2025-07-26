import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, CheckCircle } from "lucide-react";

export interface Topic {
  topic: string;
  subtopics?: string[];
  cbseReference: string;
  periods: number;
  type: string;
  equipment?: string[];
}

export interface WeekSchedule {
  week: number;
  unit: string;
  title: string;
  topics: Topic[];
  learningOutcomes: string[];
  cbseAssessment: {
    type: string;
    marks: number;
    technique: string;
  } | null;
}

export interface CourseInfo {
  title: string;
  class: string;
  subject: string;
  academicYear: string;
  totalWeeks: number;
  periodsPerWeek: number;
  practicalHours: number;
  theoryHours: number;
}

export interface TermPlan {
  term1: {
    weeks: string;
    units: string[];
    assessment: string;
  };
  term2: {
    weeks: string;
    units: string[];
    assessment: string;
  };
}

export interface ResultsData {
  courseInfo: CourseInfo;
  schedule: WeekSchedule[];
  termPlan: TermPlan;
}

interface ResultsViewProps {
  data: ResultsData;
  onBack: () => void;
}

export function ResultsView({ data, onBack }: ResultsViewProps) {
  const { courseInfo, schedule, termPlan } = data;

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: 'rgb(254, 255, 251)' }}>
      <div className="max-w-6xl mx-auto">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-6 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Edit
        </Button>

        <Card className="mb-8 overflow-hidden bg-slate-800 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              {courseInfo.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm">
                <div className="text-sm opacity-80">Class</div>
                <div className="text-xl font-semibold">{courseInfo.class}</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm">
                <div className="text-sm opacity-80">Subject Code</div>
                <div className="text-xl font-semibold">{courseInfo.subject.match(/\((\d+)\)/)?.[1] || 'N/A'}</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm">
                <div className="text-sm opacity-80">Academic Year</div>
                <div className="text-xl font-semibold">{courseInfo.academicYear}</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm">
                <div className="text-sm opacity-80">Total Weeks</div>
                <div className="text-xl font-semibold">{courseInfo.totalWeeks}</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm">
                <div className="text-sm opacity-80">Periods/Week</div>
                <div className="text-xl font-semibold">{courseInfo.periodsPerWeek}</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm">
                <div className="text-sm opacity-80">Theory Hours</div>
                <div className="text-xl font-semibold">{courseInfo.theoryHours}</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm">
                <div className="text-sm opacity-80">Practical Hours</div>
                <div className="text-xl font-semibold">{courseInfo.practicalHours}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-1 h-8 bg-slate-800 rounded mr-3"></div>
              Weekly Schedule
            </h2>
            
            <div className="space-y-6">
              {schedule.map((week) => (
                <Card key={week.week} className="p-6 hover:shadow-lg transition-shadow bg-white border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-slate-800 text-white px-4 py-2">
                      Week {week.week}
                    </Badge>
                    <div className="text-right">
                      <h3 className="text-xl font-semibold text-slate-800">{week.title}</h3>
                      <p className="text-slate-600 text-sm italic">{week.unit}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 mb-6">
                    {week.topics.map((topic, index) => (
                      <Card key={index} className="bg-slate-50 border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-slate-800">{topic.topic}</h4>
                            <div className="flex gap-2">
                              <Badge 
                                variant={topic.type === 'theory' ? 'default' : topic.type === 'practical' ? 'secondary' : 'outline'}
                                className={topic.type === 'theory' ? 'bg-slate-100 text-slate-800' : 
                                          topic.type === 'practical' ? 'bg-slate-200 text-slate-800' : 
                                          'bg-amber-100 text-amber-800'}
                              >
                                {topic.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {topic.periods} periods
                              </Badge>
                            </div>
                          </div>
                          
                          {topic.subtopics && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-slate-700 mb-2">Subtopics:</p>
                              <ul className="space-y-1">
                                {topic.subtopics.map((subtopic, subIndex) => (
                                  <li key={subIndex} className="text-sm text-slate-600 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full mr-2"></div>
                                    {subtopic}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <p className="text-xs text-slate-500">
                            <span className="font-medium">CBSE Reference:</span> {topic.cbseReference}
                          </p>
                          
                          {topic.equipment && (
                            <div className="mt-2 flex gap-2 flex-wrap">
                              <span className="text-xs font-medium text-slate-700">Equipment:</span>
                              {topic.equipment.map((item, eqIndex) => (
                                <Badge key={eqIndex} variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-300">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-slate-50 mb-4 border-slate-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mr-2" />
                        Learning Outcomes
                      </h4>
                      <ul className="space-y-1">
                        {week.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="text-sm text-slate-600 flex items-center">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {week.cbseAssessment && (
                    <Card className="bg-amber-50 border-amber-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-amber-800">{week.cbseAssessment.type}</h4>
                          <Badge className="bg-amber-600 text-white">
                            {week.cbseAssessment.marks} Marks
                          </Badge>
                        </div>
                        <p className="text-sm text-amber-700">{week.cbseAssessment.technique}</p>
                      </CardContent>
                    </Card>
                  )}
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-1 h-8 bg-slate-800 rounded mr-3"></div>
              Term Plan
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-800">Term 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">Duration</p>
                      <p className="text-slate-900">{termPlan.term1.weeks}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">Units Covered</p>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {termPlan.term1.units.map((unit, index) => (
                          <Badge key={index} className="bg-slate-700 text-white">
                            {unit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">Assessment</p>
                      <p className="text-slate-900">{termPlan.term1.assessment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-800">Term 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">Duration</p>
                      <p className="text-slate-900">{termPlan.term2.weeks}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">Units Covered</p>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {termPlan.term2.units.map((unit, index) => (
                          <Badge key={index} className="bg-slate-700 text-white">
                            {unit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">Assessment</p>
                      <p className="text-slate-900">{termPlan.term2.assessment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}