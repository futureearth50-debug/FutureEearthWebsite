import { createFileRoute } from "@tanstack/react-router";
import { ProductsPage } from "@/pages/ProductsPage";
export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Products — Industrial Lithium Battery Storage | Future Earth" }, { name: "description", content: "L1 and S1 series lithium battery energy storage systems from 50 kW / 86 kWh upward." }] }),
  component: () => <ProductsPage locale="en" />,
});
