import { AdapterPromise } from "../../../adapters";
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
): AdapterPromise<StatementResponseWithAttachments>;

export function getStatement(
  this: XAPI,
  params: GetStatementParamsWithoutAttachments
): AdapterPromise<Statement>;

export function getStatement(
  this: XAPI,
  params: GetStatementParams
): AdapterPromise<Statement | StatementResponseWithAttachments> {
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
