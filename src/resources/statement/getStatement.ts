import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { StatementResponseWithAttachments, Statement } from "../../XAPI";

export interface StatementParamsBase {
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

export function getStatement(
  this: XAPI,
  params: GetStatementParamsWithAttachments
): AxiosPromise<StatementResponseWithAttachments>;

export function getStatement(
  this: XAPI,
  params: GetStatementParamsWithoutAttachments
): AxiosPromise<Statement>;

export function getStatement(
  this: XAPI,
  params: GetStatementParams
): AxiosPromise<Statement | StatementResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, params);
}
