import { AxiosPromise } from "axios";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { SetStateParams } from "./setStateParams";

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
      ...(params.registration !== undefined
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
