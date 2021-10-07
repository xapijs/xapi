import { AxiosPromise } from "axios";
import { Verbs } from "../../constants";
import XAPI, { Statement } from "../../XAPI";
import { VoidStatementParams } from "./voidStatementParams";

export function voidStatement(
  this: XAPI,
  params: VoidStatementParams
): AxiosPromise<string[]> {
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
