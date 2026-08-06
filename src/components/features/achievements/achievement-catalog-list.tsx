"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import AppHeader from "@/components/common/app-header";
import NoItems from "@/components/common/no-items";
import { getTranslation } from "@/lib/utils";
import { useDialogStore } from "@/services";
import { achievementCatalogKeys } from "@/lib/constants";
import { achievementCatalogQueryOptions } from "@/api/query-options";
import {
  createAchievementCatalogMutationOptions,
  updateAchievementCatalogMutationOptions,
  deleteAchievementCatalogMutationOptions,
} from "@/api/mutation-options";
import { useCreate } from "@/hooks/api/use-create";
import { useDelete } from "@/hooks/api/use-delete";
import { useUpdate } from "@/hooks/api/use-update";
import AchievementForm from "./achievement-form";
import { AchievementCard } from "./achievement-card";
import { Shapes, CalendarClock } from "lucide-react";
import type { AchievementCatalog, AchievementType } from "@/types";

type GroupBy = "type" | "date";

export function AchievementCatalogList() {
  const { t } = useTranslation();
  const dialog = useDialogStore();
  const [groupBy, setGroupBy] = useState<GroupBy>("type");
  const { data: catalogData } = useQuery({
    ...achievementCatalogQueryOptions(),
    placeholderData: keepPreviousData,
  });
  const catalogList = catalogData?.data ?? [];

  const { mutate: createCatalog } = useCreate({
    mutationOptions: createAchievementCatalogMutationOptions(),
    queryKey: achievementCatalogKeys.all,
    successMessage: getTranslation(t, "achievements.messages.created"),
    errorMessage: getTranslation(t, "achievements.messages.createError"),
  });

  const { mutate: updateCatalog } = useUpdate({
    mutationOptions: updateAchievementCatalogMutationOptions(),
    queryKey: achievementCatalogKeys.all,
    successMessage: getTranslation(t, "achievements.messages.updated"),
    errorMessage: getTranslation(t, "achievements.messages.updateError"),
  });

  const { mutate: deleteCatalog } = useDelete({
    mutationOptions: deleteAchievementCatalogMutationOptions(),
    queryKey: achievementCatalogKeys.all,
    successMessage: getTranslation(t, "achievements.messages.deleted"),
    errorMessage: getTranslation(t, "achievements.messages.deleteError"),
  });

  const openCreateDialog = () => {
    const id = dialog.open({
      title: getTranslation(t, "achievements.actions.create"),
      children: (
        <AchievementForm
          onSubmit={async (values) => {
            createCatalog({
              name: values.name,
              type: values.type,
              ...(values.image instanceof File ? { image: values.image } : {}),
            });
            dialog.close(id);
          }}
          onCancel={() => dialog.close(id)}
        />
      ),
      closable: true,
    });
  };

  const openEditDialog = (catalog: AchievementCatalog) => {
    const id = dialog.open({
      title: getTranslation(t, "common.actions.edit"),
      children: (
        <AchievementForm
          catalog={catalog}
          onSubmit={async (values) => {
            updateCatalog({
              id: catalog.id,
              name: values.name,
              type: values.type,
              image: values.image,
            });
            dialog.close(id);
          }}
          onCancel={() => dialog.close(id)}
        />
      ),
      closable: true,
    });
  };

  const handleDelete = (id: number) => {
    deleteCatalog({ id });
  };

  const groups = useMemo(() => {
    if (groupBy === "type") {
      const map = new Map<AchievementType, AchievementCatalog[]>();
      catalogList.forEach((c) => {
        const list = map.get(c.type) ?? [];
        list.push(c);
        map.set(c.type, list);
      });
      return Array.from(map.entries());
    }
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const map = new Map<string, AchievementCatalog[]>();
    catalogList.forEach((c) => {
      const d = new Date(c.created_at);
      let key: string;
      if (d.toDateString() === now.toDateString()) key = "Today";
      else if (d >= startOfWeek) key = "This week";
      else if (d >= startOfMonth) key = "This month";
      else key = "Older";
      const list = map.get(key) ?? [];
      list.push(c);
      map.set(key, list);
    });
    return Array.from(map.entries());
  }, [catalogList, groupBy]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AppHeader
        entity="achievements"
        title={getTranslation(t, "achievements.plural")}
        onCreate={openCreateDialog}
        buttonLabel={getTranslation(t, "achievements.actions.createCatalog")}
      />

      <Tabs
        value={groupBy}
        onValueChange={(v) => setGroupBy(v as GroupBy)}
        className="mt-6"
      >
        {/* Group-by control.
            Was a shadcn TabsList: small, low-contrast, and carrying the tab
            underline that every other screen has had removed. It is now a
            proper segmented control on its own elevated surface — 48px tall,
            body-size type, selected segment filled with the one orange. */}
        <div className="jd-toolbar inline-flex w-auto flex-wrap items-center gap-3">
          <span className="ps-2 text-[length:var(--text-caption)] font-bold tracking-wide text-muted-foreground uppercase">
            {getTranslation(t, "achievements.groupBy.label")}
          </span>
          <div
            role="tablist"
            className="jd-field inline-flex items-center gap-1 p-1"
          >
            {[
              {
                id: "type" as const,
                icon: Shapes,
                label: "achievements.groupBy.type",
              },
              {
                id: "date" as const,
                icon: CalendarClock,
                label: "achievements.groupBy.date",
              },
            ].map((item) => {
              const active = groupBy === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setGroupBy(item.id)}
                  className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-[11px] px-5 text-[length:var(--text-body)] font-bold transition-[background-color,color,box-shadow] duration-200 ease-out ${
                    active
                      ? "bg-[var(--accent-btn)] text-[var(--accent-btn-fg)] shadow-[0_2px_8px_-3px_rgba(245,154,74,.55)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="block size-[18px] shrink-0" />
                  {getTranslation(t, item.label)}
                </button>
              );
            })}
          </div>
        </div>

        <TabsContent value="type" className="mt-8 space-y-10">
          {groups.length === 0 ? (
            <NoItems
              title={getTranslation(t, "achievements.empty.noAchievements")}
              description={getTranslation(t, "achievements.empty.createFirst")}
            />
          ) : (
            groups.map(([key, items]) => (
              <div key={key}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/80">
                    {key.toLowerCase()}
                  </h3>
                  <span className="text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {items.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {items.map((c) => (
                    <AchievementCard
                      key={c.id}
                      catalog={c}
                      onEdit={openEditDialog}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="date" className="mt-8 space-y-10">
          {groups.length === 0 ? (
            <NoItems
              title={getTranslation(t, "achievements.empty.noAchievements")}
              description={getTranslation(t, "achievements.empty.createFirst")}
            />
          ) : (
            groups.map(([key, items]) => (
              <div key={key}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-foreground/80">
                    {key}
                  </h3>
                  <span className="text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {items.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {items.map((c) => (
                    <AchievementCard
                      key={c.id}
                      catalog={c}
                      onEdit={openEditDialog}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
