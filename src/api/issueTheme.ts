import api from "@/lib/api";
import type { IssueThemeApiResponse, IssueThemeDetailApiResponse } from "@/types/api/issueTheme";

export const getIssueTheme = async (display?: number, page?: number) => {
  const res = await api.get<IssueThemeApiResponse>("/issue-theme", {
    params: { display, page },
  });
  return res.data;
};

import { useAuthStore } from "@/store/useAuthStore";

export const getIssueThemeDetail = async (themeCode: number) => {
  const { accessToken } = useAuthStore.getState();

  const res = await api.get<IssueThemeDetailApiResponse>(`/issue-theme/${themeCode}`, {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });

  return res.data;
};
