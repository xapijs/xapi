import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI from "../../XAPI";
import { GetActivityProfilesParams } from "./getActivityProfilesParams";

export function getActivityProfiles(
  this: XAPI,
  params: GetActivityProfilesParams
): AxiosPromise<string[]> {
  return this.requestResource(Resources.ACTIVITY_PROFILE, {
    activityId: params.activityId,
    ...(params.since
      ? {
          since: params.since,
        }
      : {}),
  });
}
