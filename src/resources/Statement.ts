import { AxiosPromise } from "axios";
import { Resources, Verbs } from "../constants";
import { createMultiPart } from "../internal/multiPart";
import XAPI, {
  Actor,
  GetStatementQuery,
  GetStatementQueryWithAttachments,
  GetStatementQueryWithoutAttachments,
  GetStatementsQuery,
  GetStatementsQueryWithAttachments,
  GetStatementsQueryWithoutAttachments,
  GetVoidedStatementQuery,
  GetVoidedStatementQueryWithAttachments,
  GetVoidedStatementQueryWithoutAttachments,
  MultiPart,
  Statement,
  StatementResponseWithAttachments,
  StatementsResponse,
  StatementsResponseWithAttachments,
} from "../XAPI";

export function getStatement(
  this: XAPI,
  query: GetStatementQueryWithAttachments
): AxiosPromise<StatementResponseWithAttachments>;

export function getStatement(
  this: XAPI,
  query: GetStatementQueryWithoutAttachments
): AxiosPromise<Statement>;

export function getStatement(
  this: XAPI,
  query: GetStatementQuery
): AxiosPromise<Statement | StatementResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, query);
}

export function getVoidedStatement(
  this: XAPI,
  query: GetVoidedStatementQueryWithAttachments
): AxiosPromise<StatementResponseWithAttachments>;

export function getVoidedStatement(
  this: XAPI,
  query: GetVoidedStatementQueryWithoutAttachments
): AxiosPromise<Statement>;

export function getVoidedStatement(
  this: XAPI,
  query: GetVoidedStatementQuery
): AxiosPromise<Statement | StatementResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, query);
}

export function getStatements(
  this: XAPI,
  query: GetStatementsQueryWithAttachments
): AxiosPromise<StatementsResponseWithAttachments>;

export function getStatements(
  this: XAPI,
  query?: GetStatementsQueryWithoutAttachments
): AxiosPromise<StatementsResponse>;

export function getStatements(
  this: XAPI,
  query?: GetStatementsQuery
): AxiosPromise<StatementsResponse | StatementsResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, query);
}

export function getMoreStatements(
  this: XAPI,
  more: string
): AxiosPromise<StatementsResponse | StatementsResponseWithAttachments> {
  const endpoint = new URL(this.endpoint);
  const url = `${endpoint.protocol}//${endpoint.host}${more}`;
  return this.requestURL(url);
}

export function sendStatement(
  this: XAPI,
  statement: Statement,
  attachments?: ArrayBuffer[]
): AxiosPromise<string[]> {
  const hasAttachments = attachments?.length;
  if (hasAttachments) {
    const multiPart: MultiPart = createMultiPart(statement, attachments);
    return this.requestResource(
      Resources.STATEMENT,
      {},
      {
        method: "POST",
        headers: multiPart.header,
        data: multiPart.blob,
      }
    );
  } else {
    return this.requestResource(
      Resources.STATEMENT,
      {},
      {
        method: "POST",
        data: statement,
      }
    );
  }
}

export function sendStatements(
  this: XAPI,
  statements: Statement[],
  attachments?: ArrayBuffer[]
): AxiosPromise<string[]> {
  const hasAttachments = attachments?.length;
  if (hasAttachments) {
    const multiPart: MultiPart = createMultiPart(statements, attachments);
    return this.requestResource(
      Resources.STATEMENT,
      {},
      {
        method: "POST",
        headers: multiPart.header,
        data: multiPart.blob,
      }
    );
  } else {
    return this.requestResource(
      Resources.STATEMENT,
      {},
      {
        method: "POST",
        data: statements,
      }
    );
  }
}

export function voidStatement(
  this: XAPI,
  actor: Actor,
  statementId: string
): AxiosPromise<string[]> {
  const voidStatement: Statement = {
    actor,
    verb: Verbs.VOIDED,
    object: {
      objectType: "StatementRef",
      id: statementId,
    },
  };
  return this.sendStatement(voidStatement);
}

export function voidStatements(
  this: XAPI,
  actor: Actor,
  statementIds: string[]
): AxiosPromise<string[]> {
  const voidStatements: Statement[] = statementIds.map((statementId) => {
    return {
      actor,
      verb: Verbs.VOIDED,
      object: {
        objectType: "StatementRef",
        id: statementId,
      },
    };
  });
  return this.sendStatements(voidStatements);
}
