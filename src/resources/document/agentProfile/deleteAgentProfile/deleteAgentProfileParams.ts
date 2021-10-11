import { Agent } from "../../../../XAPI";

export interface DeleteAgentProfileParams {
  agent: Agent;
  profileId: string;
  etag?: string;
}
