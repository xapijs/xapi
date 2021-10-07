import { Agent, Timestamp } from "../../XAPI";

export interface GetAgentProfilesParams {
  agent: Agent;
  since?: Timestamp;
}
