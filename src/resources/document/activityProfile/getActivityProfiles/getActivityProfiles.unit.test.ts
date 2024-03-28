import XAPI from "../../../../XAPI";
import { testActivity, testEndpoint } from "../../../../../test/constants";
import { Resources } from "../../../../constants";

describe("activity profile resource", () => {
  beforeEach(() => {
    global.adapterFn.mockClear();
    global.adapterFn.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get all activity profiles", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getActivityProfiles({
      activityId: testActivity.id,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${
          Resources.ACTIVITY_PROFILE
        }?activityId=${encodeURIComponent(testActivity.id)}`,
      })
    );
  });

  test("can get all activity profiles since a certain date", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const since = new Date();
    since.setDate(since.getDate() - 1); // yesterday
    await xapi.getActivityProfiles({
      activityId: testActivity.id,
      since: since.toISOString(),
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${
          Resources.ACTIVITY_PROFILE
        }?activityId=${encodeURIComponent(
          testActivity.id
        )}&since=${encodeURIComponent(since.toISOString())}`,
      })
    );
  });

  test("can get all activity profiles with cache buster", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getActivityProfiles({
      activityId: testActivity.id,
      useCacheBuster: true,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.stringContaining(
          `${testEndpoint}${
            Resources.ACTIVITY_PROFILE
          }?activityId=${encodeURIComponent(testActivity.id)}&cachebuster=`
        ),
      })
    );
  });
});
