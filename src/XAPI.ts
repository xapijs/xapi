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
import {
  Agent,
  Statement,
  StatementResponseWithAttachments,
  StatementsResponse,
  StatementsResponseWithAttachments,
} from "./resources/statement";
import { getMoreStatements } from "./resources/statement/getMoreStatements/getMoreStatements";
import { getStatement } from "./resources/statement/getStatement/getStatement";
import { getStatements } from "./resources/statement/getStatements/getStatements";
import { getVoidedStatement } from "./resources/statement/getVoidedStatement/getVoidedStatement";
import { sendStatement } from "./resources/statement/sendStatement/sendStatement";
import { sendStatements } from "./resources/statement/sendStatements/sendStatements";
import { voidStatement } from "./resources/statement/voidStatement/voidStatement";
import { voidStatements } from "./resources/statement/voidStatements/voidStatements";
import { XAPIConfig } from "./XAPIConfig";
import { GetParamsBase } from "./resources/GetParamsBase";
import { About } from "./resources/about/About";
import { GetAboutParams } from "./resources/about/getAbout/GetAboutParams";
import { GetActivityParams } from "./resources/activities/getActivity/GetActivityParams";
import { Activity } from "./resources/activities/Activity";
import { GetAgentParams } from "./resources/agents/getAgent/GetAgentParams";
import { Person } from "./resources/agents/Person";
import { Document } from "./resources/document/Document";
import { CreateActivityProfileParams } from "./resources/document/activityProfile/createActivityProfile/CreateActivityProfileParams";
import { DeleteActivityProfileParams } from "./resources/document/activityProfile/deleteActivityProfile/DeleteActivityProfileParams";
import { GetActivityProfileParams } from "./resources/document/activityProfile/getActivityProfile/GetActivityProfileParams";
import { GetActivityProfilesParams } from "./resources/document/activityProfile/getActivityProfiles/GetActivityProfilesParams";
import { SetActivityProfileParams } from "./resources/document/activityProfile/setActivityProfile/SetActivityProfileParams";
import { CreateAgentProfileParams } from "./resources/document/agentProfile/createAgentProfile/CreateAgentProfileParams";
import { DeleteAgentProfileParams } from "./resources/document/agentProfile/deleteAgentProfile/DeleteAgentProfileParams";
import { GetAgentProfileParams } from "./resources/document/agentProfile/getAgentProfile/GetAgentProfileParams";
import { GetAgentProfilesParams } from "./resources/document/agentProfile/getAgentProfiles/GetAgentProfilesParams";
import { SetAgentProfileParams } from "./resources/document/agentProfile/setAgentProfile/SetAgentProfileParams";
import { CreateStateParams } from "./resources/document/state/createState/CreateStateParams";
import { DeleteStateParams } from "./resources/document/state/deleteState/DeleteStateParams";
import { DeleteStatesParams } from "./resources/document/state/deleteStates/DeleteStatesParams";
import { GetStateParams } from "./resources/document/state/getState/GetStateParams";
import { GetStatesParams } from "./resources/document/state/getStates/GetStatesParams";
import { SetStateParams } from "./resources/document/state/setState/SetStateParams";
import { GetMoreStatementsParams } from "./resources/statement/getMoreStatements/GetMoreStatementsParams";
import {
  GetStatementParams,
  GetStatementParamsWithAttachments,
  GetStatementParamsWithoutAttachments,
} from "./resources/statement/getStatement/GetStatementParams";
import {
  GetStatementsParams,
  GetStatementsParamsWithAttachments,
  GetStatementsParamsWithoutAttachments,
} from "./resources/statement/getStatements/GetStatementsParams";
import {
  GetVoidedStatementParams,
  GetVoidedStatementParamsWithAttachments,
  GetVoidedStatementParamsWithoutAttachments,
} from "./resources/statement/getVoidedStatement/GetVoidedStatementParams";
import { SendStatementParams } from "./resources/statement/sendStatement/SendStatementParams";
import { SendStatementsParams } from "./resources/statement/sendStatements/SendStatementsParams";
import { VoidStatementParams } from "./resources/statement/voidStatement/VoidStatementParams";
import { VoidStatementsParams } from "./resources/statement/voidStatements/VoidStatementsParams";
import {
  AdapterFunction,
  AdapterPromise,
  AdapterRequest,
  resolveAdapterFunction,
} from "./adapters";
export * from "./helpers/getTinCanLaunchData/TinCanLaunchData";
export * from "./helpers/getXAPILaunchData/XAPILaunchData";
export * from "./resources/about/About";
export * from "./resources/activities/Activity";
export * from "./resources/activities/ActivityDefinition";
export * from "./resources/activities/getActivity/GetActivityParams";
export * from "./resources/agents/Person";
export * from "./resources/agents/getAgent/GetAgentParams";
export * from "./resources/document/Document";
export * from "./resources/document/activityProfile/createActivityProfile/CreateActivityProfileParams";
export * from "./resources/document/activityProfile/deleteActivityProfile/DeleteActivityProfileParams";
export * from "./resources/document/activityProfile/getActivityProfile/GetActivityProfileParams";
export * from "./resources/document/activityProfile/getActivityProfiles/GetActivityProfilesParams";
export * from "./resources/document/activityProfile/setActivityProfile/SetActivityProfileParams";
export * from "./resources/document/agentProfile/createAgentProfile/CreateAgentProfileParams";
export * from "./resources/document/agentProfile/deleteAgentProfile/DeleteAgentProfileParams";
export * from "./resources/document/agentProfile/getAgentProfile/GetAgentProfileParams";
export * from "./resources/document/agentProfile/getAgentProfiles/GetAgentProfilesParams";
export * from "./resources/document/agentProfile/setAgentProfile/SetAgentProfileParams";
export * from "./resources/document/state/createState/CreateStateParams";
export * from "./resources/document/state/deleteState/DeleteStateParams";
export * from "./resources/document/state/deleteStates/DeleteStatesParams";
export * from "./resources/document/state/getState/GetStateParams";
export * from "./resources/document/state/getStates/GetStatesParams";
export * from "./resources/document/state/setState/SetStateParams";
export * from "./resources/statement";
export * from "./resources/statement/getMoreStatements/GetMoreStatementsParams";
export * from "./resources/statement/getStatement/GetStatementParams";
export * from "./resources/statement/getStatements/GetStatementsParams";
export * from "./resources/statement/getVoidedStatement/GetVoidedStatementParams";
export * from "./resources/statement/sendStatement/SendStatementParams";
export * from "./resources/statement/sendStatements/SendStatementsParams";
export * from "./resources/statement/voidStatement/VoidStatementParams";
export * from "./resources/statement/voidStatements/VoidStatementsParams";

interface RequestParams {
  [key: string]: any;
  agent?: Agent;
}

class XAPI {
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
  private adapter: AdapterFunction;

  public constructor(params: XAPIConfig) {
    const version: Versions = params.version || "1.0.3";
    this.endpoint = formatEndpoint(params.endpoint);
    this.headers = {
      "X-Experience-API-Version": version,
      "Content-Type": "application/json",
      // No Authorization Process and Requirements - https://github.com/adlnet/xAPI-Spec/blob/master/xAPI-Communication.md#no-authorization-process-and-requirements
      Authorization: params.auth ? params.auth : toBasicAuth("", ""),
    };
    this.adapter = resolveAdapterFunction(params.adapter);
  }

  protected requestResource(params: {
    resource: Resources;
    queryParams?: RequestParams;
    requestConfig?: AdapterRequest | undefined;
    requestOptions?: GetParamsBase;
  }): AdapterPromise<any> {
    const extendedQueryParams = Object.assign({}, params.queryParams);
    if (params.requestOptions?.useCacheBuster) {
      extendedQueryParams["cachebuster"] = new Date().getTime().toString();
    }
    const url = this.generateURL(params.resource, extendedQueryParams);
    return this.requestURL(url, params.requestConfig);
  }

  protected requestURL(
    url: string,
    requestConfig?: AdapterRequest | undefined
  ): AdapterPromise<any> {
    return this.adapter({
      url,
      method: requestConfig?.method || "GET",
      headers: {
        ...this.headers,
        ...requestConfig?.headers,
      },
      data: requestConfig?.data,
    }).then((response) => {
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

interface XAPI {
  getAbout(params?: GetAboutParams): AdapterPromise<About>;
  getActivity(params: GetActivityParams): AdapterPromise<Activity>;
  getAgent(params: GetAgentParams): AdapterPromise<Person>;
  createActivityProfile(
    params: CreateActivityProfileParams
  ): AdapterPromise<void>;
  setActivityProfile(params: SetActivityProfileParams): AdapterPromise<void>;
  getActivityProfiles(
    params: GetActivityProfilesParams
  ): AdapterPromise<string[]>;
  getActivityProfile(
    params: GetActivityProfileParams
  ): AdapterPromise<Document>;
  deleteActivityProfile(
    params: DeleteActivityProfileParams
  ): AdapterPromise<void>;
  createAgentProfile(params: CreateAgentProfileParams): AdapterPromise<void>;
  setAgentProfile(params: SetAgentProfileParams): AdapterPromise<void>;
  getAgentProfiles(params: GetAgentProfilesParams): AdapterPromise<string[]>;
  getAgentProfile(params: GetAgentProfileParams): AdapterPromise<Document>;
  deleteAgentProfile(params: DeleteAgentProfileParams): AdapterPromise<void>;
  createState(params: CreateStateParams): AdapterPromise<void>;
  setState(params: SetStateParams): AdapterPromise<void>;
  getStates(params: GetStatesParams): AdapterPromise<string[]>;
  getState(params: GetStateParams): AdapterPromise<Document>;
  deleteState(params: DeleteStateParams): AdapterPromise<void>;
  deleteStates(params: DeleteStatesParams): AdapterPromise<void>;
  getStatement(
    params: GetStatementParamsWithAttachments
  ): AdapterPromise<StatementResponseWithAttachments>;
  getStatement(
    params: GetStatementParamsWithoutAttachments
  ): AdapterPromise<Statement>;
  getStatement(
    params: GetStatementParams
  ): AdapterPromise<Statement | StatementResponseWithAttachments>;
  getVoidedStatement(
    params: GetVoidedStatementParamsWithAttachments
  ): AdapterPromise<StatementResponseWithAttachments>;
  getVoidedStatement(
    params: GetVoidedStatementParamsWithoutAttachments
  ): AdapterPromise<Statement>;
  getVoidedStatement(
    params: GetVoidedStatementParams
  ): AdapterPromise<Statement | StatementResponseWithAttachments>;
  getStatements(
    params: GetStatementsParamsWithAttachments
  ): AdapterPromise<StatementsResponseWithAttachments>;
  getStatements(
    params: GetStatementsParamsWithoutAttachments
  ): AdapterPromise<StatementsResponse>;
  getStatements(
    params: GetStatementsParams
  ): AdapterPromise<StatementsResponse | StatementsResponseWithAttachments>;
  getMoreStatements(
    params: GetMoreStatementsParams
  ): AdapterPromise<StatementsResponse | StatementsResponseWithAttachments>;
  sendStatement(params: SendStatementParams): AdapterPromise<string[]>;
  sendStatements(params: SendStatementsParams): AdapterPromise<string[]>;
  voidStatement(params: VoidStatementParams): AdapterPromise<string[]>;
  voidStatements(params: VoidStatementsParams): AdapterPromise<string[]>;
}

XAPI.prototype.getAbout = getAbout;
XAPI.prototype.getActivity = getActivity;
XAPI.prototype.getAgent = getAgent;
XAPI.prototype.createActivityProfile = createActivityProfile;
XAPI.prototype.setActivityProfile = setActivityProfile;
XAPI.prototype.getActivityProfiles = getActivityProfiles;
XAPI.prototype.getActivityProfile = getActivityProfile;
XAPI.prototype.deleteActivityProfile = deleteActivityProfile;
XAPI.prototype.createAgentProfile = createAgentProfile;
XAPI.prototype.setAgentProfile = setAgentProfile;
XAPI.prototype.getAgentProfiles = getAgentProfiles;
XAPI.prototype.getAgentProfile = getAgentProfile;
XAPI.prototype.deleteAgentProfile = deleteAgentProfile;
XAPI.prototype.createState = createState;
XAPI.prototype.setState = setState;
XAPI.prototype.getStates = getStates;
XAPI.prototype.getState = getState;
XAPI.prototype.deleteState = deleteState;
XAPI.prototype.deleteStates = deleteStates;
XAPI.prototype.getStatement = getStatement;
XAPI.prototype.getVoidedStatement = getVoidedStatement;
XAPI.prototype.getStatements = getStatements;
XAPI.prototype.getMoreStatements = getMoreStatements;
XAPI.prototype.sendStatement = sendStatement;
XAPI.prototype.sendStatements = sendStatements;
XAPI.prototype.voidStatement = voidStatement;
XAPI.prototype.voidStatements = voidStatements;

export default XAPI;
