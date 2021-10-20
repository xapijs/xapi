import XAPI from "../../../XAPI";
import axios from "axios";
import {
  testAttachmentContent,
  testEndpoint,
  testMultiPartData,
  testStatementWithEmbeddedAttachments,
} from "../../../../test/constants";
import { Resources } from "../../../constants";

jest.mock("axios");

describe("statement resource", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get a single statement", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testStatementId = "test-statement-id";
    await xapi.getStatement({
      statementId: testStatementId,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATEMENT}?statementId=${testStatementId}`,
      })
    );
  });

  test("can get a single statement with attachments", async () => {
    jest.resetAllMocks();
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "multipart/mixed; boundary=",
      },
      data: testMultiPartData,
    });
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testStatementId = "test-statement-id";
    const result = await xapi.getStatement({
      statementId: testStatementId,
      attachments: true,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATEMENT}?statementId=${testStatementId}&attachments=true`,
      })
    );
    expect(result.data[0]).toEqual(testStatementWithEmbeddedAttachments);
    expect(result.data[1]).toEqual(testAttachmentContent);
  });

  test("can get a single statement with chosen format", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testStatementId = "test-statement-id";
    await xapi.getStatement({
      statementId: testStatementId,
      format: "canonical",
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATEMENT}?statementId=${testStatementId}&format=canonical`,
      })
    );
  });
});
