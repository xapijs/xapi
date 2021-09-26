import { AxiosPromise } from "axios";
import { Resources } from "../constants";
import XAPI, { Activity } from "../XAPI";

export function getActivity(
  this: XAPI,
  activityId: string
): AxiosPromise<Activity> {
  return this.requestResource(Resources.ACTIVITIES, {
    activityId: activityId,
  });
}
