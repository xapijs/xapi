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

  test("can send a statement", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.sendStatement({
      statement: testStatement,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: `${testEndpoint}${Resources.STATEMENT}`,
        data: testStatement,
      })
    );
  });

  testIf(!isNode())(
    "can send a statement with embedded attachments",
    async () => {
      const xapi = new XAPI({
        endpoint: testEndpoint,
        adapter: global.adapter,
      });
      await xapi.sendStatement({
        statement: testStatementWithEmbeddedAttachments,
        attachments: [testAttachmentArrayBuffer],
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
          data: createMultiPart(testStatementWithEmbeddedAttachments, [
            testAttachmentArrayBuffer,
          ]).blob,
        })
      );
    }
  );
});
