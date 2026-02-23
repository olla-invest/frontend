import { useLocation } from "react-router-dom";

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: "home",
  },
];

export function MainSidebar() {
  const location = useLocation();
  const isActiveMenu = (path: string) => location.pathname === path;

  return (
    <Sidebar className="bg-white">
      <SidebarContent>
        <SidebarGroup className="p-2">
          <SidebarGroupLabel className="p-1 size-8 items-center">
            <i className="icon icon-menu" />
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-4">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className={`size-8 rounded-md p-1 ${isActiveMenu(item.url) ? "bg-[#F1F5F9]" : ""}`}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="p-0! h-6!">
                      <i className={`icon icon-${item.icon} ${isActiveMenu(item.url) ? "active" : ""}`} />
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="size-8 p-1">
          <i className="icon icon-star-four" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
