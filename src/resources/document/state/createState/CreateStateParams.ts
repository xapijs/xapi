import { Agent } from "../../../../XAPI";
import { DocumentJson } from "../../Document";

export interface CreateStateParams {
  agent: Agent;
  activityId: string;
  stateId: string;
  state: DocumentJson;
  registration?: string;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
}
