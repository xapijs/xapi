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

  test("can send a statement", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.sendStatement({
      statement: testStatement,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
      });
      await xapi.sendStatement({
        statement: testStatementWithEmbeddedAttachments,
        attachments: [testAttachmentArrayBuffer],
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
          data: createMultiPart(testStatementWithEmbeddedAttachments, [
            testAttachmentArrayBuffer,
          ]).blob,
        })
      );
    }
  );
});
