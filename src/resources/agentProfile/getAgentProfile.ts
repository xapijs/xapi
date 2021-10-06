import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Agent } from "../../XAPI";

export interface GetAgentProfileParams {
  agent: Agent;
  profileId: string;
}

export function getAgentProfile(
  this: XAPI,
  params: GetAgentProfileParams
): AxiosPromise<Document> {
  return this.requestResource(Resources.AGENT_PROFILE, {
    agent: params.agent,
    profileId: params.profileId,
  });
}
