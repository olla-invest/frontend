import { Outlet } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { HeaderSub } from "@/components/HeaderSub";

export default function AdSubLayout() {
  return (
    <div>
      <HeaderSub />
      <div className="max-w-290 my-0 mx-auto min-h-[calc(100vh-185px)] md:max-h-[calc(100vh-120px)] overflow-x-auto no-scrollbar relative">
        <Outlet />
      </div>
      <Footer isHideBottomMenu={true} />
    </div>
  );
}
