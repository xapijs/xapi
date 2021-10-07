import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI from "../../XAPI";
import { GetAgentProfilesParams } from "./getAgentProfilesParams";

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
