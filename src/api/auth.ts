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

export interface LoginParams {
  username: string;
  password: string;
}

export const postSignUp = async (signUpParams: SignUpParams) => {
  const res = await api.post("/auth/register", signUpParams);
  return res.data;
};

export const postLogin = async (loginParams: LoginParams) => {
  const res = await api.post("/auth/login", loginParams);
  return res.data;
};
