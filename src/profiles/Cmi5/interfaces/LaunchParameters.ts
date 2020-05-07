import { Agent } from "../../../XAPI";

export interface LaunchParameters {
  endpoint: string;
  fetch: string;
  actor: Agent;
  registration: string;
  activityId: string;
}
