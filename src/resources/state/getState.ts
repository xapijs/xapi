import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Agent } from "../../XAPI";

export interface GetStateParams {
  agent: Agent;
  activityId: string;
  stateId: string;
  registration?: string;
}

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
