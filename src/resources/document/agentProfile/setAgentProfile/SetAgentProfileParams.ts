import { Agent } from "../../../../XAPI";
import { Document } from "../../Document";

export interface SetAgentProfileParams {
  agent: Agent;
  profileId: string;
  profile: Document;
  etag: string;
  matchHeader: "If-Match" | "If-None-Match";
  contentType?: string;
}
