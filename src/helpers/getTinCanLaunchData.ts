import { TinCanLaunchData } from "../interfaces/XAPI";
import { getSearchQueryParamsAsObject } from "./getSearchQueryParamsAsObject";

export function getTinCanLaunchData(): TinCanLaunchData {
  if (typeof location === "undefined")
    throw new Error("Environment does not support location.search");

  const params: TinCanLaunchData = getSearchQueryParamsAsObject(
    location.search
  );
  return params;
}
