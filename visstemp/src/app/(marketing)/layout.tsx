import { MarketingFooter } from "@/components/shared/footer/marketing-footer";
import { MarketingHeader } from "@/components/shared/header/marketing-header";
import { FloatingChatBot } from "@/components/shared/chat/floating-chatbot";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_20%_10%,#d9ebff_0%,#f4f9ff_45%,#edf5ff_100%)]">
      <MarketingHeader />
      <main className="flex flex-1 flex-col">{children}</main>
      <MarketingFooter />
      <FloatingChatBot />
    </div>
  );
}
