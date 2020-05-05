import { GetStatementQuery, GetVoidedStatementQuery, GetStatementsQuery, StatementsResponse } from "./interfaces";
import { Statement, Actor, Agent } from "./interfaces/Statement";
import { Verbs } from "./constants";
import { getSearchQueryParamsAsObject } from "../lib/getSearchQueryParamsAsObject";
import { parseMultiPart, createMultiPart, MultiPart } from "../lib/multiPart";
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";

enum Endpoint {
  ACTIVITY_STATE = "activities/state",
  ACTIVITY_PROFILE = "activities/profile",
  AGENT_PROFILE = "agents/profile",
  STATEMENTS = "statements"
}

export class XAPI {
  private axiosInstance: AxiosInstance;

  public constructor(endpoint: string, auth: string) {
    const headers: {[key: string]: string} = {
      "X-Experience-API-Version": "1.0.0",
      "Content-Type": "application/json",
      ...(auth ? { Authorization : auth } : {})
    };
    this.axiosInstance = axios.create({
      baseURL: endpoint,
      headers: headers,
      responseType: "text"
    });
  }

  // Statements API
  public getStatement(query: GetStatementQuery): Promise<Statement | (Statement | Blob)[]> {
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

  public sendStatement(statement: Statement, attachments?: ArrayBuffer[]): Promise<string[]> {
    if (attachments?.length) {
      const multiPart: MultiPart = createMultiPart(statement, attachments);
      return this.request(Endpoint.STATEMENTS, {}, {
        method: "POST",
        headers: multiPart.header,
        data: multiPart.blob
      });
    } else {
        return this.request(Endpoint.STATEMENTS, {}, {
        method: "POST",
        data: statement
      });
    }
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
      data: voidStatement
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
      data: state
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
      data: state
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
      data: profile
    });
  }

  public setActivityProfile(activityId: string, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Endpoint.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "PUT",
      data: profile
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
      data: profile
    });
  }

  public setAgentProfile(agent: Agent, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Endpoint.AGENT_PROFILE, {
      agent: JSON.stringify(agent),
      profileId: profileId
    }, {
      method: "PUT",
      data: profile
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

  private request(path: Endpoint, params: {[key: string]: any} = {}, init?: AxiosRequestConfig | undefined): any {
    const queryString: string = Object.keys(params).map(key => key + "=" + encodeURIComponent(params[key])).join("&");
    const request: RequestInfo = `${path}${queryString ? "?" + queryString : ""}`;
    const config: AxiosRequestConfig = {
      url: request,
      ...init
    };
    return this.axiosInstance.request(config).then((response) => {
      if (response.status >= 200 && response.status < 400) {
        if (typeof response.data === "string" && response.data.indexOf("--") === 2) {
          return parseMultiPart(response.data);
        } else {
          return response.data;
        }
      } else {
        return Promise.reject(response.data);
      }
    });
  }
}
