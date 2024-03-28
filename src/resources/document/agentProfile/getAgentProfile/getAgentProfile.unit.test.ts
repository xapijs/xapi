import XAPI from "../../../../XAPI";
import {
  testAgent,
  testEndpoint,
  testProfileId,
} from "../../../../../test/constants";
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

  test("can get an agent profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${
          Resources.AGENT_PROFILE
        }?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&profileId=${encodeURIComponent(testProfileId)}`,
      })
    );
  });

  test("can get an agent profile with cache buster", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
      useCacheBuster: true,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.stringContaining(
          `${testEndpoint}${Resources.AGENT_PROFILE}?agent=${encodeURIComponent(
            JSON.stringify(testAgent)
          )}&profileId=${encodeURIComponent(testProfileId)}&cachebuster=`
        ),
      })
    );
  });
});
