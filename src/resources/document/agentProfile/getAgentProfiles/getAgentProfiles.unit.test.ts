import XAPI from "../../../../XAPI";
import { testAgent, testEndpoint } from "../../../../../test/constants";
import { Resources } from "../../../../constants";

describe("agent profile resource", () => {
  beforeEach(() => {
    global.adapterFn.mockClear();
    global.adapterFn.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get all agent profiles", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getAgentProfiles({
      agent: testAgent,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${
          Resources.AGENT_PROFILE
        }?agent=${encodeURIComponent(JSON.stringify(testAgent))}`,
      })
    );
  });

  test("can get all agent profiles since a certain date", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const since = new Date();
    since.setDate(since.getDate() - 1); // yesterday
    await xapi.getAgentProfiles({
      agent: testAgent,
      since: since.toISOString(),
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${
          Resources.AGENT_PROFILE
        }?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&since=${encodeURIComponent(since.toISOString())}`,
      })
    );
  });

  test("can get all agent profiles with cache buster", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getAgentProfiles({
      agent: testAgent,
      useCacheBuster: true,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.stringContaining(
          `${testEndpoint}${Resources.AGENT_PROFILE}?agent=${encodeURIComponent(
            JSON.stringify(testAgent)
          )}&cachebuster=`
        ),
      })
    );
  });
});
