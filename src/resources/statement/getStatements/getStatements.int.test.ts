import { testAgent } from "../../../../test/constants";
import { forEachLRS } from "../../../../test/getCredentials";

forEachLRS((xapi) => {
  describe("statement resource", () => {
    describe("get statements", () => {
      test("can get multiple statements", () => {
        return xapi.getStatements().then((result) => {
          return expect(result.data.statements).toBeTruthy();
        });
      });
    });

    test("can get multiple statements with attachments", () => {
      return xapi
        .getStatements({
          attachments: true,
          limit: 2,
        })
        .then((result) => {
          const statementsResponse = result.data[0];
          return expect(statementsResponse.statements).toHaveLength(2);
        });
    });

    test("can query for statements using the actor property", () => {
      return xapi
        .getStatements({
          agent: testAgent,
        })
        .then((result) => {
          return expect(result.data.statements).toBeTruthy();
        });
    });

    test("can query a single statement using the limit property", () => {
      return xapi
        .getStatements({
          limit: 1,
        })
        .then((result) => {
          return expect(result.data.statements).toHaveLength(1);
        });
    });
  });
});
