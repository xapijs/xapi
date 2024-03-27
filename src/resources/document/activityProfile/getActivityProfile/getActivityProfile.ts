import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { GetActivityProfileParams } from "./GetActivityProfileParams";
import { Document } from "../../Document";

export function getActivityProfile(
  this: XAPI,
  params: GetActivityProfileParams
): AdapterPromise<Document> {
  return this.requestResource({
    resource: Resources.ACTIVITY_PROFILE,
    queryParams: {
      activityId: params.activityId,
      profileId: params.profileId,
    },
    requestOptions: {
      useCacheBuster: params.useCacheBuster,
    },
  });
}
