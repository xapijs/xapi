import { XAPI, Context, ContextActivity, Verb, Statement, Agent, ResultScore, Verbs, StatementObject, InteractionActivityDefinition, LanguageMap, InteractionComponent, ObjectiveActivity } from "../../XAPI";
import { getSearchQueryParamsAsObject } from "../../lib/getSearchQueryParamsAsObject";
import { calculateISO8601Duration } from "../../lib/calculateISO8601Duration";
import { default as deepmerge } from "deepmerge";

interface LaunchParameters {
  endpoint: string;
  fetch: string;
  actor: Agent;
  registration: string;
  activityId: string;
}

interface LaunchData {
  contextTemplate: Context;
  launchMode: "Normal" | "Browse" | "Review";
  launchMethod?: "OwnWindow" | "AnyWindow";
  launchParameters?: string;
  masteryScore?: number;
  moveOn: "Passed" | "Completed" | "CompletedAndPassed" | "CompletedOrPassed" | "NotApplicable";
  returnURL?: string;
  entitlementKey?: { courseStructure?: string; alternate?: string };
}

interface LearnerPreferences {
  languagePreference?: string;
  audioPreference?: "on" | "off";
}

interface AuthTokenResponse {
  "auth-token": string;
}

interface Period {
  start: Date;
  end: Date;
}
interface PerformanceCriteriaBase {
  id: string;
}

interface PerformanceCriteriaRange extends PerformanceCriteriaBase {
  min?: number;
  max?: number;
}

interface PerformanceCriteriaExact extends PerformanceCriteriaBase {
  exact?: number;
}

type PerformanceCriteria = PerformanceCriteriaBase | PerformanceCriteriaRange | PerformanceCriteriaExact;

interface Performance {
  [id: string]: number;
}

// 9.3 Verbs - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#93-verbs
class Cmi5DefinedVerbs {
  public static readonly INITIALIZED: Verb = Verbs.INITIALIZED;
  public static readonly COMPLETED: Verb = Verbs.COMPLETED;
  public static readonly PASSED: Verb = Verbs.PASSED;
  public static readonly FAILED: Verb = Verbs.FAILED;
  public static readonly TERMINATED: Verb = Verbs.TERMINATED;
}

class Cmi5ContextActivity {
  public static readonly MOVE_ON: ContextActivity = {
    id: "https://w3id.org/xapi/cmi5/context/categories/moveon"
  };
  public static readonly CMI5: ContextActivity = {
    id: "https://w3id.org/xapi/cmi5/context/categories/cmi5"
  };
}

/**
 * Experience API cmi5 Profile (Quartz - 1st Edition)
 * Reference: https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md
 */
export class Cmi5 {
  private launchParameters: LaunchParameters;
  private launchData!: LaunchData;
  private learnerPreferences!: LearnerPreferences; 
  private connection!: XAPI;
  private initialisedDate!: Date;

  constructor() {
    this.launchParameters = this.getLaunchParametersFromLMS();
    if (!this.launchParameters.fetch) {
      throw Error("no fetch parameter found.");
    } else if (!this.launchParameters.endpoint) {
      throw Error("no endpoint parameter found");
    } else if (!this.launchParameters.actor) {
      throw Error("no actor parameter found.");
    } else if (!this.launchParameters.activityId) {
      throw Error("no activityId parameter found.");
    } else if (!this.launchParameters.registration) {
      throw Error("no registration parameter found.");
    }
  }

  public getLaunchParameters(): LaunchParameters {
    return this.launchParameters;
  }

  public getLaunchData(): LaunchData {
    return this.launchData;
  }

  // 11.0 xAPI Agent Profile Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#110-xapi-agent-profile-data-model
  public getLearnerPreferences(): LearnerPreferences {
    return this.learnerPreferences;
  }

  // "cmi5 defined" Statements
  public initialize(): Promise<string[]> {
    return this.getAuthTokenFromLMS(this.launchParameters.fetch).then((response) => {
      const authToken: string = response["auth-token"];
      this.connection = new XAPI(this.launchParameters.endpoint, `Basic ${authToken}`);
      return this.getLaunchDataFromLMS();
    }).then((launchData) => {
      this.launchData = launchData;
    }).then(() => {
      return this.getLearnerPreferencesFromLMS();
    }).then((learnerPreferences) => {
      this.learnerPreferences = learnerPreferences;
    }).then(() => {
      this.initialisedDate = new Date();
      // 9.3.2 Initialized - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#932-initialized
      return this.sendCmi5DefinedStatement({
        verb: Cmi5DefinedVerbs.INITIALIZED
      });
    });
  }

  public complete(): Promise<string[]> {
    // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
    if (this.launchData.launchMode !== "Normal") return Promise.reject();
    return this.sendCmi5DefinedStatement({
      // 9.3.3 Completed - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#933-completed
      verb: Cmi5DefinedVerbs.COMPLETED,
      result: {
        // 9.5.3 Completion - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#953-completion
        completion: true,
        // 9.5.4.1 Duration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#completed-statement
        duration: calculateISO8601Duration(this.initialisedDate, new Date())
      },
      context: {
        contextActivities: {
          category: [
            // 9.6.2.2 moveOn Category Activity - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#9622-moveon-category-activity
            Cmi5ContextActivity.MOVE_ON
          ]
        }
      }
    });
  }

  public pass(score?: ResultScore, objective?: ObjectiveActivity): Promise<string[]> {
    // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
    if (this.launchData.launchMode !== "Normal") return Promise.reject();
    // Best Practice #4 - AU Mastery Score - https://aicc.github.io/CMI-5_Spec_Current/best_practices/
    if (this.launchData.masteryScore && score.scaled < this.launchData.masteryScore) return Promise.reject("Learner has not met Mastery Score");
    return this.sendCmi5DefinedStatement({
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
      context: {
        contextActivities: {
          category: [
            // 9.6.2.2 moveOn Category Activity - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#9622-moveon-category-activity
            Cmi5ContextActivity.MOVE_ON
          ],
          // Best Practice #1 - Use of Objectives - https://aicc.github.io/CMI-5_Spec_Current/best_practices/
          ...(objective ? {
            parent: [
              objective
            ]
          } : {})
        },
        ...(this.launchData.masteryScore ? {
          extensions: {
            "https://w3id.org/xapi/cmi5/context/extensions/masteryscore": this.launchData.masteryScore
          }
        } : {})
      }
    });
  }

  public fail(score?: ResultScore): Promise<string[]> {
    // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
    if (this.launchData.launchMode !== "Normal") return Promise.reject();
    return this.sendCmi5DefinedStatement({
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
      context: {
        contextActivities: {
          category: [
            // 9.6.2.2 moveOn Category Activity - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#9622-moveon-category-activity
            Cmi5ContextActivity.MOVE_ON
          ]
        },
        ...(this.launchData.masteryScore ? {
          extensions: {
            "https://w3id.org/xapi/cmi5/context/extensions/masteryscore": this.launchData.masteryScore
          }
        } : {})
      }
    });
  }

  public terminate(): Promise<string[]> {
    return this.sendCmi5DefinedStatement({
      // 9.3.8 Terminated - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#938-terminated
      verb: Cmi5DefinedVerbs.TERMINATED,
      result: {
        // 9.5.4.1 Duration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#terminated-statement
        duration: calculateISO8601Duration(this.initialisedDate, new Date())
      }
    });
  }

  // "cmi5 allowed" Statements
  public progress(percent: number): Promise<string[]> {
    return this.sendCmi5AllowedStatement({
      verb: Verbs.PROGRESSED,
      object: {
        objectType: "Activity",
        id: this.launchParameters.activityId
      },
      result: {
        extensions: {
          "https://w3id.org/xapi/cmi5/result/extensions/progress": percent
        }
      }
    });
  }

  public interactionTrueFalse(testId: string, questionId: string, answer: boolean, correctAnswer?: boolean, name?: LanguageMap, description?: LanguageMap, duration?: Period, objective?: ObjectiveActivity): Promise<string[]> {
    return this.interaction(testId, questionId, answer.toString(), {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "true-false",
      ...(correctAnswer !== undefined ? {
        correctResponsesPattern: correctAnswer ? ["true"] : ["false"]
      }: {}),
      ...(name ? {name} : {}),
      ...(description ? {description} : {})
    }, duration, objective);
  }

  public interactionChoice(testId: string, questionId: string, answerIds: string[], correctAnswerIds?: string[], choices?: InteractionComponent[], name?: LanguageMap, description?: LanguageMap, duration?: Period, objective?: ObjectiveActivity): Promise<string[]> {
    return this.interaction(testId, questionId, answerIds.join("[,]"), {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "choice",
      ...(correctAnswerIds ? {
        correctResponsesPattern: [
          correctAnswerIds.join("[,]")
        ]
      } : {}),
      ...(choices ? {choices} : {}),
      ...(name ? {name} : {}),
      ...(description ? {description} : {})
    }, duration, objective);
  }

  public interactionFillIn(testId: string, questionId: string, answers: string[], correctAnswers?: string[], name?: LanguageMap, description?: LanguageMap, duration?: Period, objective?: ObjectiveActivity): Promise<string[]> {
    return this.interaction(testId, questionId, answers.join("[,]"), {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "fill-in",
      ...(correctAnswers ? {
        correctResponsesPattern: [
          correctAnswers.join("[,]")
        ]
      } : {}),
      ...(name ? {name} : {}),
      ...(description ? {description} : {})
    }, duration, objective);
  }

  public interactionLongFillIn(testId: string, questionId: string, answers: string[], correctAnswers?: string[], name?: LanguageMap, description?: LanguageMap, duration?: Period, objective?: ObjectiveActivity): Promise<string[]> {
    return this.interaction(testId, questionId, answers.join("[,]"), {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "long-fill-in",
      ...(correctAnswers ? {
        correctResponsesPattern: [
          correctAnswers.join("[,]")
        ]
      } : {}),
      ...(name ? {name} : {}),
      ...(description ? {description} : {})
    }, duration, objective);
  }

  public interactionLikert(testId: string, questionId: string, answerId: string, correctAnswerId?: string, scale?: InteractionComponent[], name?: LanguageMap, description?: LanguageMap, duration?: Period, objective?: ObjectiveActivity): Promise<string[]> {
    return this.interaction(testId, questionId, answerId, {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "likert",
      ...(correctAnswerId ? {
        correctResponsesPattern: [
          correctAnswerId
        ]
      } : {}),
      ...(scale ? {scale} : {}),
      ...(name ? {name} : {}),
      ...(description ? {description} : {})
    }, duration, objective);
  }

  public interactionMatching(testId: string, questionId: string, answers: {[sourceId: string]: string}, correctAnswers?: {[sourceId: string]: string}, source?: InteractionComponent[], target?: InteractionComponent[], name?: LanguageMap, description?: LanguageMap, duration?: Period, objective?: ObjectiveActivity): Promise<string[]> {
    return this.interaction(testId, questionId, Object.keys(answers).map((key) => {
      return `${key}[.]${answers[key]}`;
    }).join("[,]"), {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "matching",
      ...(correctAnswers ? {
        correctResponsesPattern: [
          Object.keys(correctAnswers).map((key) => {
            return `${key}[.]${correctAnswers[key]}`;
          }).join("[,]")
        ]
      } : {}),
      ...(source ? {source} : {}),
      ...(target ? {target} : {}),
      ...(name ? {name} : {}),
      ...(description ? {description} : {})
    }, duration, objective);
  }

  public interactionPerformance(testId: string, questionId: string, answers: Performance, correctAnswers?: PerformanceCriteria[], steps?: InteractionComponent[], name?: LanguageMap, description?: LanguageMap, duration?: Period, objective?: ObjectiveActivity): Promise<string[]> {
    return this.interaction(testId, questionId, Object.keys(answers).map(key => {
      return `${key}[.]${answers[key]}`;
    }).join("[,]"), {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "performance",
      ...(correctAnswers ? {
        correctResponsesPattern: [
          Object.keys(correctAnswers).map((key) => {
            const exact: string = correctAnswers[key].exact ? correctAnswers[key].exact.toString() : "";
            const min: string = correctAnswers[key].min ? correctAnswers[key].min.toString() : "";
            const max: number = correctAnswers[key].max ? correctAnswers[key].max.toString() : "";
            return `${key}[.]${exact ? exact : (min + ":" + max)}`;
          }).join("[,]")
        ]
      } : {}),
      ...(steps ? {steps} : {}),
      ...(name ? {name} : {}),
      ...(description ? {description} : {})
    }, duration, objective);
  }

  public interactionSequencing(testId: string, questionId: string, answerIds: string[], correctAnswerIds: string[], choices?: InteractionComponent[], name?: LanguageMap, description?: LanguageMap, duration?: Period, objective?: ObjectiveActivity): Promise<string[]> {
    return this.interaction(testId, questionId, answerIds.join("[,]"), {
      type: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "sequencing",
      ...(correctAnswerIds ? {
        correctResponsesPattern: [
          correctAnswerIds.join("[,]")
        ]
      } : {}),
      ...(choices ? {choices} : {}),
      ...(name ? {name} : {}),
      ...(description ? {description} : {})
    }, duration, objective);
  }

  // public interactionNumeric(testId: string, questionId: string, answer, name?: LanguageMap, description?: LanguageMap, duration?: Period, objective?: ObjectiveActivity): Promise<string[]> {
  //   return this.interaction(testId, questionId, answer.toString(), {
  //     type: "http://adlnet.gov/expapi/activities/cmi.interaction",
  //     interactionType: "numeric",
  //     ...(name ? {name} : {}),
  //     ...(description ? {description} : {})
  //   }, duration, objective);
  // }

  // public interactionOther(testId: string, questionId: string, answer, name?: LanguageMap, description?: LanguageMap, duration?: Period, objective?: ObjectiveActivity): Promise<string[]> {
  //   return this.interaction(testId, questionId, answer.toString(), {
  //     type: "http://adlnet.gov/expapi/activities/cmi.interaction",
  //     interactionType: "other",
  //     ...(name ? {name} : {}),
  //     ...(description ? {description} : {})
  //   }, duration, objective);
  // }

  public interaction(testId: string, questionId: string, response: string, interactionDefinition: InteractionActivityDefinition, duration?: Period, objective?: ObjectiveActivity): Promise<string[]> {
    return this.sendCmi5AllowedStatement({
      verb: Verbs.ANSWERED,
      result: {
        response: response,
        ...(duration ? {
          duration: calculateISO8601Duration(duration.start, duration.end)
        } : {})
      },
      object: {
        objectType: "Activity",
        // Best Practice #16 - AU should use a derived activity ID for “cmi.interaction” statements - https://aicc.github.io/CMI-5_Spec_Current/best_practices/
        id: `${this.launchParameters.activityId}/test/${testId}/question/${questionId}`,
        definition: interactionDefinition
      },
      // Best Practice #1 - Use of Objectives - https://aicc.github.io/CMI-5_Spec_Current/best_practices/
      ...(objective ? {context: {
        contextActivities: {
          parent: [
            objective
          ]
        }
      }} : {})
    });
  }

  private getLaunchParametersFromLMS(): LaunchParameters {
    return getSearchQueryParamsAsObject(window.location.href) as LaunchParameters;
  }

  private getAuthTokenFromLMS(fetchUrl: string): Promise<AuthTokenResponse> {
    return fetch(fetchUrl, {
      method: "POST"
    }).then(response => {
        return response.json();
    });
  }

  private getLaunchDataFromLMS(): Promise<LaunchData> {
    return this.connection.getActivityState(this.launchParameters.actor, this.launchParameters.activityId, "LMS.LaunchData", this.launchParameters.registration)
    .then((launchData) => {
      return launchData as LaunchData;
    });
  }

  private getLearnerPreferencesFromLMS(): Promise<LearnerPreferences> {
    return this.connection.getAgentProfile(this.launchParameters.actor, "cmi5LearnerPreferences")
    .then((learnerPreferences) => {
      return learnerPreferences;
    }, () => {
      return {};
    });
  }

  private sendCmi5DefinedStatement(statement: Partial<Statement>): Promise<string[]> {
    // 9.4 Object - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#94-object
    const object: StatementObject = {
      objectType: "Activity",
      id: this.launchParameters.activityId
    };
    const context: Context = {
      contextActivities: {
        category: [
          // 9.6.2.1 cmi5 Category Activity - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#9621-cmi5-category-activity
          Cmi5ContextActivity.CMI5
        ]
      }
    };
    const cmi5DefinedStatementRequirements: Partial<Statement> = {
      object: object,
      context: context
    };
    const mergedStatement: Partial<Statement> = deepmerge.all([cmi5DefinedStatementRequirements, statement]);
    return this.sendCmi5AllowedStatement(mergedStatement);
  }

  public sendCmi5AllowedStatement(statement: Partial<Statement>): Promise<string[]> {
    // 9.2 Actor - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#92-actor
    const actor: Agent = this.launchParameters.actor;
    // 9.7 Timestamp - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#97-timestamp
    const timestamp = new Date().toISOString();
    // 10.0 xAPI State Data Model - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#100-xapi-state-data-model
    const context: Context = Object.assign({}, this.launchData.contextTemplate);
    // 9.6.1 Registration - https://github.com/AICC/CMI-5_Spec_Current/blob/quartz/cmi5_spec.md#961-registration
    context.registration = this.launchParameters.registration;
    const cmi5AllowedStatementRequirements: Partial<Statement> = {
      actor: actor,
      timestamp: timestamp,
      context: context
    };
    const mergedStatement: Partial<Statement> = deepmerge.all([cmi5AllowedStatementRequirements, statement]);
    return this.connection.sendStatement(mergedStatement as Statement);
  }
}
