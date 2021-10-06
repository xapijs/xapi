import {
  testActivity,
  testProfileId,
  testDocument,
} from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("activity profile resource", () => {
    test("can get an activity profile", () => {
      return xapi
        .createActivityProfile({
          activityId: testActivity.id,
          profileId: testProfileId,
          profile: testDocument,
        })
        .then(() => {
          return xapi.getActivityProfile({
            activityId: testActivity.id,
            profileId: testProfileId,
          });
        })
        .then((result) => {
          return expect(result.data).toMatchObject(testDocument);
        });
    });
  });
});
