import { Agent } from "../../../../XAPI";

export interface DeleteStateParams {
  agent: Agent;
  activityId: string;
  stateId: string;
  registration?: string;
  etag?: string;
}
