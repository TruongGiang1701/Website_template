"use client";

import { Container } from "@/components/shared/container";
import { OrderHistorySection } from "@/features/dashboard/order-history/OrderHistorySection";

export default function OrdersPage() {
  return (
    <Container className="max-w-5xl space-y-6">
      <OrderHistorySection layout="standalone" />
    </Container>
  );
}
