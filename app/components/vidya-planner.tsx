import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";

export function VidyaPlanner() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-16">
          VidyaPlanner
        </h1>
        
        <Card className="relative p-0 bg-white border-2 border-gray-300 rounded-3xl">
          <div className="relative">
            <Textarea
              placeholder="Enter syllabus"
              className="p-8 min-h-[400px] text-lg border-0 focus:ring-0 focus:outline-none resize-none bg-transparent rounded-3xl"
            />
            <Button 
              className="absolute bottom-4 right-4 bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Attach PDF
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}