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

export interface FindIdParams {
  name: string;
  email: string;
}

export interface FindPwParams {
  username: string;
  email: string;
}

export interface ChangePwParams {
  newPassword: string;
  confirmPassword: string;
}

export const postSignUp = async (signUpParams: SignUpParams) => {
  const res = await api.post("/auth/register", signUpParams);
  return res.data;
};

export const postLogin = async (loginParams: LoginParams) => {
  const res = await api.post("/auth/login", loginParams);
  return res.data;
};

export const postFindId = async (findIdParams: FindIdParams) => {
  const res = await api.post("/auth/find-id", findIdParams);
  return res.data;
};

export const postFindPw = async (findPwParams: FindPwParams) => {
  const res = await api.post("/auth/find-password", findPwParams);
  return res.data;
};

export const patchChangePw = async (changePwParams: ChangePwParams) => {
  const res = await api.patch("/auth/change-password", changePwParams);
  return res.data;
};
