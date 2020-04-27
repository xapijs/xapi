import { Statement, GetStatementQuery, GetVoidedStatementQuery, GetStatementsQuery, StatementsResponse, Actor, Agent } from "./";
import { getSearchQueryParamsAsObject } from "./lib/getSearchQueryParamsAsObject";

export class LRSConnection {
  private endpoint: string;
  private headers: Headers;

  public constructor(endpoint: string, auth: string) {
    this.endpoint = endpoint;
    const headers: Headers = new Headers();
    headers.append("X-Experience-API-Version", "1.0.0");
    headers.append("Content-Type", "application/json");
    if (auth) {
      headers.append("Authorization", auth);
    }
    this.headers = headers;
  }

  // Statements API
  // TODO: Break out APIs into different classes
  public getStatement(query: GetStatementQuery): Promise<Statement> {
    return this.request("statements", query);
  }

  public getVoidedStatement(query: GetVoidedStatementQuery): Promise<Statement> {
    return this.request("statements", query);
  }

  public getStatements(query?: GetStatementsQuery): Promise<StatementsResponse> {
    return this.request("statements", query);
  }

  public getMoreStatements(more: string): Promise<StatementsResponse> {
    const params: {[key: string]: any} = getSearchQueryParamsAsObject(more);
    return this.request("statements", params);
  }

  public sendStatement(statement: Statement): Promise<string[]> {
    return this.request("statements", {}, {
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
      }
    };
    return this.request("statements", {}, {
      method: "POST",
      body: JSON.stringify(voidStatement)
    });
  }

  // State API
  // TODO: Write tests
  public getStates(agent: Agent, activityId: string): Promise<string[]> {
    return this.request("activities/state", {
      agent: agent,
      activityId: activityId
    });
  }

  public getState(agent: Agent, activityId: string, stateId: string): Promise<{[key: string]: any}> {
    return this.request("activities/state", {
      agent: agent,
      activityId: activityId,
      stateId: stateId
    });
  }

  public setState(agent: Agent, activityId: string, stateId: string, state: {[key: string]: any}): Promise<void> {
    return this.request("activities/state", {
      agent: agent,
      activityId: activityId,
      stateId: stateId
    }, {
      method: "POST",
      body: JSON.stringify(state)
    });
  }

  public deleteState(agent: Agent, activityId: string, stateId: string): Promise<void> {
    return this.request("activities/state", {
      agent: agent,
      activityId: activityId,
      stateId: stateId
    }, {
      method: "DELETE"
    });
  }

  private request(path: string, params: {[key: string]: any} = {}, init?: RequestInit | undefined): any {
    const queryString: string = Object.keys(params).map(key => key + "=" + params[key]).join("&");
    const request: RequestInfo = `${this.endpoint}${path}${queryString ? "?" + queryString : ""}`;
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
