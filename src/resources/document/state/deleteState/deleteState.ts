import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { DeleteStateParams } from "./DeleteStateParams";

export function deleteState(
  this: XAPI,
  params: DeleteStateParams
): AdapterPromise<void> {
  const headers = {};
  if (params.etag) headers["If-Match"] = params.etag;
  return this.requestResource({
    resource: Resources.STATE,
    queryParams: {
      agent: params.agent,
      activityId: params.activityId,
      stateId: params.stateId,
      ...(!!params.registration && { registration: params.registration }),
    },
    requestConfig: {
      method: "DELETE",
      headers: headers,
    },
  });
}
