import { Statement, Actor, Agent } from "./interfaces/Statement";
import { Endpoint, GetStatementQuery, GetVoidedStatementQuery, GetStatementsQuery, StatementsResponse } from "./interfaces/XAPI";
import { AttachmentUsages, Endpoints, Verbs } from "./constants";
import { parseMultiPart, createMultiPart, MultiPart, Part } from "./helpers/multiPart";
import { getSearchQueryParamsAsObject } from "./helpers/getSearchQueryParamsAsObject";
import { calculateISO8601Duration } from "./helpers/calculateISO8601Duration";

export * from "./interfaces/XAPI";
export * from "./interfaces/Statement";

export default class XAPI {
  public static AttachmentUsages = AttachmentUsages;
  public static Verbs = Verbs;

  public static calculateISO8601Duration = calculateISO8601Duration;
  public static getSearchQueryParamsAsObject = getSearchQueryParamsAsObject;

  private endpoint: string;
  private headers: {[key: string]: string};

  public constructor(endpoint?: string, auth?: string) {
    this.endpoint = endpoint;
    this.headers = {
      "X-Experience-API-Version": "1.0.0",
      "Content-Type": "application/json",
      ...(auth ? { Authorization : auth } : {})
    };
  }

  // Statements API
  public getStatement(query: GetStatementQuery): Promise<Statement | Part[]> {
    return this.request(Endpoints.STATEMENTS, query);
  }

  public getVoidedStatement(query: GetVoidedStatementQuery): Promise<Statement | Part[]> {
    return this.request(Endpoints.STATEMENTS, query);
  }

  public getStatements(query?: GetStatementsQuery): Promise<StatementsResponse> {
    return this.request(Endpoints.STATEMENTS, query);
  }

  public getMoreStatements(more: string): Promise<StatementsResponse> {
    const params: {[key: string]: any} = getSearchQueryParamsAsObject(more);
    return this.request(Endpoints.STATEMENTS, params);
  }

  public sendStatement(statement: Statement, attachments?: ArrayBuffer[]): Promise<string[]> {
    if (attachments?.length) {
      const multiPart: MultiPart = createMultiPart(statement, attachments);
      return this.requestXMLHTTPRequest(Endpoints.STATEMENTS, {}, {
        method: "POST",
        headers: multiPart.header,
        body: multiPart.blob
      });
    } else {
        return this.request(Endpoints.STATEMENTS, {}, {
        method: "POST",
        body: JSON.stringify(statement)
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
    return this.request(Endpoints.STATEMENTS, {}, {
      method: "POST",
      body: JSON.stringify(voidStatement)
    });
  }

  // Activity State API
  public createActivityState(agent: Agent, activityId: string, stateId: string, state: {[key: string]: any}, registration?: string): Promise<void> {
    return this.request(Endpoints.ACTIVITY_STATE, {
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
    return this.request(Endpoints.ACTIVITY_STATE, {
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
    return this.request(Endpoints.ACTIVITY_STATE, {
      agent: JSON.stringify(agent),
      activityId: activityId,
      ...(registration ? {
        registration
      } : {})
    });
  }

  public getActivityState(agent: Agent, activityId: string, stateId: string, registration?: string): Promise<{[key: string]: any}> {
    return this.request(Endpoints.ACTIVITY_STATE, {
      agent: JSON.stringify(agent),
      activityId: activityId,
      stateId: stateId,
      ...(registration ? {
        registration
      } : {})
    });
  }

  public deleteActivityState(agent: Agent, activityId: string, stateId: string, registration?: string): Promise<void> {
    return this.request(Endpoints.ACTIVITY_STATE, {
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
    return this.request(Endpoints.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "POST",
      body: JSON.stringify(profile)
    });
  }

  public setActivityProfile(activityId: string, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Endpoints.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "PUT",
      body: JSON.stringify(profile)
    });
  }

  public getActivityProfiles(activityId: string): Promise<string[]> {
    return this.request(Endpoints.ACTIVITY_PROFILE, {
      activityId: activityId
    });
  }

  public getActivityProfile(activityId: string, profileId: string): Promise<{[key: string]: any}> {
    return this.request(Endpoints.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    });
  }

  public deleteActivityProfile(activityId: string, profileId: string): Promise<void> {
    return this.request(Endpoints.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "DELETE"
    });
  }

  // Agent Profile API
  public createAgentProfile(agent: Agent, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Endpoints.AGENT_PROFILE, {
      agent: JSON.stringify(agent),
      profileId: profileId
    }, {
      method: "POST",
      body: JSON.stringify(profile)
    });
  }

  public setAgentProfile(agent: Agent, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Endpoints.AGENT_PROFILE, {
      agent: JSON.stringify(agent),
      profileId: profileId
    }, {
      method: "PUT",
      body: JSON.stringify(profile)
    });
  }

  public getAgentProfiles(agent: Agent): Promise<string[]> {
    return this.request(Endpoints.AGENT_PROFILE, {
      agent: JSON.stringify(agent)
    });
  }

  public getAgentProfile(agent: Agent, profileId: string): Promise<{[key: string]: any}> {
    return this.request(Endpoints.AGENT_PROFILE, {
      agent: JSON.stringify(agent),
      profileId: profileId
    });
  }

  public deleteAgentProfile(agent: Agent, profileId: string): Promise<void> {
    return this.request(Endpoints.AGENT_PROFILE, {
      agent: JSON.stringify(agent),
      profileId: profileId
    }, {
      method: "DELETE"
    });
  }

  private request(path: Endpoint, params: {[key: string]: any} = {}, init?: RequestInit | undefined): Promise<any> {
    const queryString: string = Object.keys(params).map(key => key + "=" + encodeURIComponent(params[key])).join("&");
    const url: RequestInfo = `${this.endpoint}${path}${queryString ? "?" + queryString : ""}`;
    return fetch(url, {
      headers: this.headers,
      ...init
    }).then(response => {
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json();
        } else {
          return response.text().then((data) => {
            return data.indexOf("--") === 2 ? parseMultiPart(data) : data;
          });
        }
      } else {
        return response.text().then(error => Promise.reject(error));
      }
    });
  }

  private requestXMLHTTPRequest(path: Endpoint, params: {[key: string]: any} = {}, initExtras?: RequestInit | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      const xmlRequest = new XMLHttpRequest();
      const queryString: string = Object.keys(params).map(key => key + "=" + encodeURIComponent(params[key])).join("&");
      const url: RequestInfo = `${this.endpoint}${path}${queryString ? "?" + queryString : ""}`;
      xmlRequest.open(initExtras?.method || "GET", url, true);
      const headers = {
        ...this.headers,
        ...initExtras?.headers
      };
      const headerKeys = Object.keys(headers);
      for (let i: number = 0; i < headerKeys.length; i++) {
        const key: string = headerKeys[i];
        xmlRequest.setRequestHeader(key, headers[key]);
      }
      xmlRequest.onloadend = (): void => {
        if (xmlRequest.status >= 200 && xmlRequest.status < 400) {
          try {
            resolve(JSON.parse(xmlRequest.responseText));
          } catch {
            resolve(xmlRequest.responseText.indexOf("--") === 2 ? parseMultiPart(xmlRequest.responseText) : xmlRequest.responseText);
          }
        } else {
          reject(xmlRequest.response);
        }
      };
      xmlRequest.onerror = (): void => {
        reject(xmlRequest.response);
      };
      xmlRequest.send(initExtras?.body);
    });
  }
}
