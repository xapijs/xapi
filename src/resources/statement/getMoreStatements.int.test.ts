import { forEachLRS } from "../../../test/getCredentials";
import { StatementsResponse } from "../../XAPI";

forEachLRS((xapi) => {
  describe("statement resource", () => {
    describe("more statements", () => {
      test("can get more statements using the more property", () => {
        return xapi
          .getStatements({
            limit: 1,
          })
          .then((result) => {
            return xapi.getMoreStatements({
              more: result.data.more,
            });
          })
          .then((result) => {
            return expect(
              (result.data as StatementsResponse).statements
            ).toBeTruthy();
          });
      });

      test("can get more statements with attachments using the more property", () => {
        return xapi
          .getStatements({
            limit: 1,
            attachments: true,
          })
          .then((result) => {
            return xapi.getMoreStatements({
              more: result.data[0].more,
            });
          })
          .then((result) => {
            return expect(result.data[0].statements).toBeTruthy();
          });
      });
    });
  });
});
