// components/debate-format/debate-format-list.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getTranslation } from "@/lib/utils";
import { debateFormatsQueryOptions } from "@/api/query-options";
import { debateFormatKeys } from "@/lib/constants";

import { useDialogStore } from "@/services";
import { useDebounce } from "@/hooks/use-debounce";
import { useCreate } from "@/hooks/api/use-create";
import { useDelete } from "@/hooks/api/use-delete";

import {
  createDebateFormatMutationOptions,
  editDebateFormatMutationOptions,
  deleteDebateFormatMutationOptions,
} from "@/api/mutation-options";

import type { DebateFormat } from "@/types";

import AppHeader from "@/components/common/app-header";
import NoItems from "@/components/common/no-items";
import { DataTable } from "@/components/data-table/data-table";

import DebateFormatCard from "./debate-format-card";
import DebateFormatForm from "./debate-fromat-form";
import DeleteItem from "@/components/common/delete-item";
import { debateFormatOrderColumns } from "./columns/debate-format-order-columns";
import { AppToolbar } from "@/components/layout/toolbar/app-toolbar";
import { useUpdate } from "@/hooks/api/use-update";
import Pagination from "@/components/common/pagination";

type Props = {
  view?: "cards" | "table";
  search?: string;
  page?: number;
};

export default function DebateFormatList({
  view = "cards",
  search = "",
  page = 1,
}: Props) {
  const { t } = useTranslation();
  const dialog = useDialogStore();
  const navigate = useNavigate();

  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 500);

  // Sync URL search with local state
  useEffect(() => setLocalSearch(search), [search]);

  // Update URL when debounced search changes
  // Update URL when debounced search changes
  useEffect(() => {
    const normalizedSearch = search || "";
    if (normalizedSearch === debouncedSearch) return;

    navigate({
      to: "/debate-formats",
      search: (prev) => ({
        ...prev,
        search: debouncedSearch || undefined,
        page: 1,
      }),
    });
    // We intentionally listen only to debouncedSearch changes to prevent
    // the manual URL reset from being instantly overwritten by a stale value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, navigate]);

  // Query with pagination + search
  const { data: paginatedData } = useSuspenseQuery(
    debateFormatsQueryOptions({
      page: page,
      perPage: 12,
    }),
  );

  const formats = paginatedData.data;

  const filteredFormats = debouncedSearch
    ? formats.filter((format) =>
        format.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    : formats;

  // ----------------------------
  // mutations
  // ----------------------------
  const { mutate: createFormat } = useCreate({
    mutationOptions: createDebateFormatMutationOptions(),
    queryKey: debateFormatKeys.list(),
    successMessage: getTranslation(t, "debates.messages.created"),
    errorMessage: getTranslation(t, "debates.messages.createError"),
  });

  const { mutate: updateFormat } = useUpdate({
    mutationOptions: editDebateFormatMutationOptions(),
    queryKey: debateFormatKeys.list(),
    getDetailKey: (id) => debateFormatKeys.detail(String(id)),
    successMessage: getTranslation(t, "debates.messages.updated"),
    errorMessage: getTranslation(t, "debates.messages.updateError"),
  });

  const { mutate: deleteFormat } = useDelete({
    mutationOptions: deleteDebateFormatMutationOptions(),
    queryKey: debateFormatKeys.list(),
    successMessage: getTranslation(t, "debates.messages.deleted"),
    errorMessage: getTranslation(t, "debates.messages.deleteError"),
  });

  // ----------------------------
  // CRUD handlers
  // ----------------------------
  const handleCreate = (values: Partial<DebateFormat>) => createFormat(values);

  const handleUpdate = (id: number, values: Partial<DebateFormat>) =>
    updateFormat({ id, data: values });

  const handleDelete = (id: number) => deleteFormat(id);

  // ----------------------------
  // dialogs
  // ----------------------------
  const openCreateDialog = () => {
    const id = dialog.open({
      title: getTranslation(t, "debateFormats.actions.create"),
      children: (
        <DebateFormatForm
          onSubmit={(values) => {
            handleCreate(values);
            dialog.close(id);
          }}
        />
      ),
      closable: true,
    });
  };

  const openEditDialog = (format: DebateFormat) => {
    const id = dialog.open({
      title: getTranslation(t, "debateFormats.actions.edit"),
      children: (
        <DebateFormatForm
          debate_format_id={format.id}
          initialValues={format}
          onSubmit={(values) => {
            handleUpdate(format.id, values);
            dialog.close(id);
          }}
        />
      ),
      closable: true,
    });
  };

  const openDeleteDialog = (formatId: number) => {
    const id = dialog.open({
      title: getTranslation(t, "common.delete.title"),
      children: (
        <DeleteItem
          itemName={getTranslation(t, "debateFormats.single")}
          gender="male"
          onDelete={() => {
            handleDelete(formatId);
            dialog.close(id);
          }}
          onCancel={() => {
            dialog.close(id);
          }}
        />
      ),
      closable: true,
    });
  };

  const updateView = (newView: "cards" | "table") => {
    navigate({
      to: "/debate-formats",
      search: (prev) => ({ ...prev, view: newView }),
    });
  };

  return (
    <div className="min-h-screen py-16 px-6">
      <AppHeader
        title={getTranslation(t, "debateFormats.plural")}
        view={view}
        setView={updateView}
        showCreateButton={true}
        actions={[
          {
            label: getTranslation(t, "debateFormats.actions.create"),
            variant: "default",
            onClick: openCreateDialog,
          },
        ]}
      />

      {view === "cards" ? (
        <>
          <AppToolbar
            search={{
              title: getTranslation(t, "debateFormats.plural"),
              value: localSearch,
              onChange: setLocalSearch,
            }}
            onResetFilters={() => {
              setLocalSearch("");

              navigate({
                to: "/debate-formats",
                search: (prev) => ({
                  ...prev,
                  search: undefined, // Explicitly clears the parameter
                  page: 1,
                }),
              });
            }}
          />

          {filteredFormats.length === 0 ? (
            <NoItems
              title={getTranslation(t, "debateFormats.empty")}
              description={getTranslation(t, "debateFormats.emptyDescription")}
              onReset={() => {
                setLocalSearch("");
                navigate({
                  to: "/debate-formats",
                  search: (prev) => ({
                    ...prev,
                    search: undefined, // Explicitly clears the parameter
                    page: 1,
                  }),
                });
              }}
              showResetButton={!!localSearch}
            />
          ) : (
            <>
              {paginatedData.meta?.last_page > 1 && (
                <Pagination
                  currentPage={paginatedData?.meta?.current_page}
                  lastPage={paginatedData?.meta?.last_page}
                  onPageChange={(newPage) => {
                    navigate({
                      to: "/debate-formats",
                      search: (prev) => ({ ...prev, page: newPage }),
                    });
                    // Optional: scroll to top
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}
              <div
                className="
    mt-5
    grid
    gap-6
    grid-cols-[repeat(auto-fit,minmax(280px,1fr))]
  "
              >
                {filteredFormats.map((format) => (
                  <DebateFormatCard
                    key={format.id}
                    format={format}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <DataTable
          title={getTranslation(t, "debateFormats.plural")}
          columns={debateFormatOrderColumns(t)}
          queryOptions={debateFormatsQueryOptions({
            search: debouncedSearch || undefined,
            page: page,
            perPage: 12,
          })}
          filterKey="name"
          filterValue={localSearch}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onPageChange={(newPage) => {
            navigate({
              to: "/debate-formats",
              search: (prev) => ({ ...prev, page: newPage }),
            });
          }}
        />
      )}
    </div>
  );
}
