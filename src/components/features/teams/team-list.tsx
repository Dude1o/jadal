import * as React from "react";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { TeamCard } from "@/components/features/teams/team-card";
import { AppToolbar } from "@/components/layout/toolbar/app-toolbar";
import { getTranslation } from "@/lib/utils";
import type { TeamStatus } from "@/types";
import NoItems from "@/components/common/no-items";
import AppHeader from "@/components/common/app-header";
import { useDialogStore } from "@/services";
import { DataTable } from "@/components/data-table/data-table";
import { teamOrderColumns } from "./columns/team-order-columns";
import TeamForm from "./team-form";
import { TEAM_STATUSES, TEAM_TYPES, teamKeys } from "@/lib/constants";
import DeleteItem from "@/components/common/delete-item";
import { useDebounce } from "@/hooks/use-debounce";
import { teamsQueryOptions } from "@/api/query-options";
import { useCreate } from "@/hooks/api/use-create";
import { useUpdate } from "@/hooks/api/use-update";
import { useDelete } from "@/hooks/api/use-delete";
import {
  createTeamMutationOptions,
  deleteTeamMutationOptions,
  editTeamMutationOptions,
} from "@/api/mutation-options";
import Pagination from "@/components/common/pagination";
import { useSettingsStore } from "@/store/use-settings-store";

type Props = {
  status?: TeamStatus;
  type?: "random" | "manual";
  view?: "cards" | "table";
  search?: string;
};

export function TeamList({
  status,
  type,
  view = useSettingsStore.getState().view,
  search = "",
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dialog = useDialogStore();

  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 500);

  // Sync local search when URL search prop changes externally
  useEffect(() => setLocalSearch(search), [search]);

  // Push debounced search to URL
  useEffect(() => {
    const normalizedSearch = search || "";
    if (normalizedSearch === debouncedSearch) return;

    navigate({
      to: "/teams",
      search: (prev) => ({
        ...prev,
        search: debouncedSearch || undefined,
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, navigate]);

  const { data: realTeamsResponse } = useSuspenseQuery(
    teamsQueryOptions({
      search: debouncedSearch || undefined,
      status: status || undefined,
      type: type || undefined,
    }),
  );

  const teamsList = realTeamsResponse?.data ?? [];

  const { mutate: createTeam } = useCreate({
    mutationOptions: createTeamMutationOptions(),
    queryKey: teamKeys.list(),
    successMessage: getTranslation(t, "teams.messages.created"),
    errorMessage: getTranslation(t, "teams.messages.createError"),
  });

  const { mutate: updateTeam } = useUpdate({
    mutationOptions: editTeamMutationOptions(),
    queryKey: teamKeys.list(),
    getDetailKey: (id) => teamKeys.detail(String(id)),
    successMessage: getTranslation(t, "teams.messages.updated"),
    errorMessage: getTranslation(t, "teams.messages.updateError"),
  });

  const { mutate: deleteTeam } = useDelete({
    mutationOptions: deleteTeamMutationOptions(),
    queryKey: teamKeys.list(),
    successMessage: getTranslation(t, "teams.messages.deleted"),
    errorMessage: getTranslation(t, "teams.messages.deleteError"),
  });

  const handleCreateTeam = async (values: any) => createTeam(values);
  const handleUpdateTeam = async (id: number, values: any) =>
    updateTeam({ id, data: values });
  const handleDeleteTeam = (id: number) => deleteTeam(id);

  const updateView = (newView: "cards" | "table") => {
    navigate({
      to: "/teams",
      search: (prev) => ({ ...prev, view: newView }),
    });
  };

  return (
    <div className="min-h-screen py-16 px-6 overflow-x-hidden">
      <AppHeader
        title={getTranslation(t, "teams.plural")}
        view={view}
        setView={updateView}
        onCreate={() => {
          const id = dialog.open({
            title: getTranslation(t, "teams.actions.create"),
            children: (
              <TeamForm
                onSubmit={(values) => {
                  handleCreateTeam(values);
                  dialog.close(id);
                }}
              />
            ),
          });
        }}
        buttonLabel={getTranslation(t, "teams.actions.create")}
      />

      {view === "cards" ? (
        <>
          <AppToolbar
            search={{
              title: getTranslation(t, "teams.plural"),
              value: localSearch,
              onChange: setLocalSearch,
            }}
            filters={[
              {
                id: "status",
                label: getTranslation(t, "common.labels.statuses"),
                value: status,
                options: TEAM_STATUSES,
              },
              {
                id: "type",
                label: getTranslation(t, "common.labels.assignmentTypes"),
                value: type,
                options: TEAM_TYPES,
              },
            ]}
            onFilterChange={(id, value) => {
              navigate({
                to: "/teams",
                search: (prev) => ({
                  ...prev,
                  [id]: value || undefined,
                }),
              });
            }}
            onResetFilters={() => {
              setLocalSearch("");
              navigate({
                to: "/teams",
                search: (prev) => ({
                  view: prev.view,
                }),
              });
            }}
          />

          {teamsList.length === 0 ? (
            <NoItems
              title={getTranslation(t, "teams.empty.noData")}
              description={
                status
                  ? getTranslation(t, "teams.empty.withStatus", {
                      status: getTranslation(t, `teams.statuses.${status}`),
                    })
                  : getTranslation(t, "teams.empty.noData")
              }
              onReset={() => {
                setLocalSearch("");
                navigate({
                  to: "/teams",
                  search: (prev) => ({
                    ...prev,
                    search: undefined,
                    status: undefined,
                    type: undefined,
                  }),
                });
              }}
              showResetButton={!!localSearch || !!status || !!type}
            />
          ) : (
            <>
              <div className="mt-5 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {teamsList.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onEdit={handleUpdateTeam}
                    onDelete={handleDeleteTeam}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <DataTable
          key={`teams-table-${status || "all"}-${type || "all"}`}
          title={getTranslation(t, "teams.plural")}
          queryOptions={teamsQueryOptions({
            search: debouncedSearch || undefined,
            status: status || undefined,
            type: type || undefined,
          })}
          columns={teamOrderColumns(t)}
          filterKey="name"
          filterValue={localSearch}
          onSearchChange={(value) => {
            setLocalSearch(value);
            navigate({
              to: "/teams",
              search: (prev) => ({
                ...prev,
                search: value || undefined,
              }),
            });
          }}
          onEdit={(team) => {
            const id = dialog.open({
              title: getTranslation(t, "teams.actions.edit"),
              children: (
                <TeamForm
                  team_id={team.id}
                  onSubmit={(values) => {
                    handleUpdateTeam(team.id, values);
                    dialog.close(id);
                  }}
                />
              ),
            });
          }}
          onDelete={(team) => {
            const id = dialog.open({
              title: getTranslation(t, "common.delete.title"),
              children: (
                <DeleteItem
                  itemName={getTranslation(t, "teams.single")}
                  gender="male"
                  onDelete={() => {
                    handleDeleteTeam(team.id);
                    dialog.close(id);
                  }}
                />
              ),
            });
          }}
          onPageChange={(newPage) => {
            navigate({
              to: "/teams",
              search: (prev) => ({ ...prev }),
            });
          }}
          initialFilters={[
            { id: "status", value: status ?? "" },
            {
              id: "is_random",
              value:
                type === "manual"
                  ? false
                  : type === "random"
                    ? true
                    : undefined,
            },
          ]}
          facetedFilters={[
            {
              columnId: "status",
              title: getTranslation(t, "common.labels.statuses"),
              options: TEAM_STATUSES,
            },
            {
              columnId: "is_random",
              title: getTranslation(t, "common.labels.assignmentTypes"),
              options: TEAM_TYPES,
            },
          ]}
          filterChange={(id, value) => {
            navigate({
              to: "/teams",
              search: (prev) => ({
                ...prev,
                [id]: value || undefined,
              }),
            });
          }}
          onResetFilters={() => {
            setLocalSearch("");
            navigate({
              to: "/teams",
              search: (prev) => ({ view: prev.view }),
            });
          }}
        />
      )}
    </div>
  );
}
