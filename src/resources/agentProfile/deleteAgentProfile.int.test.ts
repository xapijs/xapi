import { testAgent, testProfileId } from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("agent profile resource", () => {
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
