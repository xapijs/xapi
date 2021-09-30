import {
  testAgent,
  testDocument,
  testProfileId,
  testProfileIdTextPlain,
} from "../../test/constants";
import { getCredentials } from "../../test/getCredentials";
import XAPI from "../XAPI";

getCredentials().forEach((credential) => {
  const auth: string = XAPI.toBasicAuth(
    credential.username,
    credential.password
  );
  const xapi: XAPI = new XAPI(credential.endpoint, auth);

  describe("agent profile resource", () => {
    test("can create agent profile", () => {
      return xapi
        .createAgentProfile({
          agent: testAgent,
          profileId: testProfileId,
          profile: testDocument,
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
            profile: testDocument,
            etag: result.headers.etag,
            matchHeader: "If-Match",
          });
        })
        .then((result) => {
          return expect(result.data).toBeDefined();
        });
    });

    test("can set agent profile with text/plain content type", () => {
      return xapi
        .deleteAgentProfile({
          agent: testAgent,
          profileId: testProfileIdTextPlain,
        })
        .then(() => {
          return xapi.setAgentProfile({
            agent: testAgent,
            profileId: testProfileIdTextPlain,
            profile: testDocument.test,
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
          return expect(result.data).toMatchObject(testDocument);
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
