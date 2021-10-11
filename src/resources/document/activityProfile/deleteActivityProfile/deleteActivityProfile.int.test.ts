import { v4 as uuidv4 } from "uuid";
import {
  testActivity,
  testDocument,
  testProfileId,
} from "../../../../../test/constants";
import { forEachLRS } from "../../../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("activity profile resource", () => {
    test("can delete an activity profile", () => {
      return xapi
        .deleteActivityProfile({
          activityId: testActivity.id,
          profileId: testProfileId,
        })
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can delete an activity profile with an etag", () => {
      const profileId = uuidv4();
      return xapi
        .createActivityProfile({
          activityId: testActivity.id,
          profileId: profileId,
          profile: testDocument,
        })
        .then(() => {
          return xapi.getActivityProfile({
            activityId: testActivity.id,
            profileId: profileId,
          });
        })
        .then((response) => {
          return xapi.deleteActivityProfile({
            activityId: testActivity.id,
            profileId: profileId,
            etag: response.headers.etag,
          });
        })
        .then((response) => {
          return expect(response.data).toBeDefined();
        });
    });
  });
});
