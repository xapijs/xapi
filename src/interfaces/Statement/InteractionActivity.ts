import { InteractionActivityDefinition } from ".";
import { Activity } from "..";

export interface InteractionActivity extends Activity {
  definition: InteractionActivityDefinition;
}
