import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Agent, Document } from "../../XAPI";

export interface SetStateParams {
  agent: Agent;
  activityId: string;
  stateId: string;
  state: Document;
  registration?: string;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
  contentType?: string;
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
