import { AxiosPromise } from "axios";
import { Resources } from "../constants";
import XAPI, {
  Document,
  CreateAgentProfileParams,
  SetAgentProfileParams,
  GetAgentProfilesParams,
  GetAgentProfileParams,
  DeleteAgentProfileParams,
} from "../XAPI";

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

export function getAgentProfiles(
  this: XAPI,
  params: GetAgentProfilesParams
): AxiosPromise<string[]> {
  return this.requestResource(Resources.AGENT_PROFILE, {
    agent: params.agent,
    ...(params.since
      ? {
          since: params.since,
        }
      : {}),
  });
}

export function getAgentProfile(
  this: XAPI,
  params: GetAgentProfileParams
): AxiosPromise<Document> {
  return this.requestResource(Resources.AGENT_PROFILE, {
    agent: params.agent,
    profileId: params.profileId,
  });
}

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
