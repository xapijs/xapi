import { StatementRef, Statement } from ".";
import { Activity, Actor, InteractionActivity, ObjectiveActivity } from "..";

export type StatementObject =
  | Activity
  | InteractionActivity
  | ObjectiveActivity
  | Actor
  | StatementRef
  | Statement;
