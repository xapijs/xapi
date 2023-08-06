import { Agent, InverseFunctionalIdentifier } from ".";

export interface IdentifiedGroup extends InverseFunctionalIdentifier {
  objectType: "Group";
  name?: string;
  member?: Agent[];
}
