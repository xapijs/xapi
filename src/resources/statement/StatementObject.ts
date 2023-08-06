import {
  StatementRef,
  SubStatement,
  InteractionActivity,
  ObjectiveActivity,
  Agent,
  Group,
} from ".";
import { Activity } from "../../XAPI";
import type { WithRequiredProperty } from "../../internal/WithRequiredProperty";

export type StatementObject =
  | Activity
  | InteractionActivity
  | ObjectiveActivity
  | WithRequiredProperty<Agent, "objectType">
  | Group
  | StatementRef
  | SubStatement;
