import XAPI from "../../../../XAPI";
import {
  testActivity,
  testDocument,
  testEndpoint,
  testProfileId,
  testProfileIdTextPlain,
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

  test("can set activity profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
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
    expect(global.adapterFn).toHaveBeenCalledWith(
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
      adapter: global.adapter,
    });
    const testEtag = "my-etag";
    const testMatchHeader = "If-Match";
    const plainTextContentType = "text/plain";
    await xapi.setActivityProfile({
      activityId: testActivity.id,
      profileId: testProfileIdTextPlain,
      profile: testDocument.test,
      etag: testEtag,
      matchHeader: testMatchHeader,
      contentType: plainTextContentType,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          [testMatchHeader]: testEtag,
          "Content-Type": plainTextContentType,
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
