import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI from "../../XAPI";

export interface DeleteActivityProfileParams {
  activityId: string;
  profileId: string;
  etag?: string;
}

export function deleteActivityProfile(
  this: XAPI,
  params: DeleteActivityProfileParams
): AxiosPromise<void> {
  const headers = {};
  if (params.etag) headers["If-Match"] = params.etag;
  return this.requestResource(
    Resources.ACTIVITY_PROFILE,
    {
      activityId: params.activityId,
      profileId: params.profileId,
    },
    {
      method: "DELETE",
      headers: headers,
    }
  );
}