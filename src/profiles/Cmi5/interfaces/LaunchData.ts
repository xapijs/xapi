import { Context } from "../../../XAPI";

export interface LaunchData {
  contextTemplate: Context;
  launchMode: "Normal" | "Browse" | "Review";
  launchMethod?: "OwnWindow" | "AnyWindow";
  launchParameters?: string;
  masteryScore?: number;
  moveOn: "Passed" | "Completed" | "CompletedAndPassed" | "CompletedOrPassed" | "NotApplicable";
  returnURL?: string;
  entitlementKey?: { courseStructure?: string; alternate?: string };
}
