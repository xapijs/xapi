import { testAgent } from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("agent profile resource", () => {
    test("can get all agent profiles", () => {
      return xapi
        .getAgentProfiles({
          agent: testAgent,
        })
        .then((result) => {
          return expect(result.data).toEqual(expect.any(Array));
        });
    });
  });
});
