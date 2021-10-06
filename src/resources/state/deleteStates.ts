import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Agent } from "../../XAPI";

export interface DeleteStatesParams {
  agent: Agent;
  activityId: string;
  registration?: string;
  etag?: string;
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
