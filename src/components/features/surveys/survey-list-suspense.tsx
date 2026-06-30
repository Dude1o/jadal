import { SurveyList } from "@/components/features/surveys/survey-list";

interface Props {
  search?: string;
  status?: "open" | "closing-soon" | "closed";
  page?: number;
}

export function SurveyListSuspense({ search, status, page = 1 }: Props) {
  return <SurveyList page={page} search={search} status={status} />;
}
