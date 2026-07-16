// components/features/blogs/blog-card.tsx
"use client";

import { useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getTranslation } from "@/lib/utils";
import type { BlogPost } from "@/types";
import { ArrowDown, Check, X, Heart, ThumbsDown, Eye } from "lucide-react";

import { useUpdate } from "@/hooks/api/use-update";
import {
  approveBlogMutationOptions,
  rejectBlogMutationOptions,
} from "@/api/mutation-options";
import { blogKeys } from "@/lib/constants";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BlogCardProps {
  blog: BlogPost;
  variant?: "feed" | "compact";
}

const EXCERPT_MAX_LENGTH = 150;

export function BlogCard({ blog, variant = "feed" }: BlogCardProps) {
  const { t, i18n } = useTranslation();
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reviewerComment, setReviewerComment] = useState("");

  const currentTimeRef = useRef(Date.now());

  const excerpt = blog.excerpt || "";
  const isExcerptTruncated = excerpt.length > EXCERPT_MAX_LENGTH;
  const truncatedExcerpt = isExcerptTruncated
    ? excerpt.slice(0, EXCERPT_MAX_LENGTH).trimEnd() + "…"
    : excerpt;

  const displayTime = useMemo(() => {
    const postDate = new Date(blog.published_at ?? blog.created_at);
    const hoursDiff = Math.floor(
      (currentTimeRef.current - postDate.getTime()) / (1000 * 60 * 60),
    );
    const isOlderThan24h = hoursDiff >= 24;

    return isOlderThan24h
      ? postDate.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year:
            postDate.getFullYear() !== new Date().getFullYear()
              ? "numeric"
              : undefined,
        })
      : `${hoursDiff} ${getTranslation(t, "blogs.time.hoursAgo")}`;
  }, [blog.published_at, blog.created_at, t]);

  const { mutateAsync: approveBlog, isPending: isApprovePending } = useUpdate({
    mutationOptions: approveBlogMutationOptions(),
    queryKey: blogKeys.all,
    successMessage: getTranslation(t, "blogs.messages.approved"),
    errorMessage: getTranslation(t, "blogs.messages.approveError"),
  });

  const { mutateAsync: rejectBlog, isPending: isRejectPending } = useUpdate({
    mutationOptions: rejectBlogMutationOptions(reviewerComment),
    queryKey: blogKeys.all,
    successMessage: getTranslation(t, "blogs.messages.rejected"),
    errorMessage: getTranslation(t, "blogs.messages.rejectError"),
  });

  const isLoading = isApprovePending || isRejectPending;

  const handleApprove = async () => {
    await approveBlog({ id: blog.id });
  };

  const handleRejectClick = () => setShowRejectForm(true);

  const handleRejectSubmit = async () => {
    await rejectBlog({ id: blog.id });
    setShowRejectForm(false);
    setReviewerComment("");
  };

  const handleCancelReject = () => {
    setShowRejectForm(false);
    setReviewerComment("");
  };

  const isApproved = blog.status === "published";
  const isRejected = blog.status === "rejected";
  const showActionButtons =
    blog.status === "pending_review" && !isApproved && !isRejected;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <article
      className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-accent/40 hover:shadow-lg flex flex-col h-full"
      dir={i18n.dir()}
    >
      {/* Cover Image */}
      {blog.cover_image_url && (
        <div className="sm:hidden relative h-36 w-full overflow-hidden">
          <img
            src={blog.cover_image_url}
            alt={blog.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row flex-1">
        <div className="flex-1 p-5 flex flex-col">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
            <span>{blog.author?.name ?? `user_${blog.author?.id}`}</span>
            <span>·</span>
            <span>{displayTime}</span>
          </div>

          {/* Title */}
          <h2 className="text-base font-semibold leading-tight mb-3 line-clamp-2 min-h-[2.75rem]">
            {blog.title}
          </h2>

          {/* Excerpt — "See More" opens a dialog with the full text */}
          {excerpt && (
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">
                {truncatedExcerpt}
              </p>
              {isExcerptTruncated && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-medium text-primary hover:underline mt-1"
                    >
                      {getTranslation(t, "common.labels.seeMore")}
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    className="max-w-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DialogHeader>
                      <DialogTitle>{blog.title}</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {excerpt}
                    </p>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}

          {/* Categories */}
          {blog.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground mt-auto mb-4">
              {blog.categories.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center rounded-full border px-2.5 py-1"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Approve / Reject Buttons */}
          {showActionButtons && !showRejectForm && (
            <div className="flex gap-2 mt-auto pt-4 border-t border-border">
              <button
                onClick={handleApprove}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-success/10 text-success hover:bg-success/20 border border-success/30"
              >
                {isLoading ? (
                  <Spinner className="h-4 w-4 text-success" />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {getTranslation(t, "blogs.messages.approveAction")}
                  </>
                )}
              </button>
              <button
                onClick={handleRejectClick}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30"
              >
                <X className="h-4 w-4" />
                {getTranslation(t, "blogs.messages.rejectAction")}
              </button>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <div className="mt-auto pt-4 border-t border-border flex flex-col gap-3">
              <label className="text-xs font-medium">
                {getTranslation(t, "blogs.card.reviewerComment")}
              </label>
              <textarea
                value={reviewerComment}
                onChange={(e) => setReviewerComment(e.target.value)}
                placeholder={getTranslation(
                  t,
                  "blogs.card.rejectionPlaceholder",
                )}
                className="w-full px-3 py-2 rounded-lg text-sm border bg-background border-border resize-none"
                rows={3}
                disabled={isRejectPending}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleRejectSubmit}
                  disabled={isRejectPending || !reviewerComment.trim()}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-medium bg-destructive/10 text-destructive border border-destructive/30 ${!reviewerComment.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? (
                    <Spinner className="h-4 w-4 text-destructive" />
                  ) : (
                    <>
                      <X className="h-4 w-4" />
                      {getTranslation(t, "blogs.card.confirmReject")}
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancelReject}
                  disabled={isRejectPending}
                  className="flex-1 px-4 py-2 rounded-lg text-xs font-medium border border-border"
                >
                  {getTranslation(t, "common.actions.cancel")}
                </button>
              </div>
            </div>
          )}

          {/* Approved State */}
          {isApproved && (
            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-success/10 text-success border border-success/30 mb-3">
                <Check className="h-4 w-4" />
                {getTranslation(t, "blogs.messages.approveLabel")}
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1 rounded-lg bg-primary/5 border border-primary/20 p-3">
                  <Eye className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    {formatNumber(blog.views ?? 0)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {getTranslation(t, "blogs.card.views")}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-rose-500/5 border border-rose-500/20 p-3">
                  <Heart className="h-4 w-4 text-rose-600 fill-rose-600" />
                  <span className="text-sm font-semibold text-rose-600">
                    {formatNumber(blog.likes ?? 0)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {getTranslation(t, "blogs.card.likes")}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 rounded-lg bg-accent/5 border border-accent/20 p-3">
                  <ThumbsDown className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-accent">
                    {formatNumber(blog.dislikes ?? 0)}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {getTranslation(t, "blogs.card.dislikes")}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rejected State */}
          {isRejected && (
            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium bg-destructive/10 text-destructive border border-destructive/30">
                <X className="h-4 w-4" />
                {getTranslation(t, "blogs.messages.rejectLabel")}
              </div>
              {blog.reviewer_comment && (
                <div className="mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-xs">
                  <p className="font-medium text-muted-foreground mb-1">
                    {getTranslation(t, "blogs.card.reviewerCommentLabel")}:
                  </p>
                  <p>{blog.reviewer_comment}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Cover Image */}
        {blog.cover_image_url && (
          <div className="hidden sm:block w-44 lg:w-52 relative overflow-hidden shrink-0">
            <img
              src={blog.cover_image_url}
              alt={blog.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </article>
  );
}
