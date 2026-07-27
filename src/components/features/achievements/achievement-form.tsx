"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { ACHIEVEMENT_TYPES } from "@/types";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import type { AchievementCatalog } from "@/types";

interface AchievementFormValues {
  name: string;
  type: string;
  image: string | any;
}

interface AchievementFormProps {
  catalog?: AchievementCatalog;
  onSubmit?: (values: {
    name: string;
    type: string;
    image: File | string | null;
  }) => Promise<void> | void;
  onCancel?: () => void;
}

export default function AchievementForm({
  catalog,
  onSubmit,
  onCancel,
}: AchievementFormProps) {
  const { t } = useTranslation();

  const formDefaultValues: AchievementFormValues = {
    name: catalog?.name ?? "",
    type: catalog?.type ?? "",
    image: "",
  };

  const nameField: FieldConfig<AchievementFormValues> = {
    name: "name",
    label: `${getTranslation(t, "achievements.form.fields.name")} *`,
    type: "text",
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "achievements.validation.nameRequired")
          : undefined,
    },
  };

  const typeField: FieldConfig<AchievementFormValues> = {
    name: "type",
    label: `${getTranslation(t, "achievements.form.fields.type")} *`,
    type: "select",
    options: () =>
      ACHIEVEMENT_TYPES.map((r) => ({
        label: getTranslation(t, r.label),
        value: r.value,
      })),
    validators: {
      onChange: ({ value }) =>
        !value
          ? getTranslation(t, "achievements.validation.typeRequired")
          : undefined,
    },
  };

  const imageField: FieldConfig<AchievementFormValues> = {
    name: "image",
    label: getTranslation(t, "achievements.form.fields.image"),
    type: "file",
    accept: "image/*",
    initialUrl: catalog?.image_url ?? undefined,
    initialName: catalog?.name ?? undefined,
  };

  const formRows: FormRow<AchievementFormValues>[] = [
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {getTranslation(t, "achievements.form.sections.details")}
          </p>
          <Separator />
        </div>
      ),
    },
    {
      kind: "fields",
      columns: 2,
      fields: [nameField, typeField],
    },
    {
      kind: "fields",
      columns: 1,
      fields: [imageField],
    },
  ];

  const handleSubmit = async (values: AchievementFormValues) => {
    const image =
      values.image?.file instanceof File
        ? values.image.file
        : values.image?.cleared
          ? ""
          : (catalog?.image_url ?? "");
    await onSubmit?.({
      name: values.name.trim(),
      type: values.type,
      image,
    });
  };

  return (
    <div>
      <DynamicForm<AchievementFormValues>
        rows={formRows}
        defaultValues={formDefaultValues}
        onSubmit={handleSubmit}
        formId="achievement-form"
        showSubmitButton={false}
      />
      <div className="flex w-full items-center gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={onCancel}
          >
            {getTranslation(t, "common.actions.cancel")}
          </Button>
        )}
        <Button
          type="button"
          className="flex-1 bg-accent hover:bg-accent/80"
          onClick={() => {
            (
              document.getElementById("achievement-form") as HTMLFormElement
            )?.requestSubmit();
          }}
        >
          {catalog
            ? getTranslation(t, "common.actions.save")
            : getTranslation(t, "achievements.actions.create")}
        </Button>
      </div>
    </div>
  );
}
