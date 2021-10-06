import { AxiosPromise } from "axios";
import { Verbs } from "../../constants";
import XAPI, { Statement, VoidStatementsParams } from "../../XAPI";

export function voidStatements(
  this: XAPI,
  params: VoidStatementsParams
): AxiosPromise<string[]> {
  const voidStatements: Statement[] = params.statementIds.map((statementId) => {
    return {
      actor: params.actor,
      verb: Verbs.VOIDED,
      object: {
        objectType: "StatementRef",
        id: statementId,
      },
    };
  });
  return this.sendStatements({
    statements: voidStatements,
  });
}
