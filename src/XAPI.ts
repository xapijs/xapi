import axios, { AxiosRequestConfig, AxiosPromise } from "axios";
import { Resource, RequestParams } from "./XAPI";
import { AttachmentUsages, Verbs, Versions } from "./constants";
import { parseMultiPart } from "./internal/multiPart";
import { formatEndpoint } from "./internal/formatEndpoint";
import { getSearchQueryParamsAsObject } from "./helpers/getSearchQueryParamsAsObject";
import { calculateISO8601Duration } from "./helpers/calculateISO8601Duration";
import { getXAPILaunchData } from "./helpers/getXAPILaunchData";
import { getTinCanLaunchData } from "./helpers/getTinCanLaunchData";
import { toBasicAuth } from "./helpers/toBasicAuth";
import { getAbout } from "./resources/about/getAbout";
import { getActivity } from "./resources/activities/getActivity";
import { createActivityProfile } from "./resources/activityProfile/createActivityProfile";
import { deleteActivityProfile } from "./resources/activityProfile/deleteActivityProfile";
import { getActivityProfile } from "./resources/activityProfile/getActivityProfile";
import { getActivityProfiles } from "./resources/activityProfile/getActivityProfiles";
import { setActivityProfile } from "./resources/activityProfile/setActivityProfile";
import { createAgentProfile } from "./resources/agentProfile/createAgentProfile";
import { deleteAgentProfile } from "./resources/agentProfile/deleteAgentProfile";
import { getAgentProfile } from "./resources/agentProfile/getAgentProfile";
import { getAgentProfiles } from "./resources/agentProfile/getAgentProfiles";
import { setAgentProfile } from "./resources/agentProfile/setAgentProfile";
import { getAgent } from "./resources/agents/getAgent";
import { createState } from "./resources/state/createState";
import { deleteState } from "./resources/state/deleteState";
import { deleteStates } from "./resources/state/deleteStates";
import { getState } from "./resources/state/getState";
import { getStates } from "./resources/state/getStates";
import { setState } from "./resources/state/setState";
import { getMoreStatements } from "./resources/statement/getMoreStatements";
import { getStatement } from "./resources/statement/getStatement";
import { getStatements } from "./resources/statement/getStatements";
import { getVoidedStatement } from "./resources/statement/getVoidedStatement";
import { sendStatement } from "./resources/statement/sendStatement";
import { sendStatements } from "./resources/statement/sendStatements";
import { voidStatement } from "./resources/statement/voidStatement";
import { voidStatements } from "./resources/statement/voidStatements";

export * from "./interfaces";

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

  public getAgent = getAgent;

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
    resource: Resource,
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

  private generateURL(resource: Resource, params: RequestParams): string {
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
