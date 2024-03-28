import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { DeleteActivityProfileParams } from "./DeleteActivityProfileParams";

export function deleteActivityProfile(
  this: XAPI,
  params: DeleteActivityProfileParams
): AdapterPromise<void> {
  const headers = {};
  if (params.etag) headers["If-Match"] = params.etag;
  return this.requestResource({
    resource: Resources.ACTIVITY_PROFILE,
    queryParams: {
      activityId: params.activityId,
      profileId: params.profileId,
    },
    requestConfig: {
      method: "DELETE",
      headers: headers,
    },
  });
}
