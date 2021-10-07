import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI from "../../XAPI";
import { DeleteAgentProfileParams } from "./deleteAgentProfileParams";

export function deleteAgentProfile(
  this: XAPI,
  params: DeleteAgentProfileParams
): AxiosPromise<void> {
  const headers = {};
  if (params.etag) headers["If-Match"] = params.etag;
  return this.requestResource(
    Resources.AGENT_PROFILE,
    {
      agent: params.agent,
      profileId: params.profileId,
    },
    {
      method: "DELETE",
      headers: headers,
    }
  );
}
