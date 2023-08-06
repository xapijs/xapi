import { Agent } from ".";

export interface AnonymousGroup {
  objectType: "Group";
  name?: string;
  member: Agent[];
}
