import { Statement } from "../../XAPI";

export interface SendStatementsParams {
  statements: Statement[];
  attachments?: ArrayBuffer[];
}
