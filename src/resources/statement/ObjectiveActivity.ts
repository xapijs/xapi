import { ObjectiveActivityDefinition } from ".";
import { Activity } from "../../XAPI";

export interface ObjectiveActivity extends Activity {
  definition: ObjectiveActivityDefinition;
}
