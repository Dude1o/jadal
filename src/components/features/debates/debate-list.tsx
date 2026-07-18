// components/features/debates/debate-list.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getTranslation } from "@/lib/utils";
import {
  debateMotionFrameworksQueryOptions,
  debatesQueryOptions,
} from "@/api/query-options";
import { DEBATE_STATUSES, debateKeys } from "@/lib/constants";
import { useDialogStore } from "@/services";
import { useDebounce } from "@/hooks/use-debounce";
import { useCreate } from "@/hooks/api/use-create";
import { useDelete } from "@/hooks/api/use-delete";

import {
  createDebateMutationOptions,
  editDebateMutationOptions,
  deleteDebateMutationOptions,
  createDebateFormatMutationOptions,
  createDebateMotionMutationOptions,
  announceDebateMutationOptions,
} from "@/api/mutation-options";

import type {
  Debate,
  DebateFormat,
  DebateStatus,
  MotionFramework,
} from "@/types";

import AppHeader from "@/components/common/app-header";
import NoItems from "@/components/common/no-items";
import { AppToolbar } from "@/components/layout/toolbar/app-toolbar";
import { DataTable } from "@/components/data-table/data-table";
import { DebateCard } from "@/components/features/debates/debate-card";
import DebateForm from "./debate-form";
import DebateFormatForm from "./debate-fromat-form";
import DebateMotionForm from "./debate-motion-form";
import DeleteItem from "@/components/common/delete-item";
import { debateOrderColumns } from "./columns/debate-order-columns";
import { useUpdate } from "@/hooks/api/use-update";
import Pagination from "@/components/common/pagination";
import { useData } from "@/hooks/api/use-data";
import { useSettingsStore } from "@/store/use-settings-store";
import { Megaphone } from "lucide-react";
import AnnounceForm from "./announce-form";

type Props = {
  state?: DebateStatus;
  topic?: string;
  view: "cards" | "table";
  search?: string;
  page?: number;
};

export default function DebateList({
  state,
  topic,
  view = useSettingsStore.getState().view,
  search = "",
  page = 1,
}: Props) {
  const { t } = useTranslation();

  const dialog = useDialogStore();

  const navigate = useNavigate();

  const [localSearch, setLocalSearch] = useState(search ?? "");

  const debouncedSearch = useDebounce(localSearch, 1000);

  useEffect(() => {
    const normalizedUrlSearch = search ?? "";
    const nextSearch = debouncedSearch ?? "";

    if (normalizedUrlSearch === nextSearch) return;

    navigate({
      to: "/debates",
      search: (prev) => ({
        ...prev,
        search: nextSearch === "" ? undefined : nextSearch,
        page: 1,
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, navigate]);

  const { data: realDebatesResponse } = useData(
    debatesQueryOptions({
      search: debouncedSearch || undefined,
      status: state || undefined,
      tag: topic || undefined,
    }),
  );

  const debatesList = realDebatesResponse?.data ?? [];

  const filteredDebates = debatesList;

  const { mutate: createDebate } = useCreate({
    mutationOptions: createDebateMutationOptions(),
    queryKey: debateKeys.list(),
    successMessage: getTranslation(t, "debates.messages.created"),
    errorMessage: getTranslation(t, "debates.messages.createError"),
  });

  const { mutate: announceDebate } = useCreate({
    mutationOptions: announceDebateMutationOptions(),
    queryKey: debateKeys.list(),
    successMessage: getTranslation(t, "debates.messages.announced"),
    errorMessage: getTranslation(t, "debates.messages.announceError"),
  });

  const { mutate: updateDebate } = useUpdate({
    mutationOptions: editDebateMutationOptions(),
    queryKey: debateKeys.list(),
    getDetailKey: (id) => debateKeys.detail(String(id)),
    successMessage: getTranslation(t, "debates.messages.updated"),
    errorMessage: getTranslation(t, "debates.messages.updateError"),
  });

  const { mutate: deleteDebate } = useDelete({
    mutationOptions: deleteDebateMutationOptions(),
    queryKey: debateKeys.list(),
    successMessage: getTranslation(t, "debates.messages.deleted"),
    errorMessage: getTranslation(t, "debates.messages.deleteError"),
  });

  const { mutate: createDebateFormat } = useCreate({
    mutationOptions: createDebateFormatMutationOptions(),
    queryKey: debateKeys.list(),
    successMessage: getTranslation(t, "debateFormats.messages.created"),
    errorMessage: getTranslation(t, "debateFormats.messages.createError"),
  });

  const { mutate: createDebateMotion } = useCreate({
    mutationOptions: createDebateMotionMutationOptions(),
    queryKey: debateKeys.list(),
    successMessage: getTranslation(t, "debateMotions.messages.created"),
    errorMessage: getTranslation(t, "debateMotions.messages.createError"),
  });

  const handleCreateDebate = async (values: Partial<Debate>) => {
    await createDebate(values);
  };

  const handleCreateDebateFormat = async (values: Partial<DebateFormat>) => {
    await createDebateFormat(values);
  };

  const handleCreateDebateMotion = async (values: Partial<DebateFormat>) => {
    await createDebateMotion(values);
  };

  const handleRowClick = (id: number) => {
    navigate({
      to: `/debates/${id}`,
    });
  };

  const handleUpdateDebate = async (
    id: string | number,
    values: Partial<Debate>,
  ) => {
    await updateDebate({ id, data: values });
  };

  const handleDeleteDebate = async (id: string | number) => {
    await deleteDebate(id);
  };

  const openCreateDialog = () => {
    const id = dialog.open({
      title: getTranslation(t, "debates.actions.create"),
      closeOnOutsideClick: true,
      children: (
        <DebateForm
          onSubmit={(values) => {
            handleCreateDebate(values);

            dialog.close(id);
          }}
        />
      ),
      closable: true,
    });
  };

  const openCreateFromatDialog = () => {
    const id = dialog.open({
      title: getTranslation(t, "debateFormats.actions.create"),
      closeOnOutsideClick: true,
      children: (
        <DebateFormatForm
          onSubmit={(values) => {
            handleCreateDebateFormat(values);

            dialog.close(id);
          }}
        />
      ),
      closable: true,
    });
  };

  const openCreateMotionDialog = () => {
    const id = dialog.open({
      title: getTranslation(t, "debateMotions.actions.create"),
      closeOnOutsideClick: true,
      children: (
        <DebateMotionForm
          onSubmit={(values) => {
            handleCreateDebateMotion(values);

            dialog.close(id);
          }}
        />
      ),
      closable: true,
    });
  };

  const updateView = (newView: "cards" | "table") => {
    navigate({
      to: "/debates",
      search: (prev) => ({
        ...prev,
        view: newView,
      }),
    });
  };

  const navigateWithView = (params: any) => {
    navigate({
      to: "/debates",
      search: (prev) => ({
        ...prev,
        view: view || "cards",
        ...params,
      }),
    });
  };

  return (
    <div className="min-h-screen py-16 px-6">
      <AppHeader
        title={getTranslation(
          t,
          state ? `debates.statuses.${state}` : "debates.all",
        )}
        view={view}
        setView={updateView}
        showCreateButton={true}
        actions={[
          {
            label: getTranslation(t, "debateMotions.actions.create"),
            variant: "default",
            onClick: openCreateMotionDialog,
          },
          {
            label: getTranslation(t, "debateFormats.actions.create"),
            variant: "default",
            onClick: openCreateFromatDialog,
          },
          {
            label: getTranslation(t, "debates.actions.create"),
            variant: "default",
            onClick: openCreateDialog,
          },
        ]}
      />

      {view === "cards" ? (
        <>
          <AppToolbar
            search={{
              title: getTranslation(t, "debates.all"),
              value: localSearch,
              onChange: setLocalSearch,
            }}
            filters={[
              {
                id: "state",
                label: "debates.fields.states",
                value: state ?? "",
                options: DEBATE_STATUSES,
              },
              {
                id: "topic",
                label: "debates.fields.topics",
                value: topic ?? "",
                options: debateMotionFrameworksQueryOptions,
                getOptionLabel: (mf: MotionFramework) => mf.name,
                getOptionValue: (mf: MotionFramework) => mf.name,
              },
            ]}
            onFilterChange={(id, value) => {
              navigateWithView({
                [id === "state" ? "state" : id]: value || undefined,
                page: 1,
              });
            }}
            onResetFilters={() => {
              setLocalSearch("");
              navigate({
                to: "/debates",
                search: (prev) => ({
                  ...prev,
                  search: undefined,
                  state: undefined, // ← correct
                  topic: undefined, // ← correct
                  page: 1,
                }),
              });
            }}
          />

          {filteredDebates.length === 0 ? (
            <NoItems
              title={getTranslation(t, "debates.empty.noData")}
              description={
                state
                  ? getTranslation(t, "debates.empty.withState", {
                      state: getTranslation(t, `debates.statuses.${state}`),
                    })
                  : topic
                    ? getTranslation(t, "debates.empty.withTopic", {
                        topic,
                      })
                    : getTranslation(t, "debates.empty.noData")
              }
              onReset={() => {
                setLocalSearch("");

                navigate({
                  to: "/debates",
                  search: (prev) => ({
                    ...prev,
                    search: undefined,
                    state: undefined, // ← correct
                    topic: undefined, // ← correct // ← ADD THIS
                    page: 1,
                  }),
                });
              }}
              showResetButton={!!localSearch || !!state || !!topic}
            />
          ) : (
            <>
              {/* {realDebatesResponse.meta.last_page > 1 && (
                <Pagination
                  currentPage={realDebatesResponse?.meta?.current_page}
                  lastPage={realDebatesResponse?.meta?.last_page}
                  onPageChange={(newPage) => {
                    navigate({
                      to: "/debates",
                      search: (prev) => ({
                        ...prev,
                        page: newPage,
                      }),
                    });

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                />
              )} */}

              <div className="mt-5 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center items-stretch">
                {filteredDebates.map((debate) => (
                  <DebateCard
                    key={debate.id}
                    debate={debate}
                    onEdit={handleUpdateDebate}
                    onDelete={handleDeleteDebate}
                    onAnnounce={announceDebate}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <DataTable
          key={`debates-table-${state || "all"}-${topic || "all"}-${page}`}
          title={getTranslation(t, "debates.all")}
          data={debatesList}
          onSearchChange={(value) => {
            setLocalSearch(value);
            navigate({
              to: "/debates",
              search: (prev) => ({
                ...prev,
                search: value || undefined,
                page: 1, // ← reset page in URL
              }),
            });
          }}
          columns={debateOrderColumns(t)}
          filterKey="title"
          filterValue={localSearch}
          onRowClick={handleRowClick}
          onEdit={(debate) => {
            setTimeout(() => {
              const id = dialog.open({
                title: getTranslation(t, "debates.actions.edit"),
                closeOnOutsideClick: true,
                children: (
                  <DebateForm
                    onSubmit={(values) => {
                      handleUpdateDebate(debate.id, values);

                      dialog.close(id);
                    }}
                    debate_id={debate.id}
                  />
                ),
                closable: true,
              });
            }, 0);
          }}
          onDelete={(debate) => {
            setTimeout(() => {
              const id = dialog.open({
                title: getTranslation(t, "debates.actions.delete"),
                closeOnOutsideClick: true,
                children: (
                  <DeleteItem
                    itemName={getTranslation(t, "debates.single")}
                    gender="female"
                    onDelete={() => {
                      handleDeleteDebate(debate.id);

                      dialog.close(id);
                    }}
                    onCancel={() => {
                      dialog.close(id);
                    }}
                  />
                ),
                closable: true,
              });
            }, 0);
          }}
          onActions={[
            {
              icon: <Megaphone className="h-4 w-4" />,
              color: "emerald",
              label: getTranslation(t, "common.actions.announce"),
              action: (debate) => {
                const id = dialog.open({
                  title: getTranslation(t, "debates.details.announceLineUp"),
                  description: getTranslation(
                    t,
                    "debates.details.announceDescription",
                  ),
                  size: "lg",
                  closable: true,
                  children: (
                    <AnnounceForm
                      debateId={debate.id}
                      onSubmit={async (payload) => {
                        announceDebate({
                          debateId: debate.id,
                          payload: payload,
                        });
                      }}
                      onCancel={() => dialog.close(id)}
                    />
                  ),
                });
              },
            },
          ]}
          initialFilters={[
            {
              id: "status",
              value: state ?? "",
            },
            {
              id: "tag",
              value: topic ?? "",
            },
          ]}
          facetedFilters={[
            {
              columnId: "status",
              title: getTranslation(t, "debates.fields.states"),
              options: DEBATE_STATUSES,
            },
            {
              columnId: "tag",
              title: getTranslation(t, "debates.fields.topics"),
              options: debateMotionFrameworksQueryOptions,
              getOptionLabel: (mf: MotionFramework) => mf.name,
              getOptionValue: (mf: MotionFramework) => mf.id,
            },
          ]}
          filterChange={(id, value) => {
            navigateWithView({
              ...(id === "status" && {
                state: value || undefined,
              }),
              ...(id === "tag" && {
                topic: value || undefined,
              }),
              page: 1,
            });
          }}
          onPageChange={(newPage) => {
            navigate({
              to: "/debates",
              search: (prev) => ({
                ...prev,
                page: newPage,
              }),
            });
          }}
          onResetFilters={() => {
            setLocalSearch("");
            navigate({
              to: "/debates",
              search: (prev) => ({
                ...prev,
                search: undefined,
                state: undefined, // ← correct
                topic: undefined, // ← correct
                page: 1,
              }),
            });
          }}
        />
      )}
    </div>
  );
}
