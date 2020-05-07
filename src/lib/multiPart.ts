import { Statement, Attachment } from "../XAPI";

export interface MultiPart {
  header: {"Content-Type": string};
  blob: Blob;
}

export type Part = Statement | unknown;

const crlf: string = "\r\n";

export function parseMultiPart(data: string): Part[] {
  const boundary = data.trim().split(crlf)[0].trim();
  const parts = data
    .split(boundary)
    .map(part => part.trim())
    .filter(part => part !== "" && part !== "--");

  const parsedParts: Part[] = [];
  for (let partIndex: number = 0; partIndex < parts.length; partIndex++) {
    const headers = {};
    const items = parts[partIndex].split(crlf);
    for (let j: number = 0; j < items.length - 2; j++) {
      const header = items[j].split(":");
      headers[header[0]] = header[1];
    }
    let data: unknown = items[items.length - 1];
    if (headers["Content-Type"].indexOf("application/json") > -1) {
      data = JSON.parse(data as string);
    }
    parsedParts.push(data);
  }
  return parsedParts;
}

export function createMultiPart(statement: Statement, attachments: ArrayBuffer[]): MultiPart {
  const blobParts: BlobPart[] = [];

  const boundary = (Math.random() + " ").substring(2, 10) + (Math.random() + " ").substring(2, 10);
  const header: MultiPart["header"] = {
    "Content-Type": `multipart/mixed; boundary=${boundary}`
  };

  // Add statement to blob
  const statementHeader: string = [
    `--${boundary}`,
    "Content-Type: application/json",
    "Content-Disposition: form-data; name=\"statement\"",
    "",
    JSON.stringify(statement)
  ].join(crlf) + crlf;
  blobParts.push(statementHeader);

  // Add attachments to blob
  attachments.forEach((attachmentArrayBuffer, index) => {
    const attachmentMeta: Attachment = statement.attachments[index];
    const attachmentHeader: string = [
      `--${boundary}`,
      `Content-Type: ${attachmentMeta.contentType}`,
      "Content-Transfer-Encoding: binary",
      `X-Experience-API-Hash: ${attachmentMeta.sha2}`
    ].join(crlf) + crlf + crlf;
    blobParts.push(attachmentHeader);
    blobParts.push(attachmentArrayBuffer);
  });
  blobParts.push(`${crlf}--${boundary}--${crlf}`);

  return {
    header: header,
    blob: new Blob(blobParts)
  };
}
