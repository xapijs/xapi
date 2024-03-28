import XAPI from "../../../XAPI";
import {
  testAttachmentArrayBuffer,
  testEndpoint,
  testStatement,
  testStatementWithEmbeddedAttachments,
} from "../../../../test/constants";
import { Resources } from "../../../constants";
import { createMultiPart } from "../../../internal/multiPart";
import { testIf, isNode } from "../../../../test/jestUtils";

describe("statement resource", () => {
  beforeEach(() => {
    global.adapterFn.mockClear();
    global.adapterFn.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can send multiple statements", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.sendStatements({
      statements: [testStatement, testStatement],
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: `${testEndpoint}${Resources.STATEMENT}`,
        data: [testStatement, testStatement],
      })
    );
  });

  testIf(!isNode())(
    "can send multiple statements with embedded attachments",
    async () => {
      const xapi = new XAPI({
        endpoint: testEndpoint,
        adapter: global.adapter,
      });
      await xapi.sendStatements({
        statements: [
          testStatementWithEmbeddedAttachments,
          testStatementWithEmbeddedAttachments,
        ],
        attachments: [testAttachmentArrayBuffer, testAttachmentArrayBuffer],
      });
      expect(global.adapterFn).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            ["Content-Type"]: expect.stringContaining(
              "multipart/mixed; boundary="
            ),
          }),
          url: `${testEndpoint}${Resources.STATEMENT}`,
          data: createMultiPart(
            [
              testStatementWithEmbeddedAttachments,
              testStatementWithEmbeddedAttachments,
            ],
            [testAttachmentArrayBuffer, testAttachmentArrayBuffer]
          ).blob,
        })
      );
    }
  );
});
