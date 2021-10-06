import { testActivity } from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("activity profile resource", () => {
    test("can get all activity profiles", () => {
      return xapi
        .getActivityProfiles({
          activityId: testActivity.id,
        })
        .then((result) => {
          return expect(result.data).toEqual(expect.any(Array));
        });
    });

    test("can get all activity profiles since a certain date", () => {
      const since = new Date();
      since.setDate(since.getDate() - 1); // yesterday
      return xapi
        .getActivityProfiles({
          activityId: testActivity.id,
          since: since.toISOString(),
        })
        .then((result) => {
          return expect(result.data).toEqual(expect.any(Array));
        });
    });
  });
});
