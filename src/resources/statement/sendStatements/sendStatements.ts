import { AdapterPromise } from "../../../adapters";
import { Resources } from "../../../constants";
import { createMultiPart, MultiPart } from "../../../internal/multiPart";
import XAPI from "../../../XAPI";
import { SendStatementsParams } from "./SendStatementsParams";

export function sendStatements(
  this: XAPI,
  params: SendStatementsParams
): AdapterPromise<string[]> {
  const hasAttachments = params.attachments?.length;
  if (hasAttachments) {
    const multiPart: MultiPart = createMultiPart(
      params.statements,
      params.attachments
    );
    return this.requestResource({
      resource: Resources.STATEMENT,
      requestConfig: {
        method: "POST",
        headers: multiPart.header,
        data: multiPart.blob,
      },
    });
  } else {
    return this.requestResource({
      resource: Resources.STATEMENT,
      requestConfig: {
        method: "POST",
        data: params.statements,
      },
    });
  }
}
