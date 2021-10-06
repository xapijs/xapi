import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Activity } from "../../XAPI";

export interface GetActivityParams {
  activityId: string;
}

export function getActivity(
  this: XAPI,
  params: GetActivityParams
): AxiosPromise<Activity> {
  return this.requestResource(Resources.ACTIVITIES, params);
}
