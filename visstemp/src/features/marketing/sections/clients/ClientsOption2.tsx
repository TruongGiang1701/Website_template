import Image from "next/image";
import { Section } from "@/components/layout/section";
import { homeClientsOption2 } from "@/features/marketing/pages/home/home.data";

export function ClientsOption2() {
  return (
    <Section spacing="sm" className="bg-white py-12 sm:py-14" withContainer={false}>
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-balance text-3xl font-extrabold leading-tight text-[#1f4f8c] sm:text-4xl">
            <span>{homeClientsOption2.headingPrefix} </span>
            <span className="bg-gradient-to-r from-[#2b61a6] to-[#d73f4f] bg-clip-text text-transparent">
              {homeClientsOption2.headingHighlight}
            </span>
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-2 items-center gap-x-8 gap-y-7 sm:grid-cols-3 lg:grid-cols-6">
          {homeClientsOption2.logos.map((logo, idx) => (
            <div
              key={`${logo}-${idx}`}
              className="relative mx-auto h-16 w-28 transition-all duration-300 hover:scale-105"
            >
              <Image
                src={logo}
                alt={`Khach hang ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 96px, 112px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
