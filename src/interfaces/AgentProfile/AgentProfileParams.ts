import { Agent, DocumentJson, Timestamp } from "..";

export interface CreateAgentProfileParams {
  agent: Agent;
  profileId: string;
  profile: DocumentJson;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
}

export interface SetAgentProfileParams {
  agent: Agent;
  profileId: string;
  profile: Document;
  etag: string;
  matchHeader: "If-Match" | "If-None-Match";
  contentType?: string;
}

export interface GetAgentProfilesParams {
  agent: Agent;
  since?: Timestamp;
}

export interface GetAgentProfileParams {
  agent: Agent;
  profileId: string;
}

export interface DeleteAgentProfileParams {
  agent: Agent;
  profileId: string;
  etag?: string;
}
