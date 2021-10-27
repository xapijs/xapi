import { InteractionActivityDefinition } from ".";
import { Activity } from "../../XAPI";

export interface InteractionActivity extends Activity {
  definition: InteractionActivityDefinition;
}
