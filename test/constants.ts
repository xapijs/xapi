import XAPI, { Activity, Agent, Attachment, Statement } from "../src/XAPI";
import { arrayBufferToWordArray } from "./arrayBufferToWordArray";
import CryptoJS from "crypto-js";
import { TextEncoder } from "util";

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
