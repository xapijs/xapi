import XAPI from "../../../XAPI";
import axios from "axios";
import { testEndpoint } from "../../../../test/constants";
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

  test("can get a voided statement", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testStatementId = "test-statement-id";
    await xapi.getVoidedStatement({
      voidedStatementId: testStatementId,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATEMENT}?voidedStatementId=${testStatementId}`,
      })
    );
  });

  test("can get a voided statement with attachments", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testStatementId = "test-statement-id";
    await xapi.getVoidedStatement({
      voidedStatementId: testStatementId,
      attachments: true,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATEMENT}?voidedStatementId=${testStatementId}&attachments=true`,
      })
    );
  });

  test("can get a voided statement with chosen format", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testStatementId = "test-statement-id";
    await xapi.getVoidedStatement({
      voidedStatementId: testStatementId,
      format: "canonical",
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATEMENT}?voidedStatementId=${testStatementId}&format=canonical`,
      })
    );
  });

  test("can get a voided statement with cache buster", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testStatementId = "test-statement-id";
    await xapi.getVoidedStatement({
      voidedStatementId: testStatementId,
      useCacheBuster: true,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.stringContaining(
          `${testEndpoint}${Resources.STATEMENT}?voidedStatementId=${testStatementId}&cachebuster=`
        ),
      })
    );
  });
});
