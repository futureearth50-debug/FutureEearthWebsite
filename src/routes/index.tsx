import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Future Earth Energy Systems — Solar & Storage at Scale in Saudi Arabia" },
      { name: "description", content: "Solar energy and lithium battery storage engineered for Saudi Arabia. 100+ MW installed worldwide." },
    ],
  }),
  component: () => <HomePage locale="en" />,
});
