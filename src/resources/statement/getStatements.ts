import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, {
  StatementsResponseWithAttachments,
  StatementsResponse,
  Agent,
  Timestamp,
} from "../../XAPI";
import { StatementParamsBase } from "./getStatement";

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

export function getStatements(
  this: XAPI,
  params: GetStatementsParamsWithAttachments
): AxiosPromise<StatementsResponseWithAttachments>;

export function getStatements(
  this: XAPI,
  params?: GetStatementsParamsWithoutAttachments
): AxiosPromise<StatementsResponse>;

export function getStatements(
  this: XAPI,
  params?: GetStatementsParams
): AxiosPromise<StatementsResponse | StatementsResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, params);
}
