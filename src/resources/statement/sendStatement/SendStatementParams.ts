import { Statement } from "..";

export interface SendStatementParams {
  statement: Statement;
  attachments?: ArrayBuffer[];
}
