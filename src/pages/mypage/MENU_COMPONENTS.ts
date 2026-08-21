// pages/mypage/MENU_COMPONENTS.tsx
import { lazy } from "react";

export const MENU_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  profile: lazy(() => import("./components/Profile")),
  account: lazy(() => import("./components/Account")),
  marketing: lazy(() => import("./components/Marketing")),
  orders: lazy(() => import("./components/Orders")),
  // MENU_LIST의 key와 정확히 일치시켜야 합니다
};
