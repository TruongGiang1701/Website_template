"use client";

import { cn } from "@/lib/utils";

export type FilterState = {
  sample: "website" | "landing" | null;
  categories: Set<string>;
  price: "under_10m" | "10m_15m" | "promo" | null;
};

type Props = {
  counts: {
    website: number;
    landing: number;
    categories: Record<string, number>;
  };
  value: FilterState;
  onChange: (next: FilterState) => void;
  className?: string;
};

export function FilterSidebar({ counts, value, onChange, className }: Props) {
  const categories = Object.entries(counts.categories).sort((a, b) => b[1] - a[1]);

  return (
    <aside
      className={cn(
        "rounded-2xl border border-[#d7e4f6] bg-white/85 p-4 shadow-sm backdrop-blur-sm",
        "min-h-[42rem] lg:min-h-[52rem]",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-extrabold text-[#173a66]">Bộ lọc tìm kiếm</p>
        <span className="text-xs font-extrabold text-[#173a66]/70">
          {counts.website + counts.landing}
        </span>
      </div>

      <div className="mt-4 space-y-5">
        <FilterGroup title="Mẫu">
          <RadioRow
            label="Website"
            count={counts.website}
            checked={value.sample === "website" || value.sample === null}
            onClick={() =>
              onChange({
                ...value,
                sample: value.sample === "website" ? null : "website",
              })
            }
          />
          <RadioRow
            label="Landing Page"
            count={counts.landing}
            checked={value.sample === "landing"}
            onClick={() =>
              onChange({
                ...value,
                sample: value.sample === "landing" ? null : "landing",
              })
            }
          />
        </FilterGroup>

        <FilterGroup title="Thể loại">
          <RadioRow
            label="Tất cả"
            count={counts.website + counts.landing}
            checked={value.categories.size === 0}
            onClick={() => onChange({ ...value, categories: new Set() })}
          />

          <div className="mt-2 space-y-2">
            {categories.map(([category, count]) => {
              const checked = value.categories.has(category);
              return (
                <CheckboxRow
                  key={category}
                  label={category}
                  count={count}
                  checked={checked}
                  onClick={() => {
                    const next = new Set(value.categories);
                    if (next.has(category)) next.delete(category);
                    else next.add(category);
                    onChange({ ...value, categories: next });
                  }}
                />
              );
            })}
          </div>
        </FilterGroup>

        <FilterGroup title="Giá">
          <RadioRow
            label="Dưới 10.000.000 VNĐ"
            checked={value.price === "under_10m"}
            onClick={() =>
              onChange({
                ...value,
                price: value.price === "under_10m" ? null : "under_10m",
              })
            }
          />
          <RadioRow
            label="Từ 10.000.000 đến 15.000.000 VNĐ"
            checked={value.price === "10m_15m"}
            onClick={() =>
              onChange({
                ...value,
                price: value.price === "10m_15m" ? null : "10m_15m",
              })
            }
          />
          <RadioRow
            label="Khuyến mãi"
            checked={value.price === "promo"}
            onClick={() =>
              onChange({ ...value, price: value.price === "promo" ? null : "promo" })
            }
          />
        </FilterGroup>
      </div>
    </aside>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#e3eefc] bg-white/60 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-extrabold text-[#173a66]">{title}</p>
        <span className="text-[#173a66]/40">▾</span>
      </div>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function RadioRow({
  label,
  count,
  checked,
  onClick,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-[#f2f7ff]"
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-[#173a66]">
        <span
          className={cn(
            "inline-flex size-4 items-center justify-center rounded-full border",
            checked ? "border-[#0f67be] bg-[#0f67be]" : "border-[#b9cceb] bg-white",
          )}
          aria-hidden="true"
        >
          {checked ? <span className="block size-1.5 rounded-full bg-white" /> : null}
        </span>
        {label}
      </span>
      {typeof count === "number" ? (
        <span className="text-xs font-extrabold text-[#2b5e95]/70">{count}</span>
      ) : null}
    </button>
  );
}

function CheckboxRow({
  label,
  count,
  checked,
  onClick,
}: {
  label: string;
  count: number;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-[#f2f7ff]"
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-[#173a66]">
        <span
          className={cn(
            "inline-flex size-4 items-center justify-center rounded-md border",
            checked ? "border-[#0f67be] bg-[#0f67be]" : "border-[#b9cceb] bg-white",
          )}
          aria-hidden="true"
        >
          {checked ? <span className="block size-2.5 rounded-[2px] bg-white" /> : null}
        </span>
        {label}
      </span>
      <span className="text-xs font-extrabold text-[#2b5e95]/70">{count}</span>
    </button>
  );
}
