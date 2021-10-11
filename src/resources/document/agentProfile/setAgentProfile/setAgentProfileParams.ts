import { Agent, Document } from "../../../../XAPI";

export interface SetAgentProfileParams {
  agent: Agent;
  profileId: string;
  profile: Document;
  etag: string;
  matchHeader: "If-Match" | "If-None-Match";
  contentType?: string;
}
