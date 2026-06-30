"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useData } from "@/hooks/api/use-data";
import { Spinner } from "@/components/ui/spinner";
import DynamicForm, {
  type FormRow,
  type FieldConfig,
} from "../../dynamic-form/dynamic-form";
import { useFormKey } from "@/hooks/use-form-key";
import { ROLES } from "@/lib/constants";
import { surveyQueryOptions } from "@/api/query-options";
import type { Survey } from "@/types";

type UserRole = "debater" | "trainer" | "judge" | "admin";

interface SurveyFormValues {
  title: string;
  description: string | null;
  target_roles: UserRole[];
  closes_at: Date | null;
  questions: any[];
}

interface SurveyFormProps {
  defaultValues?: Partial<SurveyFormValues>;
  onSubmit?: (values: any) => Promise<void> | void;
  onCancel?: () => void;
  survey_id?: number;
}

export default function SurveyForm({
  defaultValues,
  onSubmit,
  onCancel,
  survey_id,
}: SurveyFormProps) {
  const { data: survey, isLoading } = useData<Survey>(
    surveyQueryOptions(survey_id!),
    { enabled: !!survey_id },
  );

  const { t, i18n } = useTranslation();
  const formKey = useFormKey(survey);

  // ==================== Default Values for Edit ====================
  const formDefaultValues: SurveyFormValues = {
    title: survey?.title ?? defaultValues?.title ?? "",
    description: survey?.description ?? defaultValues?.description ?? null,
    target_roles: survey?.target_roles ?? defaultValues?.target_roles ?? [],
    closes_at: survey?.closes_at
      ? new Date(survey.closes_at)
      : (defaultValues?.closes_at ?? null),

    questions: (survey?.questions ?? []).map((q: any) => ({
      id: q.id || Date.now(),
      question_text: q.question_text || "",
      type:
        q.type === "mcq" ? "mcq" : q.type === "open_text" ? "text" : "rating",

      options:
        q.type === "mcq"
          ? Array.isArray(q.options)
            ? q.options.map((opt: any) =>
                typeof opt === "string" ? opt : opt?.label || "",
              )
            : []
          : q.type === "rating"
            ? {
                min: q.options?.min ?? 1,
                max: q.options?.max ?? 5,
                step: q.options?.step ?? 1,
              }
            : null,

      ratingScale: q.type === "rating" ? (q.options?.max ?? 5) : undefined,
    })),
  };

  // ==================== Field Configs ====================
  const titleField: FieldConfig<SurveyFormValues> = {
    name: "title",
    label: `${getTranslation(t, "surveys.form.fields.title")} *`,
    type: "text",
    validators: {
      onChange: ({ value }) =>
        !value?.trim()
          ? getTranslation(t, "surveys.validation.titleRequired")
          : value.trim().length < 3
            ? getTranslation(t, "surveys.validation.titleTooShort")
            : undefined,
    },
  };

  const descriptionField: FieldConfig<SurveyFormValues> = {
    name: "description",
    label: getTranslation(t, "surveys.form.fields.description"),
    type: "textarea",
    rows: 3,
  };

  const targetRolesField: FieldConfig<SurveyFormValues> = {
    name: "target_roles",
    label: `${getTranslation(t, "surveys.form.fields.targetRoles")} *`,
    type: "multi-select",
    options: () =>
      ROLES.map((r) => ({
        label: getTranslation(t, r.label),
        value: r.value,
      })),
    validators: {
      onSubmit: ({ value }) =>
        Array.isArray(value) && value.length === 0
          ? getTranslation(t, "surveys.validation.targetRolesRequired")
          : undefined,
    },
  };

  const closesAtField: FieldConfig<SurveyFormValues> = {
    name: "closes_at",
    label: getTranslation(t, "surveys.form.fields.closesAt"),
    type: "date",
  };

  const questionsField: FieldConfig<SurveyFormValues> = {
    name: "questions",
    label: getTranslation(t, "surveys.form.fields.questions"),
    type: "survey",
    validators: {
      onSubmit: ({ value }) => {
        if (!Array.isArray(value) || value.length === 0) {
          return getTranslation(t, "surveys.validation.minQuestions");
        }
        const hasEmpty = value.some((q: any) => {
          const text = (q?.question_text || q?.question || "").trim();
          return !text;
        });
        if (hasEmpty) {
          return (
            getTranslation(t, "surveys.validation.someQuestionsEmpty") ||
            getTranslation(t, "surveys.validation.someQuestionsEmpty")
          );
        }
        return undefined;
      },
    },
  };

  // ==================== Form Layout ====================
  const formRows: FormRow<SurveyFormValues>[] = [
    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {getTranslation(t, "surveys.form.sections.basicInfo")}
          </p>
          <Separator />
        </div>
      ),
    },
    { kind: "fields", columns: 1, fields: [titleField] },
    { kind: "fields", columns: 1, fields: [descriptionField] },

    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {getTranslation(t, "surveys.form.sections.settings")}
          </p>
          <Separator />
        </div>
      ),
    },
    {
      kind: "fields",
      columns: 2,
      fields: [targetRolesField, closesAtField],
    },

    {
      kind: "section",
      content: (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {getTranslation(t, "surveys.form.sections.questions")}
          </p>
          <Separator />
        </div>
      ),
    },
    { kind: "fields", columns: 1, fields: [questionsField] },
  ];

  // ==================== Submit Handler ====================
  const handleSubmit = async (values: SurveyFormValues) => {
    console.log("📋 Raw questions from form:", values.questions);

    const payload = {
      title: values.title?.trim() || "",
      description: values.description?.trim() || null,
      target_roles: values.target_roles || [],
      closes_at: values.closes_at ? values.closes_at.toISOString() : null,
      questions: (values.questions || [])
        .map((q: any, index: number) => {
          const questionText = (q?.question_text || q?.question || "").trim();
          if (!questionText) return null;

          let options: any = null;

          if (q.type === "mcq") {
            options = Array.isArray(q.options)
              ? q.options
                  .map((opt: any) =>
                    typeof opt === "string"
                      ? opt.trim()
                      : opt?.label?.trim() || "",
                  )
                  .filter(Boolean)
              : [];
          } else if (q.type === "rating") {
            const scale = q.ratingScale || q.options?.max || 5;
            options = {
              min: q.options?.min || 1,
              max: scale,
              step: q.options?.step || 1,
            };
          }
          // open_text → options = null

          return {
            question_text: questionText,
            type:
              q.type === "mcq"
                ? "mcq"
                : q.type === "text" || q.type === "open_text"
                  ? "open_text"
                  : "rating",
            options,
            order_index: index + 1,
          };
        })
        .filter(Boolean),
    };

    console.log("🚀 Final Payload Sent:", payload);
    await onSubmit?.(payload);
  };

  return (
    <div className="relative">
      {isLoading && (
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
          formId="survey-form"
          showSubmitButton={false}
        />

        <div className="flex w-full items-center gap-3 pt-2">
          <Button
            type="submit"
            form="survey-form"
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
