import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/generate-plan", "routes/api.generate-plan.tsx")
] satisfies RouteConfig;
