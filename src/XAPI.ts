import axios, { AxiosRequestConfig, AxiosPromise } from "axios";
import { AttachmentUsages, Resources, Verbs, Versions } from "./constants";
import { parseMultiPart } from "./internal/multiPart";
import { formatEndpoint } from "./internal/formatEndpoint";
import { getSearchQueryParamsAsObject } from "./helpers/getSearchQueryParamsAsObject/getSearchQueryParamsAsObject";
import { calculateISO8601Duration } from "./helpers/calculateISO8601Duration/calculateISO8601Duration";
import { getXAPILaunchData } from "./helpers/getXAPILaunchData/getXAPILaunchData";
import { getTinCanLaunchData } from "./helpers/getTinCanLaunchData/getTinCanLaunchData";
import { toBasicAuth } from "./helpers/toBasicAuth/toBasicAuth";
import { getAbout } from "./resources/about/getAbout/getAbout";
import { getActivity } from "./resources/activities/getActivity/getActivity";
import { getAgent } from "./resources/agents/getAgent/getAgent";
import { createActivityProfile } from "./resources/document/activityProfile/createActivityProfile/createActivityProfile";
import { deleteActivityProfile } from "./resources/document/activityProfile/deleteActivityProfile/deleteActivityProfile";
import { getActivityProfile } from "./resources/document/activityProfile/getActivityProfile/getActivityProfile";
import { getActivityProfiles } from "./resources/document/activityProfile/getActivityProfiles/getActivityProfiles";
import { setActivityProfile } from "./resources/document/activityProfile/setActivityProfile/setActivityProfile";
import { createAgentProfile } from "./resources/document/agentProfile/createAgentProfile/createAgentProfile";
import { deleteAgentProfile } from "./resources/document/agentProfile/deleteAgentProfile/deleteAgentProfile";
import { getAgentProfile } from "./resources/document/agentProfile/getAgentProfile/getAgentProfile";
import { getAgentProfiles } from "./resources/document/agentProfile/getAgentProfiles/getAgentProfiles";
import { setAgentProfile } from "./resources/document/agentProfile/setAgentProfile/setAgentProfile";
import { createState } from "./resources/document/state/createState/createState";
import { deleteState } from "./resources/document/state/deleteState/deleteState";
import { deleteStates } from "./resources/document/state/deleteStates/deleteStates";
import { getState } from "./resources/document/state/getState/getState";
import { getStates } from "./resources/document/state/getStates/getStates";
import { setState } from "./resources/document/state/setState/setState";
import { Agent } from "./resources/statement";
import { getMoreStatements } from "./resources/statement/getMoreStatements/getMoreStatements";
import { getStatement } from "./resources/statement/getStatement/getStatement";
import { getStatements } from "./resources/statement/getStatements/getStatements";
import { getVoidedStatement } from "./resources/statement/getVoidedStatement/getVoidedStatement";
import { sendStatement } from "./resources/statement/sendStatement/sendStatement";
import { sendStatements } from "./resources/statement/sendStatements/sendStatements";
import { voidStatement } from "./resources/statement/voidStatement/voidStatement";
import { voidStatements } from "./resources/statement/voidStatements/voidStatements";

export * from "./helpers/getTinCanLaunchData/TinCanLaunchData";
export * from "./helpers/getXAPILaunchData/XAPILaunchData";
export * from "./resources/about/About";
export * from "./resources/activities/Activity";
export * from "./resources/activities/ActivityDefinition";
export * from "./resources/activities/getActivity/getActivityParams";
export * from "./resources/agents/Person";
export * from "./resources/agents/getAgent/getAgentParams";
export * from "./resources/document/Document";
export * from "./resources/document/activityProfile/createActivityProfile/createActivityProfileParams";
export * from "./resources/document/activityProfile/deleteActivityProfile/deleteActivityProfileParams";
export * from "./resources/document/activityProfile/getActivityProfile/getActivityProfileParams";
export * from "./resources/document/activityProfile/getActivityProfiles/getActivityProfilesParams";
export * from "./resources/document/activityProfile/setActivityProfile/setActivityProfileParams";
export * from "./resources/document/agentProfile/createAgentProfile/createAgentProfileParams";
export * from "./resources/document/agentProfile/deleteAgentProfile/deleteAgentProfileParams";
export * from "./resources/document/agentProfile/getAgentProfile/getAgentProfileParams";
export * from "./resources/document/agentProfile/getAgentProfiles/getAgentProfilesParams";
export * from "./resources/document/agentProfile/setAgentProfile/setAgentProfileParams";
export * from "./resources/document/state/createState/createStateParams";
export * from "./resources/document/state/deleteState/deleteStateParams";
export * from "./resources/document/state/deleteStates/deleteStatesParams";
export * from "./resources/document/state/getState/getStateParams";
export * from "./resources/document/state/getStates/getStatesParams";
export * from "./resources/document/state/setState/setStateParams";
export * from "./resources/statement";
export * from "./resources/statement/getMoreStatements/getMoreStatementsParams";
export * from "./resources/statement/getStatement/getStatementParams";
export * from "./resources/statement/getStatements/getStatementsParams";
export * from "./resources/statement/getVoidedStatement/getVoidedStatementParams";
export * from "./resources/statement/sendStatement/sendStatementParams";
export * from "./resources/statement/sendStatements/sendStatementsParams";
export * from "./resources/statement/voidStatement/voidStatementParams";
export * from "./resources/statement/voidStatements/voidStatementsParams";

interface RequestParams {
  [key: string]: any;
  agent?: Agent;
}

export default class XAPI {
  public static default = XAPI;

  public static AttachmentUsages = AttachmentUsages;
  public static Verbs = Verbs;

  public static calculateISO8601Duration = calculateISO8601Duration;
  public static getSearchQueryParamsAsObject = getSearchQueryParamsAsObject;
  public static getXAPILaunchData = getXAPILaunchData;
  public static getTinCanLaunchData = getTinCanLaunchData;
  public static toBasicAuth = toBasicAuth;

  protected endpoint: string;
  private headers: { [key: string]: string };

  public constructor(
    endpoint: string,
    auth?: string,
    version: Versions = "1.0.3"
  ) {
    this.endpoint = formatEndpoint(endpoint);
    this.headers = {
      "X-Experience-API-Version": version,
      "Content-Type": "application/json",
      // No Authorization Process and Requirements - https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Communication.md#no-authorization-process-and-requirements
      Authorization: auth ? auth : toBasicAuth("", ""),
    };
  }

  public getAbout = getAbout;

  public getActivity = getActivity;

  public getAgent = getAgent;

  public createActivityProfile = createActivityProfile;

  public setActivityProfile = setActivityProfile;

  public getActivityProfiles = getActivityProfiles;

  public getActivityProfile = getActivityProfile;

  public deleteActivityProfile = deleteActivityProfile;

  public createAgentProfile = createAgentProfile;

  public setAgentProfile = setAgentProfile;

  public getAgentProfiles = getAgentProfiles;

  public getAgentProfile = getAgentProfile;

  public deleteAgentProfile = deleteAgentProfile;

  public createState = createState;

  public setState = setState;

  public getStates = getStates;

  public getState = getState;

  public deleteState = deleteState;

  public deleteStates = deleteStates;

  public getStatement = getStatement;

  public getVoidedStatement = getVoidedStatement;

  public getStatements = getStatements;

  public getMoreStatements = getMoreStatements;

  public sendStatement = sendStatement;

  public sendStatements = sendStatements;

  public voidStatement = voidStatement;

  public voidStatements = voidStatements;

  protected requestResource(
    resource: Resources,
    params: RequestParams = {},
    initExtras?: AxiosRequestConfig | undefined
  ): AxiosPromise<any> {
    const url = this.generateURL(resource, params);
    return this.requestURL(url, initExtras);
  }

  protected requestURL(
    url: string,
    initExtras?: AxiosRequestConfig | undefined
  ): AxiosPromise<any> {
    return axios
      .request({
        method: initExtras?.method || "GET",
        url: url,
        headers: {
          ...this.headers,
          ...initExtras?.headers,
        },
        data: initExtras?.data,
      })
      .then((response) => {
        const contentType = response.headers["content-type"];
        if (
          !!response.data &&
          contentType &&
          contentType.indexOf("multipart/mixed") !== -1
        ) {
          response.data = parseMultiPart(response.data);
        }
        return response;
      });
  }

  private generateURL(resource: Resources, params: RequestParams): string {
    const queryString = Object.keys(params)
      .map((key) => {
        let val = key === "agent" ? JSON.stringify(params[key]) : params[key];
        val = encodeURIComponent(val);
        return `${key}=${val}`;
      })
      .join("&");
    const url: RequestInfo = `${this.endpoint}${resource}${
      queryString ? "?" + queryString : ""
    }`;
    return url;
  }
}
