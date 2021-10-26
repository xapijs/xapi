import XAPI from "../../../../XAPI";
import axios from "axios";
import {
  testActivity,
  testAgent,
  testEndpoint,
} from "../../../../../test/constants";
import { Resources } from "../../../../constants";

jest.mock("axios");

describe("state resource", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get all states", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getStates({
      agent: testAgent,
      activityId: testActivity.id,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(testActivity.id)}`,
      })
    );
  });

  test("can get all states for a registration", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testRegistration = "test-registration";
    await xapi.getStates({
      agent: testAgent,
      activityId: testActivity.id,
      registration: testRegistration,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&registration=${testRegistration}`,
      })
    );
  });

  test("can get all states since a certain date", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const since = new Date();
    since.setDate(since.getDate() - 1); // yesterday
    await xapi.getStates({
      agent: testAgent,
      activityId: testActivity.id,
      since: since.toISOString(),
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
          JSON.stringify(testAgent)
        )}&activityId=${encodeURIComponent(
          testActivity.id
        )}&since=${encodeURIComponent(since.toISOString())}`,
      })
    );
  });

  test("can get all states with cache buster", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getStates({
      agent: testAgent,
      activityId: testActivity.id,
      useCacheBuster: true,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.stringContaining(
          `${testEndpoint}${Resources.STATE}?agent=${encodeURIComponent(
            JSON.stringify(testAgent)
          )}&activityId=${encodeURIComponent(testActivity.id)}&cachebuster=`
        ),
      })
    );
  });
});
