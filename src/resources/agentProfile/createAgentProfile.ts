import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { CreateAgentProfileParams } from "../../XAPI";

export function createAgentProfile(
  this: XAPI,
  params: CreateAgentProfileParams
): AxiosPromise<void> {
  const headers = {};
  if (params.etag) headers[params.matchHeader] = params.etag;
  return this.requestResource(
    Resources.AGENT_PROFILE,
    {
      agent: params.agent,
      profileId: params.profileId,
    },
    {
      method: "POST",
      data: params.profile,
      headers: headers,
    }
  );
}
