import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useSettingsStore } from "@/store/use-settings-store";

export function LangToggle() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useSettingsStore();

  const handleChange = (lang: "en" | "ar") => {
    setLanguage(lang); // persist + dir update
    i18n.changeLanguage(lang); // sync i18n
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("settings.language.toggle")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleChange("en")}>
          {t("settings.language.en")} {language === "en" && "✓"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange("ar")}>
          {t("settings.language.ar")} {language === "ar" && "✓"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
