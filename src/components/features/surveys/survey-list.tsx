// components/features/surveys/survey-list.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

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

export function SurveyList({ status = "", search = "", page = 1 }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dialog = useDialogStore();

  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 500);

  // Sync URL search with local state
  useEffect(() => setLocalSearch(search), [search]);

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
  const { data: realSurveysResponse } = useSuspenseQuery(
    surveysQueryOptions({
      search: debouncedSearch || undefined,
      status: status || undefined,
      page: page,
      perPage: 12,
    }),
  );

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
    debugger;

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
    <div className="min-h-screen py-16 px-6 overflow-x-hidden">
      <AppHeader
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
          {realSurveysResponse.meta.last_page > 1 && (
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

          <div className="mt-5 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center items-stretch">
            {filteredSurveys.map((survey) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                onEdit={handleUpdateSurvey}
                onDelete={handleDeleteSurvey}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
