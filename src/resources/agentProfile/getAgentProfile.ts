import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { GetAgentProfileParams } from "../../XAPI";

export function getAgentProfile(
  this: XAPI,
  params: GetAgentProfileParams
): AxiosPromise<Document> {
  return this.requestResource(Resources.AGENT_PROFILE, {
    agent: params.agent,
    profileId: params.profileId,
  });
}
