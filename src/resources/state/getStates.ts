import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Agent, Timestamp } from "../../XAPI";

export interface GetStatesParams {
  agent: Agent;
  activityId: string;
  registration?: string;
  since?: Timestamp;
}

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
