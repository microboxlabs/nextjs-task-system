import { InferSelectModel } from "drizzle-orm";
import { comments, groupMemberships, groups, tasks, users } from "./schema";

export type TaskT = InferSelectModel<typeof tasks> & {
  assignedUser?: UserT;
  assignedGroup?: GroupT;
  comments?: CommentsT[];
};

export type GroupMembershipT = InferSelectModel<typeof groupMemberships> & {
  group?: GroupT;
};

export type UserT = InferSelectModel<typeof users> & {
  groupMemberships?: GroupMembershipT[];
};

export type GroupT = InferSelectModel<typeof groups>;

export type CommentsT = InferSelectModel<typeof comments> & {
  user?: UserT;
};
