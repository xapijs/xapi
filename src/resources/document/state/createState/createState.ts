import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { CreateStateParams } from "./CreateStateParams";

export function createState(
  this: XAPI,
  params: CreateStateParams
): AdapterPromise<void> {
  const headers = {};
  if (params.etag && params.matchHeader)
    headers[params.matchHeader] = params.etag;
  return this.requestResource({
    resource: Resources.STATE,
    queryParams: {
      agent: params.agent,
      activityId: params.activityId,
      stateId: params.stateId,
      ...(!!params.registration && { registration: params.registration }),
    },
    requestConfig: {
      method: "POST",
      data: params.state,
      headers: headers,
    },
  });
}
