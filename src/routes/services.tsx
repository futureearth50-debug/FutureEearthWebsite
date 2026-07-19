import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/pages/ServicesPage";
export const Route = createFileRoute("/services")({
  head: () => ({ meta: [{ title: "Services — Turnkey Install, Support & PPA | Future Earth" }, { name: "description", content: "Turnkey installation, lifetime support, and flexible purchase models — direct or PPA." }] }),
  component: () => <ServicesPage locale="en" />,
});
