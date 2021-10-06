import { Agent } from "..";

export interface RequestParams {
  [key: string]: any;
  agent?: Agent;
}
