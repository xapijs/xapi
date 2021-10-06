import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import { GetStateParams } from "../../interfaces";
import XAPI from "../../XAPI";

export function getState(
  this: XAPI,
  params: GetStateParams
): AxiosPromise<Document> {
  return this.requestResource(Resources.STATE, {
    agent: params.agent,
    activityId: params.activityId,
    stateId: params.stateId,
    ...(params.registration
      ? {
          registration: params.registration,
        }
      : {}),
  });
}
