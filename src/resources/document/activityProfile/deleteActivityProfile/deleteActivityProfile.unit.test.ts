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

  test("can delete an activity profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    await xapi.deleteActivityProfile({
      activityId: testActivity.id,
      profileId: testProfileId,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "DELETE",
        url: `${testEndpoint}${
          Resources.ACTIVITY_PROFILE
        }?activityId=${encodeURIComponent(
          testActivity.id
        )}&profileId=${encodeURIComponent(testProfileId)}`,
      })
    );
  });

  test("can delete an activity profile with etag and match header", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testEtag = "my-etag";
    await xapi.deleteActivityProfile({
      activityId: testActivity.id,
      profileId: testProfileId,
      etag: testEtag,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "DELETE",
        url: `${testEndpoint}${
          Resources.ACTIVITY_PROFILE
        }?activityId=${encodeURIComponent(
          testActivity.id
        )}&profileId=${encodeURIComponent(testProfileId)}`,
        headers: expect.objectContaining({
          ["If-Match"]: testEtag,
        }),
      })
    );
  });
});
