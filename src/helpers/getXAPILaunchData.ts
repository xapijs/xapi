import { getSearchQueryParamsAsObject } from "./getSearchQueryParamsAsObject";
import axios from "axios";
import { XAPILaunchData, XAPILaunchParameters } from "../interfaces/XAPI";

export function getXAPILaunchData(): Promise<XAPILaunchData> {
  if (typeof location === "undefined")
    return Promise.reject(
      new Error("Environment does not support location.search")
    );

  const params: XAPILaunchParameters = getSearchQueryParamsAsObject(
    location.search
  );

  if (!params.xAPILaunchService) {
    return Promise.reject(
      new Error("xAPILaunchService parameter not found in URL.")
    );
  }

  const launchURL: URL = new URL(params.xAPILaunchService);
  launchURL.pathname += `launch/${params.xAPILaunchKey}`;
  return axios({
    method: "POST",
    url: launchURL.toString(),
  }).then((response) => {
    return response.data;
  });
}
