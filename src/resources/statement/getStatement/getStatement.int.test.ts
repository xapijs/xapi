import {
  testStatement,
  testAttachment,
  testAttachmentArrayBuffer,
  testAttachmentContent,
} from "../../../../test/constants";
import { forEachLRS } from "../../../../test/getCredentials";
import { testIf, isNode } from "../../../../test/jestUtils";
import { Statement } from "..";

forEachLRS((xapi) => {
  describe("statement resource", () => {
    describe("get statement", () => {
      test("can get a single statement", () => {
        return xapi
          .sendStatement({
            statement: testStatement,
          })
          .then((result) => {
            return xapi.getStatement({
              statementId: result.data[0],
            });
          })
          .then((result) => {
            return expect(result.data.id).toBeTruthy();
          });
      });

      testIf(!isNode())(
        "can get a statement with an embedded attachment",
        () => {
          const statement: Statement = Object.assign({}, testStatement);
          statement.attachments = [testAttachment];
          return xapi
            .sendStatement({
              statement: statement,
              attachments: [testAttachmentArrayBuffer],
            })
            .then((result) => {
              return xapi.getStatement({
                statementId: result.data[0],
                attachments: true,
              });
            })
            .then((response) => {
              const parts = response.data;
              const attachmentData = parts[1];
              return expect(attachmentData).toEqual(testAttachmentContent);
            });
        }
      );
    });
  });
});
