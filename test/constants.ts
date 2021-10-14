import XAPI, {
  Activity,
  Agent,
  Attachment,
  DocumentJson,
  Statement,
} from "../src/XAPI";
import { arrayBufferToWordArray } from "./arrayBufferToWordArray";
import CryptoJS from "crypto-js";
import { TextEncoder } from "util";
import axios from "axios";

export const testEndpoint = "https://www.example/com/lrs/";

export const testAgent: Agent = {
  objectType: "Agent",
  name: "Jest",
  mbox: "mailto:hello@example.com",
};

export const testActivity: Activity = {
  objectType: "Activity",
  id: "https://github.com/xapijs/xapi",
};

export const testStatement: Statement = {
  actor: testAgent,
  verb: {
    id: "http://example.com/verbs/tested",
    display: {
      "en-GB": "tested",
    },
  },
  object: testActivity,
};

export const testAttachmentContent: string = "hello world";

export const testAttachmentArrayBuffer: ArrayBuffer = new TextEncoder().encode(
  testAttachmentContent
);

export const testAttachment: Attachment = {
  usageType: XAPI.AttachmentUsages.SUPPORTING_MEDIA,
  display: {
    "en-US": "Text Attachment",
  },
  description: {
    "en-US": `The text attachment contains "${testAttachmentContent}"`,
  },
  contentType: "text/plain",
  length: testAttachmentArrayBuffer.byteLength,
  sha2: CryptoJS.SHA256(
    arrayBufferToWordArray(testAttachmentArrayBuffer)
  ).toString(),
};

export const testStatementWithEmbeddedAttachments = Object.assign(
  {},
  testStatement,
  {
    attachments: [testAttachment],
  } as Partial<Statement>
);

export const returnTestStatementWithRemoteAttachment =
  (): Promise<Statement> => {
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
        const testStatementWithRemoteAttachment: Statement = Object.assign(
          {},
          testStatement,
          {
            attachments: [
              {
                usageType: XAPI.AttachmentUsages.SUPPORTING_MEDIA,
                display: {
                  "en-US": "Image Attachment",
                },
                description: {
                  "en-US":
                    "One does not simply send an attachment with JavaScript",
                },
                contentType: "image/jpeg",
                length: imageAsArrayBuffer.byteLength,
                fileUrl: imageURL,
                sha2: CryptoJS.SHA256(
                  arrayBufferToWordArray(imageAsArrayBuffer)
                ).toString(),
              },
            ],
          } as Partial<Statement>
        );
        return testStatementWithRemoteAttachment;
      });
  };

export const testProfileId: string = `${testActivity.id}/profiles/test`;

export const testProfileIdTextPlain: string = `${testActivity.id}/profiles/test-text-plain`;

export const testStateId: string = `${testActivity.id}/states/test`;

export const testStateIdTextPlain: string = `${testActivity.id}/states/test-text-plain`;

export const testDocument: DocumentJson = {
  test: "test",
};
