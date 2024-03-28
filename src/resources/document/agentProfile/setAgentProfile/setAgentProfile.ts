import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { SetAgentProfileParams } from "./SetAgentProfileParams";

export function setAgentProfile(
  this: XAPI,
  params: SetAgentProfileParams
): AdapterPromise<void> {
  const headers = {};
  headers[params.matchHeader] = params.etag;
  if (params.contentType) headers["Content-Type"] = params.contentType;
  return this.requestResource({
    resource: Resources.AGENT_PROFILE,
    queryParams: {
      agent: params.agent,
      profileId: params.profileId,
    },
    requestConfig: {
      method: "PUT",
      data: params.profile,
      headers: headers,
    },
  });
}
