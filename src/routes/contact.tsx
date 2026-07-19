import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/pages/ContactPage";
export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Us — Future Earth Energy Systems" }, { name: "description", content: "Chat with our AI energy consultant about your solar or storage project. Our Saudi-based engineering team prepares a tailored proposal before we connect you with sales." }] }),
  component: () => <ContactPage locale="en" />,
});
