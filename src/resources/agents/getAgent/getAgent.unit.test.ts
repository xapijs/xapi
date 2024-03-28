import XAPI from "../../../XAPI";
import { testAgent, testEndpoint } from "../../../../test/constants";
import { Resources } from "../../../constants";

describe("agent resource", () => {
  describe("get agent", () => {
    beforeEach(() => {
      global.adapterFn.mockClear();
      global.adapterFn.mockResolvedValueOnce({
        headers: {
          "content-type": "application/json",
        },
      });
    });

    test("can get person by agent", async () => {
      const xapi = new XAPI({
        endpoint: testEndpoint,
        adapter: global.adapter,
      });
      await xapi.getAgent({
        agent: testAgent,
      });
      expect(global.adapterFn).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: `${testEndpoint}${Resources.AGENTS}?agent=${encodeURIComponent(
            JSON.stringify(testAgent)
          )}`,
        })
      );
    });

    test("can get person by agent with cache buster", async () => {
      const xapi = new XAPI({
        endpoint: testEndpoint,
        adapter: global.adapter,
      });
      await xapi.getAgent({
        agent: testAgent,
        useCacheBuster: true,
      });
      expect(global.adapterFn).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "GET",
          url: expect.stringContaining(
            `${testEndpoint}${Resources.AGENTS}?agent=${encodeURIComponent(
              JSON.stringify(testAgent)
            )}&cachebuster=`
          ),
        })
      );
    });
  });
});
