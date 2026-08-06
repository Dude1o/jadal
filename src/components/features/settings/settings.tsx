import { useTranslation } from "react-i18next";
import {
  LayoutGrid,
  Table as TableIcon,
  Languages,
  Moon,
  Sun,
  Monitor,
  CheckCircle2,
  Mail,
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
import { getTranslation } from "@/lib/utils";
import { useSettingsStore } from "@/store/use-settings-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useNavigate } from "@tanstack/react-router";

export default function Settings() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { view, setView, language, setLanguage, theme, setTheme } =
    useSettingsStore();

  const handleLanguageChange = (lang: "en" | "ar") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const user = useAuthStore.getState().user;

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
              <Mail className="h-5 w-5 text-accent" />
              {getTranslation(t, "auth.login.email")}
            </CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0 ">
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
              {/* §23 — the same segmented pill row as the theme selector
                  below. No underline, no orange indicator bar: this is a
                  settings row and should be the least interesting thing on
                  the screen while still being obvious. */}
              <div className="flex flex-wrap gap-2">
                {[
                  {
                    id: "cards",
                    icon: LayoutGrid,
                    label: "navigation.view.cards",
                  },
                  {
                    id: "table",
                    icon: TableIcon,
                    label: "navigation.view.table",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      navigate({
                        search: (prev) => ({ ...prev, view: item.id }),
                      });
                      setView(item.id as "cards" | "table");
                    }}
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[length:var(--text-caption)] font-bold transition-all duration-200 ${
                      view === item.id
                        ? "bg-[var(--accent-btn)] text-[var(--accent-btn-fg)] shadow-[0_2px_8px_-3px_rgba(245,154,74,.5)]"
                        : "bg-[var(--inset)] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="block size-4 shrink-0" />
                    <span>{getTranslation(t, item.label)}</span>
                    {view === item.id && (
                      <CheckCircle2 className="block size-3.5 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Language Selection */}
            <div className="group flex flex-col md:flex-row md:items-center justify-between py-6 gap-4">
              <div className="space-y-1">
                <Label className="text-base font-bold text-foreground transition-colors">
                  {getTranslation(t, "settings.language.title")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {getTranslation(t, "settings.language.description")}
                </p>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="jd-field h-[46px] w-full px-4 md:w-[260px]">
                  <div className="flex items-center gap-2">
                    <Languages className="block size-4 shrink-0 text-muted-foreground" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en" className="font-semibold">
                    {getTranslation(t, "settings.language.en")}
                  </SelectItem>
                  <SelectItem value="ar" className="font-semibold">
                    {getTranslation(t, "settings.language.ar")}
                  </SelectItem>
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
                  {
                    id: "system",
                    icon: Monitor,
                    label: "settings.theme.system",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTheme(item.id as any)}
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-[length:var(--text-caption)] font-bold transition-all duration-200 ${
                      theme === item.id
                        ? "bg-[var(--accent-btn)] text-[var(--accent-btn-fg)] shadow-[0_2px_8px_-3px_rgba(245,154,74,.5)]"
                        : "bg-[var(--inset)] text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="block size-4 shrink-0" />
                    <span>{getTranslation(t, item.label)}</span>
                    {theme === item.id && (
                      <CheckCircle2 className="block size-3.5 shrink-0" />
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
