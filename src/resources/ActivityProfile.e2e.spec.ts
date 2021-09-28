import { testActivity } from "../../test/constants";
import XAPI from "../XAPI";
import { v4 as uuidv4 } from "uuid";

const credentials: {
  endpoint: string;
  username: string;
  password: string;
}[] = JSON.parse(process.env.LRS_CREDENTIALS_ARRAY);

credentials.forEach((credential) => {
  const endpoint: string = credential.endpoint || "";
  const username: string = credential.username || "";
  const password: string = credential.password || "";
  const auth: string = XAPI.toBasicAuth(username, password);
  const xapi: XAPI = new XAPI(endpoint, auth);

  describe("activity profile resource", () => {
    const testProfileId: string = `${testActivity.id}/profiles/test`;
    const testProfile: { [key: string]: any } = {
      test: "test",
    };

    test("can create activity profile", () => {
      return xapi
        .createActivityProfile({
          activityId: testActivity.id,
          profileId: testProfileId,
          profile: testProfile,
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
              profile: testProfile,
              etag: result.headers.etag,
              matchHeader: "If-Match",
            })
            .then((result) => {
              return expect(result.data).toBeDefined();
            });
        });
    });

    test("can set activity profile with text/plain content type", () => {
      const testProfileId: string = `${testActivity.id}/profiles/test-text-plain`;
      return xapi
        .setActivityProfile({
          activityId: testActivity.id,
          profileId: testProfileId,
          profile: testProfile.test,
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
          return expect(result.data).toMatchObject(testProfile);
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
          profile: testProfile,
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
