import { Agent, Timestamp } from "../../../../XAPI";
import { GetParamsBase } from "../../../GetParamsBase";

export interface GetStatesParams extends GetParamsBase {
  agent: Agent;
  activityId: string;
  registration?: string;
  since?: Timestamp;
}
