import { AxiosPromise } from "axios";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { CreateActivityProfileParams } from "./createActivityProfileParams";

export function createActivityProfile(
  this: XAPI,
  params: CreateActivityProfileParams
): AxiosPromise<void> {
  const headers = {};
  if (params.etag) headers[params.matchHeader] = params.etag;
  return this.requestResource({
    resource: Resources.ACTIVITY_PROFILE,
    queryParams: {
      activityId: params.activityId,
      profileId: params.profileId,
    },
    requestConfig: {
      method: "POST",
      data: params.profile,
      headers: headers,
    },
  });
}
