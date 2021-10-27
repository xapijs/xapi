import { testStatement, testAgent } from "../../../../test/constants";
import { forEachLRS } from "../../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("statement resource", () => {
    describe("void statements", () => {
      test("can void multiple statements", () => {
        return xapi
          .sendStatements({
            statements: [testStatement, testStatement],
          })
          .then((result) => {
            return xapi.voidStatements({
              actor: testAgent,
              statementIds: result.data,
            });
          })
          .then((result) => {
            return expect(result.data).toHaveLength(2);
          });
      });
    });
  });
});
