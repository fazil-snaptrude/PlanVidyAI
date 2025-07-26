import type { Route } from "./+types/home";
import { VidyaPlanner } from "../components/vidya-planner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "VidyaPlanner" },
    { name: "description", content: "Plan your learning journey with VidyaPlanner" },
  ];
}

export default function Home() {
  return <VidyaPlanner />;
}
