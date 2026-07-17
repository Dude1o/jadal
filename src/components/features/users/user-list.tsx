// components/features/users/user-list.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getTranslation } from "@/lib/utils";
import { usersQueryOptions } from "@/api/query-options";
import { ROLES, userKeys } from "@/lib/constants";
import { useDialogStore } from "@/services";
import { useDebounce } from "@/hooks/use-debounce";
import { useCreate } from "@/hooks/api/use-create";
import { useUpdate } from "@/hooks/api/use-update";
import { useDelete } from "@/hooks/api/use-delete";

import {
  createUserMutationOptions,
  deleteUserMutationOptions,
  editUserMutationOptions,
  changeUserStatusMutationOptions,
} from "@/api/mutation-options";

import type { User, UserRole, UserStatus } from "@/types";

import AppHeader from "@/components/common/app-header";
import NoItems from "@/components/common/no-items";
import { AppToolbar } from "@/components/layout/toolbar/app-toolbar";
import { DataTable } from "@/components/data-table/data-table";
import { UserCard } from "@/components/features/users/user-card";
import UserForm from "./user-form";
import DeleteItem from "@/components/common/delete-item";
import { userOrderColumns } from "./columns/user-order-columns";
import Pagination from "@/components/common/pagination";
import { Ban, Pause, Play } from "lucide-react";
import { useSettingsStore } from "@/store/use-settings-store";

type Props = {
  role?: UserRole;
  view: "cards" | "table";
  search?: string;
  page?: number;
};

export function UserList({
  role = undefined,
  view = useSettingsStore.getState().view,
  search = "",
  page = 1,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dialog = useDialogStore();

  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 1000);

  // Sync URL search with local state
  useEffect(() => setLocalSearch(search), [search]);

  // Update URL when debounced search changes
  useEffect(() => {
    const normalizedSearch = search || "";
    if (normalizedSearch === debouncedSearch) return;

    navigate({
      to: "/users",
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

  // Fetch paginated user response from API
  const { data: realUsersResponse } = useSuspenseQuery(
    usersQueryOptions({
      search: debouncedSearch || undefined,
      role: role || undefined,
      page: page,
      perPage: 12,
    }),
  );

  // Users array from backend response structure
  const usersList = realUsersResponse?.data ?? [];

  // Filter users based on role selection parameter (Used primarily for Card view layout fallback)
  const filteredUsers = usersList;

  const { mutate: createUser } = useCreate({
    mutationOptions: createUserMutationOptions(),
    queryKey: userKeys.list(),
    successMessage: getTranslation(t, "users.messages.created"),
    errorMessage: getTranslation(t, "users.messages.createError"),
  });

  const { mutate: updateUser } = useUpdate({
    mutationOptions: editUserMutationOptions(),
    queryKey: userKeys.list(),
    getDetailKey: (id) => userKeys.detail(String(id)),
    successMessage: getTranslation(t, "users.messages.updated"),
    errorMessage: getTranslation(t, "users.messages.updateError"),
  });

  const { mutate: deleteUser } = useDelete({
    mutationOptions: deleteUserMutationOptions(),
    queryKey: userKeys.list(),
    successMessage: getTranslation(t, "users.messages.deleted"),
    errorMessage: getTranslation(t, "users.messages.deleteError"),
  });

  const { mutate: banUser } = useUpdate({
    mutationOptions: changeUserStatusMutationOptions(),
    queryKey: userKeys.list(),
    getDetailKey: (id) => userKeys.detail(String(id)),
    successMessage: getTranslation(t, "users.messages.banned"),
    errorMessage: getTranslation(t, "users.messages.banError"),
  });

  const { mutate: suspendUser } = useUpdate({
    mutationOptions: changeUserStatusMutationOptions(),
    queryKey: userKeys.list(),
    getDetailKey: (id) => userKeys.detail(String(id)),
    successMessage: getTranslation(t, "users.messages.suspended"),
    errorMessage: getTranslation(t, "users.messages.suspendError"),
  });

  const { mutate: activateUser } = useUpdate({
    mutationOptions: changeUserStatusMutationOptions(),
    queryKey: userKeys.list(),
    getDetailKey: (id) => userKeys.detail(String(id)),
    successMessage: getTranslation(t, "users.messages.activated"),
    errorMessage: getTranslation(t, "users.messages.activateError"),
  });

  const handleChangeUserStatus = ({
    id,
    status,
  }: {
    id: number;
    status: UserStatus;
  }) => {
    if (status === "banned") banUser({ id, status });
    else if (status === "suspended") suspendUser({ id, status });
    else if (status === "active") activateUser({ id, status });
  };

  const handleCreateUser = async (values: Partial<User>) => {
    await createUser(values);
  };

  const handleUpdateUser = async (id: number, data: Partial<User>) => {
    await updateUser({ id, data });
  };

  const handleDeleteuser = async (id: number) => {
    await deleteUser(id);
  };

  const handleRowClick = (id: number) => {
    navigate({
      to: `/users/${id}`,
    });
  };

  const updateView = (newView: "cards" | "table") => {
    navigate({
      to: "/users",
      search: (prev) => ({
        ...prev,
        view: newView,
      }),
    });
  };

  return (
    <div className="min-h-screen py-16 px-6 overflow-x-hidden">
      <AppHeader
        title={getTranslation(t, role ? `users.roles.${role}` : "users.plural")}
        view={view}
        setView={updateView}
        onCreate={() => {
          const id = dialog.open({
            title: getTranslation(t, "users.actions.create"),
            closeOnOutsideClick: true,
            children: (
              <UserForm
                onSubmit={(values) => {
                  handleCreateUser(values);
                  dialog.close(id);
                }}
              />
            ),
            closable: true,
          });
        }}
        buttonLabel={getTranslation(t, "users.actions.create")}
      />

      {view === "cards" ? (
        <>
          <AppToolbar
            search={{
              title: getTranslation(t, "users.plural"),
              value: localSearch,
              onChange: setLocalSearch,
            }}
            filters={[
              {
                id: "role",
                label: getTranslation(t, "users.roles.all"),
                value: role,
                options: ROLES,
              },
            ]}
            onFilterChange={(id, value) => {
              if (id === "role") {
                navigate({
                  to: "/users",
                  search: (prev) => ({
                    ...prev,
                    role: value || undefined,
                    page: 1,
                  }),
                });
              }
            }}
            onResetFilters={() => {
              setLocalSearch(""); // Clear local search input

              navigate({
                to: "/users",
                search: (prev) => ({
                  ...prev,
                  search: undefined,
                  role: undefined, // ← ADD THIS LINE
                  page: 1,
                }),
              });
            }}
          />

          {filteredUsers.length === 0 ? (
            <NoItems
              title={getTranslation(t, "users.empty.noData")}
              description={
                role
                  ? getTranslation(t, "users.empty.withRole", {
                      role: getTranslation(t, `users.roles.${role}`),
                    })
                  : getTranslation(t, "users.empty.noData")
              }
              onReset={() => {
                setLocalSearch("");

                navigate({
                  to: "/users",
                  search: (prev) => ({
                    ...prev,
                    search: undefined,
                    role: undefined, // ← ADD THIS
                    page: 1,
                  }),
                });
              }}
              showResetButton={!!localSearch || !!role}
            />
          ) : (
            <>
              {realUsersResponse.meta.last_page > 1 && (
                <Pagination
                  currentPage={realUsersResponse?.meta?.current_page}
                  lastPage={realUsersResponse?.meta?.last_page}
                  onPageChange={(newPage) => {
                    navigate({
                      to: "/users",
                      search: (prev) => ({ ...prev, page: newPage }),
                    });
                    // Optional: scroll to top
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              )}
              <div className="mt-5 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center items-stretch">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={handleUpdateUser}
                    onDelete={handleDeleteuser}
                    onChangeStatus={handleChangeUserStatus}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <DataTable
          key={`users-table-${role || "all"}-${page}`}
          title={getTranslation(t, "users.plural")}
          queryOptions={usersQueryOptions({
            search: debouncedSearch || undefined,
            page: page,
            perPage: 12,
          })}
          onSearchChange={(value) => {
            setLocalSearch(value);
            navigate({
              to: "/users",
              search: (prev) => ({
                ...prev,
                search: value || undefined,
                page: 1, // ← reset page in URL
              }),
            });
          }}
          columns={userOrderColumns(t)}
          filterKey="name"
          filterValue={localSearch}
          onRowClick={handleRowClick}
          onEdit={(user) => {
            setTimeout(() => {
              const id = dialog.open({
                title: getTranslation(t, "users.actions.edit"),
                closeOnOutsideClick: true,
                children: (
                  <UserForm
                    onSubmit={(values) => {
                      handleUpdateUser(user.id!, values);
                      dialog.close(id);
                    }}
                    user_id={user.id}
                  />
                ),
                closable: true,
              });
            }, 0);
          }}
          onDelete={(user) => {
            setTimeout(() => {
              const id = dialog.open({
                title: getTranslation(t, "users.actions.delete"),
                closeOnOutsideClick: true,
                children: (
                  <DeleteItem
                    itemName={getTranslation(t, "users.single")}
                    gender="male"
                    onDelete={() => {
                      handleDeleteuser(user.id!);
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
              icon: <Pause className="h-4 w-4" />,
              label: getTranslation(t, "common.actions.suspend"),
              action: (user) =>
                handleChangeUserStatus({ id: user.id!, status: "suspended" }),
              color: "orange",
              show: (user) => user.status !== "suspended", // only active users
            },
            {
              icon: <Ban className="h-4 w-4" />,
              label: getTranslation(t, "common.actions.ban"),
              color: "violet",
              action: (user) =>
                handleChangeUserStatus({ id: user.id!, status: "banned" }),
              show: (user) => user.status !== "banned", // hide if already banned
            },
            {
              icon: <Play className="h-4 w-4" />,
              label: getTranslation(t, "common.actions.activate"),
              color: "emerald",
              action: (user) =>
                handleChangeUserStatus({ id: user.id!, status: "active" }),
              show: (user) => user.status !== "active", // hide if already active
            },
          ]}
          initialFilters={[{ id: "role", value: role }]}
          facetedFilters={[
            {
              columnId: "role",
              title: getTranslation(t, "users.roles.all"),
              options: ROLES,
            },
          ]}
          filterChange={(id, value) => {
            if (id === "role") {
              navigate({
                to: "/users",
                search: (prev) => ({
                  ...prev,
                  role: value || undefined,
                  page: 1, // Reset back to first page when changing filters
                }),
              });
            }
          }}
          onPageChange={(newPage) => {
            navigate({
              to: "/users",
              search: (prev) => ({ ...prev, page: newPage }),
            });
          }}
          onResetFilters={() => {
            navigate({
              to: "/users",
              search: (prev) => ({ view: prev.view, page: 1 }),
            });
          }}
        />
      )}
    </div>
  );
}
