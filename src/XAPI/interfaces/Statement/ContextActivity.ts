import { LanguageMap } from ".";

export interface ContextActivity {
  objectType?: "Activity";
  id: string;
  definition?: {
    name?: LanguageMap;
    description?: LanguageMap;
    type: string;
  };
}
