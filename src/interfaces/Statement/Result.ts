import { Extensions } from ".";

export interface ResultScore {
  scaled: number;
  raw?: number;
  min?: number;
  max?: number;
}

export interface Result {
  score?: ResultScore;
  success?: boolean;
  completion?: boolean;
  response?: string;
  duration?: string;
  extensions?: Extensions;
}
