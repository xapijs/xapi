import XAPI from "../../../../XAPI";
import axios from "axios";
import {
  testAgent,
  testDocument,
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

  test("can create agent profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.createAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
      profile: testDocument,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
    expect(axios.request).toHaveBeenCalledWith(
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
