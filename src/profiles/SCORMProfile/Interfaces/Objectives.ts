import { ActivityDefinition, Activity } from "../../../interfaces/Activity";

export interface ObjectiveActivityDefinition extends ActivityDefinition {
  type: "http://adlnet.gov/expapi/activities/objective";
}

export interface ObjectiveActivity extends Activity {
  definition: ObjectiveActivityDefinition;
}
