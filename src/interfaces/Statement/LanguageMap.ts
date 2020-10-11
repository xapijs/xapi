import { RFC5646LanguageCodes } from ".";

export type LanguageMap = {
  [languageCode in RFC5646LanguageCodes]: string;
};
