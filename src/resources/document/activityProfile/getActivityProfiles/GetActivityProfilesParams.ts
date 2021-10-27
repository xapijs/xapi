import { Timestamp } from "../../../../XAPI";
import { GetParamsBase } from "../../../GetParamsBase";

export interface GetActivityProfilesParams extends GetParamsBase {
  activityId: string;
  since?: Timestamp;
}
