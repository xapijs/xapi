import { NumericRange } from "./NumericCriteria";

interface PerformanceCriteriaBase {
  id: string;
}

interface PerformanceCriteriaRange extends PerformanceCriteriaBase, NumericRange {}

interface PerformanceCriteriaExact extends PerformanceCriteriaBase {
  exact?: number | string;
}

export type PerformanceCriteria = PerformanceCriteriaBase | PerformanceCriteriaRange | PerformanceCriteriaExact;
