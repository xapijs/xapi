import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, {
  GetVoidedStatementParamsWithAttachments,
  StatementResponseWithAttachments,
  GetVoidedStatementParamsWithoutAttachments,
  Statement,
  GetVoidedStatementParams,
} from "../../XAPI";

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
