"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getTranslation } from "@/lib/utils";
import { debateMotionFrameworksQueryOptions } from "@/api/query-options";
import { debateMotionFrameworkKeys } from "@/lib/constants";

import { useDialogStore } from "@/services";
import { useDebounce } from "@/hooks/use-debounce";
import { useCreate } from "@/hooks/api/use-create";
import { useUpdate } from "@/hooks/api/use-update";
import { useDelete } from "@/hooks/api/use-delete";

import {
  createDebateMotionFrameworkMutationOptions,
  editDebateMotionFrameworkMutationOptions,
  deleteDebateMotionFrameworkMutationOptions,
} from "@/api/mutation-options";

import type { MotionFramework } from "@/types";

import AppHeader from "@/components/common/app-header";
import NoItems from "@/components/common/no-items";
import { DataTable } from "@/components/data-table/data-table";
import { AppToolbar } from "@/components/layout/toolbar/app-toolbar";

import DebateMotionFrameworkCard from "./debate-motion-framework-card";
import DeleteItem from "@/components/common/delete-item";
import DebateMotionFrameworkForm from "./debate-motion-framework-form";
import { debateMotionFrameworkOrderColumns } from "./columns/debate-motion-framework-order-columns";
import { useSettingsStore } from "@/store/use-settings-store";

type Props = {
  view?: "cards" | "table";
  search?: string;
  page?: number;
};

export default function DebateMotionFrameworkList({
  view = useSettingsStore.getState().view,
  search = "",
  page = 1,
}: Props) {
  const { t } = useTranslation();
  const dialog = useDialogStore();
  const navigate = useNavigate();

  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => setLocalSearch(search), [search]);

  useEffect(() => {
    const normalizedSearch = search || "";
    if (normalizedSearch === debouncedSearch) return;

    navigate({
      to: "/debate-motion-frameworks",
      search: (prev) => ({
        ...prev,
        search: debouncedSearch || undefined,
        page: 1,
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, navigate]);

  const { data: paginatedData } = useSuspenseQuery(
    debateMotionFrameworksQueryOptions({
      search: debouncedSearch || undefined,
      page,
      perPage: 12,
    }),
  );

  const frameworks = paginatedData?.data ?? [];

  const filteredFrameworks = debouncedSearch
    ? frameworks.filter((framework) =>
        framework.name?.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    : frameworks;

  const { mutate: createFramework } = useCreate({
    mutationOptions: createDebateMotionFrameworkMutationOptions(),
    queryKey: debateMotionFrameworkKeys.all,
    successMessage: getTranslation(
      t,
      "debateMotionFrameworks.messages.created",
    ),
  });

  const { mutate: updateFramework } = useUpdate({
    mutationOptions: editDebateMotionFrameworkMutationOptions(),
    queryKey: debateMotionFrameworkKeys.all,
    getDetailKey: (id) => debateMotionFrameworkKeys.detail(String(id)),
    successMessage: getTranslation(
      t,
      "debateMotionFrameworks.messages.updated",
    ),
  });

  const { mutate: deleteFramework } = useDelete({
    mutationOptions: deleteDebateMotionFrameworkMutationOptions(),
    queryKey: debateMotionFrameworkKeys.all,
    successMessage: getTranslation(
      t,
      "debateMotionFrameworks.messages.deleted",
    ),
  });

  const handleCreate = (values: any) => createFramework(values);
  const handleUpdate = (id: number, values: any) =>
    updateFramework({ id, data: values });
  const handleDelete = (id: number) => deleteFramework(id);

  const openCreateDialog = () => {
    const id = dialog.open({
      title: getTranslation(t, "debateMotionFrameworks.actions.create"),
      children: (
        <DebateMotionFrameworkForm
          onSubmit={(values) => {
            handleCreate(values);
            dialog.close(id);
          }}
        />
      ),
    });
  };

  const openEditDialog = (framework: MotionFramework) => {
    const id = dialog.open({
      title: getTranslation(t, "debateMotionFrameworks.actions.edit"),
      children: (
        <DebateMotionFrameworkForm
          name={framework.name}
          color_hex={framework.color_hex}
          onSubmit={(values) => {
            handleUpdate(framework.id, values);
            dialog.close(id);
          }}
        />
      ),
    });
  };

  const openDeleteDialog = (id: number) => {
    const dialogId = dialog.open({
      title: getTranslation(t, "common.delete.title"),
      children: (
        <DeleteItem
          itemName={getTranslation(t, "debateMotionFrameworks.single")}
          gender="male"
          onDelete={() => {
            handleDelete(id);
            dialog.close(dialogId);
          }}
          onCancel={() => {
            dialog.close(dialogId);
          }}
        />
      ),
    });
  };

  const updateView = (newView: "cards" | "table") => {
    navigate({
      to: "/debate-motion-frameworks",
      search: (prev) => ({ ...prev, view: newView }),
    });
  };

  return (
    <div className="min-h-screen py-16 px-6">
      <AppHeader
        title={getTranslation(t, "debateMotionFrameworks.all")}
        view={view}
        setView={updateView}
        onCreate={openCreateDialog}
        buttonLabel={getTranslation(t, "debateMotionFrameworks.actions.create")}
      />

      {view === "cards" ? (
        <>
          <AppToolbar
            search={{
              title: getTranslation(t, "debateMotionFrameworks.all"),
              value: localSearch,
              onChange: setLocalSearch,
            }}
            onResetFilters={() => {
              setLocalSearch("");
              navigate({
                to: "/debate-motion-frameworks",
                search: (prev) => ({
                  ...prev,
                  search: undefined,
                  page: 1,
                }),
              });
            }}
          />

          {filteredFrameworks.length === 0 ? (
            <NoItems
              title={getTranslation(t, "debateMotionFrameworks.empty")}
              description={getTranslation(
                t,
                "debateMotionFrameworks.emptyDescription",
              )}
              onReset={() => {
                setLocalSearch("");
                navigate({
                  to: "/debate-motion-frameworks",
                  search: (prev) => ({
                    ...prev,
                    search: undefined,
                    page: 1,
                  }),
                });
              }}
              showResetButton={!!localSearch}
            />
          ) : (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFrameworks.map((framework) => (
                <DebateMotionFrameworkCard
                  key={framework.id}
                  framework={framework}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <DataTable
          title={getTranslation(t, "debateMotionFrameworks.all")}
          columns={debateMotionFrameworkOrderColumns(t)}
          queryOptions={debateMotionFrameworksQueryOptions({
            search: debouncedSearch || undefined,
            page,
            perPage: 12,
          })}
          filterKey="name"
          filterValue={localSearch}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onPageChange={(newPage) => {
            navigate({
              to: "/debate-motion-frameworks",
              search: (prev) => ({ ...prev, page: newPage }),
            });
          }}
        />
      )}
    </div>
  );
}
