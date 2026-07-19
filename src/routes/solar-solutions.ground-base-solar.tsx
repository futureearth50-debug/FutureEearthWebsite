import { createFileRoute } from "@tanstack/react-router";
import { SolarSolutionPage } from "@/pages/SolarSolutionPage";
export const Route = createFileRoute("/solar-solutions/ground-base-solar")({
  head: () => ({ meta: [{ title: "Ground Base Solar Fields | Future Earth" }, { name: "description", content: "Desert farm installations, car parking shade structures and comms site power across unused land." }] }),
  component: () => <SolarSolutionPage locale="en" slug="ground-base-solar" />,
});
