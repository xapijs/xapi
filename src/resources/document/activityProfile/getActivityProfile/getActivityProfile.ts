import { AxiosPromise } from "axios";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { GetActivityProfileParams } from "./getActivityProfileParams";
import { Document } from "../../Document";

export function getActivityProfile(
  this: XAPI,
  params: GetActivityProfileParams,
  useCacheBuster?: boolean
): AxiosPromise<Document> {
  return this.requestResource(Resources.ACTIVITY_PROFILE, {
    activityId: params.activityId,
    profileId: params.profileId,
    undefined,
    useCacheBuster,
  });
}
