import { Statement, GetStatementQuery, GetVoidedStatementQuery, GetStatementsQuery, StatementsResponse, Actor, StatementRef } from "./";
import { getSearchQueryParamsAsObject } from "./lib/getSearchQueryParamsAsObject";

export class LRSConnection {
  private endpoint: string;
  private headers: Headers;

  public constructor(endpoint: string, auth: string) {
    this.endpoint = endpoint;
    let headers: Headers = new Headers();
    headers.append("X-Experience-API-Version", "1.0.0");
    headers.append("Content-Type", "application/json");
    if (auth) {
      headers.append("Authorization", auth);
    }
    this.headers = headers;
  }

  public getStatement(query: GetStatementQuery): Promise<Statement> {
    return this.request(query);
  }

  public getVoidedStatement(query: GetVoidedStatementQuery): Promise<Statement> {
    return this.request(query);
  }

  public getStatements(query?: GetStatementsQuery): Promise<StatementsResponse> {
    return this.request(query);
  }

  public getMoreStatements(more: string): Promise<StatementsResponse> {
    let params: {[key: string]: any} = getSearchQueryParamsAsObject(more);
    return this.request(params);
  }

  public sendStatement(statement: Statement): Promise<string[]> {
    return this.request({}, {
      method: "POST",
      body: JSON.stringify(statement)
    });
  }

  public voidStatement(actor: Actor, statementId: string): Promise<string[]> {
    const voidStatement: Statement = {
      actor,
      verb: {
        id: "http://adlnet.gov/expapi/verbs/voided",
        display: {
            "en-US": "voided"
        }
      },
      object: {
        objectType: "StatementRef",
        id: statementId
      } as StatementRef
    }
    return this.request({}, {
      method: "POST",
      body: JSON.stringify(voidStatement)
    });
  }

  private request(params: {[key: string]: any} = {}, init?: RequestInit | undefined): any {
    const queryString: string = Object.keys(params).map(key => key + "=" + params[key]).join("&");
    const request: RequestInfo = `${this.endpoint}statements${queryString ? "?" + queryString : ""}`;
    return fetch(request, {
      headers: this.headers,
      ...init
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.text().then(error => Promise.reject(error));
      }
    });
  }
}
