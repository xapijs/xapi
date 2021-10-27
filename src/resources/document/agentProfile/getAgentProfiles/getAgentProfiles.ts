import { AxiosPromise } from "axios";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { GetAgentProfilesParams } from "./GetAgentProfilesParams";

export function getAgentProfiles(
  this: XAPI,
  params: GetAgentProfilesParams
): AxiosPromise<string[]> {
  return this.requestResource({
    resource: Resources.AGENT_PROFILE,
    queryParams: {
      agent: params.agent,
      ...(!!params.since && { since: params.since }),
    },
    requestOptions: { useCacheBuster: params.useCacheBuster },
  });
}
