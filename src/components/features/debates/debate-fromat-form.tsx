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
import { debateFormatQueryOptions } from "@/api/query-options";
import type { DebateFormat } from "@/types";
import { DEBATE_PHASE_ROLE } from "@/lib/constants";

interface DebateFormatFormValues {
  name: string;
  description: string;

  phase_config: Array<{
    name: string;
    duration_seconds: number;
    role: "proposition" | "opposition" | "judge";
    order_index: number;
  }>;
}

interface DebateFormatFormProps {
  debate_format_id?: number;
  defaultValues?: Partial<DebateFormat>;
  onSubmit?: (values: DebateFormatFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export default function DebateFormatForm({
  debate_format_id,
  defaultValues,
  onSubmit,
  onCancel,
}: DebateFormatFormProps) {
  const { t, i18n } = useTranslation();

  const isEdit = !!debate_format_id;

  const { data: debateFormat, isLoading } = useData<DebateFormat>(
    debateFormatQueryOptions(debate_format_id ?? 0),
    {
      enabled: isEdit,
    },
  );

  const formKey = useFormKey(debateFormat);

  // ✅ phase_config is now directly an array
  const normalizePhases = (phaseConfig: any) => {
    if (!Array.isArray(phaseConfig)) return [];

    return phaseConfig.map((p: any) => ({
      name: p.name ?? "",
      duration_seconds: p.duration_seconds ?? p.duration ?? 300,
      role: p.role ?? p.side ?? "proposition",
      order_index: p.order_index ?? 0,
    }));
  };

  const formDefaultValues: DebateFormatFormValues = {
    name: debateFormat?.name ?? defaultValues?.name ?? "",
    description: debateFormat?.description ?? defaultValues?.description ?? "",

    phase_config:
      normalizePhases(debateFormat?.phase_config) ||
      normalizePhases(defaultValues?.phase_config) ||
      [],
  };

  const nameField: FieldConfig<DebateFormatFormValues> = {
    name: "name",
    label: `${getTranslation(t, "debateFormats.form.fields.name")} *`,
    type: "text",

    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debateFormats.validation.nameRequired")
          : value.trim().length < 3
            ? getTranslation(t, "debateFormats.validation.nameTooShort")
            : undefined,

      onSubmit: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "debateFormats.validation.nameRequired")
          : undefined,
    },
  };

  const descriptionField: FieldConfig<DebateFormatFormValues> = {
    name: "description",
    label: getTranslation(t, "debateFormats.form.fields.description"),
    type: "textarea",
    rows: 3,
  };

  const phaseConfigField: FieldConfig<DebateFormatFormValues> = {
    name: "phase_config",
    label: getTranslation(t, "debateFormats.form.fields.phases"),
    type: "array",

    arrayFields: [
      {
        name: "name",
        label: getTranslation(t, "debateFormats.fields.phaseName"),
        type: "text",
        placeholder: getTranslation(t, "debateFormats.form.phaseNamePlaceholder"),

        validators: {
          onChange: ({ value }) =>
            !value?.trim()
              ? getTranslation(t, "debateFormats.validation.phaseNameRequired")
              : undefined,
        },
      },

      {
        name: "duration_seconds",
        label: getTranslation(t, "debateFormats.fields.durationSeconds"),
        type: "number",
        placeholder: getTranslation(t, "debateFormats.form.durationPlaceholder"),

        validators: {
          onChange: ({ value }) =>
            !value || value < 30
              ? getTranslation(t, "debateFormats.validation.durationTooShort")
              : undefined,
        },
      },

      {
        name: "order_index",
        label: getTranslation(t, "debateFormats.fields.orderIndex"),
        type: "number",
        min: 1,
        validators: {
          onChange: ({ value }) =>
            value === undefined || value <= 0
              ? getTranslation(t, "debateFormats.validation.orderIndexNotValid")
              : undefined,
        },
      },

      {
        name: "role",
        label: getTranslation(t, "debateFormats.fields.role"),
        type: "select",
        placeholder: getTranslation(t, "debateFormats.form.selectRolePlaceholder"),

        options: () =>
          DEBATE_PHASE_ROLE.map((s) => ({
            label: getTranslation(t, s.label),
            value: s.value,
          })),

        validators: {
          onChange: ({ value }) =>
            !value
              ? getTranslation(t, "debateFormats.validation.roleRequired")
              : undefined,
        },
      },
    ],

    arrayDefaultItem: {
      name: "",
      duration_seconds: 300,
      order_index: 0,
      role: "proposition",
    },

    addButtonText: getTranslation(t, "debateFormats.actions.addPhase"),

    validators: {
      onChange: ({ value }) =>
        !value || value.length === 0
          ? getTranslation(t, "debateFormats.validation.phaseConfigRequired")
          : undefined,
    },
  };

  const formRows: FormRow<DebateFormatFormValues>[] = [
    {
      kind: "section",

      content: (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {getTranslation(t, "debateFormats.form.sections.info")}
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
      fields: [descriptionField],
    },

    {
      kind: "section",

      content: (
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {getTranslation(t, "debateFormats.form.sections.phases")}
          </p>

          <Separator />
        </div>
      ),
    },

    {
      kind: "fields",
      columns: 1,
      fields: [phaseConfigField],
    },
  ];

  const handleSubmit = async (values: DebateFormatFormValues) => {
    const payload = {
      name: values.name,
      description: values.description,
      phase_config: values.phase_config,
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
          formId="debate-format-dynamic-form"
          showSubmitButton={false}
        />

        <div className="flex w-full items-center gap-3 pt-2">
          <Button
            type="submit"
            form="debate-format-dynamic-form"
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
