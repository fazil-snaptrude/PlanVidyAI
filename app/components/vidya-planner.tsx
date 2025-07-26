import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Paperclip, ArrowUp } from "lucide-react";

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
              placeholder="Enter syllabus details"
              className="p-8 min-h-[400px] text-lg border-0 focus:ring-0 focus:outline-none resize-none bg-transparent rounded-3xl"
            />
            <Button 
              variant="ghost"
              size="sm"
              className="absolute bottom-4 left-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              aria-label="Attach PDF"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button 
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white w-10 h-10 rounded-full flex items-center justify-center"
              aria-label="Send"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}