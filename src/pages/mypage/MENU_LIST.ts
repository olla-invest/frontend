export interface MenuItem {
  name: string;
  key: string;
}

export interface MenuGroup {
  groupName: string;
  menuList: MenuItem[];
}

export const MENU_LIST: MenuGroup[] = [
  {
    groupName: "내 정보",
    menuList: [
      {
        name: "프로필",
        key: "profile",
      },
      {
        name: "계정 및 보안",
        key: "account",
      },
      {
        name: "마케팅 수신 설정",
        key: "marketing",
      },
    ],
  },
  {
    groupName: "결제 및 구독관리",
    menuList: [
      {
        name: "주문 및 청구서",
        key: "orders",
      },
    ],
  },
];
