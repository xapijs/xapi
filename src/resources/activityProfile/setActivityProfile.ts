import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { SetActivityProfileParams } from "../../XAPI";

export function setActivityProfile(
  this: XAPI,
  params: SetActivityProfileParams
): AxiosPromise<void> {
  const headers = {};
  headers[params.matchHeader] = params.etag;
  if (params.contentType) headers["Content-Type"] = params.contentType;
  return this.requestResource(
    Resources.ACTIVITY_PROFILE,
    {
      activityId: params.activityId,
      profileId: params.profileId,
    },
    {
      method: "PUT",
      data: params.profile,
      headers: headers,
    }
  );
}
