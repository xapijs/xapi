import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { StatementResponseWithAttachments, Statement } from "../../XAPI";
import { StatementParamsBase } from "./getStatement";

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

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementParamsWithAttachments
): AxiosPromise<StatementResponseWithAttachments>;

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementParamsWithoutAttachments
): AxiosPromise<Statement>;

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementParams
): AxiosPromise<Statement | StatementResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, params);
}
