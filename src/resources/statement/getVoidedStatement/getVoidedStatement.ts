import { AdapterPromise } from "../../../adapters";
import { Resources } from "../../../constants";
import XAPI from "../../../XAPI";
import { StatementResponseWithAttachments, Statement } from "..";
import {
  GetVoidedStatementParams,
  GetVoidedStatementParamsWithAttachments,
  GetVoidedStatementParamsWithoutAttachments,
} from "./GetVoidedStatementParams";

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementParamsWithAttachments
): AdapterPromise<StatementResponseWithAttachments>;

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementParamsWithoutAttachments
): AdapterPromise<Statement>;

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementParams
): AdapterPromise<Statement | StatementResponseWithAttachments> {
  return this.requestResource({
    resource: Resources.STATEMENT,
    queryParams: {
      voidedStatementId: params.voidedStatementId,
      ...(!!params.attachments && { attachments: params.attachments }),
      ...(!!params.format && { format: params.format }),
    },
    requestOptions: { useCacheBuster: params.useCacheBuster },
  });
}
