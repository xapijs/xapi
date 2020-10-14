import { TinCanLaunchParameters } from "../interfaces/XAPI";
import { getSearchQueryParamsAsObject } from "./getSearchQueryParamsAsObject";

export function getTinCanLaunchData(): TinCanLaunchParameters {
  const params: TinCanLaunchParameters = getSearchQueryParamsAsObject(
    location.search
  );
  return params;
}
