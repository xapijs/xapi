import { getSearchQueryParamsAsObject } from "../../lib/getSearchQueryParamsAsObject";
import { LRSConnection } from "../../LRSConnection";
import { Statement, Agent, Verbs } from "../..";
import { ResultScore } from "../../interfaces/Result";
import { calculateISO8601Duration } from "../../lib/calculateISO8601Duration";
import { Context, ContextActivity, Verb } from "../../interfaces";

// TODO: Write tests
// TODO: 11.0 xAPI Agent Profile Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#110-xapi-agent-profile-data-model

interface Cmi5LaunchParameters {
  endpoint: string;
  fetch: string;
  actor: Agent;
  registration: string;
  activityId: string;
}

interface Cmi5LaunchData {
  contextTemplate: Context;
  launchMode: "Normal" | "Browse" | "Review";
  launchParameters?: string;
  masteryScore?: number;
  moveOn: "Passed" | "Completed" | "CompletedAndPassed" | "CompletedOrPassed" | "NotApplicable";
  returnURL?: string;
  entitlementKey?: { courseStructure: string; alternate: string };
}

interface AuthTokenResponse {
  "auth-token": string;
}

// 9.3 Verbs - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#93-verbs
class Cmi5DefinedVerbs {
  public static readonly INITIALIZED: Verb = Verbs.INITIALIZED;
  public static readonly COMPLETED: Verb = Verbs.COMPLETED;
  public static readonly PASSED: Verb = Verbs.PASSED;
  public static readonly FAILED: Verb = Verbs.FAILED;
  public static readonly TERMINATED: Verb = Verbs.TERMINATED;
}

export class Cmi5 {
  private launchParameters: Cmi5LaunchParameters;
  private lmsLaunchData!: Cmi5LaunchData;
  private connection!: LRSConnection;
  private initialisedDate!: Date;

  constructor() {
    this.launchParameters = getSearchQueryParamsAsObject(window.location.href) as Cmi5LaunchParameters;
  }

  public initialize(): Promise<string[]> {
    this.initialisedDate = new Date();
    return this.getAuthToken(this.launchParameters.fetch).then((response) => {
      const authToken: string = response["auth-token"];
      this.connection = new LRSConnection(this.launchParameters.endpoint, authToken);
      return this.connection.getActivityStates(this.launchParameters.actor, this.launchParameters.activityId);
    }).then((states) => {
      return this.connection.getActivityState(this.launchParameters.actor, this.launchParameters.activityId, states[0]);
    }).then((state) => {
      this.lmsLaunchData = state["LMS.LaunchData"];
    }).then(() => {
      // 9.3.2 Initialized - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#932-initialized
      return this.request({
        verb: Cmi5DefinedVerbs.INITIALIZED
      });
    });
  }

  public complete(): Promise<string[]> {
    // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
    if (this.lmsLaunchData.launchMode !== "Normal") return Promise.reject();
    return this.request({
      // 9.3.3 Completed - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#933-completed
      verb: Cmi5DefinedVerbs.COMPLETED,
      result: {
        // 9.5.3 Completion - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#953-completion
        completion: true,
        // 9.5.4.1 Duration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#completed-statement
        duration: calculateISO8601Duration(this.initialisedDate, new Date())
      },
      // 9.6.2.2 moveOn Category Activity
      context: {
        contextActivities: {
          category: {
            id: "https://w3id.org/xapi/cmi5/context/categories/moveon"
          }
        }
      }
    });
  }

  public pass(score?: ResultScore): Promise<string[]> {
    // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
    if (this.lmsLaunchData.launchMode !== "Normal") return Promise.reject();
    return this.request({
      // 9.3.4 Passed - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#934-passed
      verb: Cmi5DefinedVerbs.PASSED,
      result: {
        // 9.5.1 Score - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#951-score
        ...(score ? { score: score } : {}),
        // 9.5.2 Success - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#952-success
        success: true,
        // 9.5.4.1 Duration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#passed-statement
        duration: calculateISO8601Duration(this.initialisedDate, new Date())
      },
      // 9.6.2.2 moveOn Category Activity
      context: {
        contextActivities: {
          category: {
            id: "https://w3id.org/xapi/cmi5/context/categories/moveon"
          }
        }
      }
    });
  }

  public fail(score?: ResultScore): Promise<string[]> {
    // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
    if (this.lmsLaunchData.launchMode !== "Normal") return Promise.reject();
    return this.request({
      // 9.3.5 Failed - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#935-failed
      verb: Cmi5DefinedVerbs.FAILED,
      result: {
        // 9.5.1 Score - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#951-score
        ...(score ? { score: score } : {}),
        // 9.5.2 Success - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#952-success
        success: false,
        // 9.5.4.1 Duration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#failed-statement
        duration: calculateISO8601Duration(this.initialisedDate, new Date())
      },
      // 9.6.2.2 moveOn Category Activity
      context: {
        contextActivities: {
          category: {
            id: "https://w3id.org/xapi/cmi5/context/categories/moveon"
          }
        }
      }
    });
  }

  public terminate(): Promise<string[]> {
    return this.request({
      // 9.3.8 Terminated - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#938-terminated
      verb: Cmi5DefinedVerbs.TERMINATED,
      result: {
        // 9.5.4.1 Duration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#terminated-statement
        duration: calculateISO8601Duration(this.initialisedDate, new Date())
      }
    });
  }

  private getAuthToken(fetchUrl: string): Promise<AuthTokenResponse> {
    return fetch(fetchUrl, {
      method: "POST"
    }) as unknown as Promise<AuthTokenResponse>;
  }

  private request(statement: Partial<Statement>): Promise<string[]> {
    // 9.2 Actor - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#92-actor
    const actor: Agent = this.launchParameters.actor;
    // 9.4 Object - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#94-object
    const object: any = {
      id: this.launchParameters.activityId
    };
    // 9.7 Timestamp - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#97-timestamp
    const timestamp = new Date().toISOString();
    // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
    const context: Context = this.lmsLaunchData.contextTemplate;
    const categoryContextActivities: ContextActivity[] = [
      // 9.6.2.1 cmi5 Category Activity - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#9621-cmi5-category-activity
      {
        id: "https://w3id.org/xapi/cmi5/context/categories/cmi5"
      }
    ];
    if (this.lmsLaunchData.contextTemplate.contextActivities?.category) {
      categoryContextActivities.push(this.lmsLaunchData.contextTemplate.contextActivities.category as ContextActivity);
    }
    if (statement.context?.contextActivities?.category) {
      categoryContextActivities.push(statement.context.contextActivities.category as ContextActivity);
    }
    if (!context.contextActivities) {
      context.contextActivities = {};
    }
    context.contextActivities.category = categoryContextActivities;
    const combinedStatement: Partial<Statement> = {
      ...statement,
      actor: actor,
      object: object,
      context: context,
      timestamp: timestamp
    };
    return this.connection.sendStatement(combinedStatement as Statement);
  }
}
