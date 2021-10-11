import { AxiosPromise } from "axios";
import { Resources } from "../../../../constants";
import XAPI, { GetStatesParams } from "../../../../XAPI";

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
