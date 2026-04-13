import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-[#020617] text-white">
        <AppSidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}