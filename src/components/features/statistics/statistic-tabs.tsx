import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scale, Trophy, Activity, HeartPulse, ShieldAlert } from "lucide-react";

type StatTab =
  | "framework-fairness"
  | "leaderboard"
  | "platform-health"
  | "engagement-churn"
  | "complaint-accountability";

const TAB_DEFS: { value: StatTab; icon: typeof Scale; labelKey: string }[] = [
  {
    value: "framework-fairness",
    icon: Scale,
    labelKey: "statistics.tabs.frameworkFairness",
  },
  {
    value: "leaderboard",
    icon: Trophy,
    labelKey: "statistics.tabs.leaderboard",
  },
  {
    value: "platform-health",
    icon: Activity,
    labelKey: "statistics.tabs.platformHealth",
  },
  {
    value: "engagement-churn",
    icon: HeartPulse,
    labelKey: "statistics.tabs.engagementChurn",
  },
  {
    value: "complaint-accountability",
    icon: ShieldAlert,
    labelKey: "statistics.tabs.complaintAccountability",
  },
];

interface StatisticTabsProps {
  activeTab: StatTab;
  onTabChange: (tab: StatTab) => void;
}

export function StatisticTabs({ activeTab, onTabChange }: StatisticTabsProps) {
  const { t } = useTranslation();
  const activeDef = TAB_DEFS.find((tab) => tab.value === activeTab);
  const ActiveIcon = activeDef?.icon;

  return (
    <>
      {/* Mobile: dropdown select */}
      <div className="xl:hidden">
        <Select
          value={activeTab}
          onValueChange={(v) => onTabChange(v as StatTab)}
        >
          <SelectTrigger className="w-full">
            <div className="flex items-center gap-2">
              {ActiveIcon && <ActiveIcon className="h-4 w-4 shrink-0" />}
              <SelectValue>
                {activeDef ? getTranslation(t, activeDef.labelKey) : undefined}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            {TAB_DEFS.map((tab) => {
              const Icon = tab.icon;
              return (
                <SelectItem key={tab.value} value={tab.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{getTranslation(t, tab.labelKey)}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop/tablet: pill tabs */}
      <div className="hidden xl:block">
        <Tabs
          value={activeTab}
          onValueChange={(v) => onTabChange(v as StatTab)}
        >
          <TabsList className="w-full flex-wrap h-auto">
            {TAB_DEFS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 min-w-[100px] sm:min-w-[130px]"
                >
                  <Icon />
                  <span>{getTranslation(t, tab.labelKey)}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>
    </>
  );
}
