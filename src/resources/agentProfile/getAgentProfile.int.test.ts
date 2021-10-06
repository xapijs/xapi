import {
  testAgent,
  testProfileId,
  testDocument,
} from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("agent profile resource", () => {
    test("can get an agent profile", () => {
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
          return expect(result.data).toMatchObject(testDocument);
        });
    });
  });
});
