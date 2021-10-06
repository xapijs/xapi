import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import { GetStatesParams } from "../../interfaces";
import XAPI from "../../XAPI";

export function getStates(
  this: XAPI,
  params: GetStatesParams
): AxiosPromise<string[]> {
  return this.requestResource(Resources.STATE, {
    agent: params.agent,
    activityId: params.activityId,
    ...(params.registration
      ? {
          registration: params.registration,
        }
      : {}),
    ...(params.since
      ? {
          since: params.since,
        }
      : {}),
  });
}
