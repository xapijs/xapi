import {
  testAttachment,
  testAttachmentArrayBuffer,
  testAttachmentContent,
  testStatementWithEmbeddedAttachments,
} from "../../test/constants";
import { testIf, isNode } from "../../test/jestUtils";
import { createMultiPart, parseMultiPart } from "./multiPart";

testIf(!isNode())("creates a multi-part payload", () => {
  const multiPart = createMultiPart(testStatementWithEmbeddedAttachments, [
    testAttachmentArrayBuffer,
  ]);
  expect(multiPart.header["Content-Type"]).toContain(
    "multipart/mixed; boundary="
  );
  expect(multiPart.blob).toBeInstanceOf(Blob);
});

testIf(!isNode())(
  "creates a multi-part payload with multiple statements",
  () => {
    const multiPart = createMultiPart(
      [
        testStatementWithEmbeddedAttachments,
        testStatementWithEmbeddedAttachments,
      ],
      [testAttachmentArrayBuffer, testAttachmentArrayBuffer]
    );
    expect(multiPart.header["Content-Type"]).toContain(
      "multipart/mixed; boundary="
    );
    expect(multiPart.blob).toBeInstanceOf(Blob);
  }
);

test("parses a multi-part payload", () => {
  const payload = `--testboundaryidentifier\r\nContent-Type:application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
    testStatementWithEmbeddedAttachments
  )}\r\n--testboundaryidentifier\r\nX-Experience-API-Hash:${
    testAttachment.sha2
  }\r\nContent-Transfer-Encoding:binary\r\nContent-Type:${
    testAttachment.contentType
  }\r\n\r\n${testAttachmentContent}\r\n--testboundaryidentifier--\r\n`;

  const parsed = parseMultiPart(payload);
  expect(parsed[0]).toEqual(testStatementWithEmbeddedAttachments);
  expect(parsed[1]).toEqual(testAttachmentContent);
});
