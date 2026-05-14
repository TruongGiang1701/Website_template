import type { TemplateFeatureGroup } from "@/features/marketing/pages/template-detail/template-detail.utils";

type FeatureListProps = {
  features: TemplateFeatureGroup;
};

export function FeatureList({ features }: FeatureListProps) {
  return (
    <section className="rounded-2xl border border-[#d7e4f6] bg-white/90 p-6 shadow-sm backdrop-blur-sm">
      <h2 className="text-2xl font-extrabold text-[#0f67be]">Các tính năng chính</h2>
      <p className="mt-2 text-sm font-bold text-[#1b3a66]">{features.heading}</p>

      <ul className="mt-5 space-y-3 text-sm leading-relaxed text-[#1b3a66]/85">
        {features.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0f67be] text-xs font-extrabold text-white">
              ✓
            </span>
            <span className="text-pretty font-semibold">{bullet}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
