// components/common/pagination.tsx
"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, isRTL, getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  /** Renders the "Showing 21-40 of 128" line. */
  total?: number;
  perPage?: number;
}

/**
 * Pagination (section 8).
 *
 * The items live in their own contained surface so it reads as a component
 * rather than numbers thrown on the page. Container radius is 26px, which is
 * the nested-radius arithmetic: 40px items (radius 20) + 6px padding = 26. Get
 * that wrong and you see the two-radius effect complained about on tables.
 *
 * The container carries HALF the card shadow: it is chrome, not content. If
 * your eye reaches the pagination before the content, it is too strong.
 */
export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
  total,
  perPage,
}: PaginationProps) {
  const { t } = useTranslation();
  const rtl = isRTL();

  if (lastPage <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > lastPage) return;
    onPageChange(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (lastPage <= maxVisible) {
      return Array.from({ length: lastPage }, (_, i) => i + 1);
    }

    pages.push(1);

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(lastPage - 1, currentPage + 1);

    if (currentPage <= 3) {
      endPage = 4;
    } else if (currentPage >= lastPage - 2) {
      startPage = lastPage - 3;
    }

    if (startPage > 2) pages.push("...");
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < lastPage - 1) pages.push("...");
    pages.push(lastPage);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const cell =
    "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-[length:var(--text-body)] font-semibold outline-none transition-[background-color,color,box-shadow,transform] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring";
  const ghost =
    "text-muted-foreground hover:bg-primary/[0.06] hover:text-foreground dark:hover:bg-white/[0.06]";

  const from = perPage ? (currentPage - 1) * perPage + 1 : undefined;
  const to =
    perPage && total ? Math.min(currentPage * perPage, total) : undefined;

  return (
    <nav
      aria-label={getTranslation(t, "table.pagination")}
      className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
    >
      <div
        className="inline-flex items-center gap-1 rounded-[26px] p-1.5"
        style={{
          background: "var(--toolbar-surface)",
          boxShadow:
            "0 1px 2px -1px rgba(26,56,104,.10), 0 6px 14px -8px rgba(26,56,104,.18)",
        }}
      >
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={getTranslation(t, "table.previousPage")}
          className={cn(
            cell,
            ghost,
            "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent",
          )}
        >
          {rtl ? (
            <ChevronRight className="size-[18px]" />
          ) : (
            <ChevronLeft className="size-[18px]" />
          )}
        </button>

        {pageNumbers.map((page, index) => (
          <React.Fragment key={`${page}-${index}`}>
            {page === "..." ? (
              <span
                aria-hidden
                className="flex size-10 items-center justify-center text-muted-foreground/55"
              >
                &hellip;
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handlePageChange(page as number)}
                aria-current={currentPage === page ? "page" : undefined}
                className={cn(
                  cell,
                  "tabular-nums",
                  currentPage === page
                    ? "bg-[var(--accent-btn)] font-extrabold text-[var(--accent-btn-fg)] shadow-[0_4px_12px_-4px_rgba(245,154,74,.55)]"
                    : ghost,
                )}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          aria-label={getTranslation(t, "table.nextPage")}
          className={cn(
            cell,
            ghost,
            "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent",
          )}
        >
          {rtl ? (
            <ChevronLeft className="size-[18px]" />
          ) : (
            <ChevronRight className="size-[18px]" />
          )}
        </button>
      </div>

      {/* Separated by whitespace, never by a divider. */}
      {from && to && total ? (
        <span className="text-[length:var(--text-caption)] font-semibold text-muted-foreground tabular-nums">
          {getTranslation(t, "table.showingRange", { from, to, total })}
        </span>
      ) : null}
    </nav>
  );
}
