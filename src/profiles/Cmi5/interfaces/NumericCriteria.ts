export interface NumericRange {
  min?: number;
  max?: number;
}

export interface NumericExact {
  exact?: number;
}

export type NumericCriteria = NumericRange | NumericExact;
