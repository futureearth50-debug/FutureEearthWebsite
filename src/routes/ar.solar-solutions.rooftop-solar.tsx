import { createFileRoute } from "@tanstack/react-router";
import { SolarSolutionPage } from "@/pages/SolarSolutionPage";
export const Route = createFileRoute("/ar/solar-solutions/rooftop-solar")({
  head: () => ({ meta: [{ title: "الطاقة الشمسية لأسطح المباني التجارية والصناعية — فيوتشر إيرث" }] }),
  component: () => <SolarSolutionPage locale="ar" slug="rooftop-solar" />,
});
