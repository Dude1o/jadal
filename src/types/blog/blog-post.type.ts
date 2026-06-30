import type { BlogPostStatus } from "../shared/enums";
import type { User } from "../user/user.type";

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  reviewer_comment: string;
  cover_image_url: string | null;
  author: User;
  categories: BlogCategory[];
  tags: BlogTag[];
  views: number | null;
  likes_count: number | null;
  dislikes_count: number | null;
  status: BlogPostStatus;
  published_at: string | null;
  created_at: string;
}
