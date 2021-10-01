import { AxiosPromise } from "axios";
import { Resources } from "../constants";
import XAPI, { Agent, Timestamp, Document, DocumentJson } from "../XAPI";

export function createState(
  this: XAPI,
  params: {
    agent: Agent;
    activityId: string;
    stateId: string;
    state: DocumentJson;
    registration?: string;
    etag?: string;
    matchHeader?: "If-Match" | "If-None-Match";
  }
): AxiosPromise<void> {
  const headers = {};
  if (params.etag && params.matchHeader)
    headers[params.matchHeader] = params.etag;
  return this.requestResource(
    Resources.STATE,
    {
      agent: params.agent,
      activityId: params.activityId,
      stateId: params.stateId,
      ...(params.registration
        ? {
            registration: params.registration,
          }
        : {}),
    },
    {
      method: "POST",
      data: params.state,
      headers: headers,
    }
  );
}

export function setState(
  this: XAPI,
  params: {
    agent: Agent;
    activityId: string;
    stateId: string;
    state: Document;
    registration?: string;
    etag?: string;
    matchHeader?: "If-Match" | "If-None-Match";
    contentType?: string;
  }
): AxiosPromise<void> {
  const headers = {};
  if (params.etag && params.matchHeader)
    headers[params.matchHeader] = params.etag;
  if (params.contentType) headers["Content-Type"] = params.contentType;
  return this.requestResource(
    Resources.STATE,
    {
      agent: params.agent,
      activityId: params.activityId,
      stateId: params.stateId,
      ...(params.registration
        ? {
            registration: params.registration,
          }
        : {}),
    },
    {
      method: "PUT",
      data: params.state,
      headers: headers,
    }
  );
}

export function getStates(
  this: XAPI,
  params: {
    agent: Agent;
    activityId: string;
    registration?: string;
    since?: Timestamp;
  }
): AxiosPromise<string[]> {
  return this.requestResource(Resources.STATE, {
    agent: params.agent,
    activityId: params.activityId,
    ...(params.registration
      ? {
          registration: params.registration,
        }
      : {}),
    ...(params.since
      ? {
          since: params.since,
        }
      : {}),
  });
}

export function getState(
  this: XAPI,
  params: {
    agent: Agent;
    activityId: string;
    stateId: string;
    registration?: string;
  }
): AxiosPromise<Document> {
  return this.requestResource(Resources.STATE, {
    agent: params.agent,
    activityId: params.activityId,
    stateId: params.stateId,
    ...(params.registration
      ? {
          registration: params.registration,
        }
      : {}),
  });
}

export function deleteState(
  this: XAPI,
  params: {
    agent: Agent;
    activityId: string;
    stateId: string;
    registration?: string;
    etag?: string;
  }
): AxiosPromise<void> {
  const headers = {};
  if (params.etag) headers["If-Match"] = params.etag;
  return this.requestResource(
    Resources.STATE,
    {
      agent: params.agent,
      activityId: params.activityId,
      stateId: params.stateId,
      ...(params.registration
        ? {
            registration: params.registration,
          }
        : {}),
    },
    {
      method: "DELETE",
      headers: headers,
    }
  );
}

export function deleteStates(
  this: XAPI,
  params: {
    agent: Agent;
    activityId: string;
    registration?: string;
    etag?: string;
  }
): AxiosPromise<void> {
  const headers = {};
  if (params.etag) headers["If-Match"] = params.etag;
  return this.requestResource(
    Resources.STATE,
    {
      agent: params.agent,
      activityId: params.activityId,
      ...(params.registration
        ? {
            registration: params.registration,
          }
        : {}),
    },
    {
      method: "DELETE",
      headers: headers,
    }
  );
}
