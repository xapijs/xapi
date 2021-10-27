import {
  testAgent,
  testProfileId,
  testDocument,
} from "../../../../../test/constants";
import { forEachLRS } from "../../../../../test/getCredentials";

forEachLRS((xapi) => {
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
  });
});
