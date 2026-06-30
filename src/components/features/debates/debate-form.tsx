import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { DEBATE_STATUSES } from "@/lib/constants";
import type { Debate, DebateFormat, DebateStatus, Motion } from "@/types";
import {
  debateFormatsQueryOptions,
  debateMotionsQueryOptions,
  debateQueryOptions,
} from "@/api/query-options";
import { useData } from "@/hooks/api/use-data";
import { Spinner } from "@/components/ui/spinner";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import { useFormKey } from "@/hooks/use-form-key";

interface DebateFormValues {
  title: string;
  tag: string;
  description: string;
  status: DebateStatus;
  format_id: number;
  motion_id: number;
  scheduled_at: string;
}

interface DebateFormProps {
  debate_id?: number;
  defaultValues?: Partial<Debate>;
  onSubmit?: (values: Debate) => Promise<void> | void;
  onCancel?: () => void;
}

export default function DebateForm({
  debate_id,
  defaultValues,
  onSubmit,
  onCancel,
}: DebateFormProps) {
  const { data: debate, isLoading: debateLoading } = useData<Debate>(
    debateQueryOptions(debate_id ?? 0),
  );
  const { t, i18n } = useTranslation();
  const formKey = useFormKey(debate);

  // Prepare default values for DynamicForm
  const formDefaultValues: DebateFormValues = {
    title: debate?.title ?? defaultValues?.title ?? "",
    tag: debate?.tag ?? defaultValues?.tag ?? "",
    description: debate?.description ?? defaultValues?.description ?? "",
    status: (debate?.status ??
      defaultValues?.status ??
      "scheduled") as DebateStatus,
    format_id: debate?.format?.id ?? defaultValues?.format?.id ?? 0,
    motion_id: debate?.motion.id ?? defaultValues?.motion?.id ?? 0,
    scheduled_at: debate?.scheduled_at ?? defaultValues?.scheduled_at ?? "",
  };

  // Field configurations
  const titleField: FieldConfig<DebateFormValues> = {
    name: "title",
    label: `${getTranslation(t, "debates.form.fields.title")} *`,
    type: "textarea",
    rows: 2,
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debates.validation.titleRequired")
          : value.trim().length < 3
            ? getTranslation(t, "debates.validation.titleTooShort")
            : undefined,
      onSubmit: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debates.validation.titleRequired")
          : undefined,
    },
  };

  const tagField: FieldConfig<DebateFormValues> = {
    name: "tag",
    label: `${getTranslation(t, "debates.form.fields.tag")} *`,
    type: "text",
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debates.validation.tagRequired")
          : undefined,
      onSubmit: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debates.validation.tagRequired")
          : undefined,
    },
  };

  const formatIdField: FieldConfig<DebateFormValues> = {
    name: "format_id",
    label: `${getTranslation(t, "debates.form.fields.format")} *`,
    type: "async-select",
    queryOptions: debateFormatsQueryOptions, // ← fetch function
    getOptionLabel: (df: DebateFormat) => df.name, // ← what the user sees
    getOptionValue: (df: DebateFormat) => df.id, // ← number, matches form state
    validators: {
      onChange: ({ value }) =>
        !value || value <= 0
          ? getTranslation(t, "debates.validation.formatRequired")
          : undefined,
      onSubmit: ({ value }) =>
        !value || value <= 0
          ? getTranslation(t, "debates.validation.formatRequired")
          : undefined,
    },
  };

  const motionIdField: FieldConfig<DebateFormValues> = {
    name: "motion_id",
    label: `${getTranslation(t, "debates.form.fields.motion")} *`,
    type: "async-select",
    queryOptions: debateMotionsQueryOptions, // ← you need to create/import this
    getOptionLabel: (dm: Motion) => dm.text,
    getOptionValue: (dm: Motion) => dm.id, // ← number, matches form state
    validators: {
      onChange: ({ value }) =>
        !value || value <= 0
          ? getTranslation(t, "debates.validation.motionRequired")
          : undefined,
      onSubmit: ({ value }) =>
        !value || value <= 0
          ? getTranslation(t, "debates.validation.motionRequired")
          : undefined,
    },
  };

  const descriptionField: FieldConfig<DebateFormValues> = {
    name: "description",
    label: getTranslation(t, "debates.form.fields.description"),
    type: "textarea",
    rows: 3,
  };

  const scheduledAtField: FieldConfig<DebateFormValues> = {
    name: "scheduled_at",
    label: `${getTranslation(t, "debates.form.fields.scheduledAt")} *`,
    type: "date",
    validators: {
      onChange: ({ value }) =>
        !value
          ? getTranslation(t, "debates.validation.scheduledAtRequired")
          : undefined,
      onSubmit: ({ value }) =>
        !value
          ? getTranslation(t, "debates.validation.scheduledAtRequired")
          : undefined,
    },
  };

  const statusField: FieldConfig<DebateFormValues> = {
    name: "status",
    label: `${getTranslation(t, "common.labels.status")} *`,
    type: "select",
    options: () =>
      DEBATE_STATUSES.map((s) => ({
        label: getTranslation(t, s.label),
        value: s.value,
      })),
    validators: {
      onSubmit: ({ value }) =>
        !value
          ? getTranslation(t, "debates.validation.statusRequired")
          : undefined,
    },
  };

  // Define layout rows (sections + field rows)
  const formRows: FormRow<DebateFormValues>[] = [
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {getTranslation(t, "debates.form.sections.info")}
          </p>
          <Separator />
        </div>
      ),
    },
    {
      kind: "fields",
      columns: 1,
      fields: [titleField],
    },
    {
      kind: "fields",
      columns: 3,
      fields: [tagField, formatIdField],
    },
    {
      kind: "fields",
      columns: 1,
      fields: [motionIdField],
    },
    {
      kind: "fields",
      columns: 1,
      fields: [descriptionField],
    },
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {getTranslation(t, "debates.form.sections.scheduleAndStatus")}
          </p>
          <Separator />
        </div>
      ),
    },
    {
      kind: "fields",
      columns: 2,
      fields: [scheduledAtField, statusField],
    },
  ];

  // Submit handler (no transformation needed – values already match API type)
  const handleSubmit = async (values: DebateFormValues) => {
    await onSubmit?.(values);
  };

  return (
    <div className="relative">
      {debateLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm bg-background/50">
          <Spinner />
        </div>
      )}
      <div className="flex flex-col gap-4" dir={i18n.dir()}>
        <DynamicForm
          key={formKey}
          rows={formRows}
          defaultValues={formDefaultValues}
          onSubmit={handleSubmit}
          formId="debate-dynamic-form"
          showSubmitButton={false}
        />

        <div className="flex w-full items-center gap-3 pt-2">
          <Button
            type="submit"
            form="debate-dynamic-form"
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
