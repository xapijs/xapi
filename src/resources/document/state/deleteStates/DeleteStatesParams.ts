import { Agent } from "../../../../XAPI";

export interface DeleteStatesParams {
  agent: Agent;
  activityId: string;
  registration?: string;
  etag?: string;
}
