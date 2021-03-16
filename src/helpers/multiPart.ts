import { Statement, Attachment, MultiPart } from "../interfaces/Statement";
import {
  StatementResponseWithAttachments,
  StatementsResponseWithAttachments,
} from "../interfaces/XAPI";

const crlf: string = "\r\n";

export function parseMultiPart(
  data: string
): StatementResponseWithAttachments | StatementsResponseWithAttachments {
  const boundary = data.trim().split(crlf)[0].trim();
  const parts = data
    .split(boundary)
    .map((part) => part.trim())
    .filter((part) => part !== "" && part !== "--");

  const parsedParts: Partial<
    StatementResponseWithAttachments | StatementsResponseWithAttachments
  > = [];
  for (let partIndex: number = 0; partIndex < parts.length; partIndex++) {
    const headers = {};
    const items = parts[partIndex].split(crlf);
    for (
      let headerIndex: number = 0;
      headerIndex < items.length - 2;
      headerIndex++
    ) {
      const header = items[headerIndex].split(":");
      headers[header[0]] = header[1];
    }
    let data: unknown = items[items.length - 1];
    if (headers["Content-Type"].indexOf("application/json") > -1) {
      data = JSON.parse(data as string);
    }
    parsedParts.push(data);
  }
  return parsedParts as
    | StatementResponseWithAttachments
    | StatementsResponseWithAttachments;
}

export function createMultiPart(
  statementish: Statement | Statement[],
  attachments: ArrayBuffer[]
): MultiPart {
  const blobParts: BlobPart[] = [];

  const boundary = createBoundaryIdentifier();
  const header: MultiPart["header"] = {
    "Content-Type": `multipart/mixed; boundary=${boundary}`,
  };

  // The first part of the multipart document MUST contain the Statements themselves, with type application/json.
  blobParts.push(createStatementHeader(statementish, boundary));

  // Get the attachment meta from each of the statements (if multiple statements provided)
  const flatAttachmentMetaArray = Array.isArray(statementish)
    ? statementish.reduce((acc, val) => acc.concat(val.attachments), [])
    : statementish.attachments;

  // Add attachments to blob (The attachments must be in the same order as they appear in the statements!)
  attachments.forEach((attachmentArrayBuffer, index) => {
    /**
     * TODO: SHOULD only include one copy of an Attachment's data when the same Attachment is used in multiple Statements that are sent together.
     * REF: https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Communication.md#requirements-for-attachment-statement-batches
     * */
    const attachmentMeta: Attachment = flatAttachmentMetaArray[index];
    blobParts.push(createAttachmentHeader(attachmentMeta, boundary));
    blobParts.push(attachmentArrayBuffer);
  });
  blobParts.push(`${crlf}--${boundary}--${crlf}`);

  return {
    header: header,
    blob: new Blob(blobParts),
  };
}

function createBoundaryIdentifier(): string {
  return (
    (Math.random() + " ").substring(2, 10) +
    (Math.random() + " ").substring(2, 10)
  );
}

function createStatementHeader(
  statement: Statement | Statement[],
  boundary: string
): BlobPart {
  return (
    [
      `--${boundary}`,
      // SHOULD include a Content-Type parameter in each part's header. For the first part (containing the Statement) this MUST be application/json.
      "Content-Type: application/json",
      'Content-Disposition: form-data; name="statement"',
      "",
      JSON.stringify(statement),
    ].join(crlf) + crlf
  );
}

function createAttachmentHeader(
  attachmentMeta: Attachment,
  boundary: string
): BlobPart {
  return (
    [
      `--${boundary}`,
      // SHOULD include a Content-Type parameter in each part's header. For the first part (containing the Statement) this MUST be application/json.
      `Content-Type: ${attachmentMeta.contentType}`,
      // MUST include a Content-Transfer-Encoding parameter with a value of binary in each part's header after the first (Statements) part.
      "Content-Transfer-Encoding: binary",
      // MUST include an X-Experience-API-Hash parameter in each part's header after the first (Statements) part.
      `X-Experience-API-Hash: ${attachmentMeta.sha2}`,
    ].join(crlf) +
    crlf +
    crlf
  );
}
