import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="max-w-468 my-0 mx-auto">
        <Header />
        <Outlet /> {/* 🔥 children 대신 Outlet */}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
