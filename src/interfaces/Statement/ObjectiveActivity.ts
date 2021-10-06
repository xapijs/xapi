import { ObjectiveActivityDefinition } from ".";
import { Activity } from "..";

export interface ObjectiveActivity extends Activity {
  definition: ObjectiveActivityDefinition;
}
