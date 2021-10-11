import { ActorBase } from "./ActorBase";
import { Agent } from ".";

export interface Group extends ActorBase {
  objectType: "Group";
  members?: Agent[];
}
