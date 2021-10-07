import { Agent, Timestamp } from "../../XAPI";

export interface GetStatesParams {
  agent: Agent;
  activityId: string;
  registration?: string;
  since?: Timestamp;
}
