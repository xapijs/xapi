import { Agent } from "../../../../XAPI";
import { GetParamsBase } from "../../../GetParamsBase";

export interface GetAgentProfileParams extends GetParamsBase {
  agent: Agent;
  profileId: string;
}
