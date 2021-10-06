import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Timestamp } from "../../XAPI";

export interface GetActivityProfilesParams {
  activityId: string;
  since?: Timestamp;
}

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
