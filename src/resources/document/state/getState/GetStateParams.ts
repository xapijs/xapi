import { Agent } from "../../../../XAPI";
import { GetParamsBase } from "../../../GetParamsBase";

export interface GetStateParams extends GetParamsBase {
  agent: Agent;
  activityId: string;
  stateId: string;
  registration?: string;
}
