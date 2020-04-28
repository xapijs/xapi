import { Statement, GetStatementQuery, GetVoidedStatementQuery, GetStatementsQuery, StatementsResponse, Actor, Agent } from "./";
import { getSearchQueryParamsAsObject } from "./lib/getSearchQueryParamsAsObject";
import { Verbs } from "./constants";
import { Endpoint } from "./constants/Endpoint";

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
  public getStatement(query: GetStatementQuery): Promise<Statement> {
    return this.request(Endpoint.STATEMENTS, query);
  }

  public getVoidedStatement(query: GetVoidedStatementQuery): Promise<Statement> {
    return this.request(Endpoint.STATEMENTS, query);
  }

  public getStatements(query?: GetStatementsQuery): Promise<StatementsResponse> {
    return this.request(Endpoint.STATEMENTS, query);
  }

  public getMoreStatements(more: string): Promise<StatementsResponse> {
    const params: {[key: string]: any} = getSearchQueryParamsAsObject(more);
    return this.request(Endpoint.STATEMENTS, params);
  }

  public sendStatement(statement: Statement): Promise<string[]> {
    return this.request(Endpoint.STATEMENTS, {}, {
      method: "POST",
      body: JSON.stringify(statement)
    });
  }

  public voidStatement(actor: Actor, statementId: string): Promise<string[]> {
    const voidStatement: Statement = {
      actor,
      verb: Verbs.VOIDED,
      object: {
        objectType: "StatementRef",
        id: statementId
      }
    };
    return this.request(Endpoint.STATEMENTS, {}, {
      method: "POST",
      body: JSON.stringify(voidStatement)
    });
  }

  // Activity State API
  // TODO: Write tests
  public getActivityStates(agent: Agent, activityId: string): Promise<string[]> {
    return this.request(Endpoint.ACTIVITY_STATE, {
      agent: agent,
      activityId: activityId
    });
  }

  public getActivityState(agent: Agent, activityId: string, stateId: string): Promise<{[key: string]: any}> {
    return this.request(Endpoint.ACTIVITY_STATE, {
      agent: agent,
      activityId: activityId,
      stateId: stateId
    });
  }

  public setActivityState(agent: Agent, activityId: string, stateId: string, state: {[key: string]: any}): Promise<void> {
    return this.request(Endpoint.ACTIVITY_STATE, {
      agent: agent,
      activityId: activityId,
      stateId: stateId
    }, {
      method: "POST",
      body: JSON.stringify(state)
    });
  }

  public deleteActivityState(agent: Agent, activityId: string, stateId: string): Promise<void> {
    return this.request(Endpoint.ACTIVITY_STATE, {
      agent: agent,
      activityId: activityId,
      stateId: stateId
    }, {
      method: "DELETE"
    });
  }

  // Activity Profile API
  // TODO: Write tests
  public createActivityProfile(activityId: string, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Endpoint.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "POST",
      body: JSON.stringify(profile)
    });
  }

  public getActivityProfile(activityId: string, profileId: string): Promise<{[key: string]: any}> {
    return this.request(Endpoint.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    });
  }

  public getActivityProfiles(activityId: string): Promise<string[]> {
    return this.request(Endpoint.ACTIVITY_PROFILE, {
      activityId: activityId
    });
  }

  public deleteActivityProfile(activityId: string, profileId: string): Promise<void> {
    return this.request(Endpoint.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "DELETE"
    });
  }

  // Agent Profile API
  // TODO: Write tests
  public createAgentProfile(agent: Agent, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Endpoint.AGENT_PROFILE, {
      agent: agent,
      profileId: profileId
    }, {
      method: "POST",
      body: JSON.stringify(profile)
    });
  }

  public getAgentProfile(agent: Agent, profileId: string): Promise<{[key: string]: any}> {
    return this.request(Endpoint.AGENT_PROFILE, {
      agent: agent,
      profileId: profileId
    });
  }

  public getAgentProfiles(agent: Agent): Promise<string[]> {
    return this.request(Endpoint.AGENT_PROFILE, {
      agent: agent
    });
  }

  public deleteAgentProfile(agent: Agent, profileId: string): Promise<void> {
    return this.request(Endpoint.AGENT_PROFILE, {
      agent: agent,
      profileId: profileId
    }, {
      method: "DELETE"
    });
  }

  private request(path: Endpoint, params: {[key: string]: any} = {}, init?: RequestInit | undefined): any {
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
