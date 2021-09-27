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
        .createActivityProfile(testActivity.id, testProfileId, testProfile)
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can add to an activity profile using an etag", () => {
      const profileId = uuidv4();
      return xapi
        .createActivityProfile(testActivity.id, profileId, {
          x: "foo",
          y: "bar",
        })
        .then(() => {
          return xapi.getActivityProfile(testActivity.id, profileId);
        })
        .then((response) => {
          return xapi.createActivityProfile(
            testActivity.id,
            profileId,
            {
              x: "bash",
              z: "faz",
            },
            response.headers.etag,
            "If-Match"
          );
        })
        .then(() => {
          return xapi.getActivityProfile(testActivity.id, profileId);
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
        .getActivityProfile(testActivity.id, testProfileId)
        .then((result) => {
          return xapi
            .setActivityProfile(
              testActivity.id,
              testProfileId,
              testProfile,
              result.headers.etag,
              "If-Match"
            )
            .then((result) => {
              return expect(result.data).toBeDefined();
            });
        });
    });

    test("can set activity profile with text/plain content type", () => {
      const testProfileId: string = `${testActivity.id}/profiles/test-text-plain`;

      return xapi
        .setActivityProfile(
          testActivity.id,
          testProfileId,
          testProfile.test,
          "*",
          "If-Match",
          "text/plain"
        )
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can get all activity profiles", () => {
      return xapi.getActivityProfiles(testActivity.id).then((result) => {
        return expect(result.data).toEqual(expect.any(Array));
      });
    });

    test("can get all activity profiles since a certain date", () => {
      const since = new Date();
      since.setDate(since.getDate() - 1); // yesterday
      return xapi
        .getActivityProfiles(testActivity.id, since.toISOString())
        .then((result) => {
          return expect(result.data).toEqual(expect.any(Array));
        });
    });

    test("can get an activity profile", () => {
      return xapi
        .getActivityProfile(testActivity.id, testProfileId)
        .then((result) => {
          return expect(result.data).toMatchObject(testProfile);
        });
    });

    test("can delete an activity profile", () => {
      return xapi
        .deleteActivityProfile(testActivity.id, testProfileId)
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can delete an activity profile with an etag", () => {
      const profileId = uuidv4();
      return xapi
        .createActivityProfile(testActivity.id, profileId, testProfile)
        .then(() => {
          return xapi.getActivityProfile(testActivity.id, profileId);
        })
        .then((response) => {
          return xapi.deleteActivityProfile(
            testActivity.id,
            profileId,
            response.headers.etag
          );
        })
        .then((response) => {
          return expect(response.data).toBeDefined();
        });
    });
  });
});
