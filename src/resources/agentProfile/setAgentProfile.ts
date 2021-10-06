import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { SetAgentProfileParams } from "../../XAPI";

export function setAgentProfile(
  this: XAPI,
  params: SetAgentProfileParams
): AxiosPromise<void> {
  const headers = {};
  headers[params.matchHeader] = params.etag;
  if (params.contentType) headers["Content-Type"] = params.contentType;
  return this.requestResource(
    Resources.AGENT_PROFILE,
    {
      agent: params.agent,
      profileId: params.profileId,
    },
    {
      method: "PUT",
      data: params.profile,
      headers: headers,
    }
  );
}
