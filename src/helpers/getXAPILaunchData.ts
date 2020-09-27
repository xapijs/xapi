import { getSearchQueryParamsAsObject } from "./getSearchQueryParamsAsObject";
import { Actor } from "../interfaces/Statement";
import axios from "axios";

interface XAPILaunchParameters {
  xAPILaunchKey?: string;
  xAPILaunchService?: string;
  encrypted?: string;
}

interface XAPILaunchData {
  endpoint: string;
  actor: Actor;
}

export function getXAPILaunchData(): Promise<XAPILaunchData> {
  const params: XAPILaunchParameters = getSearchQueryParamsAsObject(location.href);
  if (!params.xAPILaunchService) {
    return Promise.reject(new Error("xAPILaunchService parameter not found in URL."));
  }
  const launchURL: URL = new URL(params.xAPILaunchService);
  launchURL.pathname += `launch/${params.xAPILaunchKey}`;
  return axios({
    method: "POST",
    url: launchURL.toString()
  }).then((response) => {
    return response.data;
  });
}
