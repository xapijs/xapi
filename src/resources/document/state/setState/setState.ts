import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { SetStateParams } from "./SetStateParams";

export function setState(
  this: XAPI,
  params: SetStateParams
): AdapterPromise<void> {
  const headers = {};
  if (params.etag && params.matchHeader)
    headers[params.matchHeader] = params.etag;
  if (params.contentType) headers["Content-Type"] = params.contentType;
  return this.requestResource({
    resource: Resources.STATE,
    queryParams: {
      agent: params.agent,
      activityId: params.activityId,
      stateId: params.stateId,
      ...(!!params.registration && { registration: params.registration }),
    },
    requestConfig: {
      method: "PUT",
      data: params.state,
      headers: headers,
    },
  });
}
