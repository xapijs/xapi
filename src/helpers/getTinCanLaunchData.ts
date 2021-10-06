import { Actor } from "../XAPI";
import { getSearchQueryParamsAsObject } from "./getSearchQueryParamsAsObject";

export interface TinCanLaunchData {
  activity_id?: string;
  actor?: Actor;
  auth?: string;
  content_endpoint?: string;
  content_token?: string;
  endpoint?: string;
  externalConfiguration?: string;
  externalRegistration?: string;
  grouping?: string;
  registration?: string;
}

export function getTinCanLaunchData(): TinCanLaunchData {
  if (typeof location === "undefined")
    throw new Error("Environment does not support location.search");

  const params: TinCanLaunchData = getSearchQueryParamsAsObject(
    location.search
  );
  return params;
}
