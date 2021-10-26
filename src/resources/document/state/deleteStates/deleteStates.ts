import { AxiosPromise } from "axios";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { DeleteStatesParams } from "./deleteStatesParams";

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
      ...(!!params.registration && { registration: params.registration }),
    },
    {
      method: "DELETE",
      headers: headers,
    }
  );
}
