import XAPI from "../../../../XAPI";
import axios from "axios";
import {
  testActivity,
  testDocument,
  testEndpoint,
  testProfileId,
  testProfileIdTextPlain,
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

  test("can set activity profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testEtag = "my-etag";
    const testMatchHeader = "If-Match";
    await xapi.setActivityProfile({
      activityId: testActivity.id,
      profileId: testProfileId,
      profile: testDocument,
      etag: testEtag,
      matchHeader: testMatchHeader,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          [testMatchHeader]: testEtag,
        }),
        url: `${testEndpoint}${
          Resources.ACTIVITY_PROFILE
        }?activityId=${encodeURIComponent(
          testActivity.id
        )}&profileId=${encodeURIComponent(testProfileId)}`,
        data: testDocument,
      })
    );
  });

  test("can set activity profile with text/plain content type", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
    });
    const testEtag = "my-etag";
    const testMatchHeader = "If-Match";
    await xapi.setActivityProfile({
      activityId: testActivity.id,
      profileId: testProfileIdTextPlain,
      profile: testDocument.test,
      etag: testEtag,
      matchHeader: testMatchHeader,
    });
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          [testMatchHeader]: testEtag,
        }),
        url: `${testEndpoint}${
          Resources.ACTIVITY_PROFILE
        }?activityId=${encodeURIComponent(
          testActivity.id
        )}&profileId=${encodeURIComponent(testProfileIdTextPlain)}`,
        data: testDocument.test,
      })
    );
  });
});
