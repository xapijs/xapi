import { Actor, Group, ContextActivity, StatementRef, Extensions, RFC5646LanguageCodes } from ".";

export interface Context {
  registration?: string;
  instructor?: Actor;
  team?: Group;
  contextActivities?: {
    parent?: ContextActivity | ContextActivity[];
    grouping?: ContextActivity | ContextActivity[];
    category?: ContextActivity | ContextActivity[];
    other?: ContextActivity | ContextActivity[];
  };
  statement?: StatementRef;
  revision?: string;
  platform?: string;
  language?: RFC5646LanguageCodes;
  extensions?: Extensions;
}
