import { StatementParamsBase } from "../StatementParamsBase";

interface GetStatementParamsBase extends StatementParamsBase {
  /**
   * The UUID of the statement.
   */
  statementId: string;
}

export interface GetStatementParamsWithAttachments
  extends GetStatementParamsBase {
  attachments: true;
}

export interface GetStatementParamsWithoutAttachments
  extends GetStatementParamsBase {
  attachments?: false;
}

export type GetStatementParams =
  | GetStatementParamsWithoutAttachments
  | GetStatementParamsWithAttachments;
