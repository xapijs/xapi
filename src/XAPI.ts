import { Resource, GetStatementQuery, GetVoidedStatementQuery, GetStatementsQuery, StatementsResponse, RequestParams } from "./interfaces/XAPI";
import { Statement, Actor, Agent, Person, Activity } from "./interfaces/Statement";
import { About } from "./interfaces/About/About";
import { AttachmentUsages, Resources, Verbs } from "./constants";
import { parseMultiPart, createMultiPart, MultiPart, Part } from "./helpers/multiPart";
import { getSearchQueryParamsAsObject } from "./helpers/getSearchQueryParamsAsObject";
import { calculateISO8601Duration } from "./helpers/calculateISO8601Duration";
import axios, { AxiosRequestConfig, AxiosPromise } from "axios";

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
  public getAbout(): AxiosPromise<About> {
    return this.requestResource(Resources.ABOUT);
  }

  // Agents Resource
  public getAgent(agent: Agent): AxiosPromise<Person> {
    return this.requestResource(Resources.AGENTS, {
      agent: agent
    });
  }

  // Statement Resource
  public getStatement(query: GetStatementQuery): AxiosPromise<Statement | Part[]> {
    return this.requestResource(Resources.STATEMENT, query);
  }

  public getVoidedStatement(query: GetVoidedStatementQuery): AxiosPromise<Statement | Part[]> {
    return this.requestResource(Resources.STATEMENT, query);
  }

  public getStatements(query?: GetStatementsQuery): AxiosPromise<StatementsResponse> {
    return this.requestResource(Resources.STATEMENT, query);
  }

  public getMoreStatements(more: string): AxiosPromise<StatementsResponse> {
    const endpoint = new URL(this.endpoint);
    const url = `${endpoint.protocol}//${endpoint.host}${more}`;
    return this.requestURL(url);
  }

  public sendStatement(statement: Statement, attachments?: ArrayBuffer[]): AxiosPromise<string[]> {
    if (attachments?.length) {
      const multiPart: MultiPart = createMultiPart(statement, attachments);
      return this.requestResource(Resources.STATEMENT, {}, {
        method: "POST",
        headers: multiPart.header,
        data: multiPart.blob
      });
    } else {
        return this.requestResource(Resources.STATEMENT, {}, {
        method: "POST",
        data: statement
      });
    }
  }

  public voidStatement(actor: Actor, statementId: string): AxiosPromise<string[]> {
    const voidStatement: Statement = {
      actor,
      verb: Verbs.VOIDED,
      object: {
        objectType: "StatementRef",
        id: statementId
      }
    };
    return this.requestResource(Resources.STATEMENT, {}, {
      method: "POST",
      data: voidStatement
    });
  }

  // State Resource
  public createState(agent: Agent, activityId: string, stateId: string, state: {[key: string]: any}, registration?: string, etag?: string, matchHeader?: "If-Match" | "If-None-Match"): AxiosPromise<void> {
    const headers = {};
    if (etag) headers[matchHeader] = etag;
    return this.requestResource(Resources.STATE, {
      agent: agent,
      activityId: activityId,
      stateId: stateId,
      ...(registration ? {
        registration
      } : {})
    }, {
      method: "POST",
      data: state,
      headers: headers
    });
  }

  public setState(agent: Agent, activityId: string, stateId: string, state: {[key: string]: any}, registration?: string, etag?: string, matchHeader?: "If-Match" | "If-None-Match"): AxiosPromise<void> {
    const headers = {};
    if (etag) headers[matchHeader] = etag;
    return this.requestResource(Resources.STATE, {
      agent: agent,
      activityId: activityId,
      stateId: stateId,
      ...(registration ? {
        registration
      } : {})
    }, {
      method: "PUT",
      data: state,
      headers: headers
    });
  }

  public getStates(agent: Agent, activityId: string, registration?: string): AxiosPromise<string[]> {
    return this.requestResource(Resources.STATE, {
      agent: agent,
      activityId: activityId,
      ...(registration ? {
        registration
      } : {})
    });
  }

  public getState(agent: Agent, activityId: string, stateId: string, registration?: string): AxiosPromise<{[key: string]: any}> {
    return this.requestResource(Resources.STATE, {
      agent: agent,
      activityId: activityId,
      stateId: stateId,
      ...(registration ? {
        registration
      } : {})
    });
  }

  public deleteState(agent: Agent, activityId: string, stateId: string, registration?: string, etag?: string): AxiosPromise<void> {
    const headers = {};
    if (etag) headers["If-Match"] = etag;
    return this.requestResource(Resources.STATE, {
      agent: agent,
      activityId: activityId,
      stateId: stateId,
      ...(registration ? {
        registration
      } : {})
    }, {
      method: "DELETE",
      headers: headers
    });
  }

  public deleteStates(agent: Agent, activityId: string, registration?: string, etag?: string): AxiosPromise<void> {
    const headers = {};
    if (etag) headers["If-Match"] = etag;
    return this.requestResource(Resources.STATE, {
      agent: agent,
      activityId: activityId,
      ...(registration ? {
        registration
      } : {})
    }, {
      method: "DELETE",
      headers: headers
    });
  }

  // Activities Resource
  public getActivity(activityId: string): AxiosPromise<Activity> {
    return this.requestResource(Resources.ACTIVITIES, {
      activityId: activityId
    });
  }

  // Activity Profile Resource
  public createActivityProfile(activityId: string, profileId: string, profile: {[key: string]: any}, etag?: string, matchHeader?: "If-Match" | "If-None-Match"): AxiosPromise<void> {
    const headers = {};
    if (etag) headers[matchHeader] = etag;
    return this.requestResource(Resources.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "POST",
      data: profile,
      headers: headers
    });
  }

  public setActivityProfile(activityId: string, profileId: string, profile: {[key: string]: any}, etag: string, matchHeader: "If-Match" | "If-None-Match"): AxiosPromise<void> {
    const headers = {};
    headers[matchHeader] = etag;
    return this.requestResource(Resources.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "PUT",
      data: profile,
      headers: headers
    });
  }

  public getActivityProfiles(activityId: string): AxiosPromise<string[]> {
    return this.requestResource(Resources.ACTIVITY_PROFILE, {
      activityId: activityId
    });
  }

  public getActivityProfile(activityId: string, profileId: string): AxiosPromise<{[key: string]: any}> {
    return this.requestResource(Resources.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    });
  }

  public deleteActivityProfile(activityId: string, profileId: string, etag?: string): AxiosPromise<void> {
    const headers = {};
    if (etag) headers["If-Match"] = etag;
    return this.requestResource(Resources.ACTIVITY_PROFILE, {
      activityId: activityId,
      profileId: profileId
    }, {
      method: "DELETE",
      headers: headers
    });
  }

  // Agent Profile Resource
  public createAgentProfile(agent: Agent, profileId: string, profile: {[key: string]: any}, etag?: string, matchHeader?: "If-Match" | "If-None-Match"): AxiosPromise<void> {
    const headers = {};
    if (etag) headers[matchHeader] = etag;
    return this.requestResource(Resources.AGENT_PROFILE, {
      agent: agent,
      profileId: profileId
    }, {
      method: "POST",
      data: profile,
      headers: headers
    });
  }

  public setAgentProfile(agent: Agent, profileId: string, profile: {[key: string]: any}, etag: string, matchHeader: "If-Match" | "If-None-Match"): AxiosPromise<void> {
    const headers = {};
    headers[matchHeader] = etag;
    return this.requestResource(Resources.AGENT_PROFILE, {
      agent: agent,
      profileId: profileId
    }, {
      method: "PUT",
      data: profile,
      headers: headers
    });
  }

  public getAgentProfiles(agent: Agent): AxiosPromise<string[]> {
    return this.requestResource(Resources.AGENT_PROFILE, {
      agent: agent
    });
  }

  public getAgentProfile(agent: Agent, profileId: string): AxiosPromise<{[key: string]: any}> {
    return this.requestResource(Resources.AGENT_PROFILE, {
      agent: agent,
      profileId: profileId
    });
  }

  public deleteAgentProfile(agent: Agent, profileId: string, etag?: string): AxiosPromise<void> {
    const headers = {};
    if (etag) headers["If-Match"] = etag;
    return this.requestResource(Resources.AGENT_PROFILE, {
      agent: agent,
      profileId: profileId
    }, {
      method: "DELETE",
      headers: headers
    });
  }

  private requestResource(resource: Resource, params: RequestParams = {}, initExtras?: AxiosRequestConfig | undefined): AxiosPromise<any> {
    const url = this.generateURL(resource, params);
    return this.requestURL(url, initExtras);
  }

  private requestURL(url: string, initExtras?: AxiosRequestConfig | undefined): AxiosPromise<any> {
    return axios({
      method: initExtras?.method || "GET",
      url: url,
      headers: {
        ...this.headers,
        ...initExtras?.headers
      },
      data: initExtras?.data
    }).then((response) => {
      const contentType = response.headers["content-type"];
      if (
        !contentType || 
        contentType.indexOf("application/json") !== -1 ||
        response.data.indexOf("--") !== 2
      ) {
        return response;
      } else {
        response.data = parseMultiPart(response.data);
        return response;
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
