import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { SetActivityProfileParams } from "./SetActivityProfileParams";

export function setActivityProfile(
  this: XAPI,
  params: SetActivityProfileParams
): AdapterPromise<void> {
  const headers = {};
  headers[params.matchHeader] = params.etag;
  if (params.contentType) headers["Content-Type"] = params.contentType;
  return this.requestResource({
    resource: Resources.ACTIVITY_PROFILE,
    queryParams: {
      activityId: params.activityId,
      profileId: params.profileId,
    },
    requestConfig: {
      method: "PUT",
      data: params.profile,
      headers: headers,
    },
  });
}
