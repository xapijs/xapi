import { Actor, Verb, Object, Result, Context } from "./";

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
