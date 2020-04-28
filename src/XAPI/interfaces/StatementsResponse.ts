import { Statement } from "./Statement";

export interface StatementsResponse {
  statements: Statement[];
  /**
   * Relative URL that may be used to fetch more results, including the full path and optionally a query
string but excluding scheme, host, and port. Empty string if there are no more results to fetch.
   */
  more: string;
}
