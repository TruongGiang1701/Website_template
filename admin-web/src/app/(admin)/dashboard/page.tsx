"use client";

import { useCallback, useEffect, useState } from "react";
import { Crown, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { MetricCard } from "@/components/admin/dashboard/MetricCard";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApiJson } from "@/lib/admin-api";
import { formatVnd } from "@/lib/utils";
import type { AdminDashboardMetrics } from "@/types/admin-api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await adminApiJson<AdminDashboardMetrics>("/api/admin/dashboard/metrics");
    if (!res.ok) {
      setError(res.error);
      setMetrics(null);
      setLoading(false);
      if (res.status === 401) router.replace("/login");
      return;
    }
    setMetrics(res.data);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const series = metrics?.revenue_last_7_days ?? [];
  const maxBar = Math.max(...series.map((d) => d.amount_vnd), 1);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Dashboard"
        description="Tổng quan doanh thu, đơn hàng và người dùng — đồng bộ với API thống kê admin."
      />

      {error ? (
        <Card className="mb-8 border-amber-200 bg-amber-50/80">
          <CardContent className="py-4 text-sm text-amber-900">
            <p className="font-medium">Chưa tải được số liệu</p>
            <p className="mt-1 text-amber-800/90">{error}</p>
            <p className="mt-2 text-xs text-amber-800/80">
              Đảm bảo backend đang chạy và route <code className="rounded bg-white/80 px-1">GET /api/admin/dashboard/metrics</code> đã
              triển khai.
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Tổng doanh thu"
          value={metrics ? formatVnd(metrics.total_revenue_vnd) : "—"}
          icon={TrendingUp}
          isLoading={loading}
        />
        <MetricCard
          title="Đơn mới (tháng này)"
          value={metrics?.new_orders_this_month ?? "—"}
          icon={ShoppingBag}
          isLoading={loading}
        />
        <MetricCard
          title="Khách đăng ký mới"
          value={metrics?.new_users_this_month ?? "—"}
          icon={Users}
          isLoading={loading}
        />
        <MetricCard
          title="Sản phẩm dẫn đầu"
          value={
            metrics?.top_products?.[0]?.title
              ? metrics.top_products[0].title.length > 28
                ? `${metrics.top_products[0].title.slice(0, 28)}…`
                : metrics.top_products[0].title
              : "—"
          }
          icon={Crown}
          isLoading={loading}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Doanh thu 7 ngày</CardTitle>
            <p className="text-sm text-muted-foreground">Hiển thị khi API trả về trường revenue_last_7_days.</p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-40 items-end gap-2 px-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex-1 animate-pulse rounded-t-md bg-muted" style={{ height: `${30 + i * 8}%` }} />
                ))}
              </div>
            ) : series.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-center text-sm text-muted-foreground">
                Chưa có dữ liệu chuỗi thời gian.
              </div>
            ) : (
              <div className="flex h-44 items-end gap-2 border-b border-border px-1 pb-1">
                {series.map((d) => (
                  <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full max-w-[48px] rounded-t-md bg-primary/85 transition hover:bg-primary"
                      style={{ height: `${Math.max(8, (d.amount_vnd / maxBar) * 100)}%`, minHeight: "28px" }}
                      title={`${d.date}: ${formatVnd(d.amount_vnd)}`}
                    />
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {d.date.slice(5).replace("-", "/")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Top 5 sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-muted/40 text-left text-muted-foreground">
                    <th className="px-6 py-3 font-medium">#</th>
                    <th className="px-6 py-3 font-medium">Sản phẩm</th>
                    <th className="px-6 py-3 text-right font-medium">Đã bán</th>
                    <th className="px-6 py-3 text-right font-medium">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={4} className="px-6 py-3">
                          <div className="h-4 w-full animate-pulse rounded bg-muted" />
                        </td>
                      </tr>
                    ))
                  ) : !metrics?.top_products?.length ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                        Chưa có dữ liệu xếp hạng.
                      </td>
                    </tr>
                  ) : (
                    metrics.top_products.slice(0, 5).map((p, idx) => (
                      <tr key={p.product_id} className="hover:bg-muted/30">
                        <td className="px-6 py-3 font-medium text-muted-foreground">{idx + 1}</td>
                        <td className="px-6 py-3 font-medium text-foreground">{p.title}</td>
                        <td className="px-6 py-3 text-right tabular-nums">{p.units_sold}</td>
                        <td className="px-6 py-3 text-right font-semibold tabular-nums text-primary">
                          {formatVnd(p.revenue_vnd)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
