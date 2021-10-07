import { Agent, DocumentJson } from "../../XAPI";

export interface CreateAgentProfileParams {
  agent: Agent;
  profileId: string;
  profile: DocumentJson;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
}
