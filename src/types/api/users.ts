export interface UserInfo {
  userId: string;
  username: string;
  email: string;
  name: string;
  phone: string;
  provider: string;
  socialId: string | null;
  planType: "FREE" | "BASIC" | "PRO" | "PREMIUM";
  marketingConsent: boolean;
  createdAt: string;
  snsLinkedYn: boolean;
}
