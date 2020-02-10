import { rfc5646LanguageCodes } from "../";

export interface Verb {
  id: string;
  display: {
    [languageCode in rfc5646LanguageCodes]: string;
  };
}
