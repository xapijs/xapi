import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Agent, DocumentJson } from "../../XAPI";

export interface CreateStateParams {
  agent: Agent;
  activityId: string;
  stateId: string;
  state: DocumentJson;
  registration?: string;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
}

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
