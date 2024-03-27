import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { GetActivityProfilesParams } from "./GetActivityProfilesParams";

export function getActivityProfiles(
  this: XAPI,
  params: GetActivityProfilesParams
): AdapterPromise<string[]> {
  return this.requestResource({
    resource: Resources.ACTIVITY_PROFILE,
    queryParams: {
      activityId: params.activityId,
      ...(!!params.since && { since: params.since }),
    },
    requestOptions: { useCacheBuster: params.useCacheBuster },
  });
}
