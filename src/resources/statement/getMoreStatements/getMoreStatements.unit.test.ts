import XAPI from "../../../XAPI";
import { testEndpoint } from "../../../../test/constants";

describe("statement resource", () => {
  beforeEach(() => {
    global.adapterFn.mockClear();
    global.adapterFn.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get more statements", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const endpoint = new URL(testEndpoint);
    const testMoreIrl = "?more=test-more-irl";
    await xapi.getMoreStatements({
      more: testMoreIrl,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${endpoint.protocol}//${endpoint.host}${testMoreIrl}`,
      })
    );
  });
});
