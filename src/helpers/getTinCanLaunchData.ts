import { TinCanLaunchData } from "../interfaces/XAPI";
import { getSearchQueryParamsAsObject } from "./getSearchQueryParamsAsObject";

export function getTinCanLaunchData(): TinCanLaunchData {
  const params: TinCanLaunchData = getSearchQueryParamsAsObject(
    location.search
  );
  return params;
}
