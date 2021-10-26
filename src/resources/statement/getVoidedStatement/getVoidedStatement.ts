import { AxiosPromise } from "axios";
import { Resources } from "../../../constants";
import XAPI from "../../../XAPI";
import { StatementResponseWithAttachments, Statement } from "..";
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
