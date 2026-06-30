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
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-1 flex-wrap items-center gap-2">
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
