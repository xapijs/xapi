import {
  testStatement,
  testStatementWithEmbeddedAttachments,
  testAttachmentArrayBuffer,
} from "../../../test/constants";
import { forEachLRS } from "../../../test/getCredentials";
import { testIf, isNode } from "../../../test/jestUtils";

forEachLRS((xapi) => {
  describe("statement resource", () => {
    describe("send statements", () => {
      test("can send multiple statements", () => {
        return xapi
          .sendStatements({
            statements: [testStatement, testStatement],
          })
          .then((result) => {
            return expect(result.data).toHaveLength(2);
          });
      });

      testIf(!isNode())(
        "can send multiple statements with embedded attachments",
        () => {
          return xapi
            .sendStatements({
              statements: [
                testStatementWithEmbeddedAttachments,
                testStatementWithEmbeddedAttachments,
              ],
              attachments: [
                testAttachmentArrayBuffer,
                testAttachmentArrayBuffer,
              ],
            })
            .then((result) => {
              return expect(result.data).toHaveLength(2);
            });
        }
      );
    });
  });
});
