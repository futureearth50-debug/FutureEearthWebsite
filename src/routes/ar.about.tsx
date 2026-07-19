import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/pages/AboutPage";
export const Route = createFileRoute("/ar/about")({
  head: () => ({ meta: [{ title: "من نحن — فيوتشر إيرث لأنظمة الطاقة" }] }),
  component: () => <AboutPage locale="ar" />,
});
