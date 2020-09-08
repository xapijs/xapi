import { Resource, GetStatementQuery, GetVoidedStatementQuery, GetStatementsQuery, StatementsResponse, RequestParams } from "./interfaces/XAPI";
import { Statement, Actor, Agent, Person, Activity } from "./interfaces/Statement";
import { About } from "./interfaces/About/About";
import { AttachmentUsages, Resources, Verbs } from "./constants";
import { parseMultiPart, createMultiPart, MultiPart, Part } from "./helpers/multiPart";
import { getSearchQueryParamsAsObject } from "./helpers/getSearchQueryParamsAsObject";
import { calculateISO8601Duration } from "./helpers/calculateISO8601Duration";
import axios, { AxiosRequestConfig } from "axios";

export * from "./interfaces/XAPI";
export * from "./interfaces/Statement";

export default class XAPI {
  public static default = XAPI;

  public static AttachmentUsages = AttachmentUsages;
  public static Verbs = Verbs;

  public static calculateISO8601Duration = calculateISO8601Duration;
  public static getSearchQueryParamsAsObject = getSearchQueryParamsAsObject;

  private endpoint: string;
  private headers: {[key: string]: string};

  public constructor(endpoint: string, auth?: string) {
    this.endpoint = endpoint;
    this.headers = {
      "X-Experience-API-Version": "1.0.3",
      "Content-Type": "application/json",
      // No Authorization Process and Requirements -  https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Communication.md#no-authorization-process-and-requirements
      Authorization : auth ? auth : `Basic ${btoa(":")}`
    };
  }

  // About Resource
  public getAbout(): Promise<About> {
    return this.request(Resources.ABOUT);
  }

  // Agents Resource
  public getAgent(agent: Agent): Promise<Person> {
    return this.request(Resources.AGENTS, {
      agent: agent
    });
  }

  // Statement Resource
  public getStatement(query: GetStatementQuery): Promise<Statement | Part[]> {
    return this.request(Resources.STATEMENT, query);
  }

  public getVoidedStatement(query: GetVoidedStatementQuery): Promise<Statement | Part[]> {
    return this.request(Resources.STATEMENT, query);
  }

  public getStatements(query?: GetStatementsQuery): Promise<StatementsResponse> {
    return this.request(Resources.STATEMENT, query);
  }

  public getMoreStatements(more: string): Promise<StatementsResponse> {
    const params: {[key: string]: any} = getSearchQueryParamsAsObject(more);
    return this.request(Resources.STATEMENT, params);
  }

  public sendStatement(statement: Statement, attachments?: ArrayBuffer[]): Promise<string[]> {
    if (attachments?.length) {
      const multiPart: MultiPart = createMultiPart(statement, attachments);
      return this.request(Resources.STATEMENT, {}, {
        method: "POST",
        headers: multiPart.header,
        data: multiPart.blob
      });
    } else {
        return this.request(Resources.STATEMENT, {}, {
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
    return this.request(Resources.STATEMENT, {}, {
      method: "POST",
      data: voidStatement
    });
  }

  // State Resource
  public createState(agent: Agent, activityId: string, stateId: string, state: {[key: string]: any}, registration?: string): Promise<void> {
    return this.request(Resources.STATE, {
      agent: agent,
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

  public setState(agent: Agent, activityId: string, stateId: string, state: {[key: string]: any}, registration?: string): Promise<void> {
    return this.request(Resources.STATE, {
      agent: agent,
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

  public getStates(agent: Agent, activityId: string, registration?: string): Promise<string[]> {
    return this.request(Resources.STATE, {
      agent: agent,
      activityId: activityId,
      ...(registration ? {
        registration
      } : {})
    });
  }

  public getState(agent: Agent, activityId: string, stateId: string, registration?: string): Promise<{[key: string]: any}> {
    return this.request(Resources.STATE, {
      agent: agent,
      activityId: activityId,
      stateId: stateId,
      ...(registration ? {
        registration
      } : {})
    });
  }

  public deleteState(agent: Agent, activityId: string, stateId: string, registration?: string): Promise<void> {
    return this.request(Resources.STATE, {
      agent: agent,
      activityId: activityId,
      stateId: stateId,
      ...(registration ? {
        registration
      } : {})
    }, {
      method: "DELETE"
    });
  }

  public deleteStates(agent: Agent, activityId: string, registration?: string): Promise<void> {
    return this.request(Resources.STATE, {
      agent: agent,
      activityId: activityId,
      ...(registration ? {
        registration
      } : {})
    }, {
      method: "DELETE"
    });
  }

  // Activities Resource
  public getActivity(activityId: string): Promise<Activity> {
    return this.request(Resources.ACTIVITIES, {
      activityId: activityId
    });
  }

  // Activity Profile Resource
  public createActivityProfile(activityId: string, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Resources.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "POST",
      data: profile
    });
  }

  public setActivityProfile(activityId: string, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Resources.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "PUT",
      data: profile
    });
  }

  public getActivityProfiles(activityId: string): Promise<string[]> {
    return this.request(Resources.ACTIVITY_PROFILE, {
      activityId: activityId
    });
  }

  public getActivityProfile(activityId: string, profileId: string): Promise<{[key: string]: any}> {
    return this.request(Resources.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    });
  }

  public deleteActivityProfile(activityId: string, profileId: string): Promise<void> {
    return this.request(Resources.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "DELETE"
    });
  }

  // Agent Profile Resource
  public createAgentProfile(agent: Agent, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Resources.AGENT_PROFILE, {
      agent: agent,
      profileId: profileId
    }, {
      method: "POST",
      data: profile
    });
  }

  public setAgentProfile(agent: Agent, profileId: string, profile: {[key: string]: any}): Promise<void> {
    return this.request(Resources.AGENT_PROFILE, {
      agent: agent,
      profileId: profileId
    }, {
      method: "PUT",
      data: profile
    });
  }

  public getAgentProfiles(agent: Agent): Promise<string[]> {
    return this.request(Resources.AGENT_PROFILE, {
      agent: agent
    });
  }

  public getAgentProfile(agent: Agent, profileId: string): Promise<{[key: string]: any}> {
    return this.request(Resources.AGENT_PROFILE, {
      agent: agent,
      profileId: profileId
    });
  }

  public deleteAgentProfile(agent: Agent, profileId: string): Promise<void> {
    return this.request(Resources.AGENT_PROFILE, {
      agent: agent,
      profileId: profileId
    }, {
      method: "DELETE"
    });
  }

  private request(resource: Resource, params: RequestParams = {}, initExtras?: AxiosRequestConfig | undefined): Promise<any> {
    const url = this.generateURL(resource, params);
    return axios({
      method: initExtras?.method || "GET",
      url: url,
      headers: {
        ...this.headers,
        ...initExtras?.headers
      },
      data: initExtras?.data,
      
    }).then((response) => {
      if (response.headers["content-type"].indexOf("application/json") !== -1) {
        return response.data;
      } else {
        return response.data.indexOf("--") === 2 ? parseMultiPart(response.data) : response.data;
      }
    });
  }

  private generateURL(resource: Resource, params: {[key: string]: any}): string {
    const queryString = Object.keys(params).map(key => {
      let val = key === "agent" ? JSON.stringify(params[key]) : params[key];
      val = encodeURIComponent(val);
      return `${key}=${val}`;
    }).join("&");
    const url: RequestInfo = `${this.endpoint}${resource}${queryString ? "?" + queryString : ""}`;
    return url;
  }
}
