import { testEndpoint } from "../test/constants";
import XAPI from "./XAPI";
import { toBasicAuth } from "./helpers/toBasicAuth/toBasicAuth";
import { Versions } from "./constants";

describe("xapi constructor", () => {
  beforeEach(() => {
    global.adapterFn.mockClear();
    global.adapterFn.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can be constructed with an endpoint", () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    xapi.getAbout();
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: toBasicAuth("", ""),
        }),
      })
    );
  });

  test("can be constructed with an endpoint and auth", () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      auth: "test",
      adapter: global.adapter,
    });
    xapi.getAbout();
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "test",
        }),
      })
    );
  });

  test("can be constructed with an endpoint and version", () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      version: "1.0.0",
      adapter: global.adapter,
    });
    xapi.getAbout();
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Experience-API-Version": "1.0.0" as Versions,
        }),
      })
    );
  });
});
