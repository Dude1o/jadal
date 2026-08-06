import { Badge, BadgeDot } from "@/components/ui/badge";
import {
  CalendarDays,
  Crown,
  Edit,
  Megaphone,
  MoreHorizontal,
  Trash,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Debate } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getTranslation, isDebateAnnouncable } from "@/lib/utils";
import { entityIcons } from "@/lib/entity-icons";
import DebateForm from "./debate-form";
import { useDialogStore } from "@/services";
import DeleteItem from "@/components/common/delete-item";
import type { DebateResult } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import AnnounceForm from "./announce-form";

export interface DebateCardParticipant {
  name: string;
  avatar: string | null;
  side: "proposition" | "opposition";
}

export interface DebateCardProps {
  debate: Debate;
  proposition?: DebateCardParticipant;
  opposition?: DebateCardParticipant;
  result?: DebateResult | null;
  onEdit?: (id, values) => void;
  onDelete?: (id) => void;
  onCancel?: (id) => void;
  onAnnounce?: (id) => void;
}

/**
 * The state is the loudest thing on this card.
 *
 * Live is a saturated red pill with a pulsing dot; announced is saturated
 * orange; the rest are strong tints. It sits alone on the card's first row at
 * 36px tall — never a small chip beside the tag, and never a strip along the
 * bottom (the bottom strip is gone entirely).
 */
const STATE_STYLE: Record<string, { variant: string; pulse?: boolean }> = {
  live: { variant: "solid-destructive", pulse: true },
  announced: { variant: "solid-accent" },
  scheduled: { variant: "tint" },
  "teams-selected": { variant: "tint" },
  completed: { variant: "tint-success" },
  cancelled: { variant: "tint-neutral" },
};

export function DebateCard({
  debate,
  proposition: propProp,
  opposition: propOpp,
  result: propResult,
  onEdit,
  onDelete,
  onCancel,
  onAnnounce,
}: DebateCardProps) {
  const dialog = useDialogStore();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();
  const FormatIcon = entityIcons.debateFormats.outline;

  const result = propResult ?? debate.result;

  const winningSide = result?.winning_side ?? null;
  const propWins = winningSide === "proposition";
  const oppWins = winningSide === "opposition";

  const proposition = propProp ?? getParticipantBySide(debate, "proposition");
  const opposition = propOpp ?? getParticipantBySide(debate, "opposition");

  const percent: number = (() => {
    if (!result) return 0;
    const scores = result.scores as Record<string, number>;
    const propScore = scores["proposition"] ?? 0;
    const oppScore = scores["opposition"] ?? 0;
    const total = propScore + oppScore;
    return total > 0 ? Math.round((propScore / total) * 100) : 50;
  })();

  const stateStyle = STATE_STYLE[debate.status] ?? { variant: "tint-neutral" };

  /** One side of the matchup, in its own brand colour, saturated. */
  const Side = ({
    participant,
    side,
    wins,
  }: {
    participant?: DebateCardParticipant;
    side: "proposition" | "opposition";
    wins: boolean;
  }) => {
    const isProp = side === "proposition";
    const labelKey = isProp
      ? "debates.card.proposition"
      : "debates.card.opposition";
    const dimmed = !!result && !wins;

    return (
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col items-center gap-2.5 rounded-[20px] px-3 py-4 transition-colors duration-200 ease-in-out",
          dimmed
            ? "bg-[color-mix(in_oklab,var(--muted-foreground)_9%,transparent)]"
            : isProp
              ? "bg-[color-mix(in_oklab,var(--proposition)_12%,transparent)]"
              : "bg-[color-mix(in_oklab,var(--opposition)_14%,transparent)]",
        )}
      >
        <div className="relative">
          {/* Avatar ring — a permitted stroke: an object, not a separator */}
          <span
            className={cn(
              "allow-border block rounded-full border-[3px] transition-colors duration-200",
              dimmed
                ? "border-transparent"
                : isProp
                  ? "border-proposition"
                  : "border-opposition",
            )}
          >
            {participant?.avatar ? (
              <img
                src={participant.avatar}
                alt=""
                aria-hidden
                className="size-12 rounded-full bg-card object-cover"
              />
            ) : (
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-full text-[length:var(--text-subtitle)] font-extrabold text-white",
                  dimmed
                    ? "bg-muted-foreground/50"
                    : isProp
                      ? "bg-proposition"
                      : "bg-opposition",
                )}
              >
                {participant?.name?.[0] ?? "?"}
              </span>
            )}
          </span>

          {wins && (
            <Crown
              aria-hidden
              className={cn(
                "absolute -top-3 left-1/2 size-5 -translate-x-1/2 drop-shadow-sm",
                isProp ? "text-proposition" : "text-opposition",
              )}
              fill="currentColor"
            />
          )}
        </div>

        <div className="w-full text-center">
          <p
            className={cn(
              "text-[length:var(--text-small)] font-bold",
              dimmed
                ? "text-muted-foreground"
                : isProp
                  ? "text-proposition"
                  : "text-opposition",
            )}
          >
            {getTranslation(t, labelKey)}
          </p>
          <p className="mt-0.5 line-clamp-1 text-[length:var(--text-caption)] font-bold text-foreground">
            {participant?.name ?? "—"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <article
      className="jd-card jd-interactive jd-tint-blue bidi-plaintext group relative flex h-full cursor-pointer flex-col overflow-hidden"
      dir={i18n.dir()}
      onClick={() => {
        navigate({ to: `/debates/${debate.id}` });
      }}
    >
      <div className="flex flex-1 flex-col gap-4 py-6 ps-7 pe-5">
        {/* ── STATE — its own row, unmissable ──────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <Badge size="state" variant={stateStyle.variant as never}>
            <BadgeDot pulse={stateStyle.pulse} />
            {getTranslation(t, `debates.statuses.${debate.status}`)}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-[12px] bg-primary/[0.07] text-muted-foreground transition-colors duration-150 ease-in-out hover:bg-primary/[0.14] hover:text-foreground dark:bg-white/[0.07] dark:hover:bg-white/[0.14]"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={isRTL ? "start" : "end"}
              className="w-[180px]"
            >
              <DropdownMenuLabel>
                {getTranslation(t, "common.labels.actions")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {debate.status === "scheduled" &&
                isDebateAnnouncable(debate.id) && (
                  <DropdownMenuItem
                    className="group gap-2 text-primary focus:bg-primary/10 focus:text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTimeout(() => {
                        const id = dialog.open({
                          title: getTranslation(
                            t,
                            "debates.details.announceLineUp",
                          ),
                          description: getTranslation(
                            t,
                            "debates.details.announceDescription",
                          ),
                          size: "lg",
                          closable: true,
                          children: (
                            <AnnounceForm
                              debateId={debate.id}
                              onSubmit={async (payload) => {
                                onAnnounce({
                                  debateId: debate.id,
                                  payload: payload,
                                });
                              }}
                              onCancel={() => dialog.close(id)}
                            />
                          ),
                        });
                        dialog.close(id);
                      }, 0);
                    }}
                  >
                    <Megaphone className="size-4" />
                    {getTranslation(t, "common.actions.announce")}
                  </DropdownMenuItem>
                )}

              {debate.status === "scheduled" && (
                <DropdownMenuItem
                  className="group gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel?.(debate.id);
                  }}
                >
                  <X className="size-4" />
                  {getTranslation(t, "common.actions.cancel")}
                </DropdownMenuItem>
              )}

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
                <Edit className="size-4" />
                {getTranslation(t, "common.actions.edit")}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="group gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
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
                <Trash className="size-4" />
                {getTranslation(t, "common.actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── Title + motion ───────────────────────────────────────────── */}
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[length:var(--text-subtitle)] font-extrabold text-card-foreground">
            {debate.title}
          </h3>
          {debate.description && (
            <p className="mt-1.5 line-clamp-2 text-[length:var(--text-body)] font-semibold text-muted-foreground">
              {debate.description}
            </p>
          )}
        </div>

        {/* ── Meta chips: format and date. The status is NOT here. ─────── */}
        <div className="flex flex-wrap items-center gap-2">
          {debate.tag && (
            <Badge size="sm" variant="tint-neutral">
              {debate.tag}
            </Badge>
          )}
          {debate.format?.name && (
            <Badge size="sm" variant="tint-neutral">
              <FormatIcon />
              {debate.format.name}
            </Badge>
          )}
          {debate.scheduled_at && (
            <Badge size="sm" variant="tint-neutral">
              <CalendarDays />
              <span className="tabular-nums">
                {new Date(debate.scheduled_at).toLocaleDateString(
                  i18n.language === "ar" ? "ar" : undefined,
                  { day: "numeric", month: "short" },
                )}
              </span>
            </Badge>
          )}
        </div>

        {/* ── The matchup ─────────────────────────────────────────────── */}
        <div className="mt-auto flex items-stretch gap-2.5">
          <Side participant={proposition} side="proposition" wins={propWins} />

          <div className="flex shrink-0 items-center">
            {/* §12.4 One flat neutral disc. It separates two coloured sides,
                so it must not compete with them: no gradient, no brand colour,
                no glow, no ring, no shadow. */}
            <span className="flex size-[38px] items-center justify-center rounded-full bg-[rgba(26,56,104,.07)] text-[length:var(--text-small)] font-extrabold text-muted-foreground ltr:tracking-[.4px] dark:bg-white/[0.07]">
              {getTranslation(t, "debates.card.vs")}
            </span>
          </div>

          <Side participant={opposition} side="opposition" wins={oppWins} />
        </div>

        {/* ── Score split, only when there is a result ─────────────────── */}
        {result && (
          <div className="space-y-1.5">
            <div className="flex h-2 w-full gap-1">
              <span
                className="h-full rounded-full bg-proposition transition-[width] duration-700 ease-out"
                style={{ width: `${percent}%` }}
              />
              <span className="h-full flex-1 rounded-full bg-opposition" />
            </div>
            <div
              dir="ltr"
              className="flex items-center justify-between text-[length:var(--text-small)] font-bold tabular-nums"
            >
              <span className="text-proposition">{percent}%</span>
              <span className="text-opposition">{100 - percent}%</span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

/** Helper to extract participant by side */
function getParticipantBySide(
  debate: Debate,
  side: "proposition" | "opposition",
): DebateCardParticipant | undefined {
  const participant = debate.participants?.find((p) => {
    return (p as any).side === side || (p as any).team?.side === side;
  });

  if (!participant) return undefined;

  return {
    name: participant.user.name,
    side,
    avatar: participant.user.avatar_url,
  };
}
