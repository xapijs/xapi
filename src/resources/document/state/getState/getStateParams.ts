import { Agent } from "../../../../XAPI";

export interface GetStateParams {
  agent: Agent;
  activityId: string;
  stateId: string;
  registration?: string;
}
