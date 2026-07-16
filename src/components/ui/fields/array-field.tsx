// array-field.tsx
"use client";

import { Button } from "../button";
import { FieldWrapper } from "./field-wrapper";
import { useFieldContext } from "./form-context";
import { Trash2, Plus } from "lucide-react";
import { useStore } from "@tanstack/react-form";
import type { FieldConfig } from "@/components/dynamic-form/dynamic-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../label";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

interface ArrayFieldProps {
  label: string;
  fields: FieldConfig[];
  defaultItem: Record<string, any>;
  addButtonText?: string;
  form: any;
}

export function ArrayField({
  label,
  fields,
  defaultItem,
  addButtonText,
  form,
}: ArrayFieldProps) {
  const { t } = useTranslation();
  const arrayField = useFieldContext<Record<string, any>[]>();

  const effectiveAddButtonText =
    addButtonText ?? getTranslation(t, "common.actions.addItem");

  const value = Array.isArray(arrayField.state.value)
    ? arrayField.state.value
    : [];

  const arrayErrors = arrayField.state.meta.errors ?? [];

  const addItem = () => {
    arrayField.handleChange([...value, structuredClone(defaultItem)]);
  };

  const removeItem = (index: number) => {
    arrayField.handleChange(value.filter((_, i) => i !== index));
  };

  return (
    <FieldWrapper label={label} htmlFor={arrayField.name} errors={arrayErrors}>
      <div className="space-y-6">
        {value.map((_, index) => (
          <ArrayItemRow
            key={index}
            index={index}
            fields={fields}
            arrayName={arrayField.name}
            form={form}
            onRemove={() => removeItem(index)}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full dark:hover:text-accent"
        >
          <Plus className="mr-2 h-4 w-4" />
          {effectiveAddButtonText}
        </Button>
      </div>
    </FieldWrapper>
  );
}

function ArrayItemRow({
  index,
  fields,
  arrayName,
  form,
  onRemove,
}: {
  index: number;
  fields: FieldConfig[];
  arrayName: string;
  form: any;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border p-4 space-y-4 relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="absolute top-4 right-4 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {fields.map((cfg) => {
          const fieldPath = `${arrayName}[${index}].${cfg.name}`;

          return (
            <div
              key={cfg.name}
              style={{ gridColumn: `span ${cfg.colSpan ?? 1}` }}
              className="space-y-1"
            >
              <Label className="text-sm font-medium block">{cfg.label}</Label>

              <form.AppField
                name={fieldPath as any}
                validators={cfg.validators}
              >
                {(field: any) => {
                  // Apply format when displaying
                  const rawValue = field.state.value;
                  const displayValue = cfg.format
                    ? cfg.format(rawValue)
                    : rawValue;

                  if (cfg.type === "textarea") {
                    return (
                      <Textarea
                        value={displayValue ?? ""}
                        placeholder={cfg.placeholder}
                        rows={cfg.rows ?? 4}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={() => field.validate("blur")}
                      />
                    );
                  }

                  if (cfg.type === "select") {
                    const options =
                      typeof cfg.options === "function"
                        ? cfg.options({} as any)
                        : cfg.options || [];

                    return (
                      <Select
                        value={displayValue ?? ""}
                        onValueChange={(val) => {
                          // Apply parse when user selects
                          const storedValue = cfg.parse ? cfg.parse(val) : val;
                          field.handleChange(storedValue);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              cfg.placeholder ??
                              getTranslation(t, "common.actions.select")
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((opt: any) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }

                  // Default input
                  return (
                    <Input
                      type={cfg.type || "text"}
                      value={displayValue ?? ""}
                      placeholder={cfg.placeholder}
                      onChange={(e) => {
                        const val =
                          cfg.type === "number"
                            ? Number(e.target.value) || 0
                            : e.target.value;
                        field.handleChange(val);
                      }}
                      onBlur={() => field.validate("blur")}
                    />
                  );
                }}
              </form.AppField>

              <FieldError fieldPath={fieldPath} form={form} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FieldError({ fieldPath, form }: { fieldPath: string; form: any }) {
  const error = useStore(form.store, (state: any) => {
    const metaErrors = state.meta?.errors || [];
    const fieldMeta = state.fieldMeta?.[fieldPath];

    return (
      metaErrors.find((e: any) => e?.field === fieldPath)?.message ||
      fieldMeta?.errors?.[0] ||
      fieldMeta?.errorMap?.onSubmit ||
      fieldMeta?.errorMap?.onChange ||
      fieldMeta?.errorMap?.onBlur
    );
  });

  return error ? (
    <p className="text-xs text-destructive mt-1">{error}</p>
  ) : null;
}
