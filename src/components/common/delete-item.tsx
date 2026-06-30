import { Trash2 } from "lucide-react";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface DeleteItemProps {
  itemName?: string;
  description?: string;
  gender: "male" | "female";
  onDelete: () => void | Promise<void>;
  onCancel?: () => void;
}

export default function DeleteItem({
  itemName,
  description,
  gender = "male",
  onDelete,
  onCancel,
}: DeleteItemProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10">
        <Trash2 className="h-5 w-5 text-destructive" />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {description ??
          (itemName
            ? getTranslation(
                t,
                gender === "male"
                  ? "common.delete.confirmNamed"
                  : "common.delete.confirmNamedFemale",
                {
                  name: itemName,
                },
              )
            : getTranslation(t, "common.delete.confirm"))}
      </p>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>
          {getTranslation(t, "common.actions.cancel")}
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          {getTranslation(t, "common.actions.delete")}
        </Button>
      </div>
    </div>
  );
}
