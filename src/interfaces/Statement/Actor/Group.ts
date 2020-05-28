import { ActorBase } from "./ActorBase";
import { Agent } from "./Agent";

export interface Group extends ActorBase {
  objectType: "Group";
  members?: Agent[];
}
