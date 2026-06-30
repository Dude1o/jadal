import i18n from "@/i18n";
import type { SideBarItem } from "@/types";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { avatarPalette } from "./constants";
import { cn } from "./cn";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { FileImage, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { FilterOptions } from "@/components/layout/toolbar/toolbar-filter";
import { useLocation } from "@tanstack/react-router";

export { cn };

/* ── Avatar utils ── */
export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function avatarColor(name: string) {
  return avatarPalette[name.charCodeAt(0) % avatarPalette.length];
}

/* ── Translation utils ── */
export function getTranslation(
  t: TFunction,
  key: string,
  options?: Record<string, any>,
): string {
  return t(key, options);
}

export default function getTime(time: string) {
  return formatDistanceToNow(new Date(time), {
    addSuffix: true,
    locale: i18n.language === "ar" ? ar : undefined,
  });
}

/* ── Direction utils ── */
export function isRTL() {
  return i18n.language === "ar";
}

export function useRtl() {
  const { i18n } = useTranslation();
  const rtl = i18n.language === "ar";
  return {
    isRTL: rtl,
    dir: rtl ? "rtl" : "ltr",
  };
}

export function rtlFlex(base = "flex items-center gap-2") {
  return cn(base, isRTL() && "flex-row-reverse");
}

export function rtlAuto() {
  return isRTL() ? "mr-auto" : "ml-auto";
}

export function rtlChevron() {
  return isRTL() ? "scale-x-[-1]" : "";
}

/* ── Number / format utils ── */
export function getNumber(number: number) {
  return isRTL() ? new Intl.NumberFormat("ar-EG").format(number) : number;
}

export function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/* ── Survey / date utils ── */
export const isClosed = (closesAt: string | null, now: number): boolean => {
  if (!closesAt) return false;
  return new Date(closesAt).getTime() < now;
};

export const isUrgent = (closesAt: string | null, now: number): boolean => {
  if (!closesAt) return false;
  const diff = new Date(closesAt).getTime() - now;
  return diff > 0 && diff < 1000 * 60 * 60 * 24 * 3; // within 3 days
};

/* ── Sidebar active-state utils ── */
export function isMenuItemActive(
  pathname: string,
  search: Record<string, string>,
  item: SideBarItem,
) {
  const isParentActive =
    pathname === item.url &&
    (!item.search ||
      Object.entries(item.search).every(
        ([key, value]) => search[key] === value,
      ));

  const hasActiveChild = item.subItems?.some(
    (subItem) =>
      pathname === subItem.url &&
      (!subItem.search ||
        Object.entries(subItem.search).every(
          ([key, value]) => search[key] === value,
        )),
  );

  return isParentActive && !hasActiveChild;
}

export function isSubMenuItemActive(
  pathname: string,
  search: Record<string, string>,
  subItem: SideBarItem,
) {
  return (
    pathname === subItem.url &&
    (!subItem.search ||
      Object.entries(subItem.search).every(
        ([key, value]) => search[key] === value,
      ))
  );
}

export function getError(errors?: any[]) {
  return errors?.[0];
}

export function isValidUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(str: string) {
  return /^\+?[\d\s\-().]{7,20}$/.test(str);
}

export function removeFromEnd(str: string): string {
  const count: number = isRTL() ? 2 : 1;

  if (count <= 0) return str;

  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const graphemes = Array.from(segmenter.segment(str), (s) => s.segment);

  if (count >= graphemes.length) return "";

  return graphemes.slice(0, graphemes.length - count).join("");
}

export function isImage(file: File) {
  return file.type.startsWith("image/");
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(file: File) {
  if (file?.type.startsWith("image/")) return FileImage;
  if (file?.type === "application/pdf") return FileText;
  return File;
}

export function truncate(text: string, max = 15) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

export function isAsyncOptions(options: any) {
  return typeof options === "function";
}

// Change the name to start with "use"
export function useAsyncData(options: any) {
  const { data: asyncData, isLoading } = useQuery(
    isAsyncOptions(options)
      ? (options as () => any)()
      : { queryKey: ["disabled"], queryFn: async () => null, enabled: false },
  );
  return { asyncData, isLoading };
}

export function resolveOptions(
  options: FilterOptions,
): { label: string; value: string | number }[] {
  // If it's an array, return it directly
  if (Array.isArray(options)) {
    return options as any;
  }
  // If it's a function, it should have been resolved by useQuery already
  return [];
}

export const useMergeSearch = () => {
  const { search } = useLocation();

  return (newSearch?: Record<string, any>) => {
    // If no new search params, return existing ones
    if (!newSearch) {
      return search;
    }

    // Parse existing search params
    const existingParams = new URLSearchParams(
      typeof search === "string"
        ? search
        : new URLSearchParams(search).toString(),
    );
    const existingObj = Object.fromEntries(existingParams);

    // Merge with new params (new params override existing ones)
    return {
      ...existingObj,
      ...newSearch,
    };
  };
};
