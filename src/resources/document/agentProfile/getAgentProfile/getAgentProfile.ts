import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { Document } from "../../Document";
import { GetAgentProfileParams } from "./GetAgentProfileParams";

export function getAgentProfile(
  this: XAPI,
  params: GetAgentProfileParams
): AdapterPromise<Document> {
  return this.requestResource({
    resource: Resources.AGENT_PROFILE,
    queryParams: {
      agent: params.agent,
      profileId: params.profileId,
    },
    requestOptions: {
      useCacheBuster: params.useCacheBuster,
    },
  });
}
