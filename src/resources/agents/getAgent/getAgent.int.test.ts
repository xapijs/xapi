import { testAgent } from "../../../../test/constants";
import { forEachLRS } from "../../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("agents resource", () => {
    describe("get agent", () => {
      test("can get person by agent", () => {
        return xapi
          .getAgent({
            agent: testAgent,
          })
          .then((result) => {
            return expect(result.data).toBeDefined();
          });
      });
    });
  });
});
