import { StatementParamsBase } from "../getStatement/getStatementParams";

interface GetVoidedStatementParamsBase extends StatementParamsBase {
  /**
   * The original UUID of the statement before it was voided.
   */
  voidedStatementId: string;
}

export interface GetVoidedStatementParamsWithAttachments
  extends GetVoidedStatementParamsBase {
  attachments: true;
}

export interface GetVoidedStatementParamsWithoutAttachments
  extends GetVoidedStatementParamsBase {
  attachments?: false;
}

export type GetVoidedStatementParams =
  | GetVoidedStatementParamsWithAttachments
  | GetVoidedStatementParamsWithoutAttachments;
