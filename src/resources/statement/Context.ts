import {
  StatementRef,
  Extensions,
  RFC5646LanguageCodes,
  Actor,
  Group,
} from ".";
import { Activity } from "../activities/Activity";

export interface Context {
  registration?: string;
  instructor?: Actor;
  team?: Group;
  contextActivities?: {
    parent?: Activity[];
    grouping?: Activity[];
    category?: Activity[];
    other?: Activity[];
  };
  statement?: StatementRef;
  revision?: string;
  platform?: string;
  language?: RFC5646LanguageCodes;
  extensions?: Extensions;
}
