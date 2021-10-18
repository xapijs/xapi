import XAPI from "../../../../XAPI";
import axios from "axios";
import { testAgent, testEndpoint } from "../../../../../test/constants";
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

  test("can get all agent profiles", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getAgentProfiles({
      agent: testAgent,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
    });
    const since = new Date();
    since.setDate(since.getDate() - 1); // yesterday
    await xapi.getAgentProfiles({
      agent: testAgent,
      since: since.toISOString(),
    });
    expect(axios.request).toHaveBeenCalledWith(
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
});
