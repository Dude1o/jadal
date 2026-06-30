import { Computer, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/store/use-settings-store";

export function ModeToggle() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useSettingsStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
          {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
          {theme === "system" && <Computer className="h-[1.2rem] w-[1.2rem]" />}
          <span className="sr-only">{t("settings.theme.toggle")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} dir={i18n.dir()}>
          <Sun className="h-[1.2rem] w-[1.2rem]" />
          {t("settings.theme.light")} {theme === "light"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")} dir={i18n.dir()}>
          <Moon className="h-[1.2rem] w-[1.2rem]" />
          {t("settings.theme.dark")} {theme === "dark"}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")} dir={i18n.dir()}>
          <Computer className="h-[1.2rem] w-[1.2rem]" />
          {t("settings.theme.system")} {theme === "system"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
