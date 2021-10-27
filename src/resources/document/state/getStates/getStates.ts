import { AxiosPromise } from "axios";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { GetStatesParams } from "./GetStatesParams";

export function getStates(
  this: XAPI,
  params: GetStatesParams
): AxiosPromise<string[]> {
  return this.requestResource({
    resource: Resources.STATE,
    queryParams: {
      agent: params.agent,
      activityId: params.activityId,
      ...(!!params.registration && { registration: params.registration }),
      ...(!!params.since && { since: params.since }),
    },
    requestOptions: { useCacheBuster: params.useCacheBuster },
  });
}
