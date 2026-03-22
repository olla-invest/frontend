import api from "@/lib/api";
import type { IssueThemeApiResponse, IssueThemeDetailApiResponse } from "@/types/api/issueTheme";

export const getIssueTheme = async (display?: number, page?: number) => {
  const res = await api.get<IssueThemeApiResponse>("/issue-theme", {
    params: { display, page },
  });
  return res.data;
};

export const getIssueThemeDetail = async (themeCode: number) => {
  const res = await api.get<IssueThemeDetailApiResponse>(`/issue-theme/${themeCode}`);
  return res.data;
};
