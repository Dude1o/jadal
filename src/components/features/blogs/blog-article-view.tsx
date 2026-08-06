import { CalendarDays, Eye, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import getTime, { getTranslation } from "@/lib/utils";
import type { BlogPost } from "@/types";

import blogPlaceholder from "@/assets/blog_article_placeholder.png";

/**
 * The full reading view (§19.9), replacing the "read more" truncation.
 *
 * Measure is capped at 72ch and the body drops to weight 400 at a larger size
 * with longer leading — the one place in the app where 400 is allowed, because
 * this is long-form prose rather than UI (§6.2). Arabic picks up 1.75 leading
 * from the locale rule in the base layer.
 *
 * Note: the API's BlogPost carries `excerpt` but no full `content` field, so
 * this renders the complete excerpt untruncated. When a body field is added,
 * swap the paragraph source — nothing else here needs to change.
 */
export function BlogArticleView({ blog }: { blog: BlogPost }) {
  const { t } = useTranslation();
  const body = blog.excerpt || "";

  const stats = [
    { icon: Eye, value: blog.views, key: "blogs.card.views" },
    { icon: ThumbsUp, value: blog.likes_count, key: "blogs.card.likes" },
    {
      icon: ThumbsDown,
      value: blog.dislikes_count,
      key: "blogs.card.dislikes",
    },
  ].filter((s) => typeof s.value === "number");

  return (
    <article className="mx-auto w-full max-w-[72ch]">
      {/* Full-size hero image, not a cropped strip */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-[var(--inset)]">
        <img
          src={blog.cover_image_url || blogPlaceholder}
          alt=""
          aria-hidden
          className="size-full object-cover"
        />
      </div>

      <h1 className="mt-6 text-[length:var(--text-headline)] font-extrabold text-foreground">
        {blog.title}
      </h1>

      {/* Byline */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[length:var(--text-caption)] font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <User className="size-4" />
          {blog.author?.name ?? `user_${blog.author?.id}`}
        </span>
        {(blog.published_at || blog.created_at) && (
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" />
            {getTime(blog.published_at || blog.created_at)}
          </span>
        )}
      </div>

      {/* Taxonomy */}
      {(blog.categories?.length > 0 || blog.tags?.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {blog.categories?.map((c) => (
            <Badge key={`c-${c.id}`} size="sm" variant="tint-accent">
              {c.name}
            </Badge>
          ))}
          {blog.tags?.map((tag) => (
            <Badge key={`t-${tag.id}`} size="sm" variant="tint-neutral">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Body — the only place weight 400 is permitted (§6.2) */}
      <div className="mt-6 text-[16px] leading-[1.6] font-normal whitespace-pre-wrap text-foreground rtl:leading-[1.75]">
        {body}
      </div>

      {/* Engagement */}
      {stats.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {stats.map(({ icon: Icon, value, key }) => (
            <span
              key={key}
              className="inline-flex items-center gap-2 rounded-[14px] bg-[var(--inset)] px-3.5 py-2 text-[length:var(--text-caption)] font-bold text-foreground"
            >
              <Icon className="size-4 text-muted-foreground" />
              <span className="tabular-nums">{value}</span>
              <span className="font-semibold text-muted-foreground">
                {getTranslation(t, key)}
              </span>
            </span>
          ))}
        </div>
      )}

      {blog.reviewer_comment && (
        <div className="mt-6 rounded-[18px] bg-[var(--chip-red-bg)] p-4">
          <p className="text-[length:var(--text-small)] font-bold text-[var(--chip-red-fg)]">
            {getTranslation(t, "blogs.card.reviewerCommentLabel")}
          </p>
          <p className="mt-1 text-[length:var(--text-caption)] font-semibold text-foreground">
            {blog.reviewer_comment}
          </p>
        </div>
      )}
    </article>
  );
}
