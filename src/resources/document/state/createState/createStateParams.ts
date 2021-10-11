import { Agent, DocumentJson } from "../../../../XAPI";

export interface CreateStateParams {
  agent: Agent;
  activityId: string;
  stateId: string;
  state: DocumentJson;
  registration?: string;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
}
