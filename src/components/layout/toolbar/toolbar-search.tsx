import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ToolbarSearchProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
}

export function ToolbarSearch({ title, value, onChange }: ToolbarSearchProps) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

      <Input
        placeholder={`${getTranslation(t, "toolbar.search")} ${title}...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 border-2 border-secondary"
      />
    </div>
  );
}
