import { Outlet } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { HeaderSub } from "@/components/HeaderSub";

export default function SubLayout() {
  return (
    <div>
      <HeaderSub />
      <div className="max-w-240 my-0 mx-auto max-h-[calc(100vh-120px)] overflow-x-auto no-scrollbar">
        <Outlet />
      </div>
      <Footer isHideBottomMenu={true} />
    </div>
  );
}
