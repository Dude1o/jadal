import { mutationOptions } from "@tanstack/react-query";
import { http as api } from "@/services/api/http";
import {
  usersApi,
  authApi,
  debatesApi,
  debateFormatsApi,
  debateMotionsApi,
  debateMotionFrameworksApi,
  teamsApi,
  surveysApi,
  categoriesApi,
  tagsApi,
  approveRejectBlogApi,
  approveRejectComplaintApi,
  changeUserStatusApi,
  announceDebateApi,
} from "@/services/api";
import type { LoginPayload } from "@/services/api/auth";
import type { AnnouncePayload } from "@/services/api/announce-debate";
import {
  blogKeys,
  categoryKeys,
  complaintKeys,
  debateFormatKeys,
  debateKeys,
  debateMotionFrameworkKeys,
  debateMotionKeys,
  surveyKeys,
  tagKeys,
  teamKeys,
  userKeys,
  achievementKeys,
  achievementCatalogKeys,
} from "@/lib/constants";
import type {
  BlogCategory,
  BlogTag,
  Debate,
  Motion,
  MotionFramework,
  Survey,
  Team,
  User,
  UserStatus,
} from "@/types";

export const createUserMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: Record<string, any>) => {
      const hasFile = Object.values(data).some((v) => v instanceof File);
      if (hasFile) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value === null) formData.append(key, "");
          else if (value !== undefined) formData.append(key, value);
        });
        return api.post("/admin/users", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      return usersApi.create(data);
    },
    mutationKey: userKeys.all,
  });

export const editUserMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: {
      id: string | number;
      data: Record<string, any>;
    }) => {
      const hasFile = Object.values(variables.data).some(
        (v) => v instanceof File,
      );
      if (hasFile) {
        const formData = new FormData();
        Object.entries(variables.data).forEach(([key, value]) => {
          if (value === null) formData.append(key, "");
          else if (value !== undefined) formData.append(key, value);
        });
        return api.put(`/admin/users/${variables.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      return usersApi.update(variables.id, variables.data);
    },
    mutationKey: [userKeys.all, userKeys.detail],
  });

export const deleteUserMutationOptions = () =>
  mutationOptions({
    mutationFn: usersApi.delete,
    mutationKey: userKeys.all,
  });

export const createDebateMutationOptions = () =>
  mutationOptions({
    mutationFn: debatesApi.create,
    mutationKey: debateKeys.all,
  });

export const editDebateMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: { id: string | number; data: Partial<Debate> }) =>
      debatesApi.update(variables.id, variables.data),
    mutationKey: [debateKeys.all, debateKeys.detail],
  });

export const deleteDebateMutationOptions = () =>
  mutationOptions({
    mutationFn: debatesApi.delete,
    mutationKey: debateKeys.all,
  });

export const createDebateFormatMutationOptions = () =>
  mutationOptions({
    mutationFn: debateFormatsApi.create,
    mutationKey: debateFormatKeys.all,
  });

export const editDebateFormatMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: {
      id: string | number;
      data: Partial<DebateFormat>;
    }) => debateFormatsApi.update(variables.id, variables.data),
    mutationKey: [debateFormatKeys.all, debateFormatKeys.detail],
  });

export const deleteDebateFormatMutationOptions = () =>
  mutationOptions({
    mutationFn: debateFormatsApi.delete,
    mutationKey: debateFormatKeys.all,
  });

export const createDebateMotionMutationOptions = () =>
  mutationOptions({
    mutationFn: debateMotionsApi.create,
    mutationKey: debateMotionKeys.all,
  });

export const editDebateMotionMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: { id: string | number; data: Partial<Motion> }) =>
      debateMotionsApi.update(variables.id, variables.data),
    mutationKey: [debateMotionKeys.all, debateMotionKeys.detail],
  });

export const deleteDebateMotionMutationOptions = () =>
  mutationOptions({
    mutationFn: debateMotionsApi.delete,
    mutationKey: debateMotionKeys.all,
  });

export const createDebateMotionFrameworkMutationOptions = () =>
  mutationOptions({
    mutationFn: debateMotionFrameworksApi.create,
    mutationKey: debateMotionFrameworkKeys.all,
  });

export const editDebateMotionFrameworkMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: {
      id: string | number;
      data: Partial<MotionFramework>;
    }) => debateMotionFrameworksApi.update(variables.id, variables.data),
    mutationKey: [
      debateMotionFrameworkKeys.all,
      debateMotionFrameworkKeys.detail,
    ],
  });

export const deleteDebateMotionFrameworkMutationOptions = () =>
  mutationOptions({
    mutationFn: debateMotionFrameworksApi.delete,
    mutationKey: debateMotionFrameworkKeys.all,
  });

export const createTeamMutationOptions = () =>
  mutationOptions({
    mutationFn: teamsApi.create,
    mutationKey: teamKeys.all,
  });

export const editTeamMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: { id: string | number; data: Partial<Team> }) =>
      teamsApi.update(variables.id, variables.data),
    mutationKey: [teamKeys.all, teamKeys.detail],
  });

export const deleteTeamMutationOptions = () =>
  mutationOptions({
    mutationFn: teamsApi.delete,
    mutationKey: teamKeys.all,
  });

export const createSurveyMutationOptions = () =>
  mutationOptions({
    mutationFn: surveysApi.create,
    mutationKey: surveyKeys.all,
  });

export const editSurveyMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: { id: string | number; data: Partial<Survey> }) =>
      surveysApi.update(variables.id, variables.data),
    mutationKey: [surveyKeys.all, surveyKeys.detail],
  });

export const deleteSurveyMutationOptions = () =>
  mutationOptions({
    mutationFn: surveysApi.delete,
    mutationKey: surveyKeys.all,
  });

export const createCategoryMutationOptions = () =>
  mutationOptions({
    mutationFn: categoriesApi.create,
    mutationKey: categoryKeys.all,
  });

export const editCategoryMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: {
      id: string | number;
      data: Partial<BlogCategory>;
    }) => categoriesApi.update(variables.id, variables.data),
    mutationKey: [categoryKeys.all, categoryKeys.detail],
  });

export const deleteCategoryMutationOptions = () =>
  mutationOptions({
    mutationFn: categoriesApi.delete,
    mutationKey: categoryKeys.all,
  });

export const createTagMutationOptions = () =>
  mutationOptions({
    mutationFn: tagsApi.create,
    mutationKey: tagKeys.all,
  });

export const editTagMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: { id: string | number; data: Partial<BlogTag> }) =>
      tagsApi.update(variables.id, variables.data),
    mutationKey: [tagKeys.all, tagKeys.detail],
  });

export const deleteTagMutationOptions = () =>
  mutationOptions({
    mutationFn: tagsApi.delete,
    mutationKey: tagKeys.all,
  });

// APPROVE - No comment needed
export const approveBlogMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: { id: number }) =>
      approveRejectBlogApi.action(variables.id, "approve"),
    mutationKey: blogKeys.all,
  });

// REJECT - Requires comment parameter
export const rejectBlogMutationOptions = (reviewer_comment: string) =>
  mutationOptions({
    mutationFn: (variables: { id: number }) =>
      approveRejectBlogApi.action(variables.id, "reject", reviewer_comment),
    mutationKey: blogKeys.all,
  });

// DISMISS
export const dismissComplaintMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: { id: number; admin_comment?: string }) =>
      approveRejectComplaintApi.action(
        variables.id,
        "dismissed",
        variables.admin_comment,
      ),
    mutationKey: complaintKeys.all,
  });

// RESOLVE
export const resolveComplaintMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: { id: number; admin_comment?: string }) =>
      approveRejectComplaintApi.action(
        variables.id,
        "resolved",
        variables.admin_comment,
      ),
    mutationKey: complaintKeys.all,
  });

export const changeUserStatusMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: { id: number; status: UserStatus }) =>
      changeUserStatusApi.action(variables.id, variables.status),
    mutationKey: userKeys.all,
  });

export const loginMutationOptions = () =>
  mutationOptions({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
  });

export const announceDebateMutationOptions = () =>
  mutationOptions({
    mutationFn: (variables: { debateId: number; payload: AnnouncePayload }) =>
      announceDebateApi.action(variables.debateId, variables.payload),
    mutationKey: [...debateKeys.all, "announce"],
  });

export const createAchievementCatalogMutationOptions = () =>
  mutationOptions({
    mutationFn: async ({
      name,
      type,
      image,
    }: {
      name: string;
      type: string;
      image?: File;
    }) => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      if (image) {
        formData.append("image", image);
      }

      return api.post("/admin/achievements", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    mutationKey: achievementCatalogKeys.all,
  });

export const updateAchievementCatalogMutationOptions = () =>
  mutationOptions({
    mutationFn: async ({
      id,
      name,
      type,
      image,
    }: {
      id: number;
      name: string;
      type: string;
      image: File | string | null;
    }) => {
      const body: Record<string, unknown> = { name, type };
      if (image !== undefined) {
        if (image instanceof File) {
          body.image = await fileToBase64(image);
        } else {
          // string (existing URL) or null (remove image)
          body.image = image;
        }
      }
      return api.put(`/admin/achievements/${id}`, body, {
        headers: { "Content-Type": "application/json" },
      });
    },
    mutationKey: achievementCatalogKeys.all,
  });

export const deleteAchievementCatalogMutationOptions = () =>
  mutationOptions({
    mutationFn: ({ id, force }: { id: number; force?: boolean }) =>
      api.delete(`/admin/achievements/${id}`, {
        params: { force: force ? "true" : undefined },
      }),
    mutationKey: achievementCatalogKeys.all,
  });

export const createAchievementMutationOptions = () =>
  mutationOptions({
    mutationFn: ({
      userId,
      achievement_id,
    }: {
      userId: number;
      achievement_id: number;
    }) => api.post(`/admin/users/${userId}/achievements`, { achievement_id }),
    mutationKey: achievementKeys.all,
  });

export const deleteAchievementMutationOptions = () =>
  mutationOptions({
    mutationFn: ({
      userId,
      achievement_id,
    }: {
      userId: number;
      achievement_id: number;
    }) => api.delete(`/admin/users/${userId}/achievements/${achievement_id}`),
    mutationKey: achievementKeys.all,
  });
