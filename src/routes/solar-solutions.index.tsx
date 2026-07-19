import { createFileRoute } from "@tanstack/react-router";
import { SolarSolutionsPage } from "@/pages/SolarSolutionsPage";
export const Route = createFileRoute("/solar-solutions/")({
  head: () => ({ meta: [{ title: "Solar Solutions — Rooftop, Ground Base & Hybrid | Future Earth" }, { name: "description", content: "Engineered solar for every site — rooftop, ground base and hybrid microgrids across Saudi Arabia." }] }),
  component: () => <SolarSolutionsPage locale="en" />,
});
