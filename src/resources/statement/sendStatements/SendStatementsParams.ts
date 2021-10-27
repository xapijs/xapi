import { Statement } from "..";

export interface SendStatementsParams {
  statements: Statement[];
  attachments?: ArrayBuffer[];
}
