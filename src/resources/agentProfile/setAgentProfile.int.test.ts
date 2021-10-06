import {
  testAgent,
  testProfileId,
  testDocument,
  testProfileIdTextPlain,
} from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("agent profile resource", () => {
    test("can set agent profile", () => {
      return xapi
        .createAgentProfile({
          agent: testAgent,
          profileId: testProfileId,
          profile: testDocument,
        })
        .then(() => {
          return xapi.getAgentProfile({
            agent: testAgent,
            profileId: testProfileId,
          });
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
  });
});
