import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, { StatementResponseWithAttachments, Statement } from "../../XAPI";
import {
  GetStatementParamsWithAttachments,
  GetStatementParamsWithoutAttachments,
  GetStatementParams,
} from "./getStatementParams";

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
