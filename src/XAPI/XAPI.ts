import { GetStatementQuery, GetVoidedStatementQuery, GetStatementsQuery, StatementsResponse } from "./interfaces";
import { Statement, Actor, Agent } from "./interfaces/Statement";
import { Verbs, Endpoint } from "./constants";
import { getSearchQueryParamsAsObject } from "../lib/getSearchQueryParamsAsObject";

export class XAPI {
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
  public createActivityState(agent: Agent, activityId: string, stateId: string, state: {[key: string]: any}, registration?: string): Promise<void> {
    return this.request(Endpoint.ACTIVITY_STATE, {
      agent: JSON.stringify(agent),
      activityId: activityId,
      stateId: stateId,
      ...(registration ? {
        registration
      } : {})
    }, {
      method: "POST",
      body: JSON.stringify(state)
    });
  }

  public setActivityState(agent: Agent, activityId: string, stateId: string, state: {[key: string]: any}, registration?: string): Promise<void> {
    return this.request(Endpoint.ACTIVITY_STATE, {
      agent: JSON.stringify(agent),
      activityId: activityId,
      stateId: stateId,
      ...(registration ? {
        registration
      } : {})
    }, {
      method: "PUT",
      body: JSON.stringify(state)
    });
  }

  public getActivityStates(agent: Agent, activityId: string, registration?: string): Promise<string[]> {
    return this.request(Endpoint.ACTIVITY_STATE, {
      agent: JSON.stringify(agent),
      activityId: activityId,
      ...(registration ? {
        registration
      } : {})
    });
  }

  public getActivityState(agent: Agent, activityId: string, stateId: string, registration?: string): Promise<{[key: string]: any}> {
    return this.request(Endpoint.ACTIVITY_STATE, {
      agent: JSON.stringify(agent),
      activityId: activityId,
      stateId: stateId,
      ...(registration ? {
        registration
      } : {})
    });
  }

  public deleteActivityState(agent: Agent, activityId: string, stateId: string, registration?: string): Promise<void> {
    return this.request(Endpoint.ACTIVITY_STATE, {
      agent: JSON.stringify(agent),
      activityId: activityId,
      stateId: stateId,
      ...(registration ? {
        registration
      } : {})
    }, {
      method: "DELETE"
    });
  }

  // Activity Profile API
  public createActivityProfile(activityId: string, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Endpoint.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "POST",
      body: JSON.stringify(profile)
    });
  }

  public setActivityProfile(activityId: string, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Endpoint.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "PUT",
      body: JSON.stringify(profile)
    });
  }

  public getActivityProfiles(activityId: string): Promise<string[]> {
    return this.request(Endpoint.ACTIVITY_PROFILE, {
      activityId: activityId
    });
  }

  public getActivityProfile(activityId: string, profileId: string): Promise<{[key: string]: any}> {
    return this.request(Endpoint.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
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
  public createAgentProfile(agent: Agent, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Endpoint.AGENT_PROFILE, {
      agent: JSON.stringify(agent),
      profileId: profileId
    }, {
      method: "POST",
      body: JSON.stringify(profile)
    });
  }

  public setAgentProfile(agent: Agent, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Endpoint.AGENT_PROFILE, {
      agent: JSON.stringify(agent),
      profileId: profileId
    }, {
      method: "PUT",
      body: JSON.stringify(profile)
    });
  }

  public getAgentProfiles(agent: Agent): Promise<string[]> {
    return this.request(Endpoint.AGENT_PROFILE, {
      agent: JSON.stringify(agent)
    });
  }

  public getAgentProfile(agent: Agent, profileId: string): Promise<{[key: string]: any}> {
    return this.request(Endpoint.AGENT_PROFILE, {
      agent: JSON.stringify(agent),
      profileId: profileId
    });
  }

  public deleteAgentProfile(agent: Agent, profileId: string): Promise<void> {
    return this.request(Endpoint.AGENT_PROFILE, {
      agent: JSON.stringify(agent),
      profileId: profileId
    }, {
      method: "DELETE"
    });
  }

  private request(path: Endpoint, params: {[key: string]: any} = {}, init?: RequestInit | undefined): any {
    const queryString: string = Object.keys(params).map(key => key + "=" + encodeURIComponent(params[key])).join("&");
    const request: RequestInfo = `${this.endpoint}${path}${queryString ? "?" + queryString : ""}`;
    return fetch(request, {
      headers: this.headers,
      ...init
    }).then(response => {
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return response.text();
        }
      } else {
        return response.text().then(error => Promise.reject(error));
      }
    });
  }
}
