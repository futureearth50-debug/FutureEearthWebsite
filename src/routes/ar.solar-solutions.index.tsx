import { createFileRoute } from "@tanstack/react-router";
import { SolarSolutionsPage } from "@/pages/SolarSolutionsPage";
export const Route = createFileRoute("/ar/solar-solutions/")({
  head: () => ({ meta: [{ title: "حلول الطاقة الشمسية — فيوتشر إيرث" }] }),
  component: () => <SolarSolutionsPage locale="ar" />,
});
