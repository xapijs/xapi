import { Extensions } from "./";
import { LanguageMap } from "./LanguageMap";

export interface ActivityDefinition {
  type?: string;
  name?: LanguageMap;
  description?: LanguageMap;
  extensions?: Extensions;
}

export interface Activity {
  objectType: "Activity";
  id: string;
  definition?: ActivityDefinition;
}
