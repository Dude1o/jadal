// components/common/error-fallback.tsx
"use client";

import { useTranslation } from "react-i18next";
import { AlertCircle, RefreshCw, WifiOff, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslation } from "@/lib/utils";

interface ErrorFallbackProps {
  error: any;
  reset?: () => void;
  title?: string;
}

export default function ErrorFallback({
  error,
  reset,
  title,
}: ErrorFallbackProps) {
  const { t } = useTranslation();

  const errorMessage =
    error?.response?.data?.message ||
    error?.message ||
    getTranslation(t, "common.errors.fallback");
  const status = error?.response?.status || error?.status;

  const getErrorType = () => {
    if (
      !navigator.onLine ||
      errorMessage.toLowerCase().includes("network") ||
      errorMessage.toLowerCase().includes("fetch")
    ) {
      return {
        icon: <WifiOff className="h-10 w-10 text-amber-500 animate-pulse" />,
        heading: title || getTranslation(t, "common.errors.network.title"),
        description: getTranslation(t, "common.errors.network.description"),
      };
    }

    if (status === 403 || status === 401) {
      return {
        icon: <ShieldAlert className="h-10 w-10 text-destructive" />,
        heading: title || getTranslation(t, "common.errors.auth.title"),
        description: getTranslation(t, "common.errors.auth.description"),
      };
    }

    return {
      icon: <AlertCircle className="h-10 w-10 text-destructive" />,
      heading: title || getTranslation(t, "common.errors.generic.title"),
      description: getTranslation(t, "common.errors.generic.description"),
    };
  };

  const { icon, heading, description } = getErrorType();

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full p-4">
      <Card className="w-full max-w-md border-dashed shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
            {icon}
          </div>
          <CardTitle className="text-xl tracking-tight">{heading}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="rounded-md bg-muted/60 p-3 font-mono text-xs text-muted-foreground break-all max-h-[120px] overflow-y-auto border border-border/40">
            <span className="font-semibold text-foreground/70">
              {getTranslation(t, "common.errors.details")}:
            </span>{" "}
            {status ? `[Status ${status}] ` : ""}
            {errorMessage}
          </div>
        </CardContent>

        {reset && (
          <CardFooter className="flex justify-center pt-2">
            <Button
              onClick={() => reset()}
              variant="outline"
              className="gap-2 min-w-[140px]"
            >
              <RefreshCw className="h-4 w-4" />
              {getTranslation(t, "common.errors.retry")}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
