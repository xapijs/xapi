import { rfc5646LanguageCodes } from "..";

export type LanguageMap = {
  [languageCode in rfc5646LanguageCodes]: string;
}
