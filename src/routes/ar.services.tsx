import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/pages/ServicesPage";
export const Route = createFileRoute("/ar/services")({
  head: () => ({ meta: [{ title: "خدماتنا — فيوتشر إيرث" }] }),
  component: () => <ServicesPage locale="ar" />,
});
