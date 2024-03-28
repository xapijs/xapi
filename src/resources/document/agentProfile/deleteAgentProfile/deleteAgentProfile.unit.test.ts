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

  test("can delete an agent profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.deleteAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "DELETE",
        url: `${testEndpoint}${
          Resources.AGENT_PROFILE
        }?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&profileId=${encodeURIComponent(testProfileId)}`,
      })
    );
  });

  test("can delete an agent profile with an etag", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const testEtag = "my-etag";
    await xapi.deleteAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
      etag: testEtag,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "DELETE",
        url: `${testEndpoint}${
          Resources.AGENT_PROFILE
        }?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&profileId=${encodeURIComponent(testProfileId)}`,
        headers: expect.objectContaining({
          ["If-Match"]: testEtag,
        }),
      })
    );
  });
});
