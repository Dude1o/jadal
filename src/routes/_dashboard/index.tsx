import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock, ClipboardList } from "lucide-react";
import {
  debatesQueryOptions,
  platformHealthStatisticsQueryOptions,
  surveysQueryOptions,
} from "@/api/query-options";
import { StatisticCard } from "@/components/features/statistics/statistic-card";
import { StatisticGridSkeleton } from "@/components/features/statistics/statistic-card-skeleton";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroBanner } from "@/components/common/hero-banner";
import { SectionHeader } from "@/components/common/section-header";
import { entityIcons } from "@/lib/entity-icons";
import getTime, {
  getTranslation,
  platformHealthToStatistics,
} from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";


export const Route = createFileRoute("/_dashboard/")({
  component: RouteComponent,
});

const statusTone: Record<string, string> = {
  live: "solid-destructive",
  scheduled: "tint",
  announced: "solid-accent",
  "teams-selected": "tint",
  completed: "tint-success",
  cancelled: "tint-neutral",
};

/* ── Latest debates ───────────────────────────────────────────────────────── */

function LatestDebates() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(debatesQueryOptions({ perPage: 5 }));
  const debates = data?.data?.slice(0, 4) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-[20px]" />
        ))}
      </div>
    );
  }

  if (debates.length === 0) {
    return (
      <div className="jd-card jd-tint-deep flex items-center justify-center px-4 py-14 text-center text-[length:var(--text-body)] font-semibold text-muted-foreground">
        {getTranslation(t, "home.noDebates")}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {debates.map((debate, i) => (
        <Link
          key={debate.id}
          to="/debates/$debateId"
          params={{ debateId: String(debate.id) }}
          style={{ "--jd-i": i } as React.CSSProperties}
          className="jd-card jd-interactive jd-tint-deep jd-enter bidi-plaintext relative flex items-center gap-4 py-4 ps-6 pe-5"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-[length:var(--text-body)] font-bold text-foreground">
              {debate.title}
            </p>
            <p className="mt-1 flex items-center gap-1.5 truncate text-[length:var(--text-caption)] font-semibold text-muted-foreground">
              <CalendarClock className="size-3.5 shrink-0" />
              {debate.scheduled_at
                ? getTime(debate.scheduled_at)
                : (debate.format?.name ?? "—")}
            </p>
          </div>

          <Badge
            variant={
              (statusTone[debate.status] as never) ?? ("tint-neutral" as never)
            }
            className="shrink-0"
          >
            <BadgeDot pulse={debate.status === "live"} />
            {getTranslation(t, `debates.statuses.${debate.status}`)}
          </Badge>
        </Link>
      ))}
    </div>
  );
}

/* ── Latest survey ────────────────────────────────────────────────────────── */

function LatestSurvey() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(surveysQueryOptions({}));
  const survey = data?.data?.[0];

  if (isLoading) return <Skeleton className="h-52 w-full rounded-[28px]" />;

  if (!survey) {
    return (
      <div className="jd-card jd-tint-blue flex items-center justify-center px-4 py-14 text-center text-[length:var(--text-body)] font-semibold text-muted-foreground">
        {getTranslation(t, "home.noSurvey")}
      </div>
    );
  }

  const questionCount = survey.questions?.length ?? 0;

  return (
    <Link
      to="/surveys/$surveyId"
      params={{ surveyId: String(survey.id) }}
      className="jd-card jd-interactive jd-tint-blue relative block py-6 ps-7 pe-6"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-[length:var(--text-subtitle)] font-extrabold text-foreground">
          {survey.title}
        </h3>
        <Badge
          size="sm"
          variant={survey.is_closed ? "tint-neutral" : "tint-success"}
          className="shrink-0"
        >
          {getTranslation(t, survey.is_closed ? "home.closed" : "home.open")}
        </Badge>
      </div>

      {survey.description && (
        <p className="mt-2 line-clamp-3 text-[length:var(--text-body)] font-semibold text-muted-foreground">
          {survey.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {questionCount > 0 && (
          <Badge size="sm" variant="tint-neutral">
            <ClipboardList />
            {getTranslation(t, "home.questionsCount", {
              count: questionCount,
            })}
          </Badge>
        )}
        {survey.created_at && (
          <Badge size="sm" variant="tint-neutral">
            <CalendarClock />
            {getTime(survey.created_at)}
          </Badge>
        )}
      </div>
    </Link>
  );
}

/* ── Screen ───────────────────────────────────────────────────────────────── */

function RouteComponent() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const platformHealth = useQuery(
    platformHealthStatisticsQueryOptions({ group_by: "month", series: "none" }),
  );

  // Reuse the Statistics transform so Home never drifts from that screen.
  const stats = platformHealth.data
    ? platformHealthToStatistics(platformHealth.data, t).slice(0, 4)
    : [];
  const sectionMax = stats.reduce((max, s) => Math.max(max, s.value), 0);

  const HomeIcon = entityIcons.home.outline;
  const DebateIcon = entityIcons.debates.outline;
  const StatsIcon = entityIcons.statistics.outline;
  const SurveyIcon = entityIcons.surveys.outline;

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-8">
      {/* The one --grad-brand surface on this screen. */}
      <HeroBanner
        eyebrow={getTranslation(t, "home.title")}
        title={
          user?.name
            ? getTranslation(t, "home.greeting", { name: user.name })
            : getTranslation(t, "home.title")
        }
        description={getTranslation(t, "home.subtitle")}
        icon={<HomeIcon />}
      />

      {/* Cool section */}
      <section className="space-y-5">
        <SectionHeader
          title={getTranslation(t, "home.keyStatistics")}
          subtitle={getTranslation(t, "home.keyStatisticsSubtitle")}
          icon={<StatsIcon />}
          tone="blue"
          action={{
            label: getTranslation(t, "home.viewAll"),
            to: "/statistics",
            search: { tab: "platform-health" },
          }}
        />

        {platformHealth.isLoading ? (
          <StatisticGridSkeleton />
        ) : stats.length === 0 ? (
          <div className="jd-card jd-tint-blue flex items-center justify-center px-4 py-14 text-center text-[length:var(--text-body)] font-semibold text-muted-foreground">
            {getTranslation(t, "statistics.noActivity")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, i) => (
              <StatisticCard
                key={stat.id}
                stat={stat}
                sectionMax={sectionMax}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      {/* Neutral + cool pair */}
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-5">
          <SectionHeader
            title={getTranslation(t, "home.latestDebates")}
            subtitle={getTranslation(t, "home.latestDebatesSubtitle")}
            icon={<DebateIcon />}
            tone="deep"
            action={{
              label: getTranslation(t, "home.viewAll"),
              to: "/debates",
            }}
          />
          <LatestDebates />
        </section>

        <section className="space-y-5">
          <SectionHeader
            title={getTranslation(t, "home.latestSurvey")}
            subtitle={getTranslation(t, "home.latestSurveySubtitle")}
            icon={<SurveyIcon />}
            tone="blue"
            action={{
              label: getTranslation(t, "home.viewAll"),
              to: "/surveys",
            }}
          />
          <LatestSurvey />
        </section>
      </div>
    </div>
  );
}
