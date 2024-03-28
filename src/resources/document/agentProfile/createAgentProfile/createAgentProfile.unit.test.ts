import XAPI from "../../../../XAPI";
import {
  testAgent,
  testDocument,
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

  test("can create agent profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.createAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
      profile: testDocument,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: `${testEndpoint}${
          Resources.AGENT_PROFILE
        }?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&profileId=${encodeURIComponent(testProfileId)}`,
        data: testDocument,
      })
    );
  });

  test("can create agent profile with an etag", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const testEtag = "my-etag";
    const testMatchHeader = "If-Match";
    await xapi.createAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
      profile: testDocument,
      etag: testEtag,
      matchHeader: testMatchHeader,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: `${testEndpoint}${
          Resources.AGENT_PROFILE
        }?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&profileId=${encodeURIComponent(testProfileId)}`,
        data: testDocument,
        headers: expect.objectContaining({
          [testMatchHeader]: testEtag,
        }),
      })
    );
  });
});
