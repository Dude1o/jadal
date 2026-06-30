"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import type { MotionFramework } from "@/types";

interface MotionFrameworkFormValues {
  name: string;
  color_hex: string;
}

interface MotionFrameworkFormProps {
  name?: string;
  color_hex?: string;
  onSubmit?: (values: MotionFrameworkFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export default function DebateMotionFrameworkForm({
  name = "",
  color_hex = "#000000",
  onSubmit,
  onCancel,
}: MotionFrameworkFormProps) {
  const { t, i18n } = useTranslation();

  const formDefaultValues: MotionFrameworkFormValues = {
    name,
    color_hex,
  };

  const nameField: FieldConfig<MotionFrameworkFormValues> = {
    name: "name",
    label: getTranslation(t, "debateMotionFrameworks.form.fields.name"),
    type: "text",
    placeholder: getTranslation(
      t,
      "debateMotionFrameworks.form.fields.namePlaceholder",
    ),
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debateMotionFrameworks.validation.nameRequired")
          : value.trim().length < 3
            ? getTranslation(
                t,
                "debateMotionFrameworks.validation.nameTooShort",
              )
            : undefined,
      onSubmit: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debateMotionFrameworks.validation.nameRequired")
          : undefined,
    },
  };

  const colorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;

  const colorField: FieldConfig<MotionFrameworkFormValues> = {
    name: "color_hex",
    label: getTranslation(t, "debateMotionFrameworks.form.fields.color"),
    type: "color",
    placeholder: getTranslation(
      t,
      "debateMotionFrameworks.form.fields.colorPlaceholder",
    ),
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debateMotionFrameworks.validation.colorRequired")
          : !colorRegex.test(value.trim())
            ? getTranslation(
                t,
                "debateMotionFrameworks.validation.colorInvalid",
              )
            : undefined,

      onSubmit: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debateMotionFrameworks.validation.colorRequired")
          : !colorRegex.test(value.trim())
            ? getTranslation(
                t,
                "debateMotionFrameworks.validation.colorInvalid",
              )
            : undefined,
    },
  };

  const formRows: FormRow<MotionFrameworkFormValues>[] = [
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {getTranslation(t, "debateMotionFrameworks.form.sections.info")}
          </p>
          <Separator />
        </div>
      ),
    },

    {
      kind: "fields",
      columns: 1,
      fields: [nameField],
    },

    {
      kind: "fields",
      columns: 1,
      fields: [colorField],
    },
  ];

  const handleSubmit = async (values: MotionFrameworkFormValues) => {
    const payload = {
      name: values.name.trim(),
      color_hex: values.color_hex.trim(),
    };
    await onSubmit?.(payload);
  };

  return (
    <div className="flex flex-col gap-4" dir={i18n.dir()}>
      <DynamicForm
        rows={formRows}
        defaultValues={formDefaultValues}
        onSubmit={handleSubmit}
        formId="motion-framework-dynamic-form"
        showSubmitButton={false}
      />

      <div className="flex w-full items-center gap-3 pt-2">
        <Button
          type="submit"
          form="motion-framework-dynamic-form"
          className="flex-1 bg-accent hover:bg-accent/80"
        >
          {getTranslation(t, "common.actions.save")}
        </Button>

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
      </div>
    </div>
  );
}
