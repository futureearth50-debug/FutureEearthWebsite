import { createFileRoute } from "@tanstack/react-router";
import { SolarSolutionPage } from "@/pages/SolarSolutionPage";
export const Route = createFileRoute("/solar-solutions/rooftop-solar")({
  head: () => ({ meta: [{ title: "Commercial & Industrial Rooftop Solar | Future Earth" }, { name: "description", content: "Solar on corrugated and concrete roofs — full structural analysis, guaranteed against leaks or roof damage." }] }),
  component: () => <SolarSolutionPage locale="en" slug="rooftop-solar" />,
});
