import { v4 as uuidv4 } from "uuid";
import {
  testActivity,
  testProfileId,
  testDocument,
} from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("activity profile resource", () => {
    test("can create activity profile", () => {
      return xapi
        .createActivityProfile({
          activityId: testActivity.id,
          profileId: testProfileId,
          profile: testDocument,
        })
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can add to an activity profile using an etag", () => {
      const profileId = uuidv4();
      return xapi
        .createActivityProfile({
          activityId: testActivity.id,
          profileId: profileId,
          profile: {
            x: "foo",
            y: "bar",
          },
        })
        .then(() => {
          return xapi.getActivityProfile({
            activityId: testActivity.id,
            profileId: profileId,
          });
        })
        .then((response) => {
          return xapi.createActivityProfile({
            activityId: testActivity.id,
            profileId: profileId,
            profile: {
              x: "bash",
              z: "faz",
            },
            etag: response.headers.etag,
            matchHeader: "If-Match",
          });
        })
        .then(() => {
          return xapi.getActivityProfile({
            activityId: testActivity.id,
            profileId: profileId,
          });
        })
        .then((response) => {
          return expect(response.data).toEqual({
            x: "bash",
            y: "bar",
            z: "faz",
          });
        });
    });
  });
});
