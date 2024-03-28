import XAPI from "../../../../XAPI";
import {
  testActivity,
  testEndpoint,
  testProfileId,
} from "../../../../../test/constants";
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

  test("can get an activity profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getActivityProfile({
      activityId: testActivity.id,
      profileId: testProfileId,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: `${testEndpoint}${
          Resources.ACTIVITY_PROFILE
        }?activityId=${encodeURIComponent(
          testActivity.id
        )}&profileId=${encodeURIComponent(testProfileId)}`,
      })
    );
  });

  test("can get an activity profile with cache buster", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.getActivityProfile({
      activityId: testActivity.id,
      profileId: testProfileId,
      useCacheBuster: true,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: expect.stringContaining(
          `${testEndpoint}${
            Resources.ACTIVITY_PROFILE
          }?activityId=${encodeURIComponent(
            testActivity.id
          )}&profileId=${encodeURIComponent(testProfileId)}&cachebuster=`
        ),
      })
    );
  });
});
