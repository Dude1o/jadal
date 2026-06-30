import { LogOut } from "lucide-react";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface LogoutProps {
  error?: string;
}

export default function Logout({ error }: LogoutProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10">
        <LogOut className="h-5 w-5 text-destructive" />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {getTranslation(t, "auth.logout.confirmDescription")}
      </p>

      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  );
}
