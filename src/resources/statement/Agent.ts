import { InverseFunctionalIdentifier } from ".";

export interface Agent extends InverseFunctionalIdentifier {
  objectType?: "Agent";
  name?: string;
}
