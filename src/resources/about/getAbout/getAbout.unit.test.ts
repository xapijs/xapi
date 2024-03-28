import XAPI from "../../../XAPI";
import { testEndpoint } from "../../../../test/constants";
import { Resources } from "../../../constants";

describe("about resource", () => {
  beforeEach(() => {
    global.adapterFn.mockClear();
    global.adapterFn.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get about", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getAbout();
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.ABOUT}`,
      })
    );
  });

  test("can get about with cache buster", () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    xapi.getAbout({
      useCacheBuster: true,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(
          `${testEndpoint}${Resources.ABOUT}?cachebuster=`
        ),
      })
    );
  });
});
