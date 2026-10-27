import authApi from "@/lib/authApi";

interface FirstPayType {
  authKey: string;
  customerKey: string;
  planType: string;
  billingCycle: string;
}

export const postFirstPay = async (data: FirstPayType) => {
  const res = await authApi.post("/payment/billing-auth", data);
  return res.data;
};
