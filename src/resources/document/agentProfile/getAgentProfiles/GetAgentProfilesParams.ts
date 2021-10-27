import { Agent, Timestamp } from "../../../../XAPI";
import { GetParamsBase } from "../../../GetParamsBase";

export interface GetAgentProfilesParams extends GetParamsBase {
  agent: Agent;
  since?: Timestamp;
}
