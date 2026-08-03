import api from "@/lib/api";
import authApi from "@/lib/authApi";

import type { IssueThemeApiResponse, IssueThemeDetailApiResponse } from "@/types/api/issueTheme";

export const getIssueTheme = async (display?: number, page?: number) => {
  const res = await authApi.get<IssueThemeApiResponse>("/issue-theme", {
    params: { display, page },
  });
  return res.data;
};

import { useAuthStore } from "@/store/useAuthStore";

export const getIssueThemeDetail = async (themeCode: number) => {
  const { accessToken } = useAuthStore.getState().userInfo || {};

  const res = await api.get<IssueThemeDetailApiResponse>(`/issue-theme/${themeCode}`, {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });

  return res.data;
};
