import { Search, X } from "lucide-react";
import { cn, getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ToolbarSearchProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Search field (section 7).
 *
 * The icon is centred by flex, not by an absolute offset. Three things were
 * wrong before and all three are fixed here:
 *   1. the icon was absolutely positioned with a hardcoded `top`
 *   2. `display: inline` on the svg left an inline baseline gap under it
 *   3. `left-2.5` put it on the wrong side in Arabic
 *
 * The field is an INSET within the toolbar surface, so the page to toolbar to
 * field progression is two visible steps rather than the one invisible step it
 * used to be.
 */
export function ToolbarSearch({
  title,
  value,
  onChange,
  className,
}: ToolbarSearchProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        // Focus is a soft ring on the OUTER edge of the field, following its
        // 14px radius. An inset 2px bar of solid #F59A4A read as a hard square
        // cutting through the middle of the control.
        "jd-field flex h-[46px] w-full max-w-sm items-center gap-2.5 px-4 transition-[box-shadow] duration-150 ease-in-out",
        "focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent-btn)_78%,transparent)]",
        className,
      )}
    >
      <Search
        aria-hidden
        className="block size-5 shrink-0 text-muted-foreground"
      />

      <input
        type="search"
        placeholder={`${getTranslation(t, "toolbar.search")} ${title}...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full min-w-0 flex-1 bg-transparent text-[length:var(--text-body)] font-semibold text-foreground outline-none placeholder:font-semibold placeholder:text-muted-foreground/75 [&::-webkit-search-cancel-button]:hidden"
        style={{ lineHeight: 1.2, paddingBlock: 0 }}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={getTranslation(t, "common.actions.clear")}
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 ease-in-out hover:bg-primary/10 hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
