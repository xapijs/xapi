import { ActivityDefinition } from "./ActivityDefinition";

export interface Activity {
  objectType?: "Activity";
  id: string;
  definition?: ActivityDefinition;
}
