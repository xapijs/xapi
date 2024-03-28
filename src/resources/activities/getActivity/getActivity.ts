import { AdapterPromise } from "../../../adapters";
import { Resources } from "../../../constants";
import XAPI from "../../../XAPI";
import { Activity } from "../Activity";
import { GetActivityParams } from "./GetActivityParams";

export function getActivity(
  this: XAPI,
  params: GetActivityParams
): AdapterPromise<Activity> {
  return this.requestResource({
    resource: Resources.ACTIVITIES,
    queryParams: {
      activityId: params.activityId,
    },
    requestOptions: {
      useCacheBuster: params.useCacheBuster,
    },
  });
}
