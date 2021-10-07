import { DocumentJson } from "../../XAPI";

export interface CreateActivityProfileParams {
  activityId: string;
  profileId: string;
  profile: DocumentJson;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
}
