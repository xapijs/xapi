import { AxiosPromise } from "axios";
import { Resources } from "../constants";
import { Document, DocumentJson } from "../interfaces/Document";
import XAPI, { Agent, Timestamp } from "../XAPI";

export function createAgentProfile(
  this: XAPI,
  params: {
    agent: Agent;
    profileId: string;
    profile: DocumentJson;
    etag?: string;
    matchHeader?: "If-Match" | "If-None-Match";
  }
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
  params: {
    agent: Agent;
    profileId: string;
    profile: Document;
    etag: string;
    matchHeader: "If-Match" | "If-None-Match";
    contentType?: string;
  }
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
  params: {
    agent: Agent;
    since?: Timestamp;
  }
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
  params: {
    agent: Agent;
    profileId: string;
  }
): AxiosPromise<Document> {
  return this.requestResource(Resources.AGENT_PROFILE, {
    agent: params.agent,
    profileId: params.profileId,
  });
}

export function deleteAgentProfile(
  this: XAPI,
  params: {
    agent: Agent;
    profileId: string;
    etag?: string;
  }
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
