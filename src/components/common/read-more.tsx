// components/common/read-more.tsx

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";

interface ReadMoreProps {
  text: string;
  maxLength?: number;
  className?: string;
  readMoreLabel?: string;
  showLessLabel?: string;
}

export function ReadMore({
  text,
  maxLength = 150,
  className = "",
  readMoreLabel,
  showLessLabel,
}: ReadMoreProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;

  const displayedText =
    expanded || !shouldTruncate
      ? text
      : `${text.slice(0, maxLength).trim()}...`;

  const effectiveReadMoreLabel = readMoreLabel ?? getTranslation(t, "common.actions.readMore");
  const effectiveShowLessLabel = showLessLabel ?? getTranslation(t, "common.actions.showLess");

  return (
    <div dir="auto" className={className}>
      <p className="text-sm leading-6 text-muted-foreground whitespace-pre-wrap break-words">
        {displayedText}
      </p>

      {shouldTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {expanded ? (
            <>
              {effectiveShowLessLabel}
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              {effectiveReadMoreLabel}
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
