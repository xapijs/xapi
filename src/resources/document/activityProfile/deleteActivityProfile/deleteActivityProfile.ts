import { AxiosPromise } from "axios";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { DeleteActivityProfileParams } from "./deleteActivityProfileParams";

export function deleteActivityProfile(
  this: XAPI,
  params: DeleteActivityProfileParams
): AxiosPromise<void> {
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
