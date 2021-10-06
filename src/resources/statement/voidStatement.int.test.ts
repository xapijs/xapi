import { testStatement, testAgent } from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("statement resource", () => {
    describe("void statement", () => {
      test("can void a single statement", () => {
        return xapi
          .sendStatement({
            statement: testStatement,
          })
          .then((result) => {
            return xapi.voidStatement({
              actor: testAgent,
              statementId: result.data[0],
            });
          })
          .then((result) => {
            return expect(result.data).toHaveLength(1);
          });
      });
    });
  });
});
