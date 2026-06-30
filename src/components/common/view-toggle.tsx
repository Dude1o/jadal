import { IdCard, Table } from "lucide-react";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

type View = "cards" | "table";

interface ViewToggleProps {
  theView: View;
  setView: (view: View) => void;
}

export default function ViewToggle({ theView, setView }: ViewToggleProps) {
  const { t, i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {theView === "cards" ? (
            <IdCard className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Table className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">{getTranslation(t, "navigation.view.toggle")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setView("cards")} dir={i18n.dir()}>
          <IdCard className="h-[1.2rem] w-[1.2rem]" />
          {getTranslation(t, "navigation.view.cards")}{" "}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setView("table")} dir={i18n.dir()}>
          <Table className="h-[1.2rem] w-[1.2rem]" />
          {getTranslation(t, "navigation.view.table")}{" "}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
