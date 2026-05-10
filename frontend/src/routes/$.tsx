import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";

// Catch-all so React Router can handle every client-side path.
export const Route = createFileRoute("/$")({
  component: App,
});
