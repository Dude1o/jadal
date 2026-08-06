// components/motion/debate-motion-list.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getTranslation } from "@/lib/utils";
import { debateMotionsQueryOptions } from "@/api/query-options";
import { debateMotionKeys } from "@/lib/constants";

import { useDialogStore } from "@/services";
import { useDebounce } from "@/hooks/use-debounce";
import { useCreate } from "@/hooks/api/use-create";
import { useDelete } from "@/hooks/api/use-delete";
import { useUpdate } from "@/hooks/api/use-update";

import {
  createDebateMotionMutationOptions,
  editDebateMotionMutationOptions,
  deleteDebateMotionMutationOptions,
} from "@/api/mutation-options";

import type { Motion } from "@/types";

import AppHeader from "@/components/common/app-header";
import NoItems from "@/components/common/no-items";
import { DataTable } from "@/components/data-table/data-table";

import DebateMotionCard from "./debate-motion-card";
import DeleteItem from "@/components/common/delete-item";
import DebateMotionForm from "./debate-motion-form";
import { debateMotionOrderColumns } from "./columns/debate-motion-order-columns";
import { AppToolbar } from "@/components/layout/toolbar/app-toolbar";
import Pagination from "@/components/common/pagination";
import { useSettingsStore } from "@/store/use-settings-store";

type Props = {
  view?: "cards" | "table";
  search?: string;
  page?: number;
};

export default function DebateMotionList({
  view = useSettingsStore.getState().view,
  search = "",
  page = 1,
}: Props) {
  const { t } = useTranslation();
  const dialog = useDialogStore();
  const navigate = useNavigate();

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
      to: "/debate-motions",
      search: (prev) => ({
        ...prev,
        search: debouncedSearch || undefined,
        page: 1,
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, navigate]);

  const { data: paginatedData } = useQuery({
    ...debateMotionsQueryOptions({
      search: debouncedSearch || undefined,
      page,
      perPage: 12,
    }),
    placeholderData: keepPreviousData,
  });

  const motions = paginatedData?.data ?? [];

  const filteredMotions = motions;

  const { mutate: createMotion } = useCreate({
    mutationOptions: createDebateMotionMutationOptions(),
    queryKey: debateMotionKeys.list(),
    successMessage: getTranslation(t, "debateMotions.messages.created"),
  });

  const { mutate: updateMotion } = useUpdate({
    mutationOptions: editDebateMotionMutationOptions(),
    queryKey: debateMotionKeys.list(),
    getDetailKey: (id) => debateMotionKeys.detail(String(id)),
    successMessage: getTranslation(t, "debateMotions.messages.updated"),
  });

  const { mutate: deleteMotion } = useDelete({
    mutationOptions: deleteDebateMotionMutationOptions(),
    queryKey: debateMotionKeys.list(),
    successMessage: getTranslation(t, "debateMotions.messages.deleted"),
  });

  const handleCreate = (values: any) => createMotion(values);
  const handleUpdate = (id: number, values: any) =>
    updateMotion({ id, data: values });
  const handleDelete = (id: number) => deleteMotion(id);

  const openCreateDialog = () => {
    const id = dialog.open({
      title: getTranslation(t, "debateMotions.actions.create"),
      children: (
        <DebateMotionForm
          onSubmit={(values) => {
            handleCreate(values);
            dialog.close(id);
          }}
        />
      ),
    });
  };

  const openEditDialog = (motion: Motion) => {
    const id = dialog.open({
      title: getTranslation(t, "debateMotions.actions.edit"),
      children: (
        <DebateMotionForm
          motion_id={motion.id}
          onSubmit={(values) => {
            handleUpdate(motion.id, values);
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
          itemName={getTranslation(t, "debateMotions.single")}
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
      to: "/debate-motions",
      search: (prev) => ({ ...prev, view: newView }),
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AppHeader
        entity="motions"
        title={getTranslation(t, "debateMotions.all")}
        view={view}
        setView={updateView}
        // One action, and it goes through onCreate/buttonLabel so it picks up
        // the header's `accent` default: flat orange, navy text. Passing
        // variant "default" is what made it the blue brand gradient.
        // Frameworks have their own screen; creating one from here was a second
        // primary competing with the actual primary.
        onCreate={openCreateDialog}
        buttonLabel={getTranslation(t, "debateMotions.actions.create")}
      />

      {view === "cards" ? (
        <>
          <AppToolbar
            search={{
              title: getTranslation(t, "debateMotions.all"),
              value: localSearch,
              onChange: setLocalSearch,
            }}
            onResetFilters={() => {
              setLocalSearch("");
              navigate({
                to: "/debate-motions",
                search: (prev) => ({
                  ...prev,
                  search: undefined,
                  page: 1,
                }),
              });
            }}
          />

          {filteredMotions.length === 0 ? (
            <NoItems
              title={getTranslation(t, "debateMotions.empty")}
              description={getTranslation(t, "debateMotions.emptyDescription")}
              onReset={() => {
                setLocalSearch("");
                navigate({
                  to: "/debate-motions",
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
            <>
              <div className="mt-6 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredMotions.map((motion) => (
                  <DebateMotionCard
                    key={motion.id}
                    motion={motion}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                  />
                ))}
              </div>
              {paginatedData?.meta?.last_page > 1 && (
                <Pagination
                  currentPage={paginatedData?.meta?.current_page}
                  lastPage={paginatedData?.meta?.last_page}
                  onPageChange={(newPage) => {
                    navigate({
                      to: "/debate-motions",
                      search: (prev) => ({ ...prev, page: newPage }),
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}
            </>
          )}
        </>
      ) : (
        <DataTable
          title={getTranslation(t, "debateMotions.all")}
          columns={debateMotionOrderColumns(t)}
          queryOptions={debateMotionsQueryOptions({
            search: debouncedSearch || undefined,
            page,
            perPage: 12,
          })}
          onSearchChange={(value) => {
            setLocalSearch(value);
            navigate({
              to: "/debate-motions",
              search: (prev) => ({
                ...prev,
                search: value || undefined,
                page: 1, // ← reset page in URL
              }),
            });
          }}
          filterKey="text"
          filterValue={localSearch}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onPageChange={(newPage) => {
            navigate({
              to: "/debate-motions",
              search: (prev) => ({ ...prev, page: newPage }),
            });
          }}
        />
      )}
    </div>
  );
}
