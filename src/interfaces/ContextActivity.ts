import { rfc5646LanguageCodes } from "../";

export interface ContextActivity {
  objectType?: "Activity";
  id: string;
  definition?: {
    name?: {
      [languageCode in rfc5646LanguageCodes]: string;
    };
    description?: {
      [languageCode in rfc5646LanguageCodes]: string;
    };
    type: string;
  };
}
