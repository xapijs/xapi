import { testActivity } from "../../../../test/constants";
import { forEachLRS } from "../../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("activities resource", () => {
    test("can get activity", () => {
      return xapi
        .getActivity({
          activityId: testActivity.id,
        })
        .then((result) => {
          return expect(result.data).toMatchObject(testActivity);
        });
    });
  });
});
