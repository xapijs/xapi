import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { StatementResponseWithAttachments, Statement } from "../../XAPI";
import {
  GetVoidedStatementParams,
  GetVoidedStatementParamsWithAttachments,
  GetVoidedStatementParamsWithoutAttachments,
} from "./getVoidedStatementParams";

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
