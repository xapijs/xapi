import { testActivity, testAgent } from "../../test/constants";
import { getCredentials } from "../../test/getCredentials";
import XAPI from "../XAPI";

getCredentials().forEach((credential) => {
  const auth: string = XAPI.toBasicAuth(
    credential.username,
    credential.password
  );
  const xapi: XAPI = new XAPI(credential.endpoint, auth);

  describe("agent profile resource", () => {
    const testProfileId: string = `${testActivity.id}/profiles/test`;
    const testProfile: { [key: string]: any } = {
      test: "test",
    };

    test("can create agent profile", () => {
      return xapi
        .createAgentProfile({
          agent: testAgent,
          profileId: testProfileId,
          profile: testProfile,
        })
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can set agent profile", () => {
      return xapi
        .getAgentProfile({
          agent: testAgent,
          profileId: testProfileId,
        })
        .then((result) => {
          return xapi.setAgentProfile({
            agent: testAgent,
            profileId: testProfileId,
            profile: testProfile,
            etag: result.headers.etag,
            matchHeader: "If-Match",
          });
        })
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can set agent profile with text/plain content type", () => {
      const testProfileId: string = `${testActivity.id}/profiles/test-text-plain`;
      return xapi
        .deleteAgentProfile({
          agent: testAgent,
          profileId: testProfileId,
        })
        .then(() => {
          return xapi.setAgentProfile({
            agent: testAgent,
            profileId: testProfileId,
            profile: testProfile.test,
            etag: "*",
            matchHeader: "If-None-Match",
            contentType: "text/plain",
          });
        })
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can get all agent profiles", () => {
      return xapi
        .getAgentProfiles({
          agent: testAgent,
        })
        .then((result) => {
          return expect(result.data).toEqual(expect.any(Array));
        });
    });

    test("can get an agent profile", () => {
      return xapi
        .getAgentProfile({
          agent: testAgent,
          profileId: testProfileId,
        })
        .then((result) => {
          return expect(result.data).toMatchObject(testProfile);
        });
    });

    test("can delete an agent profile", () => {
      return xapi
        .deleteAgentProfile({
          agent: testAgent,
          profileId: testProfileId,
        })
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });
  });
});
