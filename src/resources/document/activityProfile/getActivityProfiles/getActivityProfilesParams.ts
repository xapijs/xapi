import { Timestamp } from "../../../../XAPI";

export interface GetActivityProfilesParams {
  activityId: string;
  since?: Timestamp;
}
