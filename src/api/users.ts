import authApi from "@/lib/authApi";

interface MarketingYn {
  consent: boolean;
}

interface PatchUserInfo {
  phone: string;
  email: string;
}

export const getMyInfo = async () => {
  const res = await authApi.get("/users/me");
  return res.data;
};

export const patchMyInfo = async (userData: PatchUserInfo) => {
  //내 정보 수정
  const res = await authApi.patch("/users/me", userData);
  return res.data;
};

export const patchMarketing = async (marketingYn: MarketingYn) => {
  //마케팅 수신 동의 수정
  const res = await authApi.patch("/users/me/marketing", marketingYn);
  return res.data;
};
