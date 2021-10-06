import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Agent, Timestamp } from "../../XAPI";

export interface GetAgentProfilesParams {
  agent: Agent;
  since?: Timestamp;
}

export function getAgentProfiles(
  this: XAPI,
  params: GetAgentProfilesParams
): AxiosPromise<string[]> {
  return this.requestResource(Resources.AGENT_PROFILE, {
    agent: params.agent,
    ...(params.since
      ? {
          since: params.since,
        }
      : {}),
  });
}
