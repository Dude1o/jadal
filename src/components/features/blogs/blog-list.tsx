import { useState } from "react";
import { BlogCard } from "@/components/features/blogs/blog-card";
import { ChevronDown, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { getTranslation } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import {
  blogCategoriesQueryOptions,
  blogTagsQueryOptions,
  blogsQueryOptions,
} from "@/api/query-options";

import BlogCategoryForm from "./blog-category-form";

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

  const { data: categories } = useSuspenseQuery(blogCategoriesQueryOptions());

  const { data: tags } = useSuspenseQuery(blogTagsQueryOptions());

  const { data: blogPaginatedData } = useSuspenseQuery(
    blogsQueryOptions({
      page,
      perPage: 12,
    }),
  );

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
      className="min-h-screen"
      style={{
        background: "var(--background)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-20 border-b backdrop-blur-md"
        style={{
          background: "color-mix(in oklch, var(--background) 85%, transparent)",
          borderColor: "var(--border)",
        }}
      >
        <div
          className="max-w-2xl mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3"
          dir={i18n.dir()}
        >
          <div className="flex items-center justify-between">
            <h1
              className="text-xl font-bold tracking-tight"
              style={{
                color: "var(--foreground)",
                fontFamily: "var(--font-serif)",
              }}
            >
              {getTranslation(t, "blogs.title")}
            </h1>

            <div className="flex flex-row gap-2">
              {/* Categories Toggle */}
              <button
                onClick={() => setShowCategories((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted-foreground)",
                  background: showCategories
                    ? "color-mix(in oklch, var(--accent) 10%, transparent)"
                    : "transparent",
                }}
              >
                {getTranslation(t, "blogs.topics")}

                <ChevronDown
                  className="h-3 w-3 transition-transform duration-200"
                  style={{
                    transform: showCategories
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Tags Toggle */}
              <button
                onClick={() => setShowTags((prev) => !prev)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted-foreground)",
                  background: showTags
                    ? "color-mix(in oklch, var(--accent) 10%, transparent)"
                    : "transparent",
                }}
              >
                {getTranslation(t, "blogs.tags")}

                <ChevronDown
                  className="h-3 w-3 transition-transform duration-200"
                  style={{
                    transform: showTags ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
            </div>
          </div>

          {/* Categories */}
          {showCategories && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 flex-wrap pb-1">
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200"
                  style={{
                    background: !activeCategory
                      ? "color-mix(in oklch, var(--accent) 15%, transparent)"
                      : "transparent",

                    borderColor: !activeCategory
                      ? "var(--accent)"
                      : "var(--border)",

                    color: !activeCategory
                      ? "var(--accent)"
                      : "var(--muted-foreground)",
                  }}
                >
                  {getTranslation(t, "common.labels.all")}
                </button>

                {categories.map((category) => (
                  <div key={category.id} className="relative inline-flex">
                    <button
                      onClick={() =>
                        setActiveCategory(
                          activeCategory === category.name
                            ? null
                            : category.name,
                        )
                      }
                      className="text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200 flex items-center gap-2 pr-9"
                      style={{
                        background:
                          activeCategory === category.name
                            ? "color-mix(in oklch, var(--accent) 15%, transparent)"
                            : "transparent",

                        borderColor:
                          activeCategory === category.name
                            ? "var(--accent)"
                            : "var(--border)",

                        color:
                          activeCategory === category.name
                            ? "var(--accent)"
                            : "var(--muted-foreground)",
                      }}
                    >
                      {category.name}
                    </button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => openEditCategory(category)}
                          className="gap-2 cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                          {getTranslation(t, "common.actions.edit")}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => openDeleteCategory(category)}
                          className="gap-2 text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                          {getTranslation(t, "common.actions.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>

              <button
                onClick={openCreateCategory}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 hover:border-accent/50 hover:text-accent self-start"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted-foreground)",
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                {getTranslation(t, "blogs.actions.createCategory")}
              </button>
            </div>
          )}

          {/* Tags */}
          {showTags && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 flex-wrap pb-1">
                <button
                  onClick={() => setActiveTag(null)}
                  className="text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200"
                  style={{
                    background: !activeTag
                      ? "color-mix(in oklch, var(--accent) 15%, transparent)"
                      : "transparent",

                    borderColor: !activeTag ? "var(--accent)" : "var(--border)",

                    color: !activeTag
                      ? "var(--accent)"
                      : "var(--muted-foreground)",
                  }}
                >
                  {getTranslation(t, "common.labels.all")}
                </button>

                {tags.map((tag) => (
                  <div key={tag.id} className="relative inline-flex">
                    <button
                      onClick={() =>
                        setActiveTag(activeTag === tag.id ? null : tag.id)
                      }
                      className="text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200 flex items-center gap-2 pr-9"
                      style={{
                        background:
                          activeTag === tag.id
                            ? "color-mix(in oklch, var(--accent) 15%, transparent)"
                            : "transparent",

                        borderColor:
                          activeTag === tag.id
                            ? "var(--accent)"
                            : "var(--border)",

                        color:
                          activeTag === tag.id
                            ? "var(--accent)"
                            : "var(--muted-foreground)",
                      }}
                    >
                      {tag.name}
                    </button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => openEditTag(tag)}
                          className="gap-2 cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                          {getTranslation(t, "common.actions.edit")}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => openDeleteTag(tag)}
                          className="gap-2 text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                          {getTranslation(t, "common.actions.delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>

              <button
                onClick={openCreateTag}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 hover:border-accent/50 hover:text-accent self-start"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted-foreground)",
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                {getTranslation(t, "blogs.actions.createTag")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-5">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
