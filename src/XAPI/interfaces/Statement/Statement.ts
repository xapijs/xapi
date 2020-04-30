import { Actor, Verb, StatementObject, Result, Context } from ".";

export interface Statement {
  actor: Actor;
  verb: Verb;
  object: StatementObject;
  result?: Result;
  context?: Context;
  timestamp?: string;
  stored?: string;
  authority?: Actor;
  id?: string;
}
