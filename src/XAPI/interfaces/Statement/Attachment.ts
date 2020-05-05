import { LanguageMap } from ".";
import { AttachmentUsage } from "../../constants/AttachmentUsage";

export interface Attachment {
  usageType: AttachmentUsage;
  display: LanguageMap;
  contentType: string;
  length: number;
  sha2: string;
  description?: LanguageMap;
  fileUrl?: string;
  content?: ArrayBuffer;
}
