import { createFileRoute } from "@tanstack/react-router";
import { SolarSolutionPage } from "@/pages/SolarSolutionPage";
export const Route = createFileRoute("/ar/solar-solutions/ground-base-solar")({
  head: () => ({ meta: [{ title: "المحطات الأرضية للطاقة الشمسية — فيوتشر إيرث" }] }),
  component: () => <SolarSolutionPage locale="ar" slug="ground-base-solar" />,
});
