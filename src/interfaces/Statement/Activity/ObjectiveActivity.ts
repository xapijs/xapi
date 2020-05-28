import { Activity, ObjectiveActivityDefinition } from ".";

export interface ObjectiveActivity extends Activity {
  definition: ObjectiveActivityDefinition;
}
