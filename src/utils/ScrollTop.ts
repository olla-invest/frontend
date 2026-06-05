// src/utils/scrollTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// 스크롤 컨테이너를 등록하는 ref
export const scrollContainerRef = { current: null as HTMLElement | null };

export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // window 스크롤
    window.scrollTo(0, 0);
    // 등록된 컨테이너 스크롤
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
}
