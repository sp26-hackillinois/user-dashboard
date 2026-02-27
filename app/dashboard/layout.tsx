import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row w-full min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-60 min-h-screen overflow-y-auto p-8">{children}</main>
    </div>
  );
}
