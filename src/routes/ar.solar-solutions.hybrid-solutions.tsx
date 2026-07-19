import { createFileRoute } from "@tanstack/react-router";
import { SolarSolutionPage } from "@/pages/SolarSolutionPage";
export const Route = createFileRoute("/ar/solar-solutions/hybrid-solutions")({
  head: () => ({ meta: [{ title: "حلول الطاقة الشمسية الهجينة والشبكات الذكية — فيوتشر إيرث" }] }),
  component: () => <SolarSolutionPage locale="ar" slug="hybrid-solutions" />,
});
