import { Actor, Agent, Statement, Timestamp } from "..";

interface StatementParamsBase {
  /**
   * Boolean determining if the statements’ attachments should be returned. Defaults to `false`.
   */
  attachments?: boolean;
  /**
   * `format` – what human readable names and descriptions are included in the statements.
   *
   * - `exact` format returns the statements exactly as they were received by the LRS (with some possible exceptions). `exact` format should be used when moving statements between LRSs or other systems that store statements.
   * - `ids` format returns only ids are returned with none of the human readable descriptions. This is useful if you need to fetch data that will be used for aggregation or other processing where human language names and descriptions are not required.
   * - `canonical` format requests the LRS to return its own internal definitions of objects, rather than those provided in the statement. If you trust the LRS, this is normally the most appropriate format when the data will be displayed to the end user. The LRS will build its internal definitions of objects based on statements it receives and other authoritative sources.
   */
  format?: "exact" | "ids" | "canonical";
}

interface GetStatementParamsBase extends StatementParamsBase {
  /**
   * The UUID of the statement.
   */
  statementId: string;
}

export interface GetStatementParamsWithAttachments
  extends GetStatementParamsBase {
  attachments: true;
}

export interface GetStatementParamsWithoutAttachments
  extends GetStatementParamsBase {
  attachments?: false;
}

export type GetStatementParams =
  | GetStatementParamsWithoutAttachments
  | GetStatementParamsWithAttachments;

interface GetVoidedStatementParamsBase extends StatementParamsBase {
  /**
   * The original UUID of the statement before it was voided.
   */
  voidedStatementId: string;
}

export interface GetVoidedStatementParamsWithAttachments
  extends GetVoidedStatementParamsBase {
  attachments: true;
}

export interface GetVoidedStatementParamsWithoutAttachments
  extends GetVoidedStatementParamsBase {
  attachments?: false;
}

export type GetVoidedStatementParams =
  | GetVoidedStatementParamsWithAttachments
  | GetVoidedStatementParamsWithoutAttachments;

interface GetStatementsParamsBase extends StatementParamsBase {
  /**
   * JSON encoded object containing an IFI to match an agent or group.
   */
  agent?: Agent;
  /**
   * String matching the statement’s verb identifier.
   */
  verb?: string;
  /**
   * String matching the statement’s object identifier.
   */
  activity?: string;
  /**
   * String matching the statement’s registration from the context.
   */
  registration?: string;
  /**
   * Applies the activity filter to any activity in the statement when `true`. Defaults to `false`.
   */
  related_activities?: boolean;
  /**
   * Applies the activity filter to any agent/group in the statement when `true`. Defaults to `false`.
   */
  related_agents?: boolean;
  /**
   * String that returns statements stored after the given timestamp (exclusive).
   */
  since?: Timestamp;
  /**
   * String that returns statements stored before the given timestamp (inclusive).
   */
  until?: Timestamp;
  /**
   * Number of statements to return. Defaults to `0` which returns the maximum the server will allow.
   */
  limit?: number;
  /**
   * Boolean determining if the statements should be returned in ascending stored order. Defaults to `false`.
   */
  ascending?: boolean;
}

export interface GetStatementsParamsWithAttachments
  extends GetStatementsParamsBase {
  attachments: true;
}

export interface GetStatementsParamsWithoutAttachments
  extends GetStatementsParamsBase {
  attachments?: false;
}

export type GetStatementsParams =
  | GetStatementsParamsWithAttachments
  | GetStatementsParamsWithoutAttachments;

export interface GetMoreStatementsParams {
  more: string;
}

export interface SendStatementParams {
  statement: Statement;
  attachments?: ArrayBuffer[];
}

export interface SendStatementsParams {
  statements: Statement[];
  attachments?: ArrayBuffer[];
}

export interface VoidStatementParams {
  actor: Actor;
  statementId: string;
}

export interface VoidStatementsParams {
  actor: Actor;
  statementIds: string[];
}
