import {
  testActivity,
  testProfileId,
  testDocument,
  testProfileIdTextPlain,
} from "../../../../../test/constants";
import { forEachLRS } from "../../../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("activity profile resource", () => {
    test("can set activity profile", () => {
      return xapi
        .createActivityProfile({
          activityId: testActivity.id,
          profileId: testProfileId,
          profile: {
            foo: "bar",
          },
        })
        .then(() => {
          return xapi.getActivityProfile({
            activityId: testActivity.id,
            profileId: testProfileId,
          });
        })
        .then((result) => {
          return xapi
            .setActivityProfile({
              activityId: testActivity.id,
              profileId: testProfileId,
              profile: testDocument,
              etag: result.headers.etag,
              matchHeader: "If-Match",
            })
            .then(() => {
              return xapi.getActivityProfile({
                activityId: testActivity.id,
                profileId: testProfileId,
              });
            })
            .then((result) => {
              return expect(result.data).toEqual(testDocument);
            });
        });
    });

    test("can set activity profile with text/plain content type", () => {
      return xapi
        .setActivityProfile({
          activityId: testActivity.id,
          profileId: testProfileIdTextPlain,
          profile: testDocument.test,
          etag: "*",
          matchHeader: "If-Match",
          contentType: "text/plain",
        })
        .then(() => {
          return xapi.getActivityProfile({
            activityId: testActivity.id,
            profileId: testProfileIdTextPlain,
          });
        })
        .then((result) => {
          return expect(result.data).toEqual(testDocument.test);
        });
    });
  });
});
