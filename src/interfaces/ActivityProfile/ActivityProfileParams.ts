import { Document, DocumentJson, Timestamp } from "..";

export interface CreateActivityProfileParams {
  activityId: string;
  profileId: string;
  profile: DocumentJson;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
}

export interface SetActivityProfileParams {
  activityId: string;
  profileId: string;
  profile: Document;
  etag: string;
  matchHeader: "If-Match" | "If-None-Match";
  contentType?: string;
}

export interface GetActivityProfilesParams {
  activityId: string;
  since?: Timestamp;
}

export interface GetActivityProfileParams {
  activityId: string;
  profileId: string;
}

export interface DeleteActivityProfileParams {
  activityId: string;
  profileId: string;
  etag?: string;
}
