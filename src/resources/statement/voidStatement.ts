import { AxiosPromise } from "axios";
import { Verbs } from "../../constants";
import XAPI, { VoidStatementParams, Statement } from "../../XAPI";

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
