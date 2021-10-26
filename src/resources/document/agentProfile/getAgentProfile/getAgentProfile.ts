import { AxiosPromise } from "axios";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { Document } from "../../Document";
import { GetAgentProfileParams } from "./getAgentProfileParams";

export function getAgentProfile(
  this: XAPI,
  params: GetAgentProfileParams
): AxiosPromise<Document> {
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
