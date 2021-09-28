import {
  testAgent,
  testAttachment,
  testAttachmentArrayBuffer,
  testAttachmentContent,
  testStatement,
} from "../../test/constants";
import XAPI, { Attachment, Statement, StatementsResponse } from "../XAPI";
import axios from "axios";
import CryptoJS from "crypto-js";
import { arrayBufferToWordArray } from "../../test/arrayBufferToWordArray";
import { isNode, testIf } from "../../test/jestUtils";

const credentials: {
  endpoint: string;
  username: string;
  password: string;
}[] = JSON.parse(process.env.LRS_CREDENTIALS_ARRAY);

credentials.forEach((credential) => {
  const endpoint: string = credential.endpoint || "";
  const username: string = credential.username || "";
  const password: string = credential.password || "";
  const auth: string = XAPI.toBasicAuth(username, password);
  const xapi: XAPI = new XAPI(endpoint, auth);

  describe("statement resource", () => {
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
      const statement: Statement = Object.assign({}, testStatement);
      const imageURL: string =
        "https://raw.githubusercontent.com/RusticiSoftware/TinCanJS/8733f14ddcaeea77a0579505300bc8f38921a6b1/test/files/image.jpg";
      return axios
        .get(imageURL, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          return response.data as ArrayBuffer;
        })
        .then((imageAsArrayBuffer) => {
          const attachment: Attachment = {
            usageType: XAPI.AttachmentUsages.SUPPORTING_MEDIA,
            display: {
              "en-US": "Image Attachment",
            },
            description: {
              "en-US": "One does not simply send an attachment with JavaScript",
            },
            contentType: "image/jpeg",
            length: imageAsArrayBuffer.byteLength,
            fileUrl: imageURL,
            sha2: CryptoJS.SHA256(
              arrayBufferToWordArray(imageAsArrayBuffer)
            ).toString(),
          };
          statement.attachments = [attachment];
          return xapi.sendStatement({
            statement: statement,
          });
        })
        .then((result) => {
          return expect(result.data).toHaveLength(1);
        });
    });

    testIf(!isNode())(
      "can send a statement with an embedded attachment",
      () => {
        const statement: Statement = Object.assign({}, testStatement);

        statement.attachments = [testAttachment];
        return xapi
          .sendStatement({
            statement: statement,
            attachments: [testAttachmentArrayBuffer],
          })
          .then((result) => {
            return expect(result.data).toHaveLength(1);
          });
      }
    );

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
        const statement: Statement = Object.assign({}, testStatement);
        statement.attachments = [testAttachment];
        return xapi
          .sendStatements({
            statements: [statement, statement],
            attachments: [testAttachmentArrayBuffer, testAttachmentArrayBuffer],
          })
          .then((result) => {
            return expect(result.data).toHaveLength(2);
          });
      }
    );

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

    testIf(!isNode())("can get a statement with an embedded attachment", () => {
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
    });

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

    test("can get multiple statements", () => {
      return xapi.getStatements().then((result) => {
        return expect(result.data.statements).toBeTruthy();
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
