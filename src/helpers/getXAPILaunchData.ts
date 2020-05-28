import { getSearchQueryParamsAsObject } from "./getSearchQueryParamsAsObject";
import { Actor } from "../interfaces/Statement";

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
    throw new Error("xAPILaunchService parameter not found in URL.");
  }
  const launchURL: URL = new URL(params.xAPILaunchService);
  launchURL.pathname += `launch/${params.xAPILaunchKey}`;
  return fetch(launchURL.toString(), {
    method: "POST"
  }).then((response) => {
    return response.json();
  }) as Promise<XAPILaunchData>;
}
