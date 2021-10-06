import { Actor } from "..";

export interface TinCanLaunchData {
  activity_id?: string;
  actor?: Actor;
  auth?: string;
  content_endpoint?: string;
  content_token?: string;
  endpoint?: string;
  externalConfiguration?: string;
  externalRegistration?: string;
  grouping?: string;
  registration?: string;
}
