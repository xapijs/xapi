import XAPI from "../../../../XAPI";
import {
  testActivity,
  testAgent,
  testEndpoint,
} from "../../../../../test/constants";
import { Resources } from "../../../../constants";

describe("state resource", () => {
  beforeEach(() => {
    global.adapterFn.mockClear();
    global.adapterFn.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get all states", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getStates({
      agent: testAgent,
      activityId: testActivity.id,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
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
      adapter: global.adapter,
    });
    const testRegistration = "test-registration";
    await xapi.getStates({
      agent: testAgent,
      activityId: testActivity.id,
      registration: testRegistration,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
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
      adapter: global.adapter,
    });
    const since = new Date();
    since.setDate(since.getDate() - 1); // yesterday
    await xapi.getStates({
      agent: testAgent,
      activityId: testActivity.id,
      since: since.toISOString(),
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
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
      adapter: global.adapter,
    });
    await xapi.getStates({
      agent: testAgent,
      activityId: testActivity.id,
      useCacheBuster: true,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
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
