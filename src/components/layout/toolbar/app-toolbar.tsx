import { ToolbarSearch } from "@/components/layout/toolbar/toolbar-search";
import {
  ToolbarFilters,
  type ToolbarFilter,
} from "@/components/layout/toolbar/toolbar-filter";

interface AppToolbarProps {
  search?: {
    title: string;
    value: string;
    onChange: (value: string) => void;
  };

  filters?: ToolbarFilter[];

  onFilterChange?: (id: string, value: string) => void;
  onResetFilters?: () => void;
  pluralName?: string;
}

export function AppToolbar({
  search,
  filters,
  onFilterChange,
  onResetFilters,
  pluralName,
}: AppToolbarProps) {
  return (
    /* An elevated surface, not a bare row. The field sits inset within it, so
       page -> toolbar -> field reads as two steps instead of the one ~3%
       delta that made the whole thing invisible in light mode (section 7.2). */
    <div className="jd-toolbar mb-6 flex flex-wrap items-center justify-between gap-3 max-sm:p-2.5">
      <div className="flex w-full min-w-0 flex-1 flex-wrap items-center gap-2.5 sm:w-auto sm:gap-3">
        {search && (
          <ToolbarSearch
            title={search.title}
            value={search.value}
            onChange={search.onChange}
          />
        )}

        {filters && filters.length > 0 && (
          <ToolbarFilters
            filters={filters}
            onChange={(id, value) => onFilterChange?.(id, value)}
            onReset={() => onResetFilters?.()}
            pluralName={pluralName}
          />
        )}
      </div>
    </div>
  );
}
