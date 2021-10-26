import XAPI from "../../../../XAPI";
import axios from "axios";
import {
  testAgent,
  testEndpoint,
  testProfileId,
} from "../../../../../test/constants";
import { Resources } from "../../../../constants";

jest.mock("axios");

describe("agent profile resource", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get an agent profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
    });
    await xapi.getAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
      useCacheBuster: true,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
