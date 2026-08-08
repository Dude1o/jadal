import { useState } from "react";
import { BlogCard } from "@/components/features/blogs/blog-card";
import {
  ChevronDown,
  Edit,
  FolderTree,
  Hash,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  blogCategoriesQueryOptions,
  blogTagsQueryOptions,
  blogsQueryOptions,
} from "@/api/query-options";

import BlogCategoryForm from "./blog-category-form";
import AppHeader from "@/components/common/app-header";

import Pagination from "@/components/common/pagination";
import DeleteItem from "@/components/common/delete-item";

import type { BlogCategory, BlogTag } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCreate } from "@/hooks/api/use-create";
import { useUpdate } from "@/hooks/api/use-update";
import { useDelete } from "@/hooks/api/use-delete";

import {
  createCategoryMutationOptions,
  deleteCategoryMutationOptions,
  editCategoryMutationOptions,
  createTagMutationOptions,
  editTagMutationOptions,
  deleteTagMutationOptions,
} from "@/api/mutation-options";

import { categoryKeys, tagKeys } from "@/lib/constants";
import BlogTagForm from "./blog-tag-form";
import { useDialogStore } from "@/services";

interface BlogListProps {
  page?: number;
}

export function BlogList({ page = 1 }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<number | null>(null);

  const [showCategories, setShowCategories] = useState(false);
  const [showTags, setShowTags] = useState(false);

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dialog = useDialogStore();

  // =========================
  // Category CRUD
  // =========================

  const { mutateAsync: createCategory } = useCreate({
    mutationOptions: createCategoryMutationOptions(),
    queryKey: categoryKeys.all,
    successMessage: getTranslation(t, "categories.messages.created"),
    errorMessage: getTranslation(t, "categories.messages.createError"),
  });

  const { mutateAsync: updateCategory } = useUpdate({
    mutationOptions: editCategoryMutationOptions(),
    queryKey: categoryKeys.all,
    getDetailKey: (id) => categoryKeys.detail(String(id)),
    successMessage: getTranslation(t, "categories.messages.updated"),
    errorMessage: getTranslation(t, "categories.messages.updateError"),
  });

  const { mutateAsync: deleteCategory } = useDelete({
    mutationOptions: deleteCategoryMutationOptions(),
    queryKey: categoryKeys.list(),
    successMessage: getTranslation(t, "categories.messages.deleted"),
    errorMessage: getTranslation(t, "categories.messages.deleteError"),
  });

  // =========================
  // Tag CRUD
  // =========================

  const { mutateAsync: createTag } = useCreate({
    mutationOptions: createTagMutationOptions(),
    queryKey: tagKeys.all,
    successMessage: getTranslation(t, "tags.messages.created"),
    errorMessage: getTranslation(t, "tags.messages.createError"),
  });

  const { mutateAsync: updateTag } = useUpdate({
    mutationOptions: editTagMutationOptions(),
    queryKey: tagKeys.all,
    getDetailKey: (id) => tagKeys.detail(String(id)),
    successMessage: getTranslation(t, "tags.messages.updated"),
    errorMessage: getTranslation(t, "tags.messages.updateError"),
  });

  const { mutateAsync: deleteTag } = useDelete({
    mutationOptions: deleteTagMutationOptions(),
    queryKey: tagKeys.list(),
    successMessage: getTranslation(t, "tags.messages.deleted"),
    errorMessage: getTranslation(t, "tags.messages.deleteError"),
  });

  // =========================
  // Queries
  // =========================

  const { data: categoriesData } = useQuery(blogCategoriesQueryOptions());
  const categories = categoriesData ?? [];

  const { data: tagsData } = useQuery(blogTagsQueryOptions());
  const tags = tagsData ?? [];

  const { data: blogPaginatedData } = useQuery({
    ...blogsQueryOptions({
      page,
      perPage: 12,
    }),
    placeholderData: keepPreviousData,
  });

  const blogs = blogPaginatedData?.data || [];
  const meta = blogPaginatedData?.meta;

  // =========================
  // Filters
  // =========================

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      !activeCategory ||
      blog.categories?.some((cat) => cat.name === activeCategory);

    const matchesTag =
      !activeTag || blog.tags?.some((tag) => tag.id === activeTag);

    return matchesCategory && matchesTag;
  });

  // =========================
  // Category Dialogs
  // =========================

  const openCreateCategory = () => {
    const dialogId = dialog.open({
      title: getTranslation(t, "blogs.actions.createCategory"),
      closeOnOutsideClick: true,

      children: (
        <BlogCategoryForm
          onSubmit={async (values) => {
            await createCategory(values);
            dialog.close(dialogId);
          }}
        />
      ),

      closable: true,
    });
  };

  const openEditCategory = (category: BlogCategory) => {
    const dialogId = dialog.open({
      title: getTranslation(t, "blogs.actions.editCategory"),
      closeOnOutsideClick: true,

      children: (
        <BlogCategoryForm
          category={category}
          onSubmit={async (values) => {
            await updateCategory({
              id: category.id,
              data: values,
            });

            dialog.close(dialogId);
          }}
        />
      ),

      closable: true,
    });
  };

  const openDeleteCategory = (category: BlogCategory) => {
    const dialogId = dialog.open({
      title: getTranslation(t, "common.delete.title"),

      children: (
        <DeleteItem
          itemName={category.name}
          gender="female"
          onDelete={async () => {
            await deleteCategory(category.id);
            dialog.close(dialogId);
          }}
          onCancel={() => {
            dialog.close(dialogId);
          }}
        />
      ),
    });
  };

  // =========================
  // Tag Dialogs
  // =========================

  const openCreateTag = () => {
    const dialogId = dialog.open({
      title: getTranslation(t, "blogs.actions.createTag"),
      closeOnOutsideClick: true,

      children: (
        <BlogTagForm
          onSubmit={async (values) => {
            await createTag(values);
            dialog.close(dialogId);
          }}
        />
      ),

      closable: true,
    });
  };

  const openEditTag = (tag: BlogTag) => {
    const dialogId = dialog.open({
      title: getTranslation(t, "blogs.actions.editTag"),
      closeOnOutsideClick: true,

      children: (
        <BlogTagForm
          tag={tag}
          onSubmit={async (values) => {
            await updateTag({
              id: tag.id,
              data: values,
            });

            dialog.close(dialogId);
          }}
        />
      ),

      closable: true,
    });
  };

  const openDeleteTag = (tag: BlogTag) => {
    const dialogId = dialog.open({
      title: getTranslation(t, "common.delete.title"),

      children: (
        <DeleteItem
          itemName={tag.name}
          gender="male"
          onDelete={async () => {
            await deleteTag(tag.id);
            dialog.close(dialogId);
          }}
          onCancel={() => {
            dialog.close(dialogId);
          }}
        />
      ),
    });
  };

  // =========================
  // Pagination
  // =========================

  const handlePageChange = (newPage: number) => {
    navigate({
      to: "/blogs",
      search: (prev) => ({
        ...prev,
        page: newPage,
      }),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* The blue band every other screen has. */}
      <div>
        <AppHeader
          entity="blog"
          title={getTranslation(t, "blogs.title")}
          description={getTranslation(t, "blogs.subtitle")}
        />
      </div>
      {/* Topics and tags.
          Every chip here used to be `border` + transparent fill. The global
          no-border rule zeroes border-style, so unselected chips rendered as
          bare text floating on the page with no shape at all — that is what
          made this strip look unfinished. Chips are now tinted fills, which is
          how every other control in the app separates itself.

          The row-level `More` button also used hardcoded `right-2`/`pr-9`, so
          in Arabic it sat on top of the label. Logical properties throughout. */}
      <div>
        <div
          className="jd-toolbar grid gap-x-8 gap-y-5 lg:grid-cols-2"
          dir={i18n.dir()}
        >
          <FilterRow
            icon={FolderTree}
            label={getTranslation(t, "blogs.topics")}
            count={categories.length}
            open={showCategories}
            onToggle={() => setShowCategories((v) => !v)}
            onCreate={openCreateCategory}
            createLabel={getTranslation(t, "blogs.actions.createCategory")}
            allActive={!activeCategory}
            onClearAll={() => setActiveCategory(null)}
            allLabel={getTranslation(t, "common.labels.all")}
            items={categories.map((category) => ({
              key: category.id,
              name: category.name,
              active: activeCategory === category.name,
              onSelect: () =>
                setActiveCategory(
                  activeCategory === category.name ? null : category.name,
                ),
              onEdit: () => openEditCategory(category),
              onDelete: () => openDeleteCategory(category),
            }))}
            t={t}
          />

          <FilterRow
            icon={Hash}
            label={getTranslation(t, "blogs.tags")}
            count={tags.length}
            open={showTags}
            onToggle={() => setShowTags((v) => !v)}
            onCreate={openCreateTag}
            createLabel={getTranslation(t, "blogs.actions.createTag")}
            allActive={!activeTag}
            onClearAll={() => setActiveTag(null)}
            allLabel={getTranslation(t, "common.labels.all")}
            items={tags.map((tag) => ({
              key: tag.id,
              name: tag.name,
              active: activeTag === tag.id,
              onSelect: () => setActiveTag(activeTag === tag.id ? null : tag.id),
              onEdit: () => openEditTag(tag),
              onDelete: () => openDeleteTag(tag),
            }))}
            t={t}
          />
        </div>
      </div>

      {/* Feed */}
      <div className="pt-6">
        {filteredBlogs.length === 0 ? (
          <div
            className="text-center py-16 text-sm"
            style={{
              color: "var(--muted-foreground)",
            }}
          >
            {getTranslation(t, "blogs.empty.noPosts")}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 items-stretch gap-7 min-[760px]:grid-cols-2 min-[1560px]:grid-cols-3">
              {filteredBlogs.map((blog, i) => (
                <div
                  key={blog.id}
                  style={{
                    animationDelay: `${i * 60}ms`,
                    animation: "fadeSlideIn 0.35s ease both",
                  }}
                >
                  <BlogCard blog={blog} variant="feed" />
                </div>
              ))}
            </div>
            {meta && meta.last_page > 1 && (
              <div className="mb-4">
                <Pagination
                  currentPage={page}
                  lastPage={meta?.last_page}
                  onPageChange={(newPage) => {
                    navigate({
                      to: "/blogs",
                      search: (prev) => ({ ...prev, page: newPage }),
                    });
                    // Optional: scroll to top
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

type FilterChip = {
  key: number | string;
  name: string;
  active: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

/**
 * One taxonomy: a disclosure header, then a wrap of selectable chips.
 *
 * Two rows side by side from `lg` up. Stacked full-width, each row was a short
 * label at one end and a lone button at the other with a metre of nothing
 * between them.
 *
 * Collapsed, the row still reports its state: an orange dot on the icon and
 * the selected chip echoed beside the label, so closing a section never hides
 * the fact that a filter is on.
 */
function FilterRow({
  icon: Icon,
  label,
  count,
  open,
  onToggle,
  onCreate,
  createLabel,
  allActive,
  onClearAll,
  allLabel,
  items,
  t,
}: {
  icon: LucideIcon;
  label: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  onCreate: () => void;
  createLabel: string;
  allActive: boolean;
  onClearAll: () => void;
  allLabel: string;
  items: FilterChip[];
  t: TFunction;
}) {
  const chip =
    "inline-flex h-9 cursor-pointer items-center rounded-full px-4 text-[length:var(--text-caption)] font-bold transition-[background-color,color,box-shadow] duration-150 ease-out";
  const idle =
    "bg-[var(--toolbar-field)] text-muted-foreground hover:bg-[color-mix(in_oklab,var(--accent-btn)_16%,var(--toolbar-field))] hover:text-foreground";
  const on =
    "bg-[var(--accent-btn)] text-[var(--accent-btn-fg)] shadow-[0_2px_8px_-3px_rgba(245,154,74,.55)]";

  const selected = items.find((i) => i.active);

  return (
    <section className="min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="group flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-start"
        >
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--toolbar-field)] text-muted-foreground transition-colors duration-150 ease-out group-hover:text-foreground">
            <Icon className="size-[18px]" />
            {selected && (
              <span className="absolute end-1 top-1 size-2 rounded-full bg-[var(--accent-btn)]" />
            )}
          </span>

          <span className="min-w-0">
            <span className="flex items-center gap-1.5">
              <span className="text-[length:var(--text-caption)] font-bold tracking-[0.1em] text-foreground uppercase">
                {label}
              </span>
              <span className="text-[length:var(--text-small)] font-bold text-muted-foreground tabular-nums">
                {count}
              </span>
            </span>
            <span className="block truncate text-[length:var(--text-small)] font-semibold text-muted-foreground">
              {selected ? selected.name : allLabel}
            </span>
          </span>

          <ChevronDown
            className={`ms-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        <button
          type="button"
          onClick={onCreate}
          aria-label={createLabel}
          title={createLabel}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-[12px] bg-[var(--toolbar-field)] text-muted-foreground transition-colors duration-150 ease-out hover:bg-[var(--accent-btn)] hover:text-[var(--accent-btn-fg)]"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {open && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClearAll}
            className={`${chip} ${allActive ? on : idle}`}
          >
            {allLabel}
          </button>

          {items.map((item) => (
            <span key={item.key} className="relative inline-flex">
              <button
                type="button"
                onClick={item.onSelect}
                className={`${chip} pe-9 ${item.active ? on : idle}`}
              >
                {item.name}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label={getTranslation(t, "common.labels.actions")}
                    className="absolute end-1 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 ease-out hover:bg-black/10 dark:hover:bg-white/15"
                  >
                    <MoreHorizontal className="size-3.5" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={item.onEdit}
                    className="cursor-pointer gap-2"
                  >
                    <Edit className="size-4" />
                    {getTranslation(t, "common.actions.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={item.onDelete}
                    className="cursor-pointer gap-2 text-destructive"
                  >
                    <Trash2 className="size-4" />
                    {getTranslation(t, "common.actions.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          ))}

          {items.length === 0 && (
            <span className="inline-flex h-9 items-center text-[length:var(--text-caption)] font-semibold text-muted-foreground/70">
              {getTranslation(t, "common.labels.noResults")}
            </span>
          )}
        </div>
      )}
    </section>
  );
}
