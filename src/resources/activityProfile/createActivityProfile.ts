import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { DocumentJson } from "../../XAPI";

export interface CreateActivityProfileParams {
  activityId: string;
  profileId: string;
  profile: DocumentJson;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
}

export function createActivityProfile(
  this: XAPI,
  params: CreateActivityProfileParams
): AxiosPromise<void> {
  const headers = {};
  if (params.etag) headers[params.matchHeader] = params.etag;
  return this.requestResource(
    Resources.ACTIVITY_PROFILE,
    {
      activityId: params.activityId,
      profileId: params.profileId,
    },
    {
      method: "POST",
      data: params.profile,
      headers: headers,
    }
  );
}
