import { AdapterPromise } from "../../../adapters";
import { Verbs } from "../../../constants";
import XAPI from "../../../XAPI";
import { Statement } from "..";
import { VoidStatementParams } from "./VoidStatementParams";

export function voidStatement(
  this: XAPI,
  params: VoidStatementParams
): AdapterPromise<string[]> {
  const voidStatement: Statement = {
    actor: params.actor,
    verb: Verbs.VOIDED,
    object: {
      objectType: "StatementRef",
      id: params.statementId,
    },
  };
  return this.sendStatement({
    statement: voidStatement,
  });
}
