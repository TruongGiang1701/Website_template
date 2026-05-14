import { AppSidebar } from "@/components/shared/sidebar/app-sidebar";
import { dashboardNav } from "@/config/site";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AppSidebar title="Tài khoản" items={dashboardNav} />
      <div className="flex flex-1 flex-col">
        <div className="flex-1 py-8">{children}</div>
      </div>
    </div>
  );
}
