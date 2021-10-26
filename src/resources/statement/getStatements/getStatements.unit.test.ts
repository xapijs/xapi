import XAPI from "../../../XAPI";
import axios from "axios";
import {
  testActivity,
  testAgent,
  testEndpoint,
  testVerb,
} from "../../../../test/constants";
import { Resources } from "../../../constants";

jest.mock("axios");

describe("statement resource", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get multiple statements", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getStatements();
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATEMENT}`,
      })
    );
  });

  test("can get multiple statements with attachments", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getStatements({
      attachments: true,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATEMENT}?attachments=true`,
      })
    );
  });

  test("can get multiple statements with all query parameters", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testRegistration = "test-registration";
    const since = new Date();
    since.setDate(since.getDate() - 1); // yesterday
    await xapi.getStatements({
      activity: testActivity.id,
      agent: testAgent,
      ascending: true,
      attachments: true,
      format: "ids",
      limit: 10,
      registration: testRegistration,
      related_activities: true,
      related_agents: true,
      since: since.toISOString(),
      until: since.toISOString(),
      verb: testVerb.id,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${
          Resources.STATEMENT
        }?activity=${encodeURIComponent(
          testActivity.id
        )}&agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&ascending=true&attachments=true&format=ids&limit=10&registration=${testRegistration}&related_activities=true&related_agents=true&since=${encodeURIComponent(
          since.toISOString()
        )}&until=${encodeURIComponent(
          since.toISOString()
        )}&verb=${encodeURIComponent(testVerb.id)}`,
      })
    );
  });

  test("can get multiple statements with cache buster", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getStatements({
      useCacheBuster: true,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.stringContaining(
          `${testEndpoint}${Resources.STATEMENT}?cachebuster=`
        ),
      })
    );
  });
});
