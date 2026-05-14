import { AdminAppShell } from "@/components/admin/AdminAppShell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminAppShell>{children}</AdminAppShell>;
}
