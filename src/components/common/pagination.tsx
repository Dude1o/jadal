// components/common/pagination.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isRTL, getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation();

  if (lastPage <= 1) return null;

  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    setDirection(page > currentPage ? "next" : "prev");
    setIsTransitioning(true);

    setTimeout(() => {
      onPageChange(page);
    }, 150);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
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

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < lastPage - 1) {
      pages.push("...");
    }

    pages.push(lastPage);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-8px);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(8px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0);
          }
        }

        .pagination-container {
          animation: slideInUp 0.5s ease-out forwards;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-number-item {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .page-number-item.active {
          animation: pulse-glow 2s infinite;
        }

        .chevron-button {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .chevron-button:hover:not(:disabled) {
          transform: translateX(var(--translate-x, 0));
        }

        .chevron-button.prev:hover:not(:disabled) {
          --translate-x: -2px;
        }

        .chevron-button.next:hover:not(:disabled) {
          --translate-x: 2px;
        }

        .page-number {
          position: relative;
          overflow: hidden;
        }

        .page-number-content {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
        }

        .page-number.transitioning-out .page-number-content {
          animation: slideOutRight 0.15s ease-in forwards;
        }

        .page-number.transitioning-in .page-number-content {
          animation: slideInLeft 0.3s ease-out forwards;
        }
      `}</style>

      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={getTranslation(t, "table.previousPage")}
        className="chevron-button prev relative p-2 rounded-full transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        style={{
          background:
            currentPage === 1 ? "rgba(255, 255, 255, 0.05)" : "var(--card)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent)",
            pointerEvents: "none",
          }}
        />
        {isRTL() ? (
          <ChevronRight className="w-4 h-4 text-foreground/80 transition-colors duration-300" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-foreground/80 transition-colors duration-300" />
        )}
      </button>

      {/* Page Numbers Container */}
      <div
        className="pagination-container flex gap-1 px-3 py-2 rounded-full transition-all duration-300"
        style={{
          background: "var(--card)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--border)",
        }}
      >
        {pageNumbers.map((page, index) => (
          <React.Fragment key={`${page}-${index}`}>
            {page === "..." ? (
              <div className="page-number-item flex items-center justify-center px-1.5 py-1">
                <span
                  className="text-xs text-foreground/40 transition-all duration-300"
                  style={{
                    opacity: isTransitioning ? 0.3 : 0.6,
                  }}
                >
                  •
                </span>
              </div>
            ) : (
              <button
                onClick={() => handlePageChange(page as number)}
                disabled={isTransitioning}
                className={`page-number-item relative px-2.5 py-1 rounded-lg text-sm font-medium transition-all duration-300 active:scale-95 overflow-hidden group ${
                  currentPage === page
                    ? "active text-primary-foreground shadow-md"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                }`}
                style={{
                  background:
                    currentPage === page ? "var(--primary)" : "transparent",
                  backdropFilter: currentPage === page ? "blur(10px)" : "none",
                  border:
                    currentPage === page
                      ? "1px solid var(--primary)"
                      : "1px solid transparent",
                }}
              >
                {/* Background shimmer effect for active page */}
                {currentPage === page && (
                  <div
                    className="absolute inset-0 opacity-20 blur-sm -z-10"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.4), transparent)",
                    }}
                  />
                )}

                {/* Smooth transition container */}
                <span
                  className="page-number-content transition-all duration-300"
                  style={{
                    opacity: isTransitioning ? 0.5 : 1,
                    transform: isTransitioning
                      ? direction === "next"
                        ? "translateY(4px) scale(0.95)"
                        : "translateY(-4px) scale(0.95)"
                      : "translateY(0) scale(1)",
                  }}
                >
                  {page}
                </span>

                {/* Hover overlay glow */}
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(255, 255, 255, 0.15), transparent)",
                  }}
                />
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        aria-label={getTranslation(t, "table.nextPage")}
        className="chevron-button next relative p-2 rounded-full transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
        style={{
          background:
            currentPage === lastPage
              ? "rgba(255, 255, 255, 0.05)"
              : "var(--card)",
          backdropFilter: "blur(8px)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent)",
            pointerEvents: "none",
          }}
        />
        {isRTL() ? (
          <ChevronLeft className="w-4 h-4 text-foreground/80 transition-colors duration-300" />
        ) : (
          <ChevronRight className="w-4 h-4 text-foreground/80 transition-colors duration-300" />
        )}
      </button>
    </div>
  );
}
