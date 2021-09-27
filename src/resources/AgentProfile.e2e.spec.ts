import { testActivity, testAgent } from "../../test/constants";
import XAPI from "../XAPI";

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

  describe("agent profile resource", () => {
    const testProfileId: string = `${testActivity.id}/profiles/test`;
    const testProfile: { [key: string]: any } = {
      test: "test",
    };

    test("can create agent profile", () => {
      return xapi
        .createAgentProfile(testAgent, testProfileId, testProfile)
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can set agent profile", () => {
      return xapi
        .getAgentProfile(testAgent, testProfileId)
        .then((result) => {
          return xapi.setAgentProfile(
            testAgent,
            testProfileId,
            testProfile,
            result.headers.etag,
            "If-Match"
          );
        })
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can set agent profile with text/plain content type", () => {
      const testProfileId: string = `${testActivity.id}/profiles/test-text-plain`;
      return xapi
        .deleteAgentProfile(testAgent, testProfileId)
        .then(() => {
          return xapi.setAgentProfile(
            testAgent,
            testProfileId,
            testProfile.test,
            "*",
            "If-None-Match",
            "text/plain"
          );
        })
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can get all agent profiles", () => {
      return xapi.getAgentProfiles(testAgent).then((result) => {
        return expect(result.data).toEqual(expect.any(Array));
      });
    });

    test("can get an agent profile", () => {
      return xapi.getAgentProfile(testAgent, testProfileId).then((result) => {
        return expect(result.data).toMatchObject(testProfile);
      });
    });

    test("can delete an agent profile", () => {
      return xapi
        .deleteAgentProfile(testAgent, testProfileId)
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });
  });
});
