import { Agent, Document } from "../../XAPI";

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
