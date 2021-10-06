import { AxiosPromise } from "axios";
import { Resources } from "../../constants";
import { createMultiPart } from "../../internal/multiPart";
import XAPI, { SendStatementParams, MultiPart } from "../../XAPI";

export function sendStatement(
  this: XAPI,
  params: SendStatementParams
): AxiosPromise<string[]> {
  const hasAttachments = params.attachments?.length;
  if (hasAttachments) {
    const multiPart: MultiPart = createMultiPart(
      params.statement,
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
        data: params.statement,
      }
    );
  }
}
