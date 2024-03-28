import XAPI from "../../../../XAPI";
import {
  testActivity,
  testDocument,
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

  test("can create activity profile", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    await xapi.createActivityProfile({
      activityId: testActivity.id,
      profileId: testProfileId,
      profile: testDocument,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        url: `${testEndpoint}${
          Resources.ACTIVITY_PROFILE
        }?activityId=${encodeURIComponent(
          testActivity.id
        )}&profileId=${encodeURIComponent(testProfileId)}`,
        data: testDocument,
      })
    );
  });

  test("can create activity profile with etag and match header", async () => {
    const xapi = new XAPI({
      endpoint: testEndpoint,
      adapter: global.adapter,
    });
    const testEtag = "my-etag";
    const testMatchHeader = "If-Match";
    await xapi.createActivityProfile({
      activityId: testActivity.id,
      profileId: testProfileId,
      profile: testDocument,
      etag: testEtag,
      matchHeader: testMatchHeader,
    });
    expect(global.adapterFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
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
});
