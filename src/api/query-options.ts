import api from "@/lib/axios";
import {
  blogCategoryKeys,
  blogKeys,
  blogTagKeys,
  complaintKeys,
  debateFormatKeys,
  debateKeys,
  debateMotionFrameworkKeys,
  debateMotionKeys,
  statisticKeys,
  surveyKeys,
  teamKeys,
  userKeys,
} from "@/lib/constants";
import type {
  BlogCategory,
  Complaint,
  BlogPost,
  Debate,
  Team,
  User,
  Survey,
  TeamStatus,
  PaginatedApiResponse,
  BlogTag,
  ApiResponse,
  DebateFormat,
  Motion,
  MotionFramework,
  SurveyResponse,
  DebateStatus,
  UserRole,
  FrameworkFairness,
  ComplaintAccountability,
  EngagementChurn,
  Leaderboard,
  PlatformHealth,
} from "@/types";
import { queryOptions } from "@tanstack/react-query";

export const usersQueryOptions = (
  params: {
    search?: string;
    role?: UserRole;
    page?: number;
    perPage?: number;
  } = {},
) =>
  queryOptions<PaginatedApiResponse<User>>({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const { search, role, page = 1, perPage = 10 } = params;

      const response = await api.get<PaginatedApiResponse<User>>(
        "/admin/users",
        {
          params: {
            search: search || undefined,
            role: role || undefined,
            page,
            per_page: perPage,
          },
        },
      );
      return response.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const userQueryOptions = (id: number) =>
  queryOptions<User>({
    queryKey: userKeys.detail(id?.toString()), // ← role in key so cache is per-role
    queryFn: async () => {
      const response = await api.get<ApiResponse<User>>(`/admin/users/${id}`);

      return response.data.data; // Extract the data array
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const debatesQueryOptions = (
  params: {
    search?: string;
    status?: DebateStatus; // ✅ Use DebateStatus, not string
    tag?: string;
    page?: number;
    perPage?: number;
  } = {},
) =>
  queryOptions<PaginatedApiResponse<Debate>>({
    queryKey: debateKeys.list(params),
    queryFn: async () => {
      const { search, status, tag, page = 1, perPage = 10 } = params;

      const response = await api.get<PaginatedApiResponse<Debate>>(
        "/admin/debates",
        {
          params: {
            search: search || undefined,
            status: status || undefined,
            tag: tag || undefined,
            page,
            per_page: perPage,
          },
        },
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const debateQueryOptions = (id: number) =>
  queryOptions<Debate>({
    queryKey: debateKeys.detail(id?.toString()), // ← role in key so cache is per-role
    queryFn: async () => {
      const response = await api.get<ApiResponse<Debate>>(
        `/admin/debates/${id}`,
      );
      return response.data.data; // Extract the data array
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const debateFormatsQueryOptions = (
  params: {
    search?: string;
    page?: number;
    perPage?: number;
  } = {},
) =>
  queryOptions<PaginatedApiResponse<DebateFormat>>({
    queryKey: debateFormatKeys.all,
    queryFn: async () => {
      const { search, page = 1, perPage = 10 } = params;

      const response = await api.get<PaginatedApiResponse<DebateFormat>>(
        "/debate-formats",
        {
          params: {
            search: search || undefined,
            page,
            per_page: perPage,
          },
        },
      );
      return response.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const debateFormatQueryOptions = (id: number | string) =>
  queryOptions<DebateFormat>({
    queryKey: debateFormatKeys.detail(id?.toString()),
    queryFn: async () => {
      const response = await api.get<ApiResponse<DebateFormat>>(
        `/debate-formats/${id}`,
      );
      return response.data.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const debateMotionsQueryOptions = (
  params: {
    search?: string;
    page?: number;
    perPage?: number;
  } = {},
) =>
  queryOptions({
    queryKey: debateMotionKeys.list(params),
    queryFn: async () => {
      const { search, page = 1, perPage = 10 } = params;

      const response = await api.get<PaginatedApiResponse<Motion>>("/motions", {
        params: {
          search: search || undefined,
          page,
          per_page: perPage,
        },
      });

      return response.data; // Return full paginated response (data + meta)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

export const debateMotionQueryOptions = (id: number | string) =>
  queryOptions<Motion>({
    queryKey: debateMotionKeys.detail(id?.toString()),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Motion>>(`/motions/${id}`);
      return response.data.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const debateMotionFrameworksQueryOptions = (
  params: {
    search?: string;
    page?: number;
    perPage?: number;
  } = {},
) =>
  queryOptions<PaginatedApiResponse<MotionFramework>>({
    queryKey: debateMotionFrameworkKeys.all,
    queryFn: async () => {
      const { search, page = 1, perPage = 10 } = params;
      const response = await api.get<PaginatedApiResponse<MotionFramework>>(
        `/motion-frameworks`,
        {
          params: {
            search: search || undefined,
            page,
            per_page: perPage,
          },
        },
      );
      return response.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const debateMotionFrameworkQueryOptions = (id: number | string) =>
  queryOptions<MotionFramework>({
    queryKey: debateMotionFrameworkKeys.detail(id?.toString()),
    queryFn: async () => {
      const response = await api.get<ApiResponse<MotionFramework>>(
        `/motion-frameworks/${id}`,
      );
      return response.data.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const blogsQueryOptions = (
  params: {
    page?: number;
    perPage?: number;
  } = {},
) =>
  queryOptions<PaginatedApiResponse<BlogPost>>({
    queryKey: blogKeys.list(params),
    queryFn: async () => {
      const { page = 1, perPage = 10 } = params;

      const response = await api.get<PaginatedApiResponse<BlogPost>>(
        "/admin/blog",
        {
          params: {
            page,
            per_page: perPage,
          },
        },
      );
      return response.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const blogCategoriesQueryOptions = () =>
  queryOptions<BlogCategory[]>({
    queryKey: blogCategoryKeys.list(),
    queryFn: async () => {
      const response = await api.get<PaginatedApiResponse<BlogCategory>>(
        "/admin/blog/categories",
      );

      return response.data.data;
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 30,
  });

export const blogTagsQueryOptions = () =>
  queryOptions<BlogTag[]>({
    queryKey: blogTagKeys.list(),
    queryFn: async () => {
      const response =
        await api.get<PaginatedApiResponse<BlogTag>>("/admin/blog/tags");

      return response.data.data;
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 30,
  });

export const teamsQueryOptions = (
  params: {
    search?: string;
    status?: TeamStatus;
    type?: "manual" | "random";
  } = {},
) =>
  queryOptions<PaginatedApiResponse<Team>>({
    queryKey: teamKeys.list(params),
    queryFn: async () => {
      const { search, status, type } = params;
      const response = await api.get<PaginatedApiResponse<Team>>("/teams", {
        params: {
          search: search || undefined,
          status,
          is_random: type === "random",
        },
      });

      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const teamQueryOptions = (id: number) =>
  queryOptions<Team>({
    queryKey: teamKeys.detail(id?.toString()),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Team>>(`/teams/${id}`);
      return response.data.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const surveysQueryOptions = (
  params: {
    page?: number;
    status?: "open" | "closing-soon" | "closed";
  } = {},
) =>
  queryOptions<PaginatedApiResponse<Survey>>({
    queryKey: surveyKeys.list(),
    queryFn: async () => {
      const { status, page = 1 } = params;

      const response = await api.get<PaginatedApiResponse<Survey>>(
        "/admin/surveys",
        {
          params: {
            status,
            page,
          },
        },
      );
      return response.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const surveyQueryOptions = (id: number) =>
  queryOptions<Survey>({
    queryKey: surveyKeys.detail(String(id)),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Survey>>(
        `/admin/surveys/${id}`,
      );
      return response.data.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const surveyResultsQueryOptions = (id: number) =>
  queryOptions<SurveyResponse>({
    queryKey: surveyKeys.detailResults(id.toString()),
    queryFn: async () => {
      const response = await api.get<ApiResponse<SurveyResponse>>(
        `/admin/surveys/${id}/results`,
      );
      return response.data.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const compalintsQueryOptions = () =>
  queryOptions<Complaint[]>({
    queryKey: complaintKeys.list(),
    queryFn: async () => {
      const response =
        await api.get<PaginatedApiResponse<Complaint>>(`/admin/complaints`);
      return response.data.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const complaintQueryOptions = (id: number) =>
  queryOptions<Complaint>({
    queryKey: complaintKeys.detail(String(id)),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Complaint>>(
        `/admin/complaints/${id}`,
      );
      return response.data.data; // Extract the data array
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const fairnessStatisticsQueryOptions = (
  params: {
    from?: string; // "YYYY-MM"
    to?: string; // "YYYY-MM"
    formats?: number[];
    min_n_debates?: number;
  } = {},
) =>
  queryOptions<FrameworkFairness>({
    queryKey: statisticKeys.list(params),
    queryFn: async () => {
      const response = await api.get<ApiResponse<FrameworkFairness>>(
        `/admin/stats/framework-fairness`,
        {
          params: {
            from: params.from,
            to: params.to,
            formats: params.formats?.join(","),
            min_n_debates: params.min_n_debates,
          },
        },
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const leaderboardStatisticsQueryOptions = (params?: {
  board: "most_improved" | "win_rate" | "avg_score" | "most_active";
  from?: string;
  to?: string;
  formats?: number[];
  limit?: number;
  min_n_debates?: number;
}) =>
  queryOptions<Leaderboard>({
    queryKey: statisticKeys.leaderboard(params),
    queryFn: async () => {
      const response = await api.get<ApiResponse<Leaderboard>>(
        `/admin/stats/leaderboard`,
        {
          params: {
            board: params.board,
            from: params.from,
            to: params.to,
            formats: params.formats?.join(","),
            limit: params.limit,
            min_n_debates: params.min_n_debates,
          },
        },
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const platformHealthStatisticsQueryOptions = (
  params: {
    from?: string;
    to?: string;
    formats?: number[];
    group_by?: "none" | "year" | "month";
    series?: "none" | "role" | "debate_format";
  } = {},
) =>
  queryOptions<PlatformHealth>({
    queryKey: statisticKeys.platformHealth(params),
    queryFn: async () => {
      const response = await api.get<ApiResponse<PlatformHealth>>(
        `/admin/stats/platform-health`,
        {
          params: {
            from: params.from,
            to: params.to,
            formats: params.formats?.join(","),
            group_by: params.group_by,
            series: params.series,
          },
        },
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const engagementChurnStatisticsQueryOptions = (
  params: {
    // NOTE: no from/to/formats — this stat runs on rolling day windows
    // anchored to now, not calendar filters.
    recent_window_days?: number;
    baseline_window_days?: number;
    churn_threshold_days?: number;
    risk_filter?: "churn_risk" | "ramping_up" | "all";
    page?: number;
    per_page?: number;
  } = {},
) =>
  queryOptions<EngagementChurn>({
    queryKey: statisticKeys.engagementChurn(params),
    queryFn: async () => {
      const response = await api.get<ApiResponse<EngagementChurn>>(
        `/admin/stats/engagement-churn`,
        {
          params: {
            recent_window_days: params.recent_window_days,
            baseline_window_days: params.baseline_window_days,
            churn_threshold_days: params.churn_threshold_days,
            risk_filter: params.risk_filter,
            page: params.page,
            per_page: params.per_page,
          },
        },
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

export const complaintAccountabilityStatisticsQueryOptions = (
  params: {
    from?: string;
    to?: string;
    formats?: number[];
    target_role?: "debater" | "trainer" | "judge" | "chair";
    status?: "open" | "under_review" | "resolved" | "dismissed";
    min_debates_involved?: number;
  } = {},
) =>
  queryOptions<ComplaintAccountability>({
    queryKey: statisticKeys.complaintAccountability(params),
    queryFn: async () => {
      const response = await api.get<ApiResponse<ComplaintAccountability>>(
        `/admin/stats/complaint-accountability`,
        {
          params: {
            from: params.from,
            to: params.to,
            formats: params.formats?.join(","),
            target_role: params.target_role,
            status: params.status,
            min_debates_involved: params.min_debates_involved,
          },
        },
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
