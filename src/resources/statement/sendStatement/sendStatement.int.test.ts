import {
  testStatement,
  returnTestStatementWithRemoteAttachment,
  testStatementWithEmbeddedAttachments,
  testAttachmentArrayBuffer,
} from "../../../../test/constants";
import { forEachLRS } from "../../../../test/getCredentials";
import { testIf, isNode } from "../../../../test/jestUtils";

forEachLRS((xapi) => {
  describe("statement resource", () => {
    describe("send statement", () => {
      test("can send a statement", () => {
        return xapi
          .sendStatement({
            statement: testStatement,
          })
          .then((result) => {
            return expect(result.data).toHaveLength(1);
          });
      });

      test("can send a statement with a remote attachment", () => {
        return returnTestStatementWithRemoteAttachment()
          .then((testStatementWithRemoteAttachment) => {
            return xapi.sendStatement({
              statement: testStatementWithRemoteAttachment,
            });
          })
          .then((result) => {
            return expect(result.data).toHaveLength(1);
          });
      });

      testIf(!isNode())(
        "can send a statement with an embedded attachment",
        () => {
          return xapi
            .sendStatement({
              statement: testStatementWithEmbeddedAttachments,
              attachments: [testAttachmentArrayBuffer],
            })
            .then((result) => {
              return expect(result.data).toHaveLength(1);
            });
        }
      );
    });
  });
});
