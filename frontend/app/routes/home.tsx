import type { Route } from "./+types/home";
import { PlanVidAI } from "../components/planvidai";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "PlanVidyAII - Plan Your Lessons with Ease" },
    {
      name: "description",
      content:
        "The effortless way for teachers to create clear and organized syllabus course plans with AI",
    },
  ];
}

export default function Home() {
  return <PlanVidAI />;
}
