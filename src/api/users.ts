import authApi from "@/lib/authApi";

interface MarketingYn {
  consent: boolean;
}

export const getMyInfo = async () => {
  const res = await authApi.get("/users/me");
  return res.data;
};

export const patchMarketing = async (marketingYn: MarketingYn) => {
  const res = await authApi.patch("/users/me/marketing", marketingYn);
  return res.data;
};
