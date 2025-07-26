import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Paperclip, ArrowUp, Loader2 } from "lucide-react";
import { ResultsView } from "./results-view";
import { PlanVidhAILogo } from "./planvidai-logo";

export function PlanVidAI() {
  const [syllabus, setSyllabus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!syllabus.trim()) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("syllabus", syllabus);

      const response = await fetch("/api/generate-plan", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setResults(null);
  };

  if (results) {
    return <ResultsView data={results} onBack={handleBack} />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'rgb(254, 255, 251)' }}>
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
                className="p-6 min-h-[200px] text-base border-0 focus:ring-0 focus:outline-none resize-none bg-transparent rounded-2xl placeholder:text-slate-400"
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
        </form>
      </div>
    </main>
  );
}
