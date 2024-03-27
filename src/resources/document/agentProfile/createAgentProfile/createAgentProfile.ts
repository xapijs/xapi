import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { CreateAgentProfileParams } from "./CreateAgentProfileParams";

export function createAgentProfile(
  this: XAPI,
  params: CreateAgentProfileParams
): AdapterPromise<void> {
  const headers = {};
  if (params.etag) headers[params.matchHeader] = params.etag;
  return this.requestResource({
    resource: Resources.AGENT_PROFILE,
    queryParams: {
      agent: params.agent,
      profileId: params.profileId,
    },
    requestConfig: {
      method: "POST",
      data: params.profile,
      headers: headers,
    },
  });
}
