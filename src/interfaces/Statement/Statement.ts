import { Verb, StatementObject, Result, Context, Attachment } from ".";
import { Actor } from "..";

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
  attachments?: Attachment[];
}
