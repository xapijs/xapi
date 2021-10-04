import { AxiosPromise } from "axios";
import { Resources } from "../constants";
import XAPI, { Activity, GetActivityParams } from "../XAPI";

export function getActivity(
  this: XAPI,
  params: GetActivityParams
): AxiosPromise<Activity> {
  return this.requestResource(Resources.ACTIVITIES, params);
}
