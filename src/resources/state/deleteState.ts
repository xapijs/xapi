import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import { DeleteStateParams } from "../../interfaces";
import XAPI from "../../XAPI";

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
