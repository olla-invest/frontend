import { Outlet } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function SubLayout() {
  return (
    <div>
      <Header />
      <div className="max-w-240 my-0 mx-auto max-h-[calc(100vh-120px)] overflow-x-auto no-scrollbar">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
