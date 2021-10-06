import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import { createMultiPart } from "../../internal/multiPart";
import XAPI, { SendStatementsParams, MultiPart } from "../../XAPI";

export function sendStatements(
  this: XAPI,
  params: SendStatementsParams
): AxiosPromise<string[]> {
  const hasAttachments = params.attachments?.length;
  if (hasAttachments) {
    const multiPart: MultiPart = createMultiPart(
      params.statements,
      params.attachments
    );
    return this.requestResource(
      Resources.STATEMENT,
      {},
      {
        method: "POST",
        headers: multiPart.header,
        data: multiPart.blob,
      }
    );
  } else {
    return this.requestResource(
      Resources.STATEMENT,
      {},
      {
        method: "POST",
        data: params.statements,
      }
    );
  }
}
