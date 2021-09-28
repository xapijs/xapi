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
  params: GetStatementQueryWithAttachments
): AxiosPromise<StatementResponseWithAttachments>;

export function getStatement(
  this: XAPI,
  params: GetStatementQueryWithoutAttachments
): AxiosPromise<Statement>;

export function getStatement(
  this: XAPI,
  params: GetStatementQuery
): AxiosPromise<Statement | StatementResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, params);
}

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementQueryWithAttachments
): AxiosPromise<StatementResponseWithAttachments>;

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementQueryWithoutAttachments
): AxiosPromise<Statement>;

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementQuery
): AxiosPromise<Statement | StatementResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, params);
}

export function getStatements(
  this: XAPI,
  params: GetStatementsQueryWithAttachments
): AxiosPromise<StatementsResponseWithAttachments>;

export function getStatements(
  this: XAPI,
  params?: GetStatementsQueryWithoutAttachments
): AxiosPromise<StatementsResponse>;

export function getStatements(
  this: XAPI,
  params?: GetStatementsQuery
): AxiosPromise<StatementsResponse | StatementsResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, params);
}

export function getMoreStatements(
  this: XAPI,
  params: {
    more: string;
  }
): AxiosPromise<StatementsResponse | StatementsResponseWithAttachments> {
  const endpoint = new URL(this.endpoint);
  const url = `${endpoint.protocol}//${endpoint.host}${params.more}`;
  return this.requestURL(url);
}

export function sendStatement(
  this: XAPI,
  params: {
    statement: Statement;
    attachments?: ArrayBuffer[];
  }
): AxiosPromise<string[]> {
  const hasAttachments = params.attachments?.length;
  if (hasAttachments) {
    const multiPart: MultiPart = createMultiPart(
      params.statement,
      params.attachments
    );
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
        data: params.statement,
      }
    );
  }
}

export function sendStatements(
  this: XAPI,
  params: {
    statements: Statement[];
    attachments?: ArrayBuffer[];
  }
): AxiosPromise<string[]> {
  const hasAttachments = params.attachments?.length;
  if (hasAttachments) {
    const multiPart: MultiPart = createMultiPart(
      params.statements,
      params.attachments
    );
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
        data: params.statements,
      }
    );
  }
}

export function voidStatement(
  this: XAPI,
  params: {
    actor: Actor;
    statementId: string;
  }
): AxiosPromise<string[]> {
  const voidStatement: Statement = {
    actor: params.actor,
    verb: Verbs.VOIDED,
    object: {
      objectType: "StatementRef",
      id: params.statementId,
    },
  };
  return this.sendStatement({
    statement: voidStatement,
  });
}

export function voidStatements(
  this: XAPI,
  params: {
    actor: Actor;
    statementIds: string[];
  }
): AxiosPromise<string[]> {
  const voidStatements: Statement[] = params.statementIds.map((statementId) => {
    return {
      actor: params.actor,
      verb: Verbs.VOIDED,
      object: {
        objectType: "StatementRef",
        id: statementId,
      },
    };
  });
  return this.sendStatements({
    statements: voidStatements,
  });
}
