import {
  Adapter,
  AdapterPromise,
  resolveAdapterFunction,
} from "../../adapters";
import { getSearchQueryParamsAsObject } from "../getSearchQueryParamsAsObject/getSearchQueryParamsAsObject";
import { XAPILaunchData } from "./XAPILaunchData";
import { XAPILaunchParameters } from "./XAPILaunchParameters";

export function getXAPILaunchData(params?: {
  adapter?: Adapter;
}): AdapterPromise<XAPILaunchData> {
  if (typeof location === "undefined")
    return Promise.reject(
      new Error("Environment does not support location.search")
    );

  const launchParams: XAPILaunchParameters = getSearchQueryParamsAsObject(
    location.search
  );

  if (!launchParams.xAPILaunchService) {
    return Promise.reject(
      new Error("xAPILaunchService parameter not found in URL.")
    );
  }

  const launchURL: URL = new URL(launchParams.xAPILaunchService);
  launchURL.pathname += `launch/${launchParams.xAPILaunchKey}`;
  const adapter = resolveAdapterFunction(params.adapter);
  return adapter({
    method: "POST",
    url: launchURL.toString(),
  }).then((response) => {
    return response.data;
  });
}
