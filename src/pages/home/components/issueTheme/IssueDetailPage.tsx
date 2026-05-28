//import type { IssueTheme } from "@/types/api/issueTheme";
import IssueDetailContent from "./IssueDetailContent";
import { useLocation } from "react-router-dom";

export default function IssueDetailPage() {
  const location = useLocation();
  const selectIssue = location.state?.theme;
  return <IssueDetailContent selectIssue={selectIssue} />;
}
