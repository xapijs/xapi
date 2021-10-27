import XAPI from "../../../../XAPI";
import axios from "axios";
import { testActivity, testEndpoint } from "../../../../../test/constants";
import { Resources } from "../../../../constants";

jest.mock("axios");

describe("activity profile resource", () => {
  beforeEach(() => {
    (axios as jest.MockedFunction<any>).request.mockResolvedValueOnce({
      headers: {
        "content-type": "application/json",
      },
    });
  });

  test("can get all activity profiles", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getActivityProfiles({
      activityId: testActivity.id,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
    });
    const since = new Date();
    since.setDate(since.getDate() - 1); // yesterday
    await xapi.getActivityProfiles({
      activityId: testActivity.id,
      since: since.toISOString(),
    });
    expect(axios.request).toHaveBeenCalledWith(
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
    });
    await xapi.getActivityProfiles({
      activityId: testActivity.id,
      useCacheBuster: true,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
