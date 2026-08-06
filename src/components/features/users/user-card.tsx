import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials, getTranslation } from "@/lib/utils";
import type { TFunction } from "i18next";
import type { User, UserStatus } from "@/types";
import {
  Ban,
  Edit,
  GraduationCap,
  MessagesSquare,
  MoreHorizontal,
  Pause,
  Play,
  Scale,
  Shield,
  ShieldBan,
  Trash,
  Trophy,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import UserForm from "./user-form";
import AssignmentForm from "@/components/features/achievements/assignment-form";
import { useDialogStore } from "@/services";
import { achievementKeys } from "@/lib/constants";
import { createAchievementMutationOptions } from "@/api/mutation-options";
import { useCreate } from "@/hooks/api/use-create";
import DeleteItem from "@/components/common/delete-item";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

import coverImage from "@/assets/Jadal_user_cover_image.png";

export interface UserCardProps {
  user: User;
  onEdit?: (id, values) => void;
  onDelete?: (id) => void;
  onChangeStatus?: (variables: { id: number; status: UserStatus }) => void;
}

/**
 * §11.2 — the role is the card's primary identifier, and the colour lives on
 * the role WORD. No coloured card, no coloured border, no role-keyed avatar
 * ring: the avatar keeps its per-user identity colour, which is identity, not
 * role.
 *
 * The glyph is not decoration — colour alone fails for the ~8% of male users
 * who cannot reliably separate the orange/green pair.
 */
const getRoleConfig = (t: TFunction) =>
  ({
    debater: {
      color: "var(--role-debater)",
      icon: MessagesSquare,
      label: getTranslation(t, "users.details.roles.debater"),
    },
    trainer: {
      color: "var(--role-trainer)",
      icon: GraduationCap,
      label: getTranslation(t, "users.details.roles.trainer"),
    },
    judge: {
      color: "var(--role-judge)",
      icon: Scale,
      label: getTranslation(t, "users.details.roles.judge"),
    },
    admin: {
      color: "var(--role-admin)",
      icon: Shield,
      label: getTranslation(t, "users.details.roles.admin"),
    },
  }) as const;

/** Deterministic per-user avatar colour — identity, never role. */
const AVATAR_COLORS = [
  "#0352A1",
  "#1A3868",
  "#B45F13",
  "#157A49",
  "#7A4B39",
  "#5A7296",
  "#8E4A63",
  "#2E6E7E",
];

function avatarColorFor(id?: number | string) {
  const n = Number(id) || 0;
  return AVATAR_COLORS[Math.abs(n) % AVATAR_COLORS.length];
}

export function UserCard({
  user,
  onDelete,
  onEdit,
  onChangeStatus,
}: UserCardProps) {
  const { t, i18n } = useTranslation();
  const roleCfg = getRoleConfig(t);
  const config = roleCfg[user.role] ?? roleCfg.debater;
  const RoleIcon = config.icon;
  // Status is only ever surfaced when the user is not active (§11.6).
  const isInactive = !!user.status && user.status !== "active";
  const isBanned = user.status === "banned";
  const navigate = useNavigate();

  const [activeAction, setActiveAction] = useState<
    "ban" | "suspend" | "activate" | null
  >(null);

  const dialog = useDialogStore();

  const { mutate: assignAchievement } = useCreate({
    mutationOptions: createAchievementMutationOptions(),
    queryKey: achievementKeys.all,
    successMessage: getTranslation(t, "achievements.messages.created"),
    errorMessage: getTranslation(t, "achievements.messages.createError"),
  });

  const handleUpdateUser = async (id: number, data: Partial<User>) => {
    await onEdit(id, data);
  };
  const handleDeleteUser = async (id: number) => {
    await onDelete(id);
  };
  const handleChangeUserStatus = async (id: number, status: UserStatus) => {
    await onChangeStatus({ id, status });
  };
  const openAchievementsDialog = () => {
    setTimeout(() => {
      const id = dialog.open({
        title: getTranslation(t, "achievements.actions.assign"),
        closeOnOutsideClick: true,
        children: (
          <AssignmentForm
            userId={user.id}
            onAssign={(userId, achievementId) => {
              assignAchievement({ userId, achievement_id: achievementId });
              dialog.close(id);
            }}
          />
        ),
        closable: true,
      });
    }, 0);
  };

  return (
    <div
      className={cn(
        "jd-card jd-interactive group relative flex h-full w-full cursor-pointer flex-col overflow-hidden p-5 select-none",
        isInactive && "saturate-[0.65]",
      )}
      onClick={() => {
        navigate({
          to: `/users/${user.id}`,
        });
      }}
    >
      {/* §11.6 Only inactive users surface a status, as a ribbon flush to the
          card's start edge. Active users render nothing at all.
          Banned is red: it is the one state that has to stop the eye on a wall
          of cards, and grey read as "no data" rather than "blocked". Suspended
          stays amber — recoverable, not terminal. */}
      {isInactive && (
        <span
          className={cn(
            "absolute top-3.5 start-0 z-20 rounded-e-full py-1 pe-3 ps-2.5 text-[length:var(--text-small)] font-bold text-white",
            isBanned
              ? "bg-[var(--destructive)] shadow-[0_2px_10px_-2px_rgba(216,72,87,.65)]"
              : "bg-[#B45F13] shadow-[0_2px_8px_-2px_rgba(180,95,19,.5)]",
          )}
        >
          {isBanned && <ShieldBan className="me-1.5 inline size-3.5 align-[-2px]" />}
          {getTranslation(t, `users.statuses.${user.status}`)}
        </span>
      )}

      {/* §11.3 The cover must dissolve into the card, not sit on top of it.
          Three layers are required — opacity alone only makes it lighter:
          the mask fades the pixels, and the veil guarantees the bottom edge
          matches the card colour exactly whatever the photo contains. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[104px] overflow-hidden rounded-t-[28px]"
      >
        <img
          src={coverImage}
          alt=""
          className="size-full scale-105 object-cover opacity-55 transition-transform duration-500 ease-out group-hover:scale-110 dark:opacity-[0.42]"
          style={{
            maskImage:
              "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,.72) 48%, rgba(0,0,0,.22) 82%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,.72) 48%, rgba(0,0,0,.22) 82%, rgba(0,0,0,0) 100%)",
          }}
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,.55)_70%,rgba(255,255,255,1)_100%)] dark:bg-[linear-gradient(180deg,rgba(30,50,80,0)_0%,rgba(30,50,80,.55)_70%,rgba(30,50,80,1)_100%)]" />
      </div>

      <div className="absolute top-2.5 ltr:right-2.5 rtl:left-2.5 z-20">
        <>
          {/* AlertDialog - outside card, sibling to dropdown */}
          <AlertDialog
            open={activeAction !== null}
            onOpenChange={(open) => !open && setActiveAction(null)}
          >
            <AlertDialogContent
              onClick={(e) => e.stopPropagation()}
              dir={i18n.dir()}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {activeAction === "ban" &&
                    getTranslation(t, "common.actions.ban")}
                  {activeAction === "suspend" &&
                    getTranslation(t, "common.actions.suspend")}
                  {activeAction === "activate" &&
                    getTranslation(t, "common.actions.activate")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {activeAction === "ban" &&
                    getTranslation(t, "common.labels.banDescription")}
                  {activeAction === "suspend" &&
                    getTranslation(t, "common.labels.suspendDescription")}
                  {activeAction === "activate" &&
                    getTranslation(t, "common.labels.activateDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="ghost">
                  {getTranslation(t, "complaints.dialog.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  variant="ghost"
                  className={
                    activeAction === "ban"
                      ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                      : activeAction === "suspend"
                        ? "bg-accent/15 text-[var(--chip-orange-fg)] hover:bg-accent/25"
                        : "bg-success/10 text-success hover:bg-success/20"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeAction === "ban")
                      handleChangeUserStatus(user.id!, "banned");
                    if (activeAction === "suspend")
                      handleChangeUserStatus(user.id!, "suspended");
                    if (activeAction === "activate")
                      handleChangeUserStatus(user.id!, "active");
                    setActiveAction(null);
                  }}
                >
                  {activeAction === "ban" &&
                    getTranslation(t, "common.labels.confirmBan")}
                  {activeAction === "suspend" &&
                    getTranslation(t, "common.labels.confirmSuspend")}
                  {activeAction === "activate" &&
                    getTranslation(t, "common.labels.confirmActivate")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="absolute top-2.5 ltr:right-2.5 rtl:left-2.5 z-20">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-[12px] bg-black/35 text-white backdrop-blur-md transition-colors duration-150 ease-in-out hover:bg-black/55"
                >
                  <MoreHorizontal className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[180px] rounded-xl p-1.5 shadow-xl border-border bg-card/80 backdrop-blur-md"
              >
                <DropdownMenuLabel>
                  {getTranslation(t, "common.labels.actions")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="group gap-2 text-chart-6 focus:text-chart-6 focus:bg-chart-6/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTimeout(() => {
                      const id = dialog.open({
                        title: getTranslation(t, "common.actions.edit"),
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
                >
                  <Edit className="mr-2 h-4 w-4 group-hover:text-muted-foreground" />
                  {getTranslation(t, "common.actions.edit")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="group gap-2 text-chart-5 focus:text-chart-5 focus:bg-chart-5/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAchievementsDialog();
                  }}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  {getTranslation(t, "achievements.actions.assign")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="group gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTimeout(() => {
                      const id = dialog.open({
                        title: getTranslation(t, "common.actions.delete"),
                        closeOnOutsideClick: true,
                        children: (
                          <DeleteItem
                            itemName={getTranslation(t, "users.single")}
                            gender="male"
                            onDelete={() => {
                              handleDeleteUser(user.id!);
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
                >
                  <Trash className="mr-2 h-4 w-4 group-hover:text-destructive" />
                  {getTranslation(t, "common.actions.delete")}
                </DropdownMenuItem>

                {user.status !== "banned" && (
                  <DropdownMenuItem
                    className="group gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAction("ban");
                    }}
                  >
                    <Ban className="mr-2 h-4 w-4 transitions-colors" />
                    {getTranslation(t, "common.actions.ban")}
                  </DropdownMenuItem>
                )}

                {user.status !== "suspended" && (
                  <DropdownMenuItem
                    className="group gap-2 text-warning focus:text-warning focus:bg-warning/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAction("suspend");
                    }}
                  >
                    <Pause className="mr-2 h-4 w-4 transitions-colors" />
                    {getTranslation(t, "common.actions.suspend")}
                  </DropdownMenuItem>
                )}

                {user.status !== "active" && (
                  <DropdownMenuItem
                    className="group gap-2 text-success focus:text-success focus:bg-success/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAction("activate");
                    }}
                  >
                    <Play className="mr-2 h-4 w-4 transitions-colors" />
                    {getTranslation(t, "common.actions.activate")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      </div>

      {/* §11.4 Avatar: photo if present, otherwise AT MOST two initials.
          The old fallback split the name on "" — which yields every character,
          i.e. the whole name. That is the bug being reported. */}
      <div className="relative z-10 mt-[52px] flex justify-center">
        <span
          className="allow-border rounded-full border-[3px]"
          style={{ borderColor: "var(--card)" }}
        >
          <Avatar className="size-[72px]">
            <AvatarImage src={user.avatar_url ?? ""} className="object-cover" />
            <AvatarFallback
              className="text-[length:var(--text-title)] font-extrabold text-white"
              style={{ background: avatarColorFor(user.id) }}
            >
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </span>
      </div>

      {/* Name + the role word */}
      <div className="relative z-10 mt-3 flex flex-1 flex-col items-center text-center">
        <h2 className="line-clamp-1 text-[length:var(--text-subtitle)] font-bold text-foreground">
          {user.name}
        </h2>

        {/* §11.2 The role, coloured on the word itself, with a glyph so colour
            is never the only signal. This replaces the status chip. */}
        <p
          className="mt-1 flex items-center gap-1.5 text-[length:var(--text-body)] font-bold"
          style={{ color: config.color }}
        >
          <RoleIcon className="size-3.5 shrink-0" />
          {config.label}
        </p>

        {user.phone && (
          <p className="mt-1 line-clamp-1 text-[length:var(--text-caption)] font-semibold text-muted-foreground">
            {user.phone}
          </p>
        )}
      </div>

      {/* §11.5 Secondary information: 26px chips, inside the card's padding,
          never stretched to card width. */}
      <div className="relative z-10 mt-4 flex flex-wrap justify-center gap-2">
        <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full bg-[var(--chip-neutral-bg)] px-2.5 text-[length:var(--text-small)] font-bold text-[var(--chip-neutral-fg)]">
          <span className="text-foreground tabular-nums">
            {user.points ?? 0}
          </span>
          {getTranslation(t, "users.card.points")}
        </span>
      </div>
    </div>
  );
}
