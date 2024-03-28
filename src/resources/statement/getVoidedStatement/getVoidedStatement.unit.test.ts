import XAPI from "../../../XAPI";
import { testEndpoint } from "../../../../test/constants";
import { Resources } from "../../../constants";

describe("statement resource", () => {
  beforeEach(() => {
    global.adapterFn.mockClear();
    global.adapterFn.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get a voided statement", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const testStatementId = "test-statement-id";
    await xapi.getVoidedStatement({
      voidedStatementId: testStatementId,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATEMENT}?voidedStatementId=${testStatementId}`,
      })
    );
  });

  test("can get a voided statement with attachments", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const testStatementId = "test-statement-id";
    await xapi.getVoidedStatement({
      voidedStatementId: testStatementId,
      attachments: true,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATEMENT}?voidedStatementId=${testStatementId}&attachments=true`,
      })
    );
  });

  test("can get a voided statement with chosen format", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const testStatementId = "test-statement-id";
    await xapi.getVoidedStatement({
      voidedStatementId: testStatementId,
      format: "canonical",
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATEMENT}?voidedStatementId=${testStatementId}&format=canonical`,
      })
    );
  });

  test("can get a voided statement with cache buster", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const testStatementId = "test-statement-id";
    await xapi.getVoidedStatement({
      voidedStatementId: testStatementId,
      useCacheBuster: true,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.stringContaining(
          `${testEndpoint}${Resources.STATEMENT}?voidedStatementId=${testStatementId}&cachebuster=`
        ),
      })
    );
  });
});
