import { Suspense } from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0f1419] text-[#8b9cb3]">
          Đang tải…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
