"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppHeader from "@/components/common/app-header";
import NoItems from "@/components/common/no-items";
import { getTranslation } from "@/lib/utils";
import { useDialogStore } from "@/services";
import { achievementKeys } from "@/lib/constants";
import {
  achievementsQueryOptions,
  usersQueryOptions,
  achievementCatalogQueryOptions,
} from "@/api/query-options";
import {
  createAchievementMutationOptions,
  deleteAchievementMutationOptions,
} from "@/api/mutation-options";
import { useCreate } from "@/hooks/api/use-create";
import { useDelete } from "@/hooks/api/use-delete";
import { useData } from "@/hooks/api/use-data";
import AssignmentForm from "./assignment-form";
import { Trophy, Medal, Award, Star, Heart, X, UserRound } from "lucide-react";
import type {
  UserAchievement,
  AchievementType,
  AchievementCatalog,
} from "@/types";

const typeMeta: Record<
  AchievementType,
  {
    ring: string;
    ribbon: string;
    chip: string;
    gradient: string;
    icon: typeof Trophy;
  }
> = {
  GOLD: {
    ring: "",
    ribbon: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 ",
    gradient: "linear-gradient(135deg,#fde68a,#f59e0b)",
    icon: Trophy,
  },
  SILVER: {
    ring: "",
    ribbon: "bg-slate-400",
    chip: "bg-slate-50 text-slate-700 ",
    gradient: "linear-gradient(135deg,#e2e8f0,#94a3b8)",
    icon: Medal,
  },
  BRONZE: {
    ring: "border-orange-400",
    ribbon: "bg-orange-500",
    chip: "bg-orange-50 text-orange-700 border-orange-200",
    gradient: "linear-gradient(135deg,#fdba74,#c2703d)",
    icon: Award,
  },
  HONORABLE: {
    ring: "",
    ribbon: "bg-blue-500",
    chip: "bg-blue-50 text-blue-700 ",
    gradient: "linear-gradient(135deg,#bfdbfe,#3b82f6)",
    icon: Star,
  },
  PARTICIPATION: {
    ring: "",
    ribbon: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 ",
    gradient: "linear-gradient(135deg,#a7f3d0,#10b981)",
    icon: Heart,
  },
};

const ribbonClip = "polygon(0 0,100% 0,100% 72%,50% 100%,0 72%)";

export function AchievementList() {
  const { t } = useTranslation();
  const dialog = useDialogStore();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const { data: usersData } = useData(usersQueryOptions({ perPage: 200 }));
  const usersList = usersData?.data ?? [];

  const { data: achievementsData } = useQuery({
    ...achievementsQueryOptions(selectedUserId ?? 0),
    placeholderData: keepPreviousData,
  });
  const achievementsList: UserAchievement[] = achievementsData?.data ?? [];

  const { data: catalogData } = useQuery(achievementCatalogQueryOptions());
  const catalog: AchievementCatalog[] = catalogData?.data ?? [];

  const joined = useMemo(() => {
    return achievementsList.map((a) => {
      const type = a.rank.toUpperCase() as AchievementType;
      const match = catalog.find((c) => c.name === a.name && c.type === type);
      return { flat: a, type, catalogId: match?.id };
    });
  }, [achievementsList, catalog]);

  const { mutate: assignAchievement } = useCreate({
    mutationOptions: createAchievementMutationOptions(),
    queryKey: achievementKeys.list(selectedUserId ?? 0),
    successMessage: getTranslation(t, "achievements.messages.created"),
    errorMessage: getTranslation(t, "achievements.messages.createError"),
  });

  const { mutate: revokeAchievement } = useDelete({
    mutationOptions: deleteAchievementMutationOptions(),
    queryKey: achievementKeys.list(selectedUserId ?? 0),
    successMessage: getTranslation(t, "achievements.messages.deleted"),
    errorMessage: getTranslation(t, "achievements.messages.deleteError"),
  });

  const openAssignDialog = () => {
    const id = dialog.open({
      title: getTranslation(t, "achievements.actions.assign"),
      children: (
        <AssignmentForm
          onAssign={(userId, achievementId) => {
            assignAchievement({ userId, achievement_id: achievementId });
            dialog.close(id);
          }}
        />
      ),
      closable: true,
    });
  };

  const handleRevoke = (catalogId: number) => {
    if (!selectedUserId) return;
    revokeAchievement({ userId: selectedUserId, achievement_id: catalogId });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AppHeader
        entity="achievements"
        title={getTranslation(t, "achievements.userAchievements")}
        onCreate={openAssignDialog}
        buttonLabel={getTranslation(t, "achievements.actions.assign")}
      />

      <div className="mt-6 space-y-8">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <UserRound className="h-3.5 w-3.5" />
            {getTranslation(t, "achievements.fields.user")}
          </span>
          <Select
            value={selectedUserId ? String(selectedUserId) : ""}
            onValueChange={(v) => setSelectedUserId(v ? Number(v) : null)}
          >
            <SelectTrigger className="w-[260px] rounded-full border-border bg-card shadow-sm">
              <SelectValue
                placeholder={getTranslation(t, "achievements.selectUser")}
              />
            </SelectTrigger>
            <SelectContent>
              {usersList.map((u) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!selectedUserId ? (
          <NoItems
            title={getTranslation(t, "achievements.empty.noData")}
            description={getTranslation(t, "achievements.empty.selectUser")}
          />
        ) : achievementsList.length === 0 ? (
          <NoItems
            title={getTranslation(t, "achievements.empty.noAchievements")}
            description={getTranslation(
              t,
              "achievements.empty.noAchievementsDesc",
            )}
          />
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {joined.map(({ flat, type, catalogId }) => {
              const meta = typeMeta[type];
              const Icon = meta.icon;
              return (
                <div
                  key={flat.id}
                  className="relative border border-sidebar rounded-2xl p-5 pt-9 bg-card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="relative pt-2">
                      <div className="absolute -top-1 left-0 right-0 flex justify-center -z-0">
                        <span
                          className={`block w-3 h-8 -rotate-[14deg] translate-x-[3px] ${meta.ribbon}`}
                          style={{ clipPath: ribbonClip }}
                        />
                        <span
                          className={`block w-3 h-8 rotate-[14deg] -translate-x-[3px] ${meta.ribbon}`}
                          style={{ clipPath: ribbonClip }}
                        />
                      </div>
                      <div
                        className={`relative z-10 w-16 h-16 rounded-full border-[3px] ${meta.ring} flex items-center justify-center shadow-sm ring-4 ring-background`}
                        style={{ backgroundImage: meta.gradient }}
                      >
                        {flat.image_url ? (
                          <img
                            src={flat.image_url}
                            alt={flat.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Icon
                            className="w-7 h-7 text-white drop-shadow-sm"
                            strokeWidth={2.25}
                          />
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${meta.chip}`}
                    >
                      {getTranslation(
                        t,
                        `achievements.types.${type.toLowerCase()}`,
                      )}
                    </span>

                    <p className="text-sm font-bold text-foreground line-clamp-2 leading-snug min-h-[2.5rem]">
                      {flat.name}
                    </p>

                    <div className="w-full pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>
                        {new Date(flat.awarded_at).toLocaleDateString()}
                      </span>
                      {catalogId != null && (
                        <button
                          className="flex items-center gap-1 text-destructive hover:underline"
                          onClick={() => handleRevoke(catalogId)}
                        >
                          <X className="h-3 w-3" />
                          {getTranslation(t, "common.actions.delete")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
