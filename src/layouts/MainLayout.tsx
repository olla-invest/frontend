import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <Header />
        {children}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
