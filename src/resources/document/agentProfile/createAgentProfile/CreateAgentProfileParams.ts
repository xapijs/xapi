import { Agent } from "../../../../XAPI";
import { DocumentJson } from "../../Document";

export interface CreateAgentProfileParams {
  agent: Agent;
  profileId: string;
  profile: DocumentJson;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
}
