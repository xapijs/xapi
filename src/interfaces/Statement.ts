import { Actor } from "./Actor";
import { Verb } from "./Verb";
import { Object } from "./Object";
import { Result } from "./Result";
import { Context } from "./Context";

export interface Statement {
  actor: Actor;
  verb: Verb;
  object: Object;
  result?: Result;
  context?: Context;
  timestamp?: string;
  stored?: string;
  authority?: Actor;
  id?: string;
}
