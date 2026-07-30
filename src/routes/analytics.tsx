import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsPage } from "@/pages/AnalyticsPage";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Chatbot Analytics — Future Earth" }, { name: "robots", content: "noindex" }] }),
  component: AnalyticsPage,
});
