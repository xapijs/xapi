import { Agent, DocumentJson, Timestamp, Document } from "..";

export interface CreateStateParams {
  agent: Agent;
  activityId: string;
  stateId: string;
  state: DocumentJson;
  registration?: string;
  etag?: string;
  matchHeader?: "If-Match" | "If-None-Match";
}

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

export interface GetStatesParams {
  agent: Agent;
  activityId: string;
  registration?: string;
  since?: Timestamp;
}

export interface GetStateParams {
  agent: Agent;
  activityId: string;
  stateId: string;
  registration?: string;
}

export interface DeleteStateParams {
  agent: Agent;
  activityId: string;
  stateId: string;
  registration?: string;
  etag?: string;
}

export interface DeleteStatesParams {
  agent: Agent;
  activityId: string;
  registration?: string;
  etag?: string;
}
