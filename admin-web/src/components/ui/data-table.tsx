"use client";

import type { ReactNode } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Button } from "./button";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (info: { row: T }) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  /** Thay toàn bộ hàng công cụ (tìm kiếm + lọc) bằng nội dung tùy chỉnh. */
  toolbar?: ReactNode;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  /** Hiện nút "Bộ lọc" mặc định (chỉ khi không dùng `toolbar`). */
  showFilterButton?: boolean;
  pageCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  /** Tổng bản ghi (phân trang server). */
  totalCount?: number;
  /** Kích thước trang để tính khoảng hiển thị. */
  pageSize?: number;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  toolbar,
  searchPlaceholder = "Tìm kiếm...",
  onSearchChange,
  showFilterButton = true,
  pageCount = 1,
  currentPage = 1,
  onPageChange,
  totalCount,
  pageSize = 20,
}: DataTableProps<T>) {
  const ps = pageSize;
  const total = typeof totalCount === "number" ? totalCount : null;
  const rangeStart =
    data.length === 0 ? 0 : (currentPage - 1) * ps + 1;
  const rangeEnd = data.length === 0 ? 0 : Math.min(currentPage * ps, total ?? currentPage * ps);
  return (
    <div className="flex flex-col gap-4">
      {toolbar ? (
        <div className="flex flex-col gap-3">{toolbar}</div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="w-full max-w-sm">
            <Input
              placeholder={searchPlaceholder}
              leftIcon={<Search className="h-4 w-4" />}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
          {showFilterButton ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2" type="button">
                <Filter className="h-4 w-4" />
                Bộ lọc
              </Button>
            </div>
          ) : null}
        </div>
      )}

      {/* Table Content */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-secondary/30 text-muted-foreground font-medium">
              <tr>
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className={cn("px-6 py-4 border-b border-border font-semibold", column.className)}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                // Skeleton loading rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 w-full bg-secondary rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-10 text-center text-muted-foreground">
                    Không tìm thấy dữ liệu.
                  </td>
                </tr>
              ) : (
                data.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    {columns.map((column, colIdx) => (
                      <td
                        key={colIdx}
                        className={cn("px-6 py-4 text-foreground", column.className)}
                      >
                        {column.cell
                          ? column.cell({ row })
                          : (row[column.accessorKey as keyof T] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-secondary/10 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {total !== null ? (
              <>
                Hiển thị{" "}
                <span className="font-medium text-foreground">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                / <span className="font-medium text-foreground">{total}</span>
              </>
            ) : (
              <>
                Hiển thị <span className="font-medium">{data.length}</span> kết quả
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pageCount }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "primary" : "ghost"}
                  className="h-8 w-8 text-xs p-0"
                  onClick={() => onPageChange?.(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage >= pageCount}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
