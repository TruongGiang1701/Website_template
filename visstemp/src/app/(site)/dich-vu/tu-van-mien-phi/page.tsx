import { HeroConsulting } from "@/features/marketing/pages/about/components/HeroConsulting";
import { ContactConsulting } from "@/features/marketing/pages/about/components/ContactConsulting";
import { ClientsOption2 } from "@/features/marketing/sections/clients/ClientsOption2";

export default function TuVanMienPhiPage() {
  return (
    <div className="flex flex-1 flex-col">
      <HeroConsulting />
      <ContactConsulting className="bg-[linear-gradient(180deg,#eef7ff_0%,#ffffff_55%,#f6fbff_100%)]" />
      <ClientsOption2 />
    </div>
  );
}
