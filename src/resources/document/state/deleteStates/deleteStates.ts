import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { DeleteStatesParams } from "./DeleteStatesParams";

export function deleteStates(
  this: XAPI,
  params: DeleteStatesParams
): AdapterPromise<void> {
  const headers = {};
  if (params.etag) headers["If-Match"] = params.etag;
  return this.requestResource({
    resource: Resources.STATE,
    queryParams: {
      agent: params.agent,
      activityId: params.activityId,
      ...(!!params.registration && { registration: params.registration }),
    },
    requestConfig: {
      method: "DELETE",
      headers: headers,
    },
  });
}
