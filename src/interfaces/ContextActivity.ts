import { LanguageMap } from "./LanguageMap";

export interface ContextActivity {
  objectType?: "Activity";
  id: string;
  definition?: {
    name?: LanguageMap;
    description?: LanguageMap;
    type: string;
  };
}
