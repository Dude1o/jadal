import { useTranslation } from "react-i18next";
import {
  LayoutGrid,
  Table as TableIcon,
  Languages,
  Moon,
  Sun,
  Monitor,
  Settings2,
  CheckCircle2,
  Palette,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTranslation } from "@/lib/utils";
import { useSettingsStore } from "@/store/use-settings-store";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { view, setView, language, setLanguage, theme, setTheme } =
    useSettingsStore();

  const handleLanguageChange = (lang: "en" | "ar") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="container max-w-4xl py-16 px-6 space-y-10 animate-fade-in-up">
      {/* Header with Navy to Ember Gradient */}
      <div className="space-y-2">
        <h1 className="text-gradient leading-tight">
          {getTranslation(t, "settings.title")}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {getTranslation(t, "settings.description")}
        </p>
      </div>

      <div className="grid gap-8">
        {/* Preference Section */}
        <Card className="glass shadow-lg border-none overflow-hidden">
          <div className="h-1.5 w-full animate-gradient-trio" />{" "}
          {/* Top animated bar */}
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Settings2 className="h-5 w-5 text-accent" />
              {getTranslation(t, "settings.appearance.title")}
            </CardTitle>
            <CardDescription>
              {getTranslation(t, "settings.appearance.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-0 divide-y divide-border/50">
            {/* 1. Page View Preference */}
            <div className="group flex flex-col md:flex-row md:items-center justify-between py-6 gap-4">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {getTranslation(t, "settings.view.title")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {getTranslation(t, "settings.view.description")}
                </p>
              </div>
              <Tabs
                value={view}
                onValueChange={(v) => setView(v as "cards" | "table")}
                className="w-full md:w-[260px]"
              >
                <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 border border-border">
                  <TabsTrigger
                    value="cards"
                    className="gap-2 data-[state=active]:glow-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    {getTranslation(t, "navigation.view.cards")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="table"
                    className="gap-2 data-[state=active]:glow-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <TableIcon className="h-4 w-4" />
                    {getTranslation(t, "navigation.view.table")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* 2. Language Selection */}
            <div className="group flex flex-col md:flex-row md:items-center justify-between py-6 gap-4">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground group-hover:text-jade transition-colors">
                  {getTranslation(t, "settings.language.title")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {getTranslation(t, "settings.language.description")}
                </p>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full md:w-[260px] border-border hover:border-jade focus:ring-jade/30 transition-all">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-jade" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem
                    value="en"
                    className="focus:bg-jade-muted focus:text-jade-dark font-medium"
                  >
                    {getTranslation(t, "settings.language.en")}</SelectItem>
                  <SelectItem
                    value="ar"
                    className="focus:bg-jade-muted focus:text-jade-dark font-medium"
                  >
                    {getTranslation(t, "settings.language.ar")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Theme Selection */}
            <div className="group flex flex-col md:flex-row md:items-center justify-between py-6 gap-4">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                  {getTranslation(t, "settings.theme.title")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {getTranslation(t, "settings.theme.description")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "light", icon: Sun, label: "settings.theme.light" },
                  { id: "dark", icon: Moon, label: "settings.theme.dark" },
                  { id: "system", icon: Monitor, label: "settings.theme.system" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id as any)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-md border transition-all duration-200
                      ${
                        theme === item.id
                          ? "bg-accent/10 border-accent text-accent glow-accent"
                          : "bg-card border-border hover:border-accent/50 text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <item.icon
                      className={`h-4 w-4 ${theme === item.id ? "animate-pulse" : ""}`}
                    />
                    <span className="text-xs uppercase tracking-wider">
                      {getTranslation(t, item.label)}
                    </span>
                    {theme === item.id && (
                      <CheckCircle2 className="h-3 w-3 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
