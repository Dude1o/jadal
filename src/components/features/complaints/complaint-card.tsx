import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Calendar,
  User,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check,
} from "lucide-react";

import type { Complaint } from "@/types";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  complaint: Complaint;
  onDismiss?: (id: number, admin_comment?: string) => void;
  onResolve?: (id: number, admin_comment?: string) => void;
}

export default function ComplaintCard({
  complaint,
  onDismiss,
  onResolve,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [adminComment, setAdminComment] = useState<string>("");
  const shouldClamp = complaint.description.length > 120;
  const underReview = complaint.status === "under_review";

  return (
    <div
      dir={i18n.dir()}
      className="group relative flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        fontFamily: "var(--font-sans)",
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow:
          "0 2px 12px 0 color-mix(in oklch, var(--foreground) 5%, transparent)",
        cursor: "pointer",
      }}
      onClick={() => {
        navigate({ to: `/complaints/${complaint.id}` });
      }}
    >
      {/* ── Colored top accent bar ── */}
      <div
        className="h-1 w-full shrink-0"
        style={{
          background:
            "linear-gradient(to right, var(--destructive), color-mix(in oklch, var(--destructive) 50%, var(--accent)))",
        }}
      />

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon badge */}
          <div
            className="shrink-0 mt-0.5 flex items-center justify-center h-8 w-8 rounded-lg"
            style={{
              background:
                "color-mix(in oklch, var(--destructive) 12%, transparent)",
              border:
                "1.5px solid color-mix(in oklch, var(--destructive) 30%, transparent)",
            }}
          >
            <AlertCircle
              className="h-4 w-4"
              style={{ color: "var(--destructive)" }}
            />
          </div>

          {/* Title */}
          <h3
            className="text-[15px] font-semibold leading-snug pt-1 line-clamp-2"
            style={{
              color: "var(--card-foreground)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {complaint.description}
          </h3>
        </div>

        {/* ── Action buttons ── */}
        {underReview && (
          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()} // prevent card navigation
          >
            {/* Dismiss (X) */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="flex items-center justify-center h-7 w-7 rounded-lg lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{
                    background:
                      "color-mix(in oklch, var(--destructive) 12%, transparent)",
                    border:
                      "1px solid color-mix(in oklch, var(--destructive) 30%, transparent)",
                    color: "var(--destructive)",
                  }}
                  aria-label={getTranslation(t, "complaints.details.dismiss")}
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent dir={i18n.dir()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {getTranslation(t, "complaints.dialog.dismissTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {getTranslation(t, "complaints.dialog.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Input moved out of the Header and nested Content wrapper */}
                <div className="py-4">
                  <Textarea
                    placeholder={getTranslation(
                      t,
                      "complaints.dialog.adminResponse",
                    )}
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    variant="ghost"
                    className="hover:bg-gray-300 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    {getTranslation(t, "complaints.dialog.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      onDismiss?.(complaint.id, adminComment);
                      setAdminComment("");
                    }}
                  >
                    {getTranslation(t, "complaints.dialog.dismissConfirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Resolve (Check) */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="flex items-center justify-center h-7 w-7 rounded-lg lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
                  style={{
                    background:
                      "color-mix(in oklch, var(--primary) 12%, transparent)",
                    border:
                      "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
                    color: "var(--primary)",
                  }}
                  aria-label={getTranslation(t, "complaints.details.resolve")}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent dir={i18n.dir()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {getTranslation(t, "complaints.dialog.resolveTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {getTranslation(t, "complaints.dialog.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Input moved out of the Header and nested Content wrapper */}
                <div className="py-4">
                  <Textarea
                    placeholder={getTranslation(
                      t,
                      "complaints.dialog.adminResponse",
                    )}
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                  />
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    variant="ghost"
                    className="hover:bg-gray-300 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    {getTranslation(t, "complaints.dialog.cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      onResolve?.(complaint.id, adminComment);
                      setAdminComment("");
                    }}
                  >
                    {getTranslation(t, "complaints.dialog.resolveConfirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* ── Description ── */}
      <div className="px-5 pb-4 flex-1">
        <div
          className="h-px w-full mb-3"
          style={{ background: "var(--border)" }}
        />
        <p
          className={`text-sm leading-relaxed transition-all duration-300 ${expanded ? "" : "line-clamp-3"}`}
          style={{ color: "var(--muted-foreground)" }}
        >
          {underReview
            ? getTranslation(t, "complaints.details.noResponse")
            : complaint.admin_response}
        </p>

        {shouldClamp && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="mt-2 flex items-center gap-1 text-xs font-medium transition-colors duration-200"
            style={{ color: "var(--accent)" }}
          >
            {expanded ? (
              <>
                {getTranslation(t, "complaints.actions.seeLess")}
                <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                {getTranslation(t, "complaints.actions.seeMore")}
                <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* ── Footer ── */}
      <div
        className="flex items-center justify-between px-5 py-3 mt-auto"
        style={{
          borderTop: "1px solid var(--border)",
          background: "color-mix(in oklch, var(--muted) 40%, transparent)",
        }}
      >
        <div
          className="flex items-center gap-1.5 text-xs font-medium"
          style={{ color: "var(--muted-foreground)" }}
        >
          <div
            className="flex items-center justify-center h-5 w-5 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--accent))",
              color: "var(--primary-foreground)",
              fontSize: "9px",
              fontWeight: 700,
            }}
          >
            {complaint.filed_by?.name && <User className="h-2.5 w-2.5" />}
          </div>
          <span className="truncate max-w-25">{complaint.filed_by?.name}</span>
        </div>

        <div
          className="flex items-center gap-1.5 text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>{complaint.created_at}</span>
        </div>
      </div>
    </div>
  );
}
