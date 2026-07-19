import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";
export const Route = createFileRoute("/ar/")({
  head: () => ({ meta: [{ title: "فيوتشر إيرث لأنظمة الطاقة — طاقة شمسية وتخزين في المملكة" }, { name: "description", content: "طاقة شمسية وأنظمة تخزين بالبطاريات الليثيوم مصممة هندسياً للمملكة العربية السعودية." }] }),
  component: () => <HomePage locale="ar" />,
});
