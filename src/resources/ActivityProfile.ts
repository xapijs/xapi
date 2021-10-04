import { AxiosPromise } from "axios";
import { Resources } from "../constants";
import XAPI, {
  Document,
  CreateActivityProfileParams,
  SetActivityProfileParams,
  GetActivityProfilesParams,
  GetActivityProfileParams,
  DeleteActivityProfileParams,
} from "../XAPI";

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

export function getActivityProfile(
  this: XAPI,
  params: GetActivityProfileParams
): AxiosPromise<Document> {
  return this.requestResource(Resources.ACTIVITY_PROFILE, {
    activityId: params.activityId,
    profileId: params.profileId,
  });
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
