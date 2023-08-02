import {
  Verb,
  StatementObject,
  Result,
  Context,
  Attachment,
  Actor,
  Timestamp,
} from ".";
import { Versions } from "../../constants";

export interface Statement {
  id?: string;
  actor: Actor;
  verb: Verb;
  object: StatementObject;
  result?: Result;
  context?: Context;
  timestamp?: Timestamp;
  stored?: Timestamp;
  authority?: Actor;
  version?: Versions;
  attachments?: Attachment[];
}
