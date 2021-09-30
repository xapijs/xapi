import {
  testActivity,
  testDocument,
  testProfileId,
  testProfileIdTextPlain,
} from "../../test/constants";
import XAPI from "../XAPI";
import { v4 as uuidv4 } from "uuid";
import { getCredentials } from "../../test/getCredentials";

getCredentials().forEach((credential) => {
  const auth: string = XAPI.toBasicAuth(
    credential.username,
    credential.password
  );
  const xapi: XAPI = new XAPI(credential.endpoint, auth);

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

    test("can set activity profile", () => {
      return xapi
        .getActivityProfile({
          activityId: testActivity.id,
          profileId: testProfileId,
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
            .then((result) => {
              return expect(result.data).toBeDefined();
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
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

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

    test("can get an activity profile", () => {
      return xapi
        .getActivityProfile({
          activityId: testActivity.id,
          profileId: testProfileId,
        })
        .then((result) => {
          return expect(result.data).toMatchObject(testDocument);
        });
    });

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
