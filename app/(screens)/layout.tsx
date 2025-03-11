import Header from "@/components/layout/header";
import { Loader2 } from "lucide-react";
import { Suspense } from 'react'

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={true} />
      <Suspense fallback={(
        <div className="flex grow justify-center items-center h-full">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      )}>
        <div className="flex-1 flex flex-col p-4">
          {children}
        </div>
      </Suspense>
    </div>
  );
}