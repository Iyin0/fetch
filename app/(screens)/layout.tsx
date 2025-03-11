import Header from "@/components/layout/header";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={true} />
      <div className="flex-1 flex flex-col p-4">
        {children}
      </div>
    </div>
  );
}