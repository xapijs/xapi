import { Activity, InteractionActivityDefinition } from ".";

export interface InteractionActivity extends Activity {
  definition: InteractionActivityDefinition;
}
