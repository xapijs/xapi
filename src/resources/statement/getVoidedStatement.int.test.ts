import { testStatement, testAgent } from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("statement resource", () => {
    describe("void statement", () => {
      test("can get a voided statement", () => {
        let statementId: string;
        return xapi
          .sendStatement({
            statement: testStatement,
          })
          .then((result) => {
            statementId = result.data[0];
            return xapi.voidStatement({
              actor: testAgent,
              statementId: statementId,
            });
          })
          .then(() => {
            return xapi.getVoidedStatement({
              voidedStatementId: statementId,
            });
          })
          .then((result) => {
            return expect(result.data).toHaveProperty("id");
          });
      });
    });
  });
});
