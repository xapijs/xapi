import { ActivityDefinition } from ".";

export interface Activity {
  objectType: "Activity";
  id: string;
  definition?: ActivityDefinition;
}
