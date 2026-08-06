import {
  AlertTriangle,
  Archive,
  CalendarClock,
  PlayCircle,
} from "lucide-react";
// components/features/surveys/survey-list.tsx
("use client");

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getTranslation } from "@/lib/utils";
import { surveysQueryOptions } from "@/api/query-options";
import { SURVEY_STATUSES, surveyKeys } from "@/lib/constants";
import { useDialogStore } from "@/services";
import { useDebounce } from "@/hooks/use-debounce";
import { useCreate } from "@/hooks/api/use-create";
import { useUpdate } from "@/hooks/api/use-update";
import { useDelete } from "@/hooks/api/use-delete";

import {
  createSurveyMutationOptions,
  deleteSurveyMutationOptions,
  editSurveyMutationOptions,
} from "@/api/mutation-options";

import type { Survey } from "@/types";

import AppHeader from "@/components/common/app-header";
import { SectionHeader } from "@/components/common/section-header";
import NoItems from "@/components/common/no-items";
import { AppToolbar } from "@/components/layout/toolbar/app-toolbar";
import { SurveyCard } from "@/components/features/surveys/survey-card";
import SurveyForm from "./survey-form";
import DeleteItem from "@/components/common/delete-item";
import Pagination from "@/components/common/pagination";

type Props = {
  status?: string;
  search?: string;
  page?: number;
};

/**
 * §21.2 — status ordering puts the actionable states first.
 * This is display-side partitioning of an already-fetched page; it does not
 * touch fetching, pagination or query keys.
 */
const SURVEY_GROUPS = [
  { key: "active", tone: "orange" as const, icon: PlayCircle },
  { key: "overdue", tone: "red" as const, icon: AlertTriangle },
  { key: "scheduled", tone: "blue" as const, icon: CalendarClock },
  { key: "closed", tone: "deep" as const, icon: Archive },
];

/** Derives the display status from the survey's own fields. */
function surveyStatusOf(survey: Survey): string {
  if (survey.is_closed) return "closed";
  if (!survey.closes_at) return "active";
  const closes = new Date(survey.closes_at).getTime();
  if (Number.isNaN(closes)) return "active";
  return closes < Date.now() ? "overdue" : "active";
}

export function SurveyList({ status = "", search = "", page = 1 }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dialog = useDialogStore();

  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 500);

  // Sync URL -> local only for EXTERNAL navigation (back button, a link
  // with a query). Without this guard the effect fires on our own
  // debounced URL write and clobbers whatever has been typed since.
  useEffect(() => {
    if ((search || "") !== (debouncedSearch || "")) return;
    setLocalSearch(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Update URL when debounced search changes
  useEffect(() => {
    const normalizedSearch = search || "";
    if (normalizedSearch === debouncedSearch) return;

    navigate({
      to: "/surveys",
      search: (prev) => ({
        ...prev,
        search: debouncedSearch || undefined,
        page: 1,
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, navigate]);

  // Fetch paginated surveys
  const { data: realSurveysResponse } = useQuery({
    ...surveysQueryOptions({
      search: debouncedSearch || undefined,
      status: status || undefined,
      page: page,
      perPage: 12,
    }),
    placeholderData: keepPreviousData,
  });

  const surveysList = realSurveysResponse?.data ?? [];

  // Client-side filtering (matches UserList pattern)
  const filteredSurveys = surveysList.filter((survey) => {
    const matchesStatus = status ? survey.status === status : true;
    const matchesSearch = search
      ? survey.title.toLowerCase().includes(search.toLowerCase()) ||
        survey.description?.toLowerCase().includes(search.toLowerCase())
      : true;

    return matchesStatus && matchesSearch;
  });

  const { mutate: createSurvey } = useCreate({
    mutationOptions: createSurveyMutationOptions(),
    queryKey: surveyKeys.list(),
    successMessage: getTranslation(t, "surveys.messages.created"),
    errorMessage: getTranslation(t, "surveys.messages.createError"),
  });

  const { mutate: updateSurvey } = useUpdate({
    mutationOptions: editSurveyMutationOptions(),
    queryKey: surveyKeys.list(),
    getDetailKey: surveyKeys.all,
    successMessage: getTranslation(t, "surveys.messages.updated"),
    errorMessage: getTranslation(t, "surveys.messages.updateError"),
  });

  const { mutate: deleteSurvey } = useDelete({
    mutationOptions: deleteSurveyMutationOptions(),
    queryKey: surveyKeys.list(),
    successMessage: getTranslation(t, "surveys.messages.deleted"),
    errorMessage: getTranslation(t, "surveys.messages.deleteError"),
  });

  const handleCreateSurvey = async (values: Partial<Survey>) => {
    await createSurvey(values);
  };

  const handleUpdateSurvey = async (variables: {
    id: number;
    data: Partial<Survey>;
  }) => {
    await updateSurvey(variables);
  };

  const handleDeleteSurvey = async (id: number) => {
    await deleteSurvey(id);
  };

  const handleResetFilters = () => {
    setLocalSearch("");
    navigate({
      to: "/surveys",
      search: (prev) => ({
        ...prev,
        search: undefined,
        status: undefined,
        page: 1,
      }),
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AppHeader
        entity="surveys"
        title={getTranslation(t, "surveys.plural")}
        onCreate={() => {
          const id = dialog.open({
            title: getTranslation(t, "surveys.actions.create"),
            closeOnOutsideClick: true,
            children: (
              <SurveyForm
                onSubmit={(values) => {
                  handleCreateSurvey(values);
                  dialog.close(id);
                }}
              />
            ),
            closable: true,
          });
        }}
        buttonLabel={getTranslation(t, "surveys.actions.create")}
      />

      <AppToolbar
        search={{
          title: getTranslation(t, "surveys.plural"),
          value: localSearch,
          onChange: setLocalSearch,
        }}
        filters={[
          {
            id: "status",
            label: getTranslation(t, "common.labels.statuses"),
            value: status,
            options: SURVEY_STATUSES,
          },
        ]}
        onFilterChange={(id, value) => {
          if (id === "status") {
            navigate({
              to: "/surveys",
              search: (prev) => ({
                ...prev,
                status: value || undefined,
                page: 1,
              }),
            });
          }
        }}
        onResetFilters={handleResetFilters}
      />

      {filteredSurveys.length === 0 ? (
        <NoItems
          title={getTranslation(t, "surveys.empty.noData")}
          description={
            status
              ? getTranslation(t, "surveys.empty.withStatus", {
                  status: getTranslation(t, `surveys.status.${status}`),
                })
              : getTranslation(t, "surveys.empty.noResults")
          }
          onReset={handleResetFilters}
          showResetButton={!!localSearch || !!status}
        />
      ) : (
        <>
          {/* §21.2 One section per status, in actionability order. A section
              with no items is not rendered — no empty headers, no dividers. */}
          <div className="mt-6 space-y-8">
            {SURVEY_GROUPS.map(({ key, tone, icon: GroupIcon }) => {
              const items = filteredSurveys.filter(
                (s) => surveyStatusOf(s) === key,
              );
              if (items.length === 0) return null;

              return (
                <section key={key} className="space-y-6">
                  <SectionHeader
                    icon={<GroupIcon />}
                    tone={tone}
                    title={getTranslation(t, `surveys.status.${key}`)}
                    subtitle={getTranslation(t, "surveys.countLabel", {
                      count: items.length,
                    })}
                  />
                  <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {items.map((survey) => (
                      <SurveyCard
                        key={survey.id}
                        survey={survey}
                        onEdit={handleUpdateSurvey}
                        onDelete={handleDeleteSurvey}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {realSurveysResponse?.meta?.last_page > 1 && (
            <Pagination
              currentPage={realSurveysResponse?.meta?.current_page}
              lastPage={realSurveysResponse?.meta?.last_page}
              onPageChange={(newPage) => {
                navigate({
                  to: "/surveys",
                  search: (prev) => ({ ...prev, page: newPage }),
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
