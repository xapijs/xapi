import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Agent, DocumentJson } from "../../XAPI";

export interface CreateAgentProfileParams {
  agent: Agent;
  profileId: string;
  profile: DocumentJson;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
}

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
