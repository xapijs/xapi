import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { Activity } from "../../XAPI";
import { GetActivityParams } from "./getActivityParams";

export function getActivity(
  this: XAPI,
  params: GetActivityParams
): AxiosPromise<Activity> {
  return this.requestResource(Resources.ACTIVITIES, params);
}
