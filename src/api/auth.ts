import api from "@/lib/api";

export interface SignUpParams {
  username: string;
  password: string;
  email: string;
  name: string;
  phone: string;
  agreeService: boolean;
  agreePrivacy: boolean;
  agreeMarketing?: boolean; // 선택 (기본값 false)
}

export const postSignUp = async (signUpParams: SignUpParams) => {
  const res = await api.post("/auth/register", {
    params: { ...signUpParams },
  });
  return res.data;
};
