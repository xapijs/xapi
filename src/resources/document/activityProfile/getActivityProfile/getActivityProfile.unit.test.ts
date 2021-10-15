import XAPI from "../../../../XAPI";
import axios from "axios";
import {
  testActivity,
  testEndpoint,
  testProfileId,
} from "../../../../../test/constants";
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

  test("can get an activity profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.getActivityProfile({
      activityId: testActivity.id,
      profileId: testProfileId,
    });
    expect(axios.request).toHaveBeenCalledWith(
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
});
