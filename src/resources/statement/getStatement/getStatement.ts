import { AxiosPromise } from "axios";
import { Resources } from "../../../constants";
import XAPI from "../../../XAPI";
import { StatementResponseWithAttachments, Statement } from "..";
import {
  GetStatementParamsWithAttachments,
  GetStatementParamsWithoutAttachments,
  GetStatementParams,
} from "./GetStatementParams";

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
  return this.requestResource({
    resource: Resources.STATEMENT,
    queryParams: {
      statementId: params.statementId,
      ...(!!params.attachments && { attachments: params.attachments }),
      ...(!!params.format && { format: params.format }),
    },
    requestOptions: { useCacheBuster: params.useCacheBuster },
  });
}
