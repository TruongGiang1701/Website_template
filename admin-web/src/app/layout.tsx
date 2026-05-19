import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  description: "Trang quản trị",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-full antialiased text-foreground">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
