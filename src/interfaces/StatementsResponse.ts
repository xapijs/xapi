import { Statement } from "./";

export interface StatementsResponse {
  statements: Statement[];
  more: string;
}