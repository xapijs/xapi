import { AxiosPromise } from "axios";
import { Resources } from "../constants";
import XAPI, { Timestamp, Document, DocumentJson } from "../XAPI";

export function createActivityProfile(
  this: XAPI,
  params: {
    activityId: string;
    profileId: string;
    profile: DocumentJson;
    etag?: string;
    matchHeader?: "If-Match" | "If-None-Match";
  }
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
  params: {
    activityId: string;
    profileId: string;
    profile: Document;
    etag: string;
    matchHeader: "If-Match" | "If-None-Match";
    contentType?: string;
  }
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
  params: {
    activityId: string;
    since?: Timestamp;
  }
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
  params: {
    activityId: string;
    profileId: string;
  }
): AxiosPromise<Document> {
  return this.requestResource(Resources.ACTIVITY_PROFILE, {
    activityId: params.activityId,
    profileId: params.profileId,
  });
}

export function deleteActivityProfile(
  this: XAPI,
  params: {
    activityId: string;
    profileId: string;
    etag?: string;
  }
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
