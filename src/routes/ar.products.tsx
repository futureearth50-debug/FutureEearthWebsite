import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "@/pages/ProductsPage";
export const Route = createFileRoute("/ar/products")({
  head: () => ({ meta: [{ title: "المنتجات — أنظمة تخزين طاقة | فيوتشر إيرث" }] }),
  component: () => <ProductsPage locale="ar" />,
});
