"use client";

import { Checkbox } from "../checkbox";
import { Label } from "../label";
import { FieldWrapper } from "./field-wrapper";
import { useFieldContext } from "./form-context";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

interface MultiCheckboxFieldProps {
  label: string;
  options?: { label: string; value: string | number }[];
  queryOptions?: () => any;
  getOptionLabel?: (item: any) => string;
  getOptionValue?: (item: any) => string | number;
}

export function MultiCheckboxField({
  label,
  options: staticOptions = [],
  queryOptions,
  getOptionLabel,
  getOptionValue,
}: MultiCheckboxFieldProps) {
  const { t } = useTranslation();
  const field = useFieldContext<(string | number)[]>();

  // Async Query
  const queryResult = useQuery(
    queryOptions
      ? queryOptions()
      : {
          queryKey: ["multi-checkbox-disabled"],
          queryFn: async () => [],
          enabled: false,
        },
  );

  const { isLoading, isError } = queryResult;

  // Handle both array and nested { data: [] } response structures
  const rawData = queryResult.data;
  const apiData = useMemo(() => {
    if (Array.isArray(rawData)) {
      return rawData;
    }
    if (rawData?.data && Array.isArray(rawData.data)) {
      return rawData.data;
    }
    return [];
  }, [rawData]);

  const options = useMemo(() => {
    if (staticOptions.length > 0) return staticOptions;

    if (!apiData || apiData.length === 0) return [];

    return apiData.map((item: any) => ({
      label: getOptionLabel
        ? getOptionLabel(item)
        : item.name || item.label || String(item),
      value: getOptionValue
        ? getOptionValue(item)
        : item.id || item.value || item,
      color_hex: item.color_hex,
    }));
  }, [staticOptions, apiData, getOptionLabel, getOptionValue]);

  const toggle = (value: string | number) => {
    const current = field.state.value ?? [];
    field.handleChange(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  return (
    <FieldWrapper label={label} errors={field.state.meta.errors}>
      <div className="space-y-2">
        {isLoading && (
          <p className="text-sm text-muted-foreground py-2">
            {getTranslation(t, "common.fields.loadingOptions")}
          </p>
        )}

        {isError && (
          <p className="text-sm text-destructive py-2">
            {getTranslation(t, "common.fields.failedToLoadOptions")}
          </p>
        )}

        {options.length > 0
          ? options.map((opt) => (
              <div key={opt.value} className="flex items-center gap-3">
                <Checkbox
                  id={`${field.name}-${opt.value}`}
                  checked={(field.state.value ?? []).includes(opt.value)}
                  onBlur={field.handleBlur}
                  onCheckedChange={() => toggle(opt.value)}
                />

                <div className="flex items-center gap-2 flex-1">
                  {opt.color_hex && (
                    <div
                      className="h-4 w-4 rounded-full border border-white/30 flex-shrink-0"
                      style={{ backgroundColor: opt.color_hex }}
                    />
                  )}
                  <Label
                    htmlFor={`${field.name}-${opt.value}`}
                    className="cursor-pointer text-sm flex-1"
                  >
                    {opt.label}
                  </Label>
                </div>
              </div>
            ))
          : !isLoading && (
              <p className="text-sm text-muted-foreground py-2">
                {getTranslation(t, "common.fields.noOptions")}
              </p>
            )}
      </div>
    </FieldWrapper>
  );
}
