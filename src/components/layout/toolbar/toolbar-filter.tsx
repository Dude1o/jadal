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
  showAllLabel?: boolean; // Whether to show "All" option for this filter
}

interface FilterSelectProps {
  filter: ToolbarFilter;
  onChange: (id: string, value: string) => void;
  showAllLabel?: boolean; // Whether to show "All" option for this filter
}

function FilterSelect({
  filter,
  onChange,
  showAllLabel = true,
}: FilterSelectProps) {
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
      {/* Phone: two filters share a row (basis 50% minus the gap) instead of
          each claiming a full-width band. From sm up nothing changes — fixed
          176px, as before. */}
      <SelectTrigger className="jd-field h-[46px] w-full min-w-0 flex-1 basis-[calc(50%-0.25rem)] px-4 text-[length:var(--text-body)] font-semibold capitalize sm:w-44 sm:flex-none sm:basis-auto">
        {" "}
        {isLoading ? (
          <Spinner />
        ) : (
          <SelectValue
            className="truncate"
            placeholder={getTranslation(t, filter.label)}
          />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          {showAllLabel ? getTranslation(t, "common.labels.all") : null}
          {" "}
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
  showAllLabel = true,
}: ToolbarFiltersProps) {
  const hasActiveFilters = filters.some((f) => f.value && f.value !== "");
  const { t, i18n } = useTranslation();

  return (
    <div
      dir={i18n.dir()}
      className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto [&>*]:min-w-0"
    >
      {filters.map((filter) => (
        <FilterSelect
          key={filter.id}
          filter={filter}
          onChange={onChange}
          showAllLabel={showAllLabel}
        />
      ))}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onReset}
          aria-label={getTranslation(t, "common.actions.resetFilters")}
          title={getTranslation(t, "common.actions.resetFilters")}
          className="size-[46px] shrink-0 rounded-[14px] p-0 sm:h-[46px] sm:w-auto sm:px-4"
        >
          <RotateCcw className="size-4" />
          {/* The label is worth a whole row on a phone; the glyph is not
              ambiguous next to the filters it resets. */}
          <span className="max-sm:hidden">
            {getTranslation(t, "common.actions.resetFilters")}
          </span>
        </Button>
      )}
    </div>
  );
}
