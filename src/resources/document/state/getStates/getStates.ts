import { AxiosPromise } from "axios";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { GetStatesParams } from "./getStatesParams";

export function getStates(
  this: XAPI,
  params: GetStatesParams
): AxiosPromise<string[]> {
  return this.requestResource(
    Resources.STATE,
    {
      agent: params.agent,
      activityId: params.activityId,
      ...(params.registration !== undefined
        ? {
            registration: params.registration,
          }
        : {}),
      ...(params.since !== undefined
        ? {
            since: params.since,
          }
        : {}),
    },
    undefined,
    {
      useCacheBuster: params.useCacheBuster,
    }
  );
}
