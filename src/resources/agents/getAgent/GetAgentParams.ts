import { Agent } from "../../../XAPI";
import { GetParamsBase } from "../../GetParamsBase";

export interface GetAgentParams extends GetParamsBase {
  agent: Agent;
}
