import { getSearchQueryParamsAsObject } from "./getSearchQueryParamsAsObject";
import { Actor } from "../interfaces/Statement";

interface TinCanLaunchParameters {
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

export function getTinCanLaunchData(): TinCanLaunchParameters {
  const params: TinCanLaunchParameters = getSearchQueryParamsAsObject(
    location.search
  );
  return params;
}
