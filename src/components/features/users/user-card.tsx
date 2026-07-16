import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTranslation } from "@/lib/utils";
import type { TFunction } from "i18next";
import type { User, UserStatus } from "@/types";
import { Ban, Edit, MoreHorizontal, Pause, Play, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import UserForm from "./user-form";
import { useDialogStore } from "@/services";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export interface UserCardProps {
  user: User;
  onEdit?: (id, values) => void;
  onDelete?: (id) => void;
  onChangeStatus?: (variables: { id: number; status: UserStatus }) => void;
}

const getRoleConfig = (t: TFunction) =>
  ({
    debater: {
      cover:
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200",
      accent: "from-cyan-400 via-blue-400 to-violet-400",
      tag: `🎤 ${getTranslation(t, "users.details.roles.debater")}`,
    },
    trainer: {
      cover:
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200",
      accent: "from-amber-400 via-orange-400 to-rose-400",
      tag: `🧭 ${getTranslation(t, "users.details.roles.trainer")}`,
    },
    judge: {
      cover:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200",
      accent: "from-rose-400 via-fuchsia-400 to-indigo-400",
      tag: `⚖️ ${getTranslation(t, "users.details.roles.judge")}`,
    },
    admin: {
      cover:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200",
      accent: "from-emerald-400 via-teal-400 to-cyan-400",
      tag: `🛡️ ${getTranslation(t, "users.details.roles.admin")}`,
    },
  }) as const;

export function UserCard({
  user,
  onDelete,
  onEdit,
  onChangeStatus,
}: UserCardProps) {
  const { t, i18n } = useTranslation();
  const roleCfg = getRoleConfig(t);
  const config = roleCfg[user.role] ?? roleCfg.debater;
  const navigate = useNavigate();

  const [activeAction, setActiveAction] = useState<
    "ban" | "suspend" | "activate" | null
  >(null);

  const dialog = useDialogStore();

  const handleUpdateUser = async (id: number, data: Partial<User>) => {
    await onEdit(id, data);
  };
  const handleDeleteUser = async (id: number) => {
    await onDelete(id);
  };
  const handleChangeUserStatus = async (id: number, status: UserStatus) => {
    await onChangeStatus({ id, status });
  };

  return (
    <div
      className="group relative w-full max-w-[300px] select-none h-full hover:cursor-pointer"
      onClick={() => {
        navigate({
          to: `/users/${user.id}`,
        });
      }}
    >
      {/* Ambient glow */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${config?.accent} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 scale-95 group-hover:scale-105`}
      />

      {/* Card */}
      <div className="relative rounded-3xl overflow-hidden bg-card border border-border/60 shadow-md group-hover:[box-shadow:0_0_40px_-4px_oklch(0.72_0.17_47_/_0.4),_0_0_16px_-2px_oklch(0.72_0.17_47_/_0.25)] group-hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
        {/* Cover */}
        <div className="relative h-28 overflow-hidden">
          <img
            src={config.cover}
            alt="cover"
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-card" />
          <span className="absolute top-3 ltr:left-3 rtl:right-3 text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20">
            {config.tag}
          </span>
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
                  <AlertDialogCancel
                    variant="ghost"
                    className="hover:bg-muted hover:text-foreground"
                  >
                    {getTranslation(t, "complaints.dialog.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="ghost"
                    className={
                      activeAction === "ban"
                        ? "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20"
                        : activeAction === "suspend"
                          ? "bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20"
                          : "bg-success/10 text-success border border-success/20 hover:bg-success/20"
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
                    className="h-7 w-7 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 transition-colors duration-200"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
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

        {/* Avatar */}
        <div className="flex justify-center -mt-9 relative z-10">
          <div
            className={`p-[2.5px] rounded-full bg-gradient-to-br ${config.accent} shadow-lg`}
          >
            <div className="p-[2px] rounded-full bg-card">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user.avatar_url ?? ""}
                  className="object-cover"
                />
                <AvatarFallback className="text-sm font-bold bg-muted">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center px-5 mt-2.5 pb-1 flex-1">
          <h2 className="text-base font-bold text-foreground tracking-tight leading-tight">
            {user.name}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2 h-8">
            {user.phone}
          </p>
        </div>

        {/* Divider */}
        <div className="mx-5 mt-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Stats */}
        <div className="grid grid-cols-2 divide-x divide-border/60">
          {[
            {
              label: getTranslation(t, "users.card.points"),
              value: user.points,
            },
            {
              label: getTranslation(t, "users.card.status"),
              value: getTranslation(t, `users.statuses.${user.status}`),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center py-4 gap-0.5 hover:bg-muted/40 transition-colors duration-200"
            >
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                {label}
              </span>
              <span className="text-sm font-bold text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
