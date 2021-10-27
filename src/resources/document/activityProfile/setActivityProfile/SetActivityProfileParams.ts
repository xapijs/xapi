import { Document } from "../../Document";

export interface SetActivityProfileParams {
  activityId: string;
  profileId: string;
  profile: Document;
  etag: string;
  matchHeader: "If-Match" | "If-None-Match";
  contentType?: string;
}
