"use client";

import { useStore } from "@tanstack/react-form";
import { useAppForm } from "../ui/fields/form-context";
import { Button } from "../ui/button"; // only if you keep internal submit; we'll keep it optional
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

export type FieldType =
  | "text"
  | "number"
  | "password"
  | "select"
  | "checkbox"
  | "email"
  | "textarea"
  | "radio-group"
  | "file"
  | "range"
  | "date"
  | "tel"
  | "multi-select"
  | "async-select"
  | "async-multi-select"
  | "array"
  | "color"
  | "survey"
  | "datetime";

export type Validator<TValue = any> = (value: TValue) => string | undefined;

export type FieldConfig<TValues = any> = {
  name: string;
  label?: string;
  type: FieldType;
  placeholder?: string;
  visible?: (values: TValues) => boolean;
  options?: (values: TValues) => Array<{ value: string; label: string }>;
  deps?: Array<keyof TValues | string>;
  onChange?: (
    value: any,
    values: TValues,
    helpers: { setFieldValue: (name: string, value: any) => void },
  ) => void;
  validators?: {
    onChange?: Validator<any>;
    onBlur?: Validator<any>;
    onSubmit?: Validator<any>;
  };
  colSpan?: number; // relative to the row's internal column count (default 1)
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  accept?: string;
  multiple?: boolean;
  initialUrl?: string;
  initialName?: string;

  queryOptions?: () => any; // e.g. () => usersQueryOptions()
  getOptionLabel?: (item: any) => string;
  getOptionValue?: (item: any) => string | number;

  format?: (value: any) => any; // stored -> form value
  parse?: (value: any) => any; // form value -> stored

  arrayFields?: FieldConfig[];
  arrayDefaultItem?: Record<string, any>;
  addButtonText?: string;
};

export type FormRow<TValues = any> =
  | {
      kind: "fields";
      /** Fields placed side‑by‑side in this row */
      fields: FieldConfig<TValues>[];
      /** Number of columns used inside this row (default = number of fields) */
      columns?: number;
    }
  | {
      kind: "section";
      /** Any React node (heading, separator, custom component) */
      content: React.ReactNode;
    };

type DynamicFormProps<TValues> = {
  /** Define the entire form layout – rows and sections */
  rows: FormRow<TValues>[];
  defaultValues: TValues;
  onSubmit?: (values: TValues) => void;
  className?: string;
  formId?: string;
  /** Whether to show an internal submit button (default false) */
  showSubmitButton?: boolean;
  submitButtonText?: string;
};

export default function DynamicForm<TValues extends Record<string, any>>({
  rows,
  defaultValues,
  onSubmit,
  className,
  formId = "dynamic-form",
  showSubmitButton = false,
  submitButtonText,
}: DynamicFormProps<TValues>) {
  const { t } = useTranslation();
  const form = useAppForm({
    defaultValues,
    onSubmit: ({ value }) => {
      onSubmit?.(value as TValues);
    },
    validators: {
      onSubmit: ({ value }) => {
        // optional global validation
      },
    },
  });

  const values = useStore(form.store, (s) => s.values) as TValues;

  // Helper to render a single field
  const renderField = (cfg: FieldConfig<TValues>) => {
    return (
      <form.Subscribe key={cfg.name} selector={(s) => [s.values]}>
        {([currentValues]) => {
          const visible = cfg.visible
            ? cfg.visible(currentValues as TValues)
            : true;
          if (!visible) return null;

          const options =
            (cfg.type === "select" ||
              cfg.type === "radio-group" ||
              cfg.type === "multi-select") &&
            cfg.options
              ? typeof cfg.options === "function"
                ? cfg.options(currentValues as TValues)
                : cfg.options
              : [];

          return (
            <form.AppField
              name={cfg.name as any}
              validators={cfg.validators}
              listeners={{
                onChange: ({ value }) => {
                  cfg.onChange?.(value, currentValues as TValues, {
                    setFieldValue: form.setFieldValue,
                  });
                },
              }}
            >
              {(field) => (
                <div
                  className="mb-0" // margin handled by row gap
                  style={{
                    gridColumn: `span ${cfg.colSpan ?? 1}`,
                  }}
                >
                  {(() => {
                    switch (cfg.type) {
                      case "text":
                      case "number":
                      case "email":
                      case "password":
                      case "tel":
                        return (
                          <field.TextInputField
                            label={cfg.label ?? ""}
                            type={cfg.type}
                            placeholder={cfg.placeholder}
                          />
                        );
                      case "color":
                        return (
                          <field.ColorField
                            label={cfg.label ?? ""}
                            placeholder={cfg.placeholder}
                          />
                        );
                      case "array":
                        return (
                          <field.ArrayField
                            label={cfg.label ?? ""}
                            fields={cfg.arrayFields ?? []}
                            defaultItem={cfg.arrayDefaultItem ?? {}}
                            addButtonText={cfg.addButtonText}
                            form={form}
                          />
                        );
                      case "survey":
                        return (
                          <field.SurveyBuilderField
                            fieldName={cfg.name}
                            form={form}
                            label={cfg.label}
                          />
                        );
                      case "textarea":
                        return (
                          <field.TextareaField
                            label={cfg.label ?? ""}
                            placeholder={cfg.placeholder}
                            rows={cfg.rows}
                          />
                        );
                      case "select": {
                        const rawValue = field.state.value;
                        const displayValue = cfg.format
                          ? cfg.format(rawValue)
                          : rawValue;
                        return (
                          <field.SelectField
                            label={cfg.label ?? ""}
                            placeholder={cfg.placeholder}
                            options={options}
                            value={displayValue}
                            onChange={(val) => {
                              const stored = cfg.parse ? cfg.parse(val) : val;
                              field.handleChange(stored);
                            }}
                          />
                        );
                      }
                      case "async-select":
                        return (
                          <field.AsyncSelectField
                            label={cfg.label ?? ""}
                            queryOptions={cfg.queryOptions!}
                            getOptionLabel={cfg.getOptionLabel!}
                            getOptionValue={cfg.getOptionValue!}
                            placeholder={cfg.placeholder}
                          />
                        );
                      case "async-multi-select":
                        return (
                          <field.AsyncMultiSelectField
                            label={cfg.label ?? ""}
                            queryOptions={cfg.queryOptions!}
                            getOptionLabel={cfg.getOptionLabel!}
                            getOptionValue={cfg.getOptionValue!}
                            placeholder={cfg.placeholder}
                          />
                        );
                      case "radio-group":
                        return (
                          <field.RadioGroupField
                            label={cfg.label ?? ""}
                            options={options}
                          />
                        );
                      case "multi-select":
                        return (
                          <field.MultiCheckboxField
                            label={cfg.label ?? ""}
                            options={options} // static options
                            queryOptions={cfg.queryOptions}
                            getOptionLabel={cfg.getOptionLabel}
                            getOptionValue={cfg.getOptionValue}
                          />
                        );
                      case "checkbox":
                        return <field.CheckboxField label={cfg.label ?? ""} />;
                      case "range":
                        return (
                          <field.SliderField
                            label={cfg.label ?? ""}
                            min={cfg.min}
                            max={cfg.max}
                            step={cfg.step}
                          />
                        );
                      case "date":
                        return (
                          <field.DatePickerField label={cfg.label ?? ""} />
                        );
                      case "datetime":
                        return (
                          <field.DateTimePickerField label={cfg.label ?? ""} />
                        );
                      case "file":
                        return (
                          <field.FileUploaderField
                            label={cfg.label ?? ""}
                            accept={cfg.accept}
                            maxSizeMb={cfg.max}
                            initialUrl={cfg.initialUrl}
                            initialName={cfg.initialName}
                          />
                        );
                      default:
                        return null;
                    }
                  })()}
                </div>
              )}
            </form.AppField>
          );
        }}
      </form.Subscribe>
    );
  };

  return (
    <div className={className}>
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-6">
          {rows.map((row, idx) => {
            if (row.kind === "section") {
              return <div key={`section-${idx}`}>{row.content}</div>;
            } else {
              // row.kind === "fields"
              const columns = row.columns ?? row.fields.length;
              return (
                <div
                  key={`row-${idx}`}
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  }}
                >
                  {row.fields.map((field) => renderField(field))}
                </div>
              );
            }
          })}
        </div>

        {showSubmitButton && (
          <div className="mt-6">
            <Button type="submit">
              {submitButtonText ?? getTranslation(t, "common.actions.submit")}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
