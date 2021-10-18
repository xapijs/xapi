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

  test("can delete an agent profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.deleteAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
    });
    const testEtag = "my-etag";
    await xapi.deleteAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
      etag: testEtag,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
