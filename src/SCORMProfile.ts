import {
  Actor,
  Statement,
  ContextActivity,
  Activity,
  Config,
  Context
} from "./interfaces";
import { LRSConnection } from "./LRSConnection";
import { Verbs } from "./constants";

export class SCORMProfile {
  private config: Config;
  private connection: LRSConnection;

  constructor(config: Config) {
    this.config = {
      ...config,
      ...this.getParams()
    };
    this.connection = new LRSConnection(
      this.config.endpoint as string,
      this.config.auth as string
    );
  }

  private getParams(): {
    [key: string]: string | Actor;
  } {
    let queryParams: { [key: string]: string } = {};
    let anchor: HTMLAnchorElement = document.createElement("a");
    anchor.href = window.location.href;
    let queryStrings: string = anchor.search.substring(1);
    let params: string[] = queryStrings.split("&");
    for (let i: number = 0; i < params.length; i++) {
      var pair: string[] = params[i].split("=");
      queryParams[pair[0]] = decodeURIComponent(pair[1]);
      if (pair[0] === "actor") {
        queryParams[pair[0]] = JSON.parse(decodeURIComponent(pair[1]));
      }
    }
    return queryParams;
  }

  // https://adl.gitbooks.io/scorm-profile-xapi/content/xapi-scorm-profile.html#initializing-an-attempt
  public initialise() {
    return this.request({
      verb: Verbs.INITIALIZED
    });
  }

  // public terminate() {}

  // public suspend() {}

  // public resume() {}

  // public pass() {}

  // public fail() {}

  // public score(score: number) {}

  // public complete() {}

  // public response(interactionId: number, value: string) {}

  // TODO: Attempt IRI is missing
  private request(statement: Partial<Statement>) {
    let combinedStatement: Partial<Statement> = {
      actor: this.config.actor,
      ...statement,
      object: this.object,
      context: this.context,
      timestamp: new Date().toISOString()
    };
    console.log(combinedStatement);
    return this.connection.sendStatement(combinedStatement as Statement);
  }

  private get object(): Activity | undefined {
    if (!this.config.lessonIRI) {
      return undefined;
    }
    return {
      id: this.config.lessonIRI as string,

      definition: {
        ...(this.config.lessonTitle
          ? {
              name: {
                "en-US": this.config.lessonTitle as string
              }
            }
          : {}),
        ...(this.config.lessonDescription
          ? {
              description: {
                "en-US": this.config.lessonDescription as string
              }
            }
          : {}),
        type: "http://adlnet.gov/expapi/activities/lesson"
      }
    } as Activity;
  }

  private get context(): Context {
    let scormProfileCategory: ContextActivity = {
      id: "https://w3id.org/xapi/scorm",
      definition: {
        type: "http://adlnet.gov/expapi/activities/profile"
      }
    };
    let grouping: ContextActivity | undefined = this.grouping;
    return {
      contextActivities: {
        category: [scormProfileCategory],
        ...(grouping ? { grouping: [grouping] } : {})
      }
    };
  }

  private get grouping(): ContextActivity | undefined {
    if (!this.config.courseIRI) {
      return undefined;
    }
    return {
      id: this.config.courseIRI as string,
      ...(this.config?.courseTitle || this.config?.courseDescription
        ? {
            definition: {
              ...(this.config?.courseTitle
                ? {
                    name: {
                      "en-US": this.config.courseTitle as string
                    }
                  }
                : {}),
              ...(this.config?.courseDescription
                ? {
                    description: {
                      "en-US": this.config.courseDescription as string
                    }
                  }
                : {}),
              type: "http://adlnet.gov/expapi/activities/course"
            }
          }
        : {})
    };
  }
}
