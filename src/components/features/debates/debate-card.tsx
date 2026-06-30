import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Crown, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Debate } from "@/types/debate/debate.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTranslation } from "@/lib/utils";
import DebateForm from "./debate-form";
import { useDialogStore } from "@/services";
import DeleteItem from "@/components/common/delete-item";
import type { DebateResult } from "@/types";
import { useNavigate } from "@tanstack/react-router";

export interface DebateCardParticipant {
  name: string;
  avatar: string | null;
  side: "proposition" | "opposition";
}

export interface DebateCardProps {
  debate: Debate;
  // Optional overrides if you want to pass pre-processed participants
  proposition?: DebateCardParticipant;
  opposition?: DebateCardParticipant;
  result?: DebateResult | null;
  onEdit?: (id, values) => void;
  onDelete?: (id) => void;
}

export function DebateCard({
  debate,
  proposition: propProp,
  opposition: propOpp,
  result: propResult,
  onEdit,
  onDelete,
}: DebateCardProps) {
  const dialog = useDialogStore();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();

  // Use result from props or from debate object
  const result = propResult ?? debate.result;

  const winningSide = result?.winning_side ?? null;
  const propWins = winningSide === "proposition";
  const oppWins = winningSide === "opposition";
  const isDraw = winningSide === "draw";

  // Derive proposition and opposition from debate.participants if not passed as props
  const proposition = propProp ?? getParticipantBySide(debate, "proposition");
  const opposition = propOpp ?? getParticipantBySide(debate, "opposition");

  // Calculate win percentage from scores
  const percent: number = (() => {
    if (!result) return 0;
    const scores = result.scores as Record<string, number>;
    const propScore = scores["proposition"] ?? 0;
    const oppScore = scores["opposition"] ?? 0;
    const total = propScore + oppScore;
    return total > 0 ? Math.round((propScore / total) * 100) : 50;
  })();

  const flip = (deg: number) => (isRTL ? deg * -1 : deg);

  const winLabel = () => {
    if (debate.status === "live" || debate.started_at)
      return getTranslation(t, "debates.card.live");
    if (["cancelled", "scheduled", "announced"].includes(debate.status))
      return getTranslation(t, "debates.card.upcoming");
    const winningSide = debate.result?.winning_side;
    if (winningSide === "draw") return getTranslation(t, "debates.card.draw");
    if (winningSide === "proposition")
      return getTranslation(t, "debates.card.propWins");
    if (winningSide === "opposition")
      return getTranslation(t, "debates.card.oppWins");
    return getTranslation(t, "debates.card.upcoming");
  };

  return (
    <Card
      className="cursor-pointer relative h-95 w-full min-[1301px]:h-112.5 overflow-hidden border-sidebar group hover:shadow-[0_0_50px_var(--accent)] transition-all duration-300 rounded-4xl min-[1301px]:rounded-[2.5rem] bg-card font-sans"
      dir={i18n.dir()}
      onClick={() => {
        navigate({
          to: `/debates/${debate.id}`,
        });
      }}
    >
      {/* TOP HEADER */}
      <div className="absolute top-0 w-full z-30 p-4 min-[1301px]:p-6 flex flex-col items-center gap-1 min-[1301px]:gap-2 bg-linear-to-b from-background/90 to-transparent">
        <Badge
          style={{ transform: `rotate(${flip(-2)}deg)` }}
          className="bg-accent text-accent-foreground border-2 border-sidebar font-extrabold min-[1301px]:font-black italic uppercase tracking-wider px-2 py-0.5 min-[1301px]:px-4 min-[1301px]:py-1 shadow-[3px_3px_0px_var(--sidebar)] min-[1301px]:shadow-[4px_4px_0px_var(--sidebar)] text-[10px] min-[1301px]:text-xs"
        >
          {debate.tag}
        </Badge>
        <h2 className="text-xl min-[1301px]:text-3xl font-black text-foreground text-center uppercase tracking-tighter [text-shadow:2px_2px_0_var(--background)] min-[1301px]:[text-shadow:3px_3px_0_var(--background)] leading-none mt-1 px-2">
          {debate.title}
        </h2>
      </div>

      {/* Actions Menu */}
      <div
        className={`absolute top-4 min-[1301px]:top-6 z-40 ${isRTL ? "left-4 min-[1301px]:left-6" : "right-4 min-[1301px]:right-6"}`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-7 w-7 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 transition-colors duration-200">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isRTL ? "start" : "end"}
            className="w-[160px]"
          >
            <DropdownMenuLabel>
              {getTranslation(t, "common.labels.actions")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="group gap-2"
              onClick={(e) => {
                e.stopPropagation();
                setTimeout(() => {
                  const id = dialog.open({
                    title: getTranslation(t, "debates.actions.edit"),
                    children: (
                      <DebateForm
                        onSubmit={(values) => {
                          onEdit(debate.id, values);
                          dialog.close(id);
                        }}
                        debate_id={debate.id}
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
              className="group gap-2 text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setTimeout(() => {
                  const id = dialog.open({
                    title: getTranslation(t, "debates.actions.delete"),
                    children: (
                      <DeleteItem
                        itemName={getTranslation(t, "debates.single")}
                        gender="female"
                        onDelete={() => {
                          onDelete(debate.id);
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
              <Trash className="mr-2 h-4 w-4 group-hover:text-red-600" />
              {getTranslation(t, "common.actions.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Split Background */}
      <div className="absolute inset-0 flex flex-row">
        <div
          className={`relative w-1/2 flex flex-col items-center justify-center transition-all duration-500
          ${propWins || !result ? "bg-sidebar brightness-125" : "bg-muted grayscale opacity-40"}`}
          style={{
            clipPath: isRTL
              ? "polygon(18% 0, 100% 0, 100% 100%, 0 100%)"
              : "polygon(0 0, 100% 0, 82% 100%, 0% 100%)",
          }}
        />
        <div
          className={`relative w-1/2 flex flex-col items-center justify-center transition-all duration-500
          ${oppWins ? "bg-accent brightness-110" : "bg-muted grayscale opacity-40"}`}
          style={{
            clipPath: isRTL
              ? "polygon(0 0, 100% 0, 82% 100%, 0% 100%)"
              : "polygon(18% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>

      {/* VS Center */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 z-40 ${isRTL ? "right-1/2 translate-x-1/2" : "left-1/2 -translate-x-1/2"}`}
      >
        <div className="relative group-hover:scale-110 transition-transform duration-500">
          <div className="absolute inset-0 bg-accent blur-xl min-[1301px]:blur-2xl opacity-40 animate-pulse" />
          <div
            style={{ transform: `rotate(${flip(12)}deg)` }}
            className="relative w-7 h-7 min-[1301px]:w-9 min-[1301px]:h-9 bg-card border border-sidebar rounded-xl min-[1301px]:rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_var(--accent)] min-[1301px]:shadow-[6px_6px_0px_var(--accent)]"
          >
            <span
              style={{ transform: `rotate(${flip(-12)}deg)` }}
              className="text-foreground font-black text-sm min-[1301px]:text-lg tracking-tighter"
            >
              {getTranslation(t, "debates.card.vs")}
            </span>
          </div>
        </div>
      </div>

      {/* Team Content */}
      <CardContent className="relative z-20 h-full grid grid-cols-2 pt-24 min-[1301px]:pt-28 pb-10 min-[1301px]:pb-12">
        {/* Proposition */}
        <div className="flex flex-col items-center justify-center gap-2 min-[1301px]:gap-4 px-2 min-[1301px]:px-4 transition-all duration-500">
          <div
            className={`relative p-0.5 min-[1301px]:p-1 rounded-full border-[3px] min-[1301px]:border-[5px] transition-all duration-500 ${
              propWins || !result
                ? "border-accent scale-105 min-[1301px]:scale-110 shadow-[0_0_20px_var(--accent)]"
                : "border-foreground/10 scale-90 min-[1301px]:scale-95 opacity-50"
            }`}
          >
            {proposition?.avatar ? (
              <img
                src={proposition.avatar}
                className="w-10 h-10 min-[1301px]:w-14 min-[1301px]:h-14 rounded-full object-cover bg-sidebar"
                alt={proposition.name}
              />
            ) : (
              <div className="w-10 h-10 min-[1301px]:w-14 min-[1301px]:h-14 rounded-full bg-sidebar flex items-center justify-center text-sm font-bold text-sidebar-foreground">
                {proposition?.name?.[0] ?? "?"}
              </div>
            )}
            {propWins && (
              <Crown className="absolute -top-2 min-[1301px]:-top-3 w-6 h-6 min-[1301px]:w-9 min-[1301px]:h-9 text-accent fill-accent stroke-sidebar stroke-2 drop-shadow-lg animate-pulse" />
            )}
          </div>
          <div className="text-center">
            <p className="text-accent font-bold min-[1301px]:font-black text-[8px] min-[1301px]:text-[10px] tracking-[0.2em] mt-1 min-[1301px]:mt-2 opacity-80">
              {proposition?.name ?? getTranslation(t, "debates.card.proposition")}
            </p>
          </div>
        </div>

        {/* Opposition */}
        <div className="flex flex-col items-center justify-center gap-2 min-[1301px]:gap-4 px-2 min-[1301px]:px-4 transition-all duration-500">
          <div
            className={`relative p-0.5 min-[1301px]:p-1 rounded-full border-[3px] min-[1301px]:border-[5px] transition-all duration-500 ${
              oppWins
                ? "border-foreground scale-105 min-[1301px]:scale-110 shadow-[0_0_20px_var(--foreground)]"
                : "border-foreground/10 scale-90 min-[1301px]:scale-95 opacity-50"
            }`}
          >
            {opposition?.avatar ? (
              <img
                src={opposition.avatar}
                className="w-10 h-10 min-[1301px]:w-14 min-[1301px]:h-14 rounded-full object-cover bg-sidebar"
                alt={opposition.name}
              />
            ) : (
              <div className="w-10 h-10 min-[1301px]:w-14 min-[1301px]:h-14 rounded-full bg-sidebar flex items-center justify-center text-sm font-bold text-sidebar-foreground">
                {opposition?.name?.[0] ?? "?"}
              </div>
            )}
            {oppWins && (
              <Crown className="absolute -top-2 min-[1301px]:-top-3 w-6 h-6 min-[1301px]:w-9 min-[1301px]:h-9 text-foreground fill-foreground stroke-sidebar stroke-2 drop-shadow-lg animate-pulse" />
            )}
          </div>
          <div className="text-center">
            <p
              className={`font-bold min-[1301px]:font-black text-[8px] min-[1301px]:text-[10px] tracking-[0.2em] mt-1 min-[1301px]:mt-2 opacity-80 ${oppWins ? "text-sidebar-foreground" : "text-foreground/30"}`}
            >
              {opposition?.name ?? getTranslation(t, "debates.card.opposition")}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-4 min-[1301px]:bottom-6 w-full px-6 min-[1301px]:px-10 z-30">
        <div className="bg-card border-2 min-[1301px]:border-4 border-accent p-0.5 min-[1301px]:p-1 rounded-lg min-[1301px]:rounded-xl shadow-[3px_3px_0px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between px-3 min-[1301px]:px-4 h-8 min-[1301px]:h-10 bg-sidebar text-sidebar-foreground overflow-hidden relative rounded-sm min-[1301px]:rounded-md">
            <div
              className={`absolute inset-y-0 transition-all duration-700 ease-out bg-accent ${isRTL ? "right-0" : "left-0"}`}
              style={{ width: `${percent}%` }}
            />
            {percent > 0 && (
              <div className="relative z-10 font-black italic flex items-center gap-1.5 min-[1301px]:gap-2 text-xs min-[1301px]:text-sm text-white">
                <Zap className="w-3 h-3 min-[1301px]:w-4 min-[1301px]:h-4 fill-white text-white animate-pulse" />
                <span dir="ltr">{percent}%</span>
              </div>
            )}
            <div className="relative z-10 font-extrabold min-[1301px]:font-black italic text-[9px] min-[1301px]:text-xs tracking-wider min-[1301px]:tracking-widest text-white/90 uppercase">
              {winLabel()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/** Helper to extract participant by side */
function getParticipantBySide(
  debate: Debate,
  side: "proposition" | "opposition",
): DebateCardParticipant | undefined {
  const participant = debate.participants?.find((p) => {
    // You may need to adjust this logic based on how you store side in DebateParticipant
    return (p as any).side === side || (p as any).team?.side === side;
  });

  if (!participant) return undefined;

  return {
    name: participant.name,
    side,
    avatar: participant.avatar_url,
  };
}
