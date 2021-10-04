import { AxiosPromise } from "axios";
import { Resources, Verbs } from "../constants";
import { createMultiPart } from "../internal/multiPart";
import XAPI, {
  GetMoreStatementsParams,
  GetStatementParams,
  GetStatementParamsWithAttachments,
  GetStatementParamsWithoutAttachments,
  GetStatementsParams,
  GetStatementsParamsWithAttachments,
  GetStatementsParamsWithoutAttachments,
  GetVoidedStatementParams,
  GetVoidedStatementParamsWithAttachments,
  GetVoidedStatementParamsWithoutAttachments,
  MultiPart,
  SendStatementParams,
  SendStatementsParams,
  Statement,
  StatementResponseWithAttachments,
  StatementsResponse,
  StatementsResponseWithAttachments,
  VoidStatementParams,
  VoidStatementsParams,
} from "../XAPI";

export function getStatement(
  this: XAPI,
  params: GetStatementParamsWithAttachments
): AxiosPromise<StatementResponseWithAttachments>;

export function getStatement(
  this: XAPI,
  params: GetStatementParamsWithoutAttachments
): AxiosPromise<Statement>;

export function getStatement(
  this: XAPI,
  params: GetStatementParams
): AxiosPromise<Statement | StatementResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, params);
}

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementParamsWithAttachments
): AxiosPromise<StatementResponseWithAttachments>;

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementParamsWithoutAttachments
): AxiosPromise<Statement>;

export function getVoidedStatement(
  this: XAPI,
  params: GetVoidedStatementParams
): AxiosPromise<Statement | StatementResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, params);
}

export function getStatements(
  this: XAPI,
  params: GetStatementsParamsWithAttachments
): AxiosPromise<StatementsResponseWithAttachments>;

export function getStatements(
  this: XAPI,
  params?: GetStatementsParamsWithoutAttachments
): AxiosPromise<StatementsResponse>;

export function getStatements(
  this: XAPI,
  params?: GetStatementsParams
): AxiosPromise<StatementsResponse | StatementsResponseWithAttachments> {
  return this.requestResource(Resources.STATEMENT, params);
}

export function getMoreStatements(
  this: XAPI,
  params: GetMoreStatementsParams
): AxiosPromise<StatementsResponse | StatementsResponseWithAttachments> {
  const endpoint = new URL(this.endpoint);
  const url = `${endpoint.protocol}//${endpoint.host}${params.more}`;
  return this.requestURL(url);
}

export function sendStatement(
  this: XAPI,
  params: SendStatementParams
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
  params: SendStatementsParams
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
  params: VoidStatementParams
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
  params: VoidStatementsParams
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
