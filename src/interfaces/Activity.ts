import { Extensions } from "./";
import { rfc5646LanguageCodes } from "../";

export interface Activity {
  objectType: "Activity";
  id: string;
  definition?: {
    type?: string;
    name?: {
      [languageCode in rfc5646LanguageCodes]: string;
    };
    description?: {
      [languageCode in rfc5646LanguageCodes]: string;
    };
    extensions?: Extensions;
  };
}
