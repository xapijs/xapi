import { AxiosPromise } from "axios";
import { Resources } from "../constants";
import XAPI, {
  Document,
  CreateStateParams,
  SetStateParams,
  GetStatesParams,
  GetStateParams,
  DeleteStateParams,
  DeleteStatesParams,
} from "../XAPI";

export function createState(
  this: XAPI,
  params: CreateStateParams
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
  params: SetStateParams
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
  params: GetStatesParams
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
  params: GetStateParams
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
  params: DeleteStateParams
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
  params: DeleteStatesParams
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
