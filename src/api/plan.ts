import authApi from "@/lib/authApi";

export const getMyPlan = async () => {
  const res = await authApi.get("/subscription/me");
  return res.data;
};
