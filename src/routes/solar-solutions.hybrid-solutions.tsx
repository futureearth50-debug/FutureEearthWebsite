import { createFileRoute } from "@tanstack/react-router";
import { SolarSolutionPage } from "@/pages/SolarSolutionPage";
export const Route = createFileRoute("/solar-solutions/hybrid-solutions")({
  head: () => ({ meta: [{ title: "Solar Hybrid Solutions & Customized Microgrids | Future Earth" }, { name: "description", content: "Solar, diesel, battery and grid combined — autonomous microgrids with full command, control and SCADA." }] }),
  component: () => <SolarSolutionPage locale="en" slug="hybrid-solutions" />,
});
