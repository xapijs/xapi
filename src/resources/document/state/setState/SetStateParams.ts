import { Agent } from "../../../../XAPI";
import { Document } from "../../Document";

export interface SetStateParams {
  agent: Agent;
  activityId: string;
  stateId: string;
  state: Document;
  registration?: string;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
  contentType?: string;
}
