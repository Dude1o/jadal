import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import {
  getTranslation,
  isAsyncOptions,
  resolveOptions,
  useAsyncData,
} from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export type FilterOptions =
  | { label: string; value: string | boolean }[]
  | (() => any); // query options function

export interface ToolbarFilter {
  id: string;
  label: string;
  value?: string;
  options: FilterOptions;
  // Optional extractors for async options with custom structure
  getOptionLabel?: (item: any) => string;
  getOptionValue?: (item: any) => string | number;
}

interface ToolbarFiltersProps {
  filters: ToolbarFilter[];
  onChange: (id: string, value: string) => void;
  onReset: () => void;
  pluralName?: string;
}

interface FilterSelectProps {
  filter: ToolbarFilter;
  onChange: (id: string, value: string) => void;
}

function FilterSelect({ filter, onChange }: FilterSelectProps) {
  const { t } = useTranslation();

  // Only call useQuery if options are async
  const { asyncData, isLoading } = useAsyncData(filter.options);
  // Ensure options is always an array
  let resolvedOptions: Array<{
    label: string;
    value: string | number;
    color_hex?: string;
  }> = [];

  if (isAsyncOptions(filter.options)) {
    const raw = Array.isArray(asyncData)
      ? asyncData
      : ((asyncData as any)?.data ?? []);

    // If custom extractors are provided, use them
    if (filter.getOptionLabel && filter.getOptionValue) {
      resolvedOptions = raw.map((item) => ({
        label: filter.getOptionLabel!(item),
        value: filter.getOptionValue!(item),
        color_hex: item?.color_hex ?? "",
      }));
    } else {
      // Otherwise assume standard { label, value } structure
      resolvedOptions = raw;
    }
  } else {
    resolvedOptions = resolveOptions(filter.options);
  }

  return (
    <Select
      value={filter.value ?? "all"}
      onValueChange={(value) =>
        onChange(filter.id, value === "all" ? "" : value)
      }
      disabled={isLoading}
    >
      <SelectTrigger className="w-40 capitalize border-2 border-secondary">
        {isLoading ? (
          <Spinner />
        ) : (
          <SelectValue placeholder={getTranslation(t, filter.label)} />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          {getTranslation(t, "common.labels.all")}{" "}
          {getTranslation(t, filter.label)}
        </SelectItem>
        {resolvedOptions.map((opt, index) => (
          <SelectItem
            key={`${filter.id}-${opt.value}-${index}`}
            value={String(opt.value)}
          >
            {/* A flex wrapper pushes the circle completely to the right side */}
            <div className="flex items-center justify-between w-full gap-4 min-w-[120px]">
              <span>{getTranslation(t, opt.label)}</span>

              {opt.color_hex && (
                <span
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: opt.color_hex }}
                />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ToolbarFilters({
  filters,
  onChange,
  onReset,
}: ToolbarFiltersProps) {
  const hasActiveFilters = filters.some((f) => f.value && f.value !== "");
  const { t, i18n } = useTranslation();

  return (
    <div dir={i18n.dir()} className="flex items-center gap-2">
      {filters.map((filter) => (
        <FilterSelect key={filter.id} filter={filter} onChange={onChange} />
      ))}
      {hasActiveFilters && (
        <Button variant="secondary" onClick={onReset} className="h-10 px-3">
          {getTranslation(t, "common.actions.resetFilters")}
          <RotateCcw className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
