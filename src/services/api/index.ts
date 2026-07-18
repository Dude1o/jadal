import type {
  Debate,
  DebateFormat,
  Motion,
  MotionFramework,
  Survey,
  Team,
  User,
} from "@/types";
import { createCrudApi } from "./crud";
import { authApi } from "./auth";
import { approveRejectBlogApi } from "./approve-reject-blog";
import { approveRejectComplaintApi } from "./resolve-reject-complaint";
import { changeUserStatusApi } from "./change-user-status";
import { announceDebateApi } from "./announce-debate";
import { debateRegistrationsApi } from "./debate-registrations";

export const usersApi = createCrudApi<User>("/admin/users");
export const debatesApi = createCrudApi<Debate>("/admin/debates");
export const debateFormatsApi = createCrudApi<DebateFormat>(
  "/admin/debate-formats",
);
export const debateMotionsApi = createCrudApi<Motion>("/motions");
export const debateMotionFrameworksApi = createCrudApi<MotionFramework>(
  "/admin/motion-frameworks",
);
export const teamsApi = createCrudApi<Team>("/teams");
export const categoriesApi = createCrudApi<Team>("/admin/blog/categories");
export const tagsApi = createCrudApi<Team>("/admin/blog/tags");
export const surveysApi = createCrudApi<Survey>("/admin/surveys");

export {
  authApi,
  approveRejectBlogApi,
  approveRejectComplaintApi,
  changeUserStatusApi,
  announceDebateApi,
  debateRegistrationsApi,
};
