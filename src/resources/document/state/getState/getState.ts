import { AdapterPromise } from "../../../../adapters";
import { Resources } from "../../../../constants";
import XAPI from "../../../../XAPI";
import { GetStateParams } from "./GetStateParams";
import { Document } from "../../Document";

export function getState(
  this: XAPI,
  params: GetStateParams
): AdapterPromise<Document> {
  return this.requestResource({
    resource: Resources.STATE,
    queryParams: {
      agent: params.agent,
      activityId: params.activityId,
      stateId: params.stateId,
      ...(!!params.registration && { registration: params.registration }),
    },
    requestOptions: { useCacheBuster: params.useCacheBuster },
  });
}
