import { AxiosPromise } from "axios";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { DeleteAgentProfileParams } from "./DeleteAgentProfileParams";

export function deleteAgentProfile(
  this: XAPI,
  params: DeleteAgentProfileParams
): AxiosPromise<void> {
  const headers = {};
  if (params.etag) headers["If-Match"] = params.etag;
  return this.requestResource({
    resource: Resources.AGENT_PROFILE,
    queryParams: {
      agent: params.agent,
      profileId: params.profileId,
    },
    requestConfig: {
      method: "DELETE",
      headers: headers,
    },
  });
}
