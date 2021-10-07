import { Statement } from "../../XAPI";

export interface SendStatementParams {
  statement: Statement;
  attachments?: ArrayBuffer[];
}
