// components/motion/debate-motion-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import { useFormKey } from "@/hooks/use-form-key";
import { useData } from "@/hooks/api/use-data";
import type { Motion } from "@/types";
import {
  debateMotionFrameworksQueryOptions,
  debateMotionQueryOptions,
} from "@/api/query-options";

interface MotionFormValues {
  text: string;
  frameworks: number[];
}

interface MotionFormProps {
  motion_id?: number;
  defaultValues?: Partial<Motion>;
  onSubmit?: (values: MotionFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export default function DebateMotionForm({
  motion_id,
  defaultValues,
  onSubmit,
  onCancel,
}: MotionFormProps) {
  const { t, i18n } = useTranslation();

  const isEdit = !!motion_id;

  const { data: motion, isLoading } = useData<Motion>(
    debateMotionQueryOptions(motion_id ?? 0),
    { enabled: isEdit },
  );

  const formKey = useFormKey(motion);

  const formDefaultValues: MotionFormValues = {
    text: motion?.text ?? defaultValues?.text ?? "",
    frameworks:
      motion?.frameworks?.map((f) => f.id) ?? defaultValues?.frameworks ?? [],
  };

  const textField: FieldConfig<MotionFormValues> = {
    name: "text",
    label: getTranslation(t, "debateMotions.form.fields.text"),
    type: "textarea",
    rows: 6,
    placeholder: getTranslation(t, "debateMotions.form.fields.textPlaceholder"),
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debateMotions.validation.textRequired")
          : value.trim().length < 10
            ? getTranslation(t, "debateMotions.validation.textTooShort")
            : undefined,
      onSubmit: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debateMotions.validation.textRequired")
          : undefined,
    },
  };

  const frameworksField: FieldConfig<MotionFormValues> = {
    name: "frameworks",
    label: getTranslation(t, "debateMotions.form.fields.frameworks"),
    type: "multi-select",

    queryOptions: debateMotionFrameworksQueryOptions,
    getOptionLabel: (item) => item.name,
    getOptionValue: (item) => item.id,

    validators: {
      onChange: ({ value }) =>
        !value || value.length === 0
          ? getTranslation(t, "debateMotions.validation.frameworksRequired")
          : undefined,
    },
  };

  const formRows: FormRow<MotionFormValues>[] = [
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {getTranslation(t, "debateMotions.form.sections.info")}
          </p>
          <Separator />
        </div>
      ),
    },

    {
      kind: "fields",
      columns: 1,
      fields: [textField],
    },

    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {getTranslation(t, "debateMotions.form.sections.frameworks")}
          </p>
          <Separator />
        </div>
      ),
    },

    {
      kind: "fields",
      columns: 1,
      fields: [frameworksField],
    },
  ];

  const handleSubmit = async (values: MotionFormValues) => {
    const payload = {
      text: values.text,
      framework_ids: values.frameworks,
    };
    await onSubmit?.(payload);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm">
          <Spinner />
        </div>
      )}

      <div className="flex flex-col gap-4" dir={i18n.dir()}>
        <DynamicForm
          key={formKey}
          rows={formRows}
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
          formId="motion-dynamic-form"
          showSubmitButton={false}
        />

        <div className="flex w-full items-center gap-3 pt-2">
          <Button
            type="submit"
            form="motion-dynamic-form"
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
    </div>
  );
}
