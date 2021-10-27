import XAPI from "../../../XAPI";
import axios from "axios";
import {
  testAttachmentArrayBuffer,
  testEndpoint,
  testStatement,
  testStatementWithEmbeddedAttachments,
} from "../../../../test/constants";
import { Resources } from "../../../constants";
import { createMultiPart } from "../../../internal/multiPart";
import { testIf, isNode } from "../../../../test/jestUtils";

jest.mock("axios");

describe("statement resource", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can send multiple statements", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.sendStatements({
      statements: [testStatement, testStatement],
    });
    expect(axios.request).toHaveBeenCalledWith(
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
      });
      await xapi.sendStatements({
        statements: [
          testStatementWithEmbeddedAttachments,
          testStatementWithEmbeddedAttachments,
        ],
        attachments: [testAttachmentArrayBuffer, testAttachmentArrayBuffer],
      });
      expect(axios.request).toHaveBeenCalledWith(
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
