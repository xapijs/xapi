import { Extensions, LanguageMap } from "../../XAPI";

export interface ActivityDefinition {
  type?: string;
  name?: LanguageMap;
  description?: LanguageMap;
  extensions?: Extensions;
}
