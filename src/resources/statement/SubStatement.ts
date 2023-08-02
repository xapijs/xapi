import { Statement, StatementObject } from ".";

export interface SubStatement
  extends Omit<Statement, "id" | "stored" | "version" | "authority"> {
  objectType: "SubStatement";
  object: Exclude<StatementObject, SubStatement>;
}
