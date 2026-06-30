import { BlogList } from "@/components/features/blogs/blog-list";
import NotFoundPage from "@/components/common/not-found";
import BlogListSkeleton from "@/components/features/blogs/blog-list-skeleton";
import { blogsQueryOptions } from "@/api/query-options";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

const searchSchema = z.object({
  page: z.coerce.number().optional().default(1),
});

export const Route = createFileRoute("/_dashboard/blogs")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({
    page: search.page,
  }),
  component: RouteComponent,
  pendingComponent: BlogListSkeleton,
  notFoundComponent: NotFoundPage,
});

function RouteComponent() {
  const { page } = Route.useSearch();

  return <BlogList page={page} />;
}
