import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/pages/AboutPage";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Us — Future Earth Energy Systems" }, { name: "description", content: "15+ years of solar engineering experience delivered to Saudi Arabia — a message from our Chairman and our story." }] }),
  component: () => <AboutPage locale="en" />,
});
