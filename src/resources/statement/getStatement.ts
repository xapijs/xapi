import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import XAPI, {
  GetStatementParamsWithAttachments,
  StatementResponseWithAttachments,
  GetStatementParamsWithoutAttachments,
  Statement,
  GetStatementParams,
} from "../../XAPI";

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
