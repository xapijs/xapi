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

  test("can set agent profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testEtag = "my-etag";
    const testMatchHeader = "If-Match";
    await xapi.setAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
      profile: testDocument,
      etag: testEtag,
      matchHeader: testMatchHeader,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
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

  test("can set agent profile with content type", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testEtag = "my-etag";
    const testMatchHeader = "If-Match";
    const plainTextContentType = "text/plain";
    await xapi.setAgentProfile({
      agent: testAgent,
      profileId: testProfileId,
      profile: testDocument.test,
      etag: testEtag,
      matchHeader: testMatchHeader,
      contentType: plainTextContentType,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
        url: `${testEndpoint}${
          Resources.AGENT_PROFILE
        }?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&profileId=${encodeURIComponent(testProfileId)}`,
        data: testDocument.test,
        headers: expect.objectContaining({
          [testMatchHeader]: testEtag,
          "Content-Type": plainTextContentType,
        }),
      })
    );
  });
});
